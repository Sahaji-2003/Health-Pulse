import type { SxProps, Theme } from '@mui/material';
import type { Provider } from '../ProviderCard/ProviderCard.types';

export interface AppointmentFormData {
  providerId: string;
  date: Date | null;
  startTime: string;
  endTime: string;
  consultationPurpose: string;
}

export interface AppointmentScheduleFormProps {
  /**
   * List of available providers to select from
   */
  providers: Provider[];
  /**
   * Currently selected provider (optional)
   */
  selectedProvider?: Provider;
  /**
   * Callback when form is submitted
   */
  onSubmit: (formData: AppointmentFormData) => void;
  /**
   * Callback when cancel is clicked
   */
  onCancel: () => void;
  /**
   * Whether the form is loading/submitting
   */
  isLoading?: boolean;
  /**
   * Custom styles
   */
  sx?: SxProps<Theme>;
}
