import type { SxProps, Theme } from '@mui/material';
import type { Provider } from '../ProviderCard/ProviderCard.types';

/**
 * Props for ProviderList component
 */
export interface ProviderListProps {
  providers: Provider[];
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onConnectClick?: (provider: Provider) => void;
  onMenuClick?: (provider: Provider, anchorEl: HTMLElement) => void;
  onScheduleClick?: () => void;
  onListAppointmentsClick?: () => void;
  isLoading?: boolean;
  sx?: SxProps<Theme>;
}
