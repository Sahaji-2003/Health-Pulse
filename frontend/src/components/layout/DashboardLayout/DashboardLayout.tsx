import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  useTheme,
  useMediaQuery,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Avatar,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import FolderIcon from '@mui/icons-material/Folder';
import { Sidebar } from '../../ui/organisms/Sidebar';
import { PageHeader } from '../../ui/organisms/PageHeader';
import { NotificationPanel } from '../../ui/organisms/NotificationPanel';
import type { NotificationItem, NotificationCategory } from '../../ui/organisms/NotificationPanel';
import type { DashboardLayoutProps } from './DashboardLayout.types';
import { useReminders } from '../../../hooks/useReminders';
import { useNotifications, useMarkNotificationAsRead } from '../../../hooks/useNotifications';
import { useProfile } from '../../../hooks/useProfile';
import { userApi } from '../../../services/api/user.api';
import type { Reminder } from '../../../types';
import type { Notification as ApiNotification } from '../../../services/api/notifications.api';

const SIDEBAR_WIDTH = 80;

// Map reminder category to notification type
const mapCategoryToNotificationType = (category: Reminder['category']): NotificationItem['type'] => {
  switch (category) {
    case 'medication':
    case 'vitals':
      return 'health_alert';
    case 'exercise':
      return 'activity';
    case 'appointment':
      return 'health_alert';
    default:
      return 'info';
  }
};

// Map API notification type to panel notification type
const mapApiNotificationType = (type: ApiNotification['type'], severity: ApiNotification['severity']): NotificationItem['type'] => {
  if (type === 'vital_alert') {
    return severity === 'critical' ? 'health_alert' : 'health_alert';
  }
  switch (type) {
    case 'reminder':
      return 'activity';
    case 'appointment':
      return 'health_alert';
    default:
      return 'info';
  }
};

// Format time for display (e.g., "2 hours ago")
const formatTimeAgo = (date: Date | string): string => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  headerSubtitle,
  headerActions,
  hideHeader = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Get user profile for avatar
  const { profile } = useProfile();

  // Notification state - centralized here
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory>('All');
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const notificationPanelOpen = Boolean(notificationAnchorEl);

  // Fetch reminders from API
  const { data: remindersData, isLoading: remindersLoading, isError: remindersError } = useReminders();
  
  // Fetch notifications from API
  const { data: notificationsData, isLoading: notificationsLoading, isError: notificationsError } = useNotifications();
  const markNotificationAsRead = useMarkNotificationAsRead();

  // Transform reminders to notification items
  const reminderNotifications: NotificationItem[] = useMemo(() => {
    if (!remindersData?.data) return [];
    
    return remindersData.data
      .filter(reminder => !dismissedIds.has(reminder._id))
      .map((reminder): NotificationItem => ({
        id: reminder._id,
        type: mapCategoryToNotificationType(reminder.category),
        title: reminder.name,
        message: reminder.description || `Scheduled at ${reminder.time}`,
        isRead: !reminder.isActive,
        isHighlighted: reminder.isActive && reminder.category === 'medication',
        timestamp: formatTimeAgo(reminder.createdAt),
        primaryAction: {
          label: 'View Details',
          onClick: () => {
            navigate('/profile');
            handleNotificationPanelClose();
          },
        },
        secondaryAction: {
          label: 'Dismiss',
          onClick: () => {
            setDismissedIds(prev => new Set(prev).add(reminder._id));
          },
        },
      }));
  }, [remindersData?.data, dismissedIds, navigate]);

  // Transform API notifications to notification items
  const apiNotifications: NotificationItem[] = useMemo(() => {
    if (!notificationsData?.data) return [];
    
    return notificationsData.data
      .filter(notification => !dismissedIds.has(notification._id))
      .map((notification): NotificationItem => ({
        id: notification._id,
        type: mapApiNotificationType(notification.type, notification.severity),
        title: notification.title,
        message: notification.message,
        isRead: notification.isRead,
        isHighlighted: notification.severity === 'critical' && !notification.isRead,
        timestamp: formatTimeAgo(notification.createdAt),
        primaryAction: {
          label: notification.relatedVitalId ? 'View Vitals' : 'Mark Read',
          onClick: () => {
            if (notification.relatedVitalId) {
              navigate('/vitals');
            }
            if (!notification.isRead) {
              markNotificationAsRead.mutate(notification._id);
            }
            handleNotificationPanelClose();
          },
        },
        secondaryAction: {
          label: 'Dismiss',
          onClick: () => {
            setDismissedIds(prev => new Set(prev).add(notification._id));
            if (!notification.isRead) {
              markNotificationAsRead.mutate(notification._id);
            }
          },
        },
      }));
  }, [notificationsData?.data, dismissedIds, navigate, markNotificationAsRead]);

  // Combine all notifications and sort by most recent
  const notifications: NotificationItem[] = useMemo(() => {
    return [...apiNotifications, ...reminderNotifications].sort((a, b) => {
      // Prioritize unread and highlighted notifications
      if (a.isHighlighted && !b.isHighlighted) return -1;
      if (!a.isHighlighted && b.isHighlighted) return 1;
      if (!a.isRead && b.isRead) return -1;
      if (a.isRead && !b.isRead) return 1;
      return 0;
    });
  }, [apiNotifications, reminderNotifications]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleDrawerClose = () => setMobileOpen(false);

  // Mobile navigation paths
  const mobileNavPaths = ['/dashboard', '/fitness', '/vitals', '/resources', '/profile'];

  const getCurrentNavValue = () => {
    const currentPath = mobileNavPaths.find(path => location.pathname === path);
    return currentPath || '/dashboard';
  };

  const handleBottomNavChange = (_event: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  // Notification handlers
  const handleNotificationClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  }, []);

  const handleNotificationPanelClose = useCallback(() => {
    setNotificationAnchorEl(null);
  }, []);

  const handleCategoryChange = useCallback((category: NotificationCategory) => {
    setSelectedCategory(category);
  }, []);

  const handleNotificationAction = useCallback((notificationId: string, action: 'primary' | 'secondary') => {
    if (action === 'secondary') {
      // Dismiss the notification
      setDismissedIds(prev => new Set(prev).add(notificationId));
    }
  }, []);

  // Calculate unread count from all notifications
  const unreadCount = useMemo(() => {
    const apiUnreadCount = notificationsData?.unreadCount || 0;
    const reminderUnreadCount = reminderNotifications.filter(n => !n.isRead).length;
    return apiUnreadCount + reminderUnreadCount;
  }, [notificationsData?.unreadCount, reminderNotifications]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: theme.customColors.background.mint }}>
      {/* Sidebar - only show on desktop */}
      {!isMobile && (
        <Sidebar open={mobileOpen} onClose={handleDrawerClose} width={SIDEBAR_WIDTH} />
      )}

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: '100%', md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Fixed Page Header */}
        {!hideHeader && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: { xs: 0, md: SIDEBAR_WIDTH },
              right: 0,
              zIndex: theme.zIndex.appBar,
              bgcolor: theme.customColors.background.mint,
              px: { xs: 2, sm: 3 },
              boxSizing: 'border-box',
            }}
          >
            <PageHeader
              title={title}
              subtitle={headerSubtitle}
              actions={headerActions}
              showNotification
              notificationCount={unreadCount}
              onNotificationClick={handleNotificationClick}
              showMenuButton={false}
              onMenuClick={handleDrawerToggle}
            />
          </Box>
        )}

        {/* Scrollable Page Content */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            px: { xs: 2, sm: 3 },
            pt: hideHeader ? 0 : { xs: 9, sm: 10 }, // Add top padding to account for fixed header
            pb: { xs: 10, md: 3 }, // More bottom padding on mobile for bottom nav
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            marginTop: 2
          }}
        >
          {children}
        </Box>

        {/* Centralized Notification Panel */}
        <NotificationPanel
          anchorEl={notificationAnchorEl}
          open={notificationPanelOpen}
          onClose={handleNotificationPanelClose}
          notifications={notifications}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          onNotificationAction={handleNotificationAction}
          isLoading={remindersLoading || notificationsLoading}
          isError={remindersError || notificationsError}
        />

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <Paper
            elevation={0}
            sx={{ 
              position: 'fixed', 
              bottom: 0, 
              left: 0, 
              right: 0, 
              zIndex: theme.zIndex.appBar,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <BottomNavigation
              value={getCurrentNavValue()}
              onChange={handleBottomNavChange}
              showLabels
              sx={{
                bgcolor: theme.customColors.background.mint,
                height: 68,
                '& .MuiBottomNavigationAction-root': {
                  color: 'text.secondary',
                  minWidth: 'auto',
                  py: 1,
                  gap: 0.5,
                  '&.Mui-selected': { 
                    color: theme.palette.text.primary,
                    '& .MuiBottomNavigationAction-label': {
                      color: theme.palette.text.primary,
                    },
                  },
                },
                '& .MuiBottomNavigationAction-label': {
                  fontSize: 10,
                  fontWeight: 500,
                  '&.Mui-selected': { 
                    fontSize: 10,
                  },
                },
                '& .MuiSvgIcon-root': {
                  fontSize: 24,
                },
              }}
            >
              {/* Home */}
              <BottomNavigationAction
                label="Home"
                value="/dashboard"
                icon={
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 52,
                      height: 30,
                      borderRadius: 3,
                      bgcolor: location.pathname === '/dashboard' ? theme.customColors.accent.mint : 'transparent',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <HomeIcon />
                  </Box>
                }
              />
              {/* Fitness */}
              <BottomNavigationAction
                label="Fitness"
                value="/fitness"
                icon={
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 52,
                      height: 30,
                      borderRadius: 3,
                      bgcolor: location.pathname === '/fitness' ? theme.customColors.accent.mint : 'transparent',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <DirectionsRunIcon />
                  </Box>
                }
              />
              {/* Vitals - Red Heart */}
              <BottomNavigationAction
                label="Vitals"
                value="/vitals"
                icon={
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 52,
                      height: 30,
                      borderRadius: 3,
                      bgcolor: location.pathname === '/vitals' ? theme.customColors.accent.mint : 'transparent',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <FavoriteIcon sx={{ color: '#E91E63' }} />
                  </Box>
                }
              />
              {/* Library */}
              <BottomNavigationAction
                label="Library"
                value="/resources"
                icon={
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 52,
                      height: 30,
                      borderRadius: 3,
                      bgcolor: location.pathname === '/resources' ? theme.customColors.accent.mint : 'transparent',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <FolderIcon />
                  </Box>
                }
              />
              {/* Profile - Avatar */}
              <BottomNavigationAction
                label="Account"
                value="/profile"
                icon={
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 52,
                      height: 30,
                      borderRadius: 3,
                      bgcolor: location.pathname === '/profile' ? theme.customColors.accent.mint : 'transparent',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <Avatar
                      src={userApi.getAvatarUrl(profile?.avatarUrl)}
                      sx={{
                        width: 26,
                        height: 26,
                        bgcolor: '#E8DEF8',
                        color: '#65558F',
                        fontSize: 12,
                        border: location.pathname === '/profile' ? '2px solid' : 'none',
                        borderColor: 'primary.main',
                      }}
                    >
                      {profile?.firstName?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                  </Box>
                }
              />
            </BottomNavigation>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
