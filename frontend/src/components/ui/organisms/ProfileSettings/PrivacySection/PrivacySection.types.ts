export interface HealthcareProvider {
  id: string;
  name: string;
  enabled: boolean;
}

export interface PrivacySectionProps {
  /** Optional custom title */
  title?: string;
  /** Healthcare providers list */
  providers?: HealthcareProvider[];
  /** Handler for saving privacy settings */
  onSave?: (providers: HealthcareProvider[]) => void;
  /** Whether save is in progress */
  isSaving?: boolean;
  /** Optional content to render */
  children?: React.ReactNode;
}
