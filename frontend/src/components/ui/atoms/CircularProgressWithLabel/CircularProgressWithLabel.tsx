import React from 'react';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import type { CircularProgressWithLabelProps } from './CircularProgressWithLabel.types';

/**
 * CircularProgressWithLabel Atom Component
 *
 * A circular progress indicator with a label displayed in the center.
 * Used for displaying goal progress (workouts, calories, duration, distance).
 */
export const CircularProgressWithLabel: React.FC<CircularProgressWithLabelProps> = ({
  value,
  max,
  size = 180,
  thickness = 6,
  label,
  formatValue = (v, m) => `${v}/${m}`,
}) => {
  const theme = useTheme();
  
  // Calculate percentage for progress
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      {/* Background circle (track) */}
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={thickness}
        sx={{
          color: theme.palette.mode === 'light' 
            ? 'rgba(158, 242, 227, 0.4)' 
            : 'rgba(158, 242, 227, 0.2)',
          position: 'absolute',
        }}
      />
      {/* Progress circle */}
      <CircularProgress
        variant="determinate"
        value={percentage}
        size={size}
        thickness={thickness}
        sx={{
          color: theme.palette.primary.main,
          strokeLinecap: 'round',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }}
      />
      {/* Center content */}
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: 500,
            color: 'text.primary',
            fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
          }}
        >
          {formatValue(value, max)}
        </Typography>
        {label && (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              mt: 0.5,
            }}
          >
            {label}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default CircularProgressWithLabel;
