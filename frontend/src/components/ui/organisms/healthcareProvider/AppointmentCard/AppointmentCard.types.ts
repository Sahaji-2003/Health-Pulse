import type { SxProps, Theme } from '@mui/material';
import type { Provider } from '../ProviderCard/ProviderCard.types';

export type AppointmentStatus = 'upcoming' | 'past' | 'cancelled';

export interface Appointment {
  /**
   * Unique identifier for the appointment
   */
  id: string;
  /**
   * The healthcare provider for this appointment
   */
  provider: Provider;
  /**
   * Appointment title/type (e.g., "Checkup", "Follow-up")
   */
  title: string;
  /**
   * Date and time of the appointment
   */
  dateTime: Date;
  /**
   * Duration in minutes
   */
  duration: number;
  /**
   * Purpose/notes for the appointment
   */
  purpose?: string;
  /**
   * Status of the appointment
   */
  status: AppointmentStatus;
}

export interface AppointmentCardProps {
  /**
   * The appointment data
   */
  appointment: Appointment;
  /**
   * Callback when Join Session button is clicked
   */
  onJoinSession?: (appointment: Appointment) => void;
  /**
   * Callback when card is clicked
   */
  onClick?: (appointment: Appointment) => void;
  /**
   * Callback when more actions menu is opened
   */
  onMoreClick?: (appointment: Appointment) => void;
  /**
   * Whether to show the join session button
   */
  showJoinButton?: boolean;
  /**
   * Custom styles
   */
  sx?: SxProps<Theme>;
}
