import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { ProviderList } from '../ProviderList';
import { ProviderDetailView } from '../ProviderDetailView';
import { VideoSession } from '../VideoSession';
import { MessageConversation } from '../MessageConversation';
import { NoMatchesFound } from '../NoMatchesFound';
import type { Provider } from '../ProviderCard/ProviderCard.types';
import type { Conversation } from '../MessageConversation/MessageConversation.types';
import type { HealthcareSystemsDashboardProps, ViewState } from './HealthcareSystemsDashboard.types';

/**
 * HealthcareSystemsDashboard Component
 *
 * Main orchestrator component that manages the state and transitions
 * between different views in the Healthcare Systems section.
 *
 * Views:
 * - list: Provider listing with search
 * - detail: Individual provider profile
 * - video: Active video session
 * - message: Messaging interface
 */
export const HealthcareSystemsDashboard: React.FC<HealthcareSystemsDashboardProps> = ({
  providers,
  conversations = [],
  currentUserId,
  onSendMessage,
  onEndVideoSession,
  isLoading = false,
  sx,
}) => {
  const [currentView, setCurrentView] = useState<ViewState>('list');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNoMatchesSnackbar, setShowNoMatchesSnackbar] = useState(false);

  // Filter providers based on search query
  const filteredProviders = providers.filter((provider) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      provider.name.toLowerCase().includes(query) ||
      (provider.specialty && provider.specialty.toLowerCase().includes(query)) ||
      provider.description.toLowerCase().includes(query)
    );
  });

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim() && filteredProviders.length === 0) {
      setShowNoMatchesSnackbar(true);
    }
  }, [filteredProviders.length]);

  // Handle provider selection (Connect Now button)
  const handleConnectClick = useCallback((provider: Provider) => {
    setSelectedProvider(provider);
    setCurrentView('detail');
  }, []);

  // Handle starting video chat
  const handleStartVideoChat = useCallback((provider: Provider) => {
    setSelectedProvider(provider);
    setCurrentView('video');
  }, []);

  // Handle starting message
  const handleStartMessage = useCallback((provider: Provider) => {
    // Find or create conversation for this provider
    const existingConversation = conversations.find(
      (c) => c.provider.id === provider.id
    );
    
    if (existingConversation) {
      setSelectedConversation(existingConversation);
    } else {
      // Create a new conversation placeholder
      const newConversation: Conversation = {
        id: `conv-${provider.id}`,
        provider: provider,
        lastMessage: '',
        messages: [],
      };
      setSelectedConversation(newConversation);
    }
    
    setSelectedProvider(provider);
    setCurrentView('message');
  }, [conversations]);

  // Handle conversation selection in message view
  const handleConversationSelect = useCallback((conversation: Conversation) => {
    setSelectedConversation(conversation);
    setSelectedProvider(conversation.provider);
  }, []);

  // Handle back navigation
  const handleBack = useCallback(() => {
    setCurrentView((prevView) => {
      switch (prevView) {
        case 'detail':
          setSelectedProvider(null);
          return 'list';
        case 'video':
          return 'detail';
        case 'message':
          return 'detail';
        default:
          return prevView;
      }
    });
  }, []);

  // Handle end video session
  const handleEndVideoSession = useCallback(() => {
    if (selectedProvider) {
      onEndVideoSession?.(selectedProvider.id);
    }
    setCurrentView('detail');
  }, [selectedProvider, onEndVideoSession]);

  // Handle send message
  const handleSendMessage = useCallback((conversationId: string, message: string) => {
    onSendMessage?.(conversationId, message);
  }, [onSendMessage]);

  // Handle bookmark toggle
  const handleBookmarkToggle = useCallback((provider: Provider) => {
    // Handle bookmark toggle - typically would update state or call API
    console.log('Bookmark toggled for:', provider.name);
  }, []);

  return (
    <Box
      sx={{
        height: '100%',
        ...sx,
      }}
    >
      {/* Provider List View */}
      {currentView === 'list' && (
        <ProviderList
          providers={filteredProviders}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
          onConnectClick={handleConnectClick}
          onScheduleClick={() => console.log('Schedule appointments clicked')}
          onListAppointmentsClick={() => console.log('List appointments clicked')}
        />
      )}

      {/* Provider Detail View */}
      {currentView === 'detail' && selectedProvider && (
        <ProviderDetailView
          provider={selectedProvider}
          onBack={handleBack}
          onStartVideoChat={handleStartVideoChat}
          onStartMessage={handleStartMessage}
          onBookmarkToggle={handleBookmarkToggle}
          isBookmarked={selectedProvider.isBookmarked}
        />
      )}

      {/* Video Session View */}
      {currentView === 'video' && selectedProvider && (
        <VideoSession
          provider={selectedProvider}
          onEndSession={handleEndVideoSession}
          onAttachment={() => console.log('Attach file clicked')}
        />
      )}

      {/* Message Conversation View */}
      {currentView === 'message' && (
        <MessageConversation
          conversations={conversations}
          selectedConversation={selectedConversation}
          currentUserId={currentUserId}
          onConversationSelect={handleConversationSelect}
          onSendMessage={handleSendMessage}
          onBack={handleBack}
        />
      )}

      {/* No Matches Found Snackbar */}
      <NoMatchesFound
        open={showNoMatchesSnackbar}
        onClose={() => setShowNoMatchesSnackbar(false)}
        message={`No matches found for "${searchQuery}"`}
      />
    </Box>
  );
};

export default HealthcareSystemsDashboard;
