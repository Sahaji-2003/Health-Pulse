import type { SxProps, Theme } from '@mui/material';

/**
 * Vitals form data structure
 */
export interface VitalsFormData {
  bloodPressureSystolic: string;
  bloodPressureDiastolic: string;
  heartRate: string;
  bloodSugar: string;
  weight: string;
  cholesterol: string;
}

/**
 * Props for VitalsEntrySection component
 */
export interface VitalsEntrySectionProps {
  /** Callback when vitals are saved */
  onSave?: (data: VitalsFormData) => void;
  /** Callback when form is reset */
  onReset?: () => void;
  /** Callback when importing from Google Fit */
  onImportGoogleFit?: () => Promise<VitalsFormData | null>;
  /** Callback when importing from Apple Health */
  onImportAppleHealth?: () => Promise<VitalsFormData | null>;
  /** Initial values for the form */
  initialValues?: Partial<VitalsFormData>;
  /** Loading state */
  isLoading?: boolean;
  /** Whether to show compact version */
  compact?: boolean;
  /** Custom styling */
  sx?: SxProps<Theme>;
}
