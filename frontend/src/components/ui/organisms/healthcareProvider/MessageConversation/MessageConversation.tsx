import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  IconButton,
  Avatar,
  List,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  TextField,
  InputAdornment,
  Chip,
  useTheme,
  keyframes,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SearchIcon from '@mui/icons-material/Search';
import type { MessageConversationProps, Message } from './MessageConversation.types';

// Import placeholder avatar
const placeholderAvatarImage = '/src/assets/054dfe02e425078fdd66113858fbed2e929f9c10.png';

// Typing indicator animation
const bounce = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-4px);
  }
`;

// Typing Indicator Component
const TypingIndicator: React.FC<{ providerName?: string }> = ({ providerName }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 1,
        mb: 1,
      }}
    >
      <Avatar
        src={placeholderAvatarImage}
        alt="Provider"
        sx={{ width: 36, height: 36 }}
      />
      <Box
        sx={{
          bgcolor: theme.customColors?.background.mintDark || '#E3EAE7',
          px: 2,
          py: 1.5,
          borderRadius: '20px 20px 20px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary', mr: 1 }}>
          {providerName || 'Provider'} is typing
        </Typography>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: 'text.secondary',
              animation: `${bounce} 1.4s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

/**
 * MessageConversation Component
 *
 * Displays a messaging interface with conversation list on the left
 * and chat area on the right.
 */
export const MessageConversation: React.FC<MessageConversationProps> = ({
  conversations,
  selectedConversation,
  currentUserId,
  onConversationSelect,
  onSendMessage,
  onBack,
  suggestedResponses = ["Let's do it", 'Great!', 'Great!'],
  isTyping = false,
  sx,
}) => {
  const theme = useTheme();
  const [messageInput, setMessageInput] = useState('');

  const handleConversationClick = (conversationId: string) => {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (conversation) {
      onConversationSelect?.(conversation);
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedConversation) {
      onSendMessage?.(selectedConversation.id, messageInput);
      setMessageInput('');
    }
  };

  const handleSuggestedResponse = (response: string) => {
    if (selectedConversation) {
      onSendMessage?.(selectedConversation.id, response);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (message: Message) => {
    const isOwnMessage = message.senderId === currentUserId;

    return (
      <Box
        key={message.id}
        sx={{
          display: 'flex',
          justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
          alignItems: 'flex-start',
          gap: 1,
          mb: 1,
        }}
      >
        {!isOwnMessage && (
          <Avatar
            src={placeholderAvatarImage}
            alt="Provider"
            sx={{ width: 36, height: 36 }}
          />
        )}
        <Box
          sx={{
            maxWidth: '70%',
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
          }}
        >
          {/* Image message */}
          {message.type === 'image' && message.imageUrl && (
            <Box
              sx={{
                bgcolor: isOwnMessage ? 'secondary.main' : theme.customColors?.background.mintDark || '#E3EAE7',
                borderRadius: isOwnMessage
                  ? '20px 20px 8px 20px'
                  : '20px 20px 20px 8px',
                overflow: 'hidden',
                p: 1.5,
              }}
            >
              <Box
                component="img"
                src={message.imageUrl}
                alt="Shared image"
                sx={{
                  width: 200,
                  height: 176,
                  objectFit: 'cover',
                  borderRadius: 2,
                  mb: 1,
                }}
              />
              {message.linkTitle && (
                <Typography variant="body2" sx={{ color: isOwnMessage ? 'white' : 'text.primary' }}>
                  {message.linkTitle}
                </Typography>
              )}
              {message.linkDescription && (
                <Typography variant="caption" sx={{ color: isOwnMessage ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                  {message.linkDescription}
                </Typography>
              )}
            </Box>
          )}

          {/* Text message */}
          {message.type === 'text' && (
            <Box
              sx={{
                bgcolor: isOwnMessage ? 'secondary.main' : theme.customColors?.background.mintDark || '#E3EAE7',
                color: isOwnMessage ? 'white' : 'text.secondary',
                px: 2,
                py: 1,
                borderRadius: isOwnMessage
                  ? '20px 20px 8px 20px'
                  : '20px 20px 20px 8px',
              }}
            >
              <Typography variant="body1">{message.content}</Typography>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        height: '100%',
        ...sx,
      }}
    >
      {/* Conversations List */}
      <Box
        sx={{
          width: 432,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Section Header */}
        <Box
          sx={{
            px: 2,
            py: 2.25,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ color: 'text.secondary', fontWeight: 500 }}
          >
            Conversations
          </Typography>
        </Box>

        {/* Conversation List */}
        <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
          {conversations.map((conversation) => (
            <ListItemButton
              key={conversation.id}
              selected={selectedConversation?.id === conversation.id}
              onClick={() => handleConversationClick(conversation.id)}
              sx={{
                py: 1.5,
                px: 2,
                '&.Mui-selected': {
                  bgcolor: 'action.selected',
                },
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemAvatar>
                <Avatar
                  src={conversation.provider.avatarUrl || placeholderAvatarImage}
                  alt={conversation.provider.name}
                  sx={{ width: 40, height: 40 }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {conversation.provider.name || 'Name'}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {conversation.lastMessage}
                  </Typography>
                }
              />
              <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
                {conversation.lastMessageTime}
              </Typography>
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Chat Area */}
      <Card
        sx={{
          flex: 1,
          borderRadius: 7,
          bgcolor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        elevation={0}
      >
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 1.5,
                py: 1,
                borderBottom: 1,
                borderColor: 'divider',
              }}
            >
              <IconButton onClick={onBack} sx={{ color: 'text.primary' }}>
                <ArrowBackIcon />
              </IconButton>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  color: theme.palette.text.primary,
                  flex: 1,
                  ml: 1,
                }}
              >
                {selectedConversation.provider.name} | Healthcare Provider
              </Typography>
            </Box>

            {/* Messages Area */}
            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                p: 3,
                bgcolor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}
            >
              {selectedConversation.messages.map(renderMessage)}
              {isTyping && <TypingIndicator providerName={selectedConversation.provider.name} />}
            </Box>

            {/* Suggested Responses */}
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                justifyContent: 'flex-end',
                px: 3,
                py: 2,
              }}
            >
              {suggestedResponses.map((response, index) => (
                <Chip
                  key={index}
                  label={response}
                  onClick={() => handleSuggestedResponse(response)}
                  sx={{
                    bgcolor: theme.customColors?.accent.mint || '#CAE6DF',
                    color: 'text.primary',
                    borderRadius: '20px',
                    '&:hover': {
                      bgcolor: theme.customColors?.accent.mintHover || '#B0D4CB',
                    },
                  }}
                />
              ))}
            </Box>

            {/* Message Input */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                px: 3,
                py: 1.5,
              }}
            >
              <IconButton sx={{ color: 'text.primary' }}>
                <AddCircleOutlineIcon />
              </IconButton>
              <IconButton sx={{ color: 'text.primary' }}>
                <SentimentSatisfiedAltIcon />
              </IconButton>
              <TextField
                fullWidth
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 6,
                    bgcolor: theme.customColors?.background.mintDark || '#E3EAE7',
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: 'transparent',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small">
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body1" color="text.secondary">
              Select a conversation to start messaging
            </Typography>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default MessageConversation;
