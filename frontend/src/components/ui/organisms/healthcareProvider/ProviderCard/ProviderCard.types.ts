import type { SxProps, Theme } from '@mui/material';

/**
 * Provider type - either healthcare provider or insurance company
 */
export type ProviderType = 'healthcare' | 'insurance';

/**
 * Provider data model
 */
export interface Provider {
  id: string;
  name: string;
  type?: ProviderType;
  specialty: string;
  description: string;
  rating: number;
  avatarUrl?: string;
  specialties?: string[];
  isConnected?: boolean;
  isBookmarked?: boolean;
}

/**
 * Props for ProviderCard component
 */
export interface ProviderCardProps {
  provider: Provider;
  onConnectClick?: (provider: Provider) => void;
  onMenuClick?: (provider: Provider, anchorEl: HTMLElement) => void;
  sx?: SxProps<Theme>;
}
