import type { SxProps, Theme } from '@mui/material';

export interface ProfileCardProps {
  /** User's name */
  name: string;
  /** URL to user's avatar image */
  avatarUrl?: string;
  /** User's age */
  age?: string;
  /** User's date of birth */
  dateOfBirth?: string;
  /** User's gender */
  gender?: string;
  /** User's blood group */
  bloodGroup?: string;
  /** User's weight */
  weight?: string;
  /** Whether profile PDF is being downloaded */
  isDownloading?: boolean;
  /** Callback when schedule button is clicked */
  onScheduleClick?: () => void;
  /** Callback when download button is clicked */
  onDownloadClick?: () => void;
  /** Callback when more details is clicked */
  onMoreDetailsClick?: () => void;
  /** Additional sx props */
  sx?: SxProps<Theme>;
}
