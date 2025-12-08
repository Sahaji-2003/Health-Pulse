import type { SxProps, Theme } from '@mui/material';
import type { Provider } from '../ProviderCard/ProviderCard.types';

/**
 * Props for VideoSession component
 */
export interface VideoSessionProps {
  provider: Provider;
  onBack?: () => void;
  onEndSession?: () => void;
  onAttachment?: () => void;
  onMenuClick?: (anchorEl: HTMLElement) => void;
  isConnecting?: boolean;
  sx?: SxProps<Theme>;
}

/**
 * Video call state interface
 */
export interface VideoCallState {
  isMicOn: boolean;
  isCameraOn: boolean;
  isConnected: boolean;
  stream: MediaStream | null;
}
