import type { SxProps, Theme } from '@mui/material';
import type { Reminder } from '@/types';

/**
 * Reminder item data structure (for display)
 */
export interface ReminderItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
}

/**
 * Alert history item data structure
 */
export interface AlertHistoryItem {
  id: string;
  date: string;
  title: string;
  value: string;
  isCompleted?: boolean;
}

/**
 * Props for ManageReminders component
 */
export interface ManageRemindersProps {
  /**
   * List of reminders to display
   */
  reminders?: ReminderItem[];
  /**
   * Raw reminder data from API (for edit/delete operations)
   */
  reminderData?: Reminder[];
  /**
   * Whether reminders are loading
   */
  isLoading?: boolean;
  /**
   * Callback when Edit Reminder is clicked
   */
  onEditReminder?: (reminder?: Reminder) => void;
  /**
   * Callback when Cancel/Delete is clicked
   */
  onCancel?: (reminderId?: string) => void;
  /**
   * Callback when a reminder item is clicked
   */
  onReminderClick?: (reminder: Reminder) => void;
  /**
   * Custom styles
   */
  sx?: SxProps<Theme>;
}

/**
 * Props for HistoryAlerts component
 */
export interface HistoryAlertsProps {
  /**
   * List of alert history items
   */
  alerts?: AlertHistoryItem[];
  /**
   * Whether there are no alerts (show empty state)
   */
  isEmpty?: boolean;
  /**
   * Callback when info icon is clicked
   */
  onInfoClick?: () => void;
  /**
   * Custom styles
   */
  sx?: SxProps<Theme>;
}

/**
 * Props for the RemindersAlertsSection component
 */
export interface RemindersAlertsSectionProps {
  /**
   * Reminders data (display format)
   */
  reminders?: ReminderItem[];
  /**
   * Raw reminder data from API
   */
  reminderData?: Reminder[];
  /**
   * Alert history data
   */
  alerts?: AlertHistoryItem[];
  /**
   * Whether reminders are loading
   */
  isLoading?: boolean;
  /**
   * Show empty state for alerts
   */
  showEmptyState?: boolean;
  /**
   * Callback when Edit Reminder is clicked
   */
  onEditReminder?: (reminder?: Reminder) => void;
  /**
   * Callback when Cancel is clicked
   */
  onCancel?: () => void;
  /**
   * Callback when reminder is saved
   */
  onReminderSave?: () => void;
  /**
   * Custom styles
   */
  sx?: SxProps<Theme>;
}
