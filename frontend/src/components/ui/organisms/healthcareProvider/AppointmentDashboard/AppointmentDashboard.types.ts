import type { SxProps, Theme } from '@mui/material';
import type { Appointment } from '../AppointmentCard/AppointmentCard.types';

export type AppointmentViewMode = 'list' | 'calendar';

export interface AppointmentDashboardProps {
  /**
   * List of upcoming appointments
   */
  upcomingAppointments: Appointment[];
  /**
   * List of past appointments
   */
  pastAppointments: Appointment[];
  /**
   * Selected appointment for the detail panel
   */
  selectedAppointment?: Appointment;
  /**
   * Current view mode (list or calendar)
   */
  viewMode?: AppointmentViewMode;
  /**
   * Selected date for calendar view
   */
  selectedDate?: Date | null;
  /**
   * User's name for greeting
   */
  userName?: string;
  /**
   * Callback when view mode changes
   */
  onViewModeChange?: (mode: AppointmentViewMode) => void;
  /**
   * Callback when date is selected in calendar
   */
  onDateSelect?: (date: Date | null) => void;
  /**
   * Callback when an appointment is selected
   */
  onAppointmentSelect?: (appointment: Appointment) => void;
  /**
   * Callback when Join Session is clicked
   */
  onJoinSession?: (appointment: Appointment) => void;
  /**
   * Callback to schedule a new appointment
   */
  onScheduleAppointment?: () => void;
  /**
   * Custom styles
   */
  sx?: SxProps<Theme>;
}
