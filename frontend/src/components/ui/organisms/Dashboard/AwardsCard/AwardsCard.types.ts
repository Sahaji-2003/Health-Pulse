import type { SxProps, Theme } from '@mui/material';

export interface AwardsCardProps {
  /** Badge name earned */
  badgeName: string;
  /** Date when badge was earned */
  earnedDate: string;
  /** Current streak count */
  streakDays: number;
  /** Number of new rewards */
  newRewards: number;
  /** Badge image URL */
  badgeImageUrl?: string;
  /** Callback when review activities is clicked */
  onReviewActivities?: () => void;
  /** Callback when reward shop is clicked */
  onRewardShop?: () => void;
  /** Callback when more options is clicked */
  onMoreClick?: () => void;
  /** Additional sx props */
  sx?: SxProps<Theme>;
}
