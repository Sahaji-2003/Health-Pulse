import React from 'react';
import { Box, Paper, Typography, IconButton, Divider, useTheme } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { CircularProgressWithLabel } from '../../atoms/CircularProgressWithLabel';
import type { FitnessStatCardProps } from './FitnessStatCard.types';

/**
 * FitnessStatCard Molecule Component
 *
 * A card displaying fitness statistics with a circular progress indicator.
 * Used for Total Workouts, Calories, Duration, and Distance stats.
 */
export const FitnessStatCard: React.FC<FitnessStatCardProps> = ({
  title,
  goal,
  currentValue,
  targetValue,
  progressLabel,
  icon,
  dayLabel,
  formatValue,
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 7, // 28px
        bgcolor: theme.palette.mode === 'light' 
          ? '#E3EAE7' 
          : theme.palette.background.paper,
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: { xs: 360, sm: 380, md: 400 },
      }}
    >
      {/* Header with icon and title */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1 }}>
        <IconButton
          sx={{
            bgcolor: theme.palette.primary.main,
            color: 'white',
            borderRadius: 4,
            width: 56,
            height: 56,
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
            },
          }}
          disableRipple
        >
          {icon || <FitnessCenterIcon />}
        </IconButton>
        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 500,
              color: theme.palette.primary.dark,
              fontSize: { xs: 14, sm: 16 },
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              color: theme.palette.primary.dark,
              fontSize: { xs: 18, sm: 22 },
            }}
          >
            {goal}
          </Typography>
        </Box>
      </Box>

      {/* Divider */}
      <Divider sx={{ my: 2 }} />

      {/* Circular Progress */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 2,
        }}
      >
        <CircularProgressWithLabel
          value={currentValue}
          max={targetValue}
          size={180}
          thickness={6}
          label={progressLabel}
          formatValue={formatValue}
        />
      </Box>

      {/* Day label at bottom */}
      {dayLabel && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: theme.palette.primary.dark,
            }}
          >
            {dayLabel}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default FitnessStatCard;
