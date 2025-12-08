import { SxProps, Theme } from '@mui/material';

export interface ChartDataPoint {
  /** Day label (e.g., "M", "T", "W") */
  day: string;
  /** Value for the bar */
  value: number;
  /** Whether this day is highlighted */
  isHighlighted?: boolean;
}

export interface WeeklyChartCardProps {
  /** Array of chart data points */
  data: ChartDataPoint[];
  /** Currently selected filter */
  selectedFilter: 'Walking' | 'Heart Rate' | 'Weight';
  /** Target line value (optional) */
  targetValue?: number;
  /** Insight text to display below chart */
  insightText?: string;
  /** Callback when filter chip is clicked */
  onFilterChange?: (filter: 'Walking' | 'Heart Rate' | 'Weight') => void;
  /** Callback when more options is clicked */
  onMoreClick?: () => void;
  /** Additional sx props */
  sx?: SxProps<Theme>;
}
