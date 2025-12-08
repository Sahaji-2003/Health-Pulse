import { useMemo, useState, useCallback, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Box, Snackbar, Alert } from '@mui/material';
import { DashboardLayout } from '../../components/layout';
import { ProviderList } from '../../components/ui/organisms/healthcareProvider/ProviderList';
import { ProviderDetailView } from '../../components/ui/organisms/healthcareProvider/ProviderDetailView';
import { VideoSession } from '../../components/ui/organisms/healthcareProvider/VideoSession';
import { MessageConversation } from '../../components/ui/organisms/healthcareProvider/MessageConversation';
import { NoMatchesFound } from '../../components/ui/organisms/healthcareProvider/NoMatchesFound';
import { AppointmentDashboard } from '../../components/ui/organisms/healthcareProvider/AppointmentDashboard';
import { AppointmentScheduleForm } from '../../components/ui/organisms/healthcareProvider/AppointmentScheduleForm';
import type { Provider } from '../../components/ui/organisms/healthcareProvider/ProviderCard/ProviderCard.types';
import type { Conversation, Message } from '../../components/ui/organisms/healthcareProvider/MessageConversation/MessageConversation.types';
import type { Appointment } from '../../components/ui/organisms/healthcareProvider/AppointmentCard/AppointmentCard.types';
import type { AppointmentFormData } from '../../components/ui/organisms/healthcareProvider/AppointmentScheduleForm/AppointmentScheduleForm.types';
import {
  useProviders,
  useAppointments,
  useCreateAppointment,
  useConversations,
  useGetOrCreateConversation,
  useMessages,
  useSendMessage,
  useAddProviderReply,
  useMarkMessagesAsRead,
} from '../../hooks';
import { useAuth } from '../../hooks/useAuth';

// 3D Avatar images from Figma Material 3 Design Kit
const PROVIDER_AVATARS = [
  '/src/assets/avatars/ad0230e51cf72c468f60f22a06ee0b26b40e974f.png', // Avatar 1
  '/src/assets/avatars/9bf85657768890adce0bc6ec7465d29b46d08d7d.png', // Avatar 2
  '/src/assets/avatars/3ef290bc29275437b13e4e702a43b9c3e4b5bafe.png', // Avatar 3
  '/src/assets/avatars/fe1b75d322ccec05c072759497ec90f5105b559b.png', // Avatar 4
  '/src/assets/avatars/4f5f4fc24d4fb323844cbdd0f8c3864a98b89c8b.png', // Avatar 5
  '/src/assets/avatars/a0b846e76cae6700516f401c2b0ddceeb96a6402.png', // Avatar 6
  '/src/assets/avatars/f2905db0cff0258fe1161e71ce0b684c9616c5ef.png', // Avatar 7
  '/src/assets/avatars/5f8ea6b9caf08d167684ed154ad8a85f97b6913b.png', // Avatar 8
  '/src/assets/avatars/8f8503017e8180578a64860d00f1a2f713a24fbb.png', // Avatar 9
  '/src/assets/avatars/6e4d877ce9c070a34ca062eebd3f33d8c1dac952.png', // Avatar 10
  '/src/assets/avatars/e94ab0fb805f87cde4c201f6a72ac4ed80d9e261.png', // Avatar 11
  '/src/assets/avatars/eaa320717b7e77fd08d1bdaf9802cc375eb36366.png', // Avatar 12
  '/src/assets/avatars/436985b609d053075017d7f78ccd2d5f7d059fcf.png', // Avatar 13
  '/src/assets/avatars/57bfd56243f1eda09c78fa01cb765443993748ee.png', // Avatar 14
  '/src/assets/avatars/b45fff6b8e9ca09258e544c7bd3e6cd00180d427.png', // Avatar 15
  '/src/assets/avatars/9b19bc03f645625ddb77cba0433d55782d515d52.png', // Avatar 16
  '/src/assets/avatars/a7e8150b48421155ec56805f777056f57141df11.png', // Avatar 17
  '/src/assets/avatars/e61b32a6b96823a8b0214ef17a3aac015a2ed382.png', // Avatar 18
  '/src/assets/avatars/f111a4d9e98c2f1849285d198126666303e67f65.png', // Avatar 19
  '/src/assets/avatars/633f85a8183a9043a1490dbabccae2c5cd82170e.png', // Avatar 20
];

// Helper to get avatar based on provider name (consistent mapping)
const getProviderAvatar = (name: string): string => {
  // Create a simple hash from the name to get consistent avatar for same provider
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % PROVIDER_AVATARS.length;
  return PROVIDER_AVATARS[index];
};

// Helper to format relative time
const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString();
};

// Transform backend provider to frontend Provider type
const transformProvider = (backendProvider: any): Provider => ({
  id: backendProvider._id,
  name: backendProvider.name,
  type: 'healthcare',
  specialty: backendProvider.specialty,
  description: backendProvider.description || `${backendProvider.specialty} specialist at ${backendProvider.location?.city || 'our clinic'}. Accepting ${backendProvider.acceptsInsurance?.join(', ') || 'various insurance plans'}.`,
  rating: backendProvider.rating || 4.5,
  avatarUrl: getProviderAvatar(backendProvider.name),
  isBookmarked: false,
});

// Transform backend appointment to frontend Appointment type
const transformAppointment = (backendAppointment: any): Appointment => {
  const provider = backendAppointment.providerId;
  const dateTime = new Date(backendAppointment.dateTime);
  const now = new Date();
  
  let status: 'upcoming' | 'past' | 'cancelled' = 'upcoming';
  if (backendAppointment.status === 'cancelled') {
    status = 'cancelled';
  } else if (dateTime < now || backendAppointment.status === 'completed') {
    status = 'past';
  }

  return {
    id: backendAppointment._id,
    provider: provider ? transformProvider(provider) : {
      id: 'unknown',
      name: 'Unknown Provider',
      specialty: 'General',
      description: '',
      rating: 0,
    },
    title: backendAppointment.type === 'video' ? 'Video Consultation' : 
           backendAppointment.type === 'chat' ? 'Chat Consultation' : 'Checkup',
    dateTime,
    duration: 30,
    purpose: backendAppointment.notes,
    status,
  };
};

export const HealthcareSystems = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const currentUserId = authUser?._id || 'current-user';

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // API Hooks
  const { data: providersData, isLoading: providersLoading } = useProviders({
    search: searchQuery || undefined,
    limit: 50,
  });
  const { data: appointmentsData } = useAppointments({ limit: 50 });
  const { data: conversationsData } = useConversations();
  const { data: messagesData } = useMessages(selectedConversationId || '');
  
  const createAppointmentMutation = useCreateAppointment();
  const getOrCreateConversationMutation = useGetOrCreateConversation();
  const sendMessageMutation = useSendMessage();
  const addProviderReply = useAddProviderReply();
  const markAsReadMutation = useMarkMessagesAsRead();

  // Transform providers data
  const providers: Provider[] = useMemo(() => {
    if (!providersData?.data) return [];
    return providersData.data.map(transformProvider);
  }, [providersData]);

  // Transform appointments data
  const { upcomingAppointments, pastAppointments } = useMemo(() => {
    if (!appointmentsData?.data) return { upcomingAppointments: [], pastAppointments: [] };
    
    const all = appointmentsData.data.map(transformAppointment);
    const now = new Date();
    
    return {
      upcomingAppointments: all.filter(apt => apt.status === 'upcoming' && new Date(apt.dateTime) >= now),
      pastAppointments: all.filter(apt => apt.status === 'past' || new Date(apt.dateTime) < now),
    };
  }, [appointmentsData]);

  // Transform conversations data
  const conversations: Conversation[] = useMemo(() => {
    if (!conversationsData?.data) return [];
    
    return conversationsData.data.map((conv: any) => {
      const provider = conv.providerId;
      return {
        id: conv._id,
        provider: provider ? transformProvider(provider) : {
          id: 'unknown',
          name: 'Unknown Provider',
          specialty: 'General',
          description: '',
          rating: 0,
        },
        lastMessage: conv.lastMessage || 'Start a conversation...',
        lastMessageTime: conv.lastMessageTime ? formatRelativeTime(conv.lastMessageTime) : undefined,
        unreadCount: conv.unreadCount || 0,
        messages: [],
      };
    });
  }, [conversationsData]);

  // Get the selected conversation with messages
  const selectedConversation: Conversation | undefined = useMemo(() => {
    if (!selectedConversationId) return undefined;
    
    const conv = conversations.find(c => c.id === selectedConversationId);
    if (!conv) return undefined;

    // Add messages from messagesData
    const messages: Message[] = messagesData?.data?.map((msg: any) => ({
      id: msg._id,
      senderId: msg.senderType === 'user' ? currentUserId : conv.provider.id,
      content: msg.content,
      timestamp: new Date(msg.createdAt),
      type: msg.type || 'text',
      imageUrl: msg.imageUrl,
      linkTitle: msg.linkTitle,
      linkDescription: msg.linkDescription,
    })) || [];

    return { ...conv, messages };
  }, [selectedConversationId, conversations, messagesData, currentUserId]);

  // Determine current view based on URL
  const currentView = useMemo(() => {
    if (location.pathname === '/healthcare-systems/appointments') return 'appointments';
    if (location.pathname === '/healthcare-systems/schedule') return 'schedule';
    if (!providerId) return 'list';
    if (location.pathname.endsWith('/video')) return 'video';
    if (location.pathname.endsWith('/message')) return 'message';
    return 'detail';
  }, [providerId, location.pathname]);

  // Get selected provider based on URL param
  const selectedProvider = useMemo(() => {
    if (!providerId) return null;
    return providers.find((p) => p.id === providerId) || null;
  }, [providerId, providers]);

  // Handle conversation selection for messaging - only run once when entering message view
  useEffect(() => {
    if (currentView === 'message' && providerId && !selectedConversationId) {
      // Find existing conversation for this provider
      const existingConv = conversations.find(c => c.provider.id === providerId);
      if (existingConv) {
        setSelectedConversationId(existingConv.id);
        // Mark messages as read (fire and forget, no refetch)
        markAsReadMutation.mutate(existingConv.id);
      } else if (conversations.length > 0 || conversationsData) {
        // Only create new conversation if conversations have been loaded
        getOrCreateConversationMutation.mutate(providerId, {
          onSuccess: (data) => {
            setSelectedConversationId(data.data._id);
          },
        });
      }
    }
    // Reset selected conversation when leaving message view
    if (currentView !== 'message') {
      setSelectedConversationId(null);
    }
  }, [currentView, providerId]); // Remove conversations from deps to avoid loop

  // Navigation handlers
  const handleConnectClick = (provider: Provider) => {
    navigate(`/healthcare-systems/provider/${provider.id}`);
  };

  const handleBack = () => {
    switch (currentView) {
      case 'detail':
        navigate('/healthcare-systems');
        break;
      case 'video':
      case 'message':
        navigate(`/healthcare-systems/provider/${providerId}`);
        break;
      case 'appointments':
      case 'schedule':
        navigate('/healthcare-systems');
        break;
    }
  };

  const handleStartVideoChat = (provider: Provider) => {
    navigate(`/healthcare-systems/provider/${provider.id}/video`);
  };

  const handleStartMessage = (provider: Provider) => {
    navigate(`/healthcare-systems/provider/${provider.id}/message`);
  };

  const handleEndVideoSession = () => {
    if (providerId) {
      navigate(`/healthcare-systems/provider/${providerId}`);
    }
  };

  const handleSendMessage = useCallback((conversationId: string, message: string) => {
    // Show typing indicator
    setIsTyping(true);
    
    sendMessageMutation.mutate(
      { conversationId, content: message, type: 'text' },
      {
        onSuccess: () => {
          // Keep typing indicator for 2-3 seconds to simulate provider typing
          // Then fetch the actual messages including the provider's reply
          setTimeout(() => {
            setIsTyping(false);
            addProviderReply(conversationId);
          }, 2500);
        },
        onError: () => {
          setIsTyping(false);
          setSnackbar({ open: true, message: 'Failed to send message', severity: 'error' });
        },
      }
    );
  }, [sendMessageMutation, addProviderReply]);

  const handleConversationSelect = (conversation: Conversation) => {
    const conv = conversations.find(c => c.id === conversation.id);
    if (conv) {
      setSelectedConversationId(conv.id);
      navigate(`/healthcare-systems/provider/${conv.provider.id}/message`);
      // Mark as read
      markAsReadMutation.mutate(conv.id);
    }
  };

  const handleBookmarkToggle = (provider: Provider) => {
    console.log('Bookmark toggled for:', provider.name);
    // TODO: Implement bookmark functionality
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // Appointment handlers
  const handleScheduleAppointment = () => {
    navigate('/healthcare-systems/schedule');
  };

  const handleListAppointments = () => {
    navigate('/healthcare-systems/appointments');
  };

  const handleJoinSession = (appointment: Appointment) => {
    navigate(`/healthcare-systems/provider/${appointment.provider.id}/video`);
  };

  const handleAppointmentSubmit = useCallback((formData: AppointmentFormData) => {
    if (!formData.date || !formData.startTime) return;

    // Parse time string to create proper datetime
    const [time, period] = formData.startTime.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let hour24 = hours;
    if (period === 'PM' && hours !== 12) hour24 += 12;
    if (period === 'AM' && hours === 12) hour24 = 0;

    const dateTime = new Date(formData.date);
    dateTime.setHours(hour24, minutes, 0, 0);

    createAppointmentMutation.mutate(
      {
        providerId: formData.providerId,
        dateTime: dateTime.toISOString(),
        type: 'in-person',
        notes: formData.consultationPurpose,
      },
      {
        onSuccess: () => {
          setSnackbar({ open: true, message: 'Appointment scheduled successfully!', severity: 'success' });
          navigate('/healthcare-systems/appointments');
        },
        onError: () => {
          setSnackbar({ open: true, message: 'Failed to schedule appointment', severity: 'error' });
        },
      }
    );
  }, [createAppointmentMutation, navigate]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const renderContent = () => {
    switch (currentView) {
      case 'list':
        return (
          <ProviderList
            providers={providers}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onConnectClick={handleConnectClick}
            onScheduleClick={handleScheduleAppointment}
            onListAppointmentsClick={handleListAppointments}
            isLoading={providersLoading}
          />
        );
      case 'appointments':
        return (
          <AppointmentDashboard
            upcomingAppointments={upcomingAppointments}
            pastAppointments={pastAppointments}
            userName={authUser?.firstName || 'User'}
            onJoinSession={handleJoinSession}
            onScheduleAppointment={handleScheduleAppointment}
          />
        );
      case 'schedule':
        return (
          <AppointmentScheduleForm
            providers={providers}
            onSubmit={handleAppointmentSubmit}
            onCancel={handleBack}
            isLoading={createAppointmentMutation.isPending}
          />
        );
      case 'detail':
        if (!selectedProvider) return null;
        return (
          <ProviderDetailView
            provider={selectedProvider}
            onBack={handleBack}
            onStartVideoChat={handleStartVideoChat}
            onStartMessage={handleStartMessage}
            onBookmarkToggle={handleBookmarkToggle}
            isBookmarked={selectedProvider.isBookmarked}
          />
        );
      case 'video':
        if (!selectedProvider) return null;
        return (
          <VideoSession
            provider={selectedProvider}
            onEndSession={handleEndVideoSession}
            onBack={handleBack}
          />
        );
      case 'message':
        return (
          <MessageConversation
            conversations={conversations}
            selectedConversation={selectedConversation}
            currentUserId={currentUserId}
            onConversationSelect={handleConversationSelect}
            onSendMessage={handleSendMessage}
            onBack={handleBack}
            isTyping={isTyping}
          />
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout title="Healthcare Systems">
      <Box sx={{ height: 'calc(100vh - 120px)' }}>
        {renderContent()}
        <NoMatchesFound
          open={providers.length === 0 && !providersLoading && searchQuery.length > 0}
          onClose={() => setSearchQuery('')}
        />
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default HealthcareSystems;
