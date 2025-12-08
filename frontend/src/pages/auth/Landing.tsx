import React from 'react';
import { Box, Container, useMediaQuery, useTheme, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

// Import atoms
import { EmojiDecoration, Icon } from '../../components/ui/atoms';

/**
 * Landing Page
 * 
 * The main entry point for unauthenticated users.
 * Features the Health Pulse branding with heart icon, tagline, and auth navigation buttons.
 * Fully responsive for mobile, tablet, and desktop views.
 * Uses MUI sx prop for styling instead of styled-components.
 */
export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  // Determine emoji size and visibility based on screen size
  const emojiSize = isMobile ? 'small' : isTablet ? 'medium' : 'large';
  const showEmojis = !isMobile; // Hide emojis on mobile for cleaner UI

  return (
    <Box
      sx={{
        bgcolor: theme.customColors.background.mintLight,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        p: 2,
      }}
    >
      {/* Decorative Emojis - Only show on tablet and desktop */}
      {showEmojis && (
        <>
          {/* Left Side */}
          <EmojiDecoration emoji="🩺" size={emojiSize} top="17%" left={isTablet ? '3%' : '10%'} />
          <EmojiDecoration emoji="🥗" size={emojiSize} top="42%" left={isTablet ? '3%' : '10%'} />
          <EmojiDecoration emoji="👨🏽‍⚕️" size={emojiSize} top="67%" left={isTablet ? '3%' : '10%'} />

          {/* Right Side */}
          <EmojiDecoration emoji="🏃🏽‍♀️" size={emojiSize} top="17%" right={isTablet ? '3%' : '10%'} />
          <EmojiDecoration emoji="🍏" size={emojiSize} top="42%" right={isTablet ? '3%' : '10%'} />
          <EmojiDecoration emoji="⛑️" size={emojiSize} top="67%" right={isTablet ? '3%' : '10%'} />
        </>
      )}

      {/* Main Content */}
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Logo with Heart Icon */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 1.5, sm: 2, md: 3 },
            mb: { xs: 3, sm: 4, md: 5 },
            flexWrap: 'wrap',
          }}
        >
          <Typography
            variant={isMobile ? 'h3' : isTablet ? 'h2' : 'h1'}
            sx={{ 
              color: 'primary.main', 
              fontWeight: 600,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
              lineHeight: 1.2,
            }}
          >
            Health
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon 
              icon={FavoriteBorderIcon} 
              customSize={isMobile ? 48 : isTablet ? 56 : 80} 
              color="primary" 
            />
          </Box>
          <Typography
            variant={isMobile ? 'h3' : isTablet ? 'h2' : 'h1'}
            sx={{ 
              color: 'primary.main', 
              fontWeight: 600,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
              lineHeight: 1.2,
            }}
          >
            Pulse
          </Typography>
        </Box>

        {/* Tagline */}
        <Box
          sx={{
            maxWidth: theme.customSizes.maxWidth.sm,
            textAlign: 'center',
            mb: { xs: 5, sm: 6, md: 7 },
            px: { xs: 1.5, sm: 2 },
          }}
        >
          <Typography
            variant={isMobile ? 'body1' : 'h6'}
            sx={{ 
              color: 'text.secondary', 
              fontWeight: 500,
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
              lineHeight: 1.6,
              textAlign: 'center' 
            }}
          >
            Track your fitness journey, fuel your strength, balance your mind and live healthier every day.
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 1.5, sm: 2 },
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            [theme.breakpoints.down('sm')]: {
              flexDirection: 'column',
              gap: 2,
              width: '100%',
            },
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size={isMobile ? 'large' : 'large'}
            onClick={handleRegister}
            fullWidth={isMobile}
            sx={{
              borderRadius: 3,
              fontSize: { xs: '1rem', sm: '1.1rem' },
              fontWeight: 500,
              padding: { xs: '12px 32px', sm: '14px 40px' },
              minWidth: isMobile ? 'auto' : '150px',
            }}
          >
            Register
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size={isMobile ? 'large' : 'large'}
            onClick={handleLogin}
            fullWidth={isMobile}
            sx={{
              borderRadius: 3,
              fontSize: { xs: '1rem', sm: '1.1rem' },
              fontWeight: 500,
              padding: { xs: '12px 32px', sm: '14px 40px' },
              minWidth: isMobile ? 'auto' : '150px',
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              },
            }}
          >
            Log In
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Landing;
