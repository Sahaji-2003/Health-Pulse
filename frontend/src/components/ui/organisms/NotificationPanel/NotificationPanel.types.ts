import type { SxProps, Theme } from '@mui/material';

export type NotificationCategory = 'All' | 'Critical' | 'Activities' | 'Promotions';

export interface NotificationItem {
  id: string;
  type: 'health_alert' | 'activity' | 'promotion' | 'info';
  title: string;
  message: string;
  isRead: boolean;
  isHighlighted?: boolean;
  timestamp?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export interface NotificationPanelProps {
  /** Anchor element for positioning the dropdown */
  anchorEl: HTMLElement | null;
  /** Whether the panel is open */
  open: boolean;
  /** Callback when panel is closed */
  onClose: () => void;
  /** List of notifications to display */
  notifications: NotificationItem[];
  /** Currently selected category filter */
  selectedCategory?: NotificationCategory;
  /** Callback when category filter changes */
  onCategoryChange?: (category: NotificationCategory) => void;
  /** Callback when notification action button is clicked */
  onNotificationAction?: (notificationId: string, action: 'primary' | 'secondary') => void;
  /** Whether notifications are loading */
  isLoading?: boolean;
  /** Whether there was an error fetching notifications */
  isError?: boolean;
  /** Custom styles */
  sx?: SxProps<Theme>;
}
