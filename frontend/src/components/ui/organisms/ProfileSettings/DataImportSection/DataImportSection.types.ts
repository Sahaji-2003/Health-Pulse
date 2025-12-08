export interface HealthApp {
  id: string;
  name: string;
  icon: string;
  connected?: boolean;
}

export interface DataField {
  id: string;
  label: string;
  selected: boolean;
}

export type ImportStatus = 'idle' | 'selecting-app' | 'selecting-data' | 'importing' | 'success' | 'error';

export interface DataImportSectionProps {
  /** Current import status/step */
  status?: ImportStatus;
  /** Available health apps to connect */
  availableApps?: HealthApp[];
  /** Selected health app */
  selectedApp?: HealthApp | null;
  /** Data fields available for import */
  dataFields?: DataField[];
  /** Import progress (0-100) */
  importProgress?: number;
  /** Handler for app selection */
  onAppSelect?: (app: HealthApp) => void;
  /** Handler for data field selection toggle */
  onDataFieldToggle?: (fieldId: string) => void;
  /** Handler for starting import */
  onImportStart?: () => void;
  /** Handler for confirming data selection */
  onConfirmDataSelection?: () => void;
  /** Handler for closing success snackbar */
  onSuccessClose?: () => void;
  /** Error message if import fails */
  errorMessage?: string;
}
