import type { SxProps, Theme } from '@mui/material';
import type { Provider } from '../ProviderCard/ProviderCard.types';

/**
 * Props for ProviderDetailView component
 */
export interface ProviderDetailViewProps {
  provider: Provider;
  isBookmarked?: boolean;
  onBack?: () => void;
  onStartVideoChat?: (provider: Provider) => void;
  onStartMessage?: (provider: Provider) => void;
  onBookmarkToggle?: (provider: Provider) => void;
  onMenuClick?: (provider: Provider, anchorEl: HTMLElement) => void;
  sx?: SxProps<Theme>;
}
