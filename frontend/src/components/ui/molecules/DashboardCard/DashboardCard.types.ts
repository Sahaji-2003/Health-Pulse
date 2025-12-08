import { ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material';

export interface DashboardCardProps {
  /** Card title displayed in the header */
  title?: string;
  /** Icon to display before the title */
  icon?: ReactNode;
  /** Actions to display on the right side of the header */
  headerActions?: ReactNode;
  /** Main content of the card */
  children: ReactNode;
  /** Maximum width of the card */
  maxWidth?: number | string;
  /** Fixed height of the card */
  height?: number | string;
  /** Whether the card should take full width */
  fullWidth?: boolean;
  /** Additional sx props for customization */
  sx?: SxProps<Theme>;
  /** Additional sx props for content area */
  contentSx?: SxProps<Theme>;
  /** Whether to show padding in content area */
  noPadding?: boolean;
  /** Whether to use compact/smaller sizing */
  compact?: boolean;
}
