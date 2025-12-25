import type { SxProps, Theme } from '@mui/material';

export interface RecommendationsCardProps {
  /** Whether recommendations have been enabled */
  isEnabled?: boolean;
  /** Image/illustration URL */
  illustrationUrl?: string;
  /** Callback when receive recommendations button is clicked */
  onReceiveRecommendations?: () => void;
  /** Callback when more options is clicked */
  onMoreClick?: () => void;
  /** Additional sx props */
  sx?: SxProps<Theme>;
}
