import type { SxProps, Theme } from '@mui/material';

export interface HeartStatusCardProps {
  /**
   * Blood sugar value in mg/Dl
   */
  bloodSugarValue: number;
  /**
   * Blood sugar unit (default: mm/Dl)
   */
  bloodSugarUnit?: string;
  /**
   * Days ago when blood sugar was measured
   */
  daysAgo?: number;
  /**
   * Custom styles
   */
  sx?: SxProps<Theme>;
}
