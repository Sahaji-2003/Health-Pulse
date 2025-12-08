import type { SxProps, Theme } from '@mui/material';

/**
 * Represents a single vitals history data point
 */
export interface VitalsHistoryData {
  id: string;
  date: string;
  value: number;
  unit: string;
}

/**
 * Weekly data point for graph view
 */
export interface WeeklyDataPoint {
  day: string;
  value: number;
  percentage: number;
  isHighlighted?: boolean;
}

/**
 * View mode for vitals history
 */
export type VitalsHistoryViewMode = 'graph' | 'table';

/**
 * Vital type options
 */
export type VitalType = 'heart_rate' | 'blood_pressure' | 'temperature' | 'oxygen_saturation' | 'weight' | 'blood_sugar';

/**
 * Props for the Graph View component
 */
export interface VitalsHistoryGraphViewProps {
  /**
   * Title for the graph
   */
  title?: string;
  /**
   * Weekly data points to display
   */
  data?: WeeklyDataPoint[];
  /**
   * Callback when view mode changes
   */
  onViewModeChange?: (mode: VitalsHistoryViewMode) => void;
  /**
   * Callback when export is clicked
   */
  onExport?: () => void;
  /**
   * Selected vital type
   */
  vitalType?: VitalType;
  /**
   * Callback when vital type changes
   */
  onVitalTypeChange?: (type: VitalType) => void;
  /**
   * From date filter
   */
  fromDate?: string;
  /**
   * To date filter
   */
  toDate?: string;
  /**
   * Callback when date range changes
   */
  onDateRangeChange?: (from: string, to: string) => void;
  /**
   * Custom styles
   */
  sx?: SxProps<Theme>;
}

/**
 * Props for the Table View component
 */
export interface VitalsHistoryTableViewProps {
  /**
   * Title for the table
   */
  title?: string;
  /**
   * Table data to display
   */
  data?: VitalsHistoryData[];
  /**
   * Callback when view mode changes
   */
  onViewModeChange?: (mode: VitalsHistoryViewMode) => void;
  /**
   * Callback when export is clicked
   */
  onExport?: () => void;
  /**
   * Selected vital type
   */
  vitalType?: VitalType;
  /**
   * Callback when vital type changes
   */
  onVitalTypeChange?: (type: VitalType) => void;
  /**
   * From date filter
   */
  fromDate?: string;
  /**
   * To date filter
   */
  toDate?: string;
  /**
   * Callback when date range changes
   */
  onDateRangeChange?: (from: string, to: string) => void;
  /**
   * Custom styles
   */
  sx?: SxProps<Theme>;
}

export interface VitalsHistorySectionProps {
  /**
   * Current view mode
   */
  viewMode?: VitalsHistoryViewMode;
  /**
   * Callback when view mode changes
   */
  onViewModeChange?: (mode: VitalsHistoryViewMode) => void;
  /**
   * Graph data for weekly view
   */
  graphData?: WeeklyDataPoint[];
  /**
   * Table data for list view
   */
  tableData?: VitalsHistoryData[];
  /**
   * Selected vital type
   */
  vitalType?: VitalType;
  /**
   * Callback when vital type changes
   */
  onVitalTypeChange?: (type: VitalType) => void;
  /**
   * From date filter
   */
  fromDate?: string;
  /**
   * To date filter
   */
  toDate?: string;
  /**
   * Callback when date range changes
   */
  onDateRangeChange?: (from: string, to: string) => void;
  /**
   * Callback when export is clicked
   */
  onExport?: () => void;
  /**
   * Custom styles
   */
  sx?: SxProps<Theme>;
}
