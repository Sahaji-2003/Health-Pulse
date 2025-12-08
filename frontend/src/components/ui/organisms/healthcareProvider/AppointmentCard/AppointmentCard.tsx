import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  IconButton,
  Rating,
} from '@mui/material';
import {
  HealthAndSafety as HealthIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import type { AppointmentCardProps } from './AppointmentCard.types';

/**
 * AppointmentCard Component
 *
 * Displays appointment information with provider details, date/time,
 * rating, and action buttons. Based on Figma design for the
 * Healthcare Provider appointment cards.
 */
export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onJoinSession,
  onClick,
  onMoreClick,
  showJoinButton = true,
  sx,
}) => {
  const { provider, dateTime } = appointment;

  // Format date as DD/MM/YYYY
  const formattedDate = dateTime.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // Format time as HH:MM AM/PM
  const formattedTime = dateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const handleCardClick = () => {
    onClick?.(appointment);
  };

  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onJoinSession?.(appointment);
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMoreClick?.(appointment);
  };

  return (
    <Paper
      elevation={0}
      onClick={handleCardClick}
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 6,
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow 0.2s ease-in-out',
        '&:hover': onClick
          ? {
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }
          : undefined,
        ...sx,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pt: 3,
          px: 3,
          pb: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HealthIcon sx={{ color: 'text.secondary', fontSize: 24 }} />
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 500,
              color: 'text.primary',
            }}
          >
            Healthcare Provider
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={handleMoreClick}
          sx={{ color: 'text.secondary' }}
        >
          <MoreVertIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          p: 3,
        }}
      >
        {/* Provider Avatar */}
        <Avatar
          src={provider.avatarUrl}
          alt={provider.name}
          sx={{
            width: 120,
            height: 120,
            border: '4px solid',
            borderColor: 'primary.main',
          }}
        />

        {/* Rating */}
        <Rating
          value={provider.rating}
          precision={0.1}
          readOnly
          sx={{
            '& .MuiRating-iconFilled': {
              color: '#FFD700',
            },
          }}
        />

        {/* Provider Name */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: 'text.secondary',
            textAlign: 'center',
            width: '100%',
          }}
        >
          {provider.name}
        </Typography>

        {/* Date */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: 'text.secondary',
            textAlign: 'center',
            width: '100%',
            mt: -2,
          }}
        >
          {formattedDate}
        </Typography>

        {/* Time */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: 'text.secondary',
            textAlign: 'center',
            width: '100%',
            mt: -2,
          }}
        >
          {formattedTime}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
            width: '100%',
            mt: -1,
          }}
        >
          Share your health data securely and get tailored advice, wellness plans, and support from certified professionals.
        </Typography>

        {/* Join Session Button */}
        {showJoinButton && appointment.status === 'upcoming' && (
          <Button
            variant="contained"
            fullWidth
            onClick={handleJoinClick}
            sx={{
              borderRadius: 3,
              py: 1.25,
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            Join Session
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default AppointmentCard;
