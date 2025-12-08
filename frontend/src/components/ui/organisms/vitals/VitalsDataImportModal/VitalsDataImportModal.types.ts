import type { SxProps, Theme } from '@mui/material';

/**
 * Import status for the vitals data import flow
 */
export type VitalsImportStatus = 'idle' | 'selecting-app' | 'selecting-data' | 'importing' | 'success';

/**
 * Health app that can be used to import vitals data
 */
export interface VitalsHealthApp {
  id: 'google-fit' | 'apple-health';
  name: string;
  icon: string;
}

/**
 * Data field for vitals import
 */
export interface VitalsDataField {
  id: keyof VitalsImportData;
  label: string;
  selected: boolean;
}

/**
 * Data that can be imported from health apps
 */
export interface VitalsImportData {
  bloodPressure: boolean;
  bloodSugar: boolean;
  weight: boolean;
  heartRate: boolean;
  cholesterol: boolean;
}

/**
 * Imported vitals values
 */
export interface ImportedVitals {
  bloodPressureSystolic?: string;
  bloodPressureDiastolic?: string;
  bloodSugar?: string;
  weight?: string;
  heartRate?: string;
  cholesterol?: string;
}

/**
 * Props for VitalsDataImportModal component
 */
export interface VitalsDataImportModalProps {
  /**
   * Whether the modal is open
   */
  open: boolean;

  /**
   * Called when modal is closed
   */
  onClose: () => void;

  /**
   * Called when import is complete with the imported data
   */
  onImportComplete?: (data: ImportedVitals) => void;

  /**
   * Which app triggered the import (passed from button click)
   */
  sourceApp?: 'google-fit' | 'apple-health';

  /**
   * Custom styling for the modal content
   */
  sx?: SxProps<Theme>;
}
