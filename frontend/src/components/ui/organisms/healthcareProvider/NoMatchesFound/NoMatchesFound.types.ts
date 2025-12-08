import type { SxProps, Theme } from '@mui/material';

/**
 * Props for NoMatchesFound component
 */
export interface NoMatchesFoundProps {
  open: boolean;
  onClose?: () => void;
  message?: string;
  sx?: SxProps<Theme>;
}
