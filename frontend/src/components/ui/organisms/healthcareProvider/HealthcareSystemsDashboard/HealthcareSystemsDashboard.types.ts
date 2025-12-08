import type { SxProps, Theme } from '@mui/material';
import type { Provider } from '../ProviderCard/ProviderCard.types';
import type { Conversation } from '../MessageConversation/MessageConversation.types';

/**
 * View states for the Healthcare Systems Dashboard
 */
export type ViewState = 'list' | 'detail' | 'video' | 'message';

/**
 * Props for the HealthcareSystemsDashboard component
 */
export interface HealthcareSystemsDashboardProps {
  /**
   * List of healthcare providers
   */
  providers: Provider[];

  /**
   * List of message conversations
   */
  conversations?: Conversation[];

  /**
   * ID of the currently logged in user
   */
  currentUserId: string;

  /**
   * Callback when user books an appointment
   */
  onBookAppointment?: (provider: Provider) => void;

  /**
   * Callback when user sends a message
   */
  onSendMessage?: (conversationId: string, message: string) => void;

  /**
   * Callback when video session ends
   */
  onEndVideoSession?: (providerId: string) => void;

  /**
   * Loading state
   */
  isLoading?: boolean;

  /**
   * Custom styles
   */
  sx?: SxProps<Theme>;
}
