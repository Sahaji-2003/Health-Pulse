import type { SxProps, Theme } from '@mui/material';
import type { Provider } from '../ProviderCard/ProviderCard.types';

/**
 * Message model
 */
export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'link';
  imageUrl?: string;
  linkTitle?: string;
  linkDescription?: string;
}

/**
 * Conversation model
 */
export interface Conversation {
  id: string;
  provider: Provider;
  lastMessage: string;
  lastMessageTime?: string;
  unreadCount?: number;
  messages: Message[];
}

/**
 * Props for MessageConversation component
 */
export interface MessageConversationProps {
  conversations: Conversation[];
  selectedConversation?: Conversation;
  currentUserId: string;
  onConversationSelect?: (conversation: Conversation) => void;
  onSendMessage?: (conversationId: string, message: string) => void;
  onBack?: () => void;
  suggestedResponses?: string[];
  isTyping?: boolean;
  sx?: SxProps<Theme>;
}
