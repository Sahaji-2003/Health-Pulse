import { SxProps, Theme } from '@mui/material';

export interface VitalReading {
  /** Current value (e.g., "100/65", "83", "70") */
  value: string | null;
  /** Unit (e.g., "mm Hg", "BPM", "Kgs") */
  unit: string;
  /** Label for the vital */
  label: 'Blood Pressure' | 'Heart Rate' | 'Weight';
  /** Ranges for visual indicator */
  ranges?: VitalRange[];
  /** Current position on the range (0-100) */
  currentPosition?: number;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Whether there was an error fetching data */
  hasError?: boolean;
  /** Text color for warning states (e.g., yellow for Weight warning) */
  textColor?: 'default' | 'warning';
}

export interface VitalRange {
  /** Range label (e.g., "SYS", "DIA", "Normal Range") */
  label?: string;
  /** Position on scale (0-100) */
  position: number;
  /** Status: good, warning, danger */
  status: 'good' | 'warning' | 'danger';
}

export interface VitalsCardProps {
  /** Array of vital readings to display (Weight, Blood Pressure, Heart Rate) */
  vitals: VitalReading[];
  /** Callback when navigation arrows are clicked */
  onNavigate?: (direction: 'prev' | 'next') => void;
  /** Callback when more options is clicked */
  onMoreClick?: () => void;
  /** Callback when refresh button is clicked */
  onRefresh?: (vitalLabel: string) => void;
  /** Whether any vitals are loading */
  isLoading?: boolean;
  /** Additional sx props */
  sx?: SxProps<Theme>;
}
