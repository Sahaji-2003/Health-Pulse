import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Avatar,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VideocamIcon from '@mui/icons-material/Videocam';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import type { ProviderDetailViewProps } from './ProviderDetailView.types';

// Import provider avatar image
const providerAvatarImage = '/src/assets/a7e8150b48421155ec56805f777056f57141df11.png';

/**
 * ProviderDetailView Component
 *
 * Displays detailed information about a healthcare provider
 * with options to start video chat or send a message.
 */
export const ProviderDetailView: React.FC<ProviderDetailViewProps> = ({
  provider,
  isBookmarked,
  onBack,
  onStartVideoChat,
  onStartMessage,
  onBookmarkToggle,
  onMenuClick,
  sx,
}) => {
  const theme = useTheme();

  const handleBack = () => {
    onBack?.();
  };

  const handleVideoChat = () => {
    onStartVideoChat?.(provider);
  };

  const handleMessage = () => {
    onStartMessage?.(provider);
  };

  const handleBookmark = () => {
    onBookmarkToggle?.(provider);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onMenuClick?.(provider, event.currentTarget);
  };

  // Extended description for the detail view
  const detailedDescription = `Enables online doctor consultations, appointment booking, and digital health records. Connect with licensed doctors across 22+ specialties via chat, audio, or video—anytime, anywhere. Most consultations begin within 2 minutes.`;

  return (
    <Card
      sx={{
        borderRadius: { xs: 4, sm: 7 },
        bgcolor: '#ffffff',
        maxWidth: 820,
        width: '100%',
        overflow: 'hidden',
        ...sx,
      }}
      elevation={0}
    >
      {/* Header with back button and actions */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 1, sm: 1.5 },
          py: 1,
        }}
      >
        {/* Back button */}
        <IconButton onClick={handleBack} sx={{ color: 'text.primary' }}>
          <ArrowBackIcon />
        </IconButton>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBookmark} sx={{ color: 'text.primary' }}>
            {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>
          <IconButton onClick={handleMenuClick} sx={{ color: 'text.primary' }}>
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Content */}
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'flex-start' },
          gap: { xs: 2, sm: 3 },
          p: { xs: 2, sm: 3 },
        }}
      >
        {/* Provider Avatar */}
        <Avatar
          src={provider.avatarUrl || providerAvatarImage}
          alt={provider.name}
          sx={{
            width: { xs: 120, sm: 160, md: 200 },
            height: { xs: 120, sm: 160, md: 200 },
            bgcolor: '#E8F5F0',
            flexShrink: 0,
          }}
        />

        {/* Provider Info */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: { xs: 1.5, sm: 2 }, 
            flex: 1,
            textAlign: { xs: 'center', sm: 'left' },
            width: '100%',
          }}
        >
          {/* Provider Name and Type */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 400,
              color: theme.palette.text.primary,
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
            }}
          >
            {provider.name} | {provider.specialty || 'Healthcare Provider'}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.primary,
              lineHeight: 1.6,
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
            }}
          >
            {detailedDescription}
          </Typography>

          {/* Action Buttons */}
          <Box 
            sx={{ 
              display: 'flex', 
              gap: { xs: 1.5, sm: 2 }, 
              flexWrap: 'wrap', 
              mt: 1,
              justifyContent: { xs: 'center', sm: 'flex-start' },
            }}
          >
            {/* Start Video Chat Button */}
            <Button
              variant="contained"
              startIcon={<VideocamIcon />}
              onClick={handleVideoChat}
              sx={{
                borderRadius: 3,
                px: { xs: 1.5, sm: 2 },
                py: { xs: 1, sm: 1.25 },
                textTransform: 'none',
                fontWeight: 500,
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
              }}
            >
              Start Video Chat
            </Button>

            {/* Message Button */}
            <Button
              variant="outlined"
              startIcon={<ChatBubbleOutlineIcon />}
              onClick={handleMessage}
              sx={{
                borderRadius: 3,
                px: { xs: 1.5, sm: 2 },
                py: { xs: 1, sm: 1.25 },
                textTransform: 'none',
                fontWeight: 500,
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                borderColor: 'divider',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'transparent',
                },
              }}
            >
              Message
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProviderDetailView;
