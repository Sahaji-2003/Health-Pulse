import type { SvgIconComponent } from '@mui/icons-material';

export interface NavigationItemProps {
  /** The label text to display */
  label: string;
  /** The icon component to display */
  icon: SvgIconComponent;
  /** The route path to navigate to */
  to: string;
  /** Whether the item is currently active/selected */
  isActive?: boolean;
  /** Optional click handler */
  onClick?: () => void;
  /** Whether to show the label (for collapsed sidebar) */
  showLabel?: boolean;
}
