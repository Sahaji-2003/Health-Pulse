import type { SxProps, Theme } from '@mui/material';

export interface FitnessHistoryItem {
  /** Date label (e.g., "Today", "Yesterday", "13th Oct") */
  date: string;
  /** Activity name */
  activity: string;
  /** Duration (e.g., "45m", "90m") */
  duration: string;
  /** Status: pending, completed */
  status: 'pending' | 'completed';
}

export interface FitnessActivityCardProps {
  /** Calories burned value */
  caloriesBurned: number;
  /** Today's progress percentage (0-100) */
  progressPercent: number;
  /** Array of fitness history items */
  history: FitnessHistoryItem[];
  /** Callback when more options is clicked */
  onMoreClick?: () => void;
  /** Additional sx props */
  sx?: SxProps<Theme>;
}
