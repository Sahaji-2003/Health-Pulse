import { ReactNode } from 'react';

export interface PageHeaderProps {
  /**
   * The title displayed in the header
   */
  title: string;
  /**
   * Optional subtitle or chip element to display next to the title
   */
  subtitle?: ReactNode;
  /**
   * Optional actions/buttons to display on the right side
   */
  actions?: ReactNode;
  /**
   * Whether to show notification icon
   * @default false
   */
  showNotification?: boolean;
  /**
   * Notification count to display in badge
   */
  notificationCount?: number;
  /**
   * Callback when notification icon is clicked
   * Passes the mouse event for anchoring popovers/menus
   */
  onNotificationClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Whether to show the menu button (for mobile view)
   * @default false
   */
  showMenuButton?: boolean;
  /**
   * Callback when menu button is clicked
   */
  onMenuClick?: () => void;
}
