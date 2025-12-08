import type { ReactNode } from 'react';

export interface DashboardLayoutProps {
  /** The content to render inside the layout */
  children: ReactNode;
  /** Title for the page header */
  title: string;
  /** Optional subtitle or chip element to display next to the title */
  headerSubtitle?: ReactNode;
  /** Optional actions/buttons to display on the right side of header */
  headerActions?: ReactNode;
  /** Whether to hide the page header (useful for customize mode with custom header) */
  hideHeader?: boolean;
}
