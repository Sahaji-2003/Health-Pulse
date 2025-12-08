import React from 'react';
import { Box, Typography, IconButton, CircularProgress, Divider, useTheme } from '@mui/material';
import { DashboardCard } from '../../../molecules/DashboardCard';
import type { HeartStatusCardProps } from './HeartStatusCard.types';

// Heart image from Figma assets
const HEART_IMAGE_URL = '/assets/eb337fd1a0c23bae87b286bda97247c197417eb3.png';

/**
 * BloodSugarMeter Sub-component
 * Circular progress indicator with blood sugar value display
 */
const BloodSugarMeter: React.FC<{
  value: number;
  unit: string;
  daysAgo?: number;
}> = ({ value, unit, daysAgo }) => {
  const theme = useTheme();
  
  // Calculate progress percentage (assuming normal range 70-140 mg/dL)
  const progressPercent = value > 0 ? Math.min(100, Math.max(0, ((value - 70) / 70) * 100)) : 0;

  // Format days ago text
  const getDaysAgoText = () => {
    if (daysAgo === undefined || value === 0) return null;
    if (daysAgo === 0) return '(today)';
    if (daysAgo === 1) return '(1 day ago)';
    return `(${daysAgo} days ago)`;
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: { xs: 140, sm: 160, md: 180 },
        height: { xs: 140, sm: 160, md: 180 },
      }}
    >
      {/* Background circle */}
      <CircularProgress
        variant="determinate"
        value={100}
        size="100%"
        thickness={2}
        sx={{
          position: 'absolute',
          color: 'rgba(232, 222, 248, 1)', // Light purple track
        }}
      />
      {/* Progress circle */}
      <CircularProgress
        variant="determinate"
        value={progressPercent}
        size="100%"
        thickness={2}
        sx={{
          position: 'absolute',
          color: theme.palette.primary.main,
          transform: 'rotate(-90deg) !important',
        }}
      />
      {/* Value and unit */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: 24, sm: 28, md: 32 },
            fontWeight: 500,
            color: theme.palette.primary.dark,
            lineHeight: 1.2,
          }}
        >
          {value > 0 ? value : '--'}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: 12, sm: 14, md: 16 },
            fontWeight: 500,
            color: theme.palette.primary.dark,
            textAlign: 'center',
            lineHeight: '20px',
          }}
        >
          {unit}
        </Typography>
        {getDaysAgoText() && (
          <Typography
            sx={{
              fontSize: { xs: 11, sm: 13, md: 14 },
              fontWeight: 500,
              color: theme.palette.primary.dark,
              textAlign: 'center',
              lineHeight: '18px',
            }}
          >
            {getDaysAgoText()}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

/**
 * BloodSugarLabel Sub-component
 * Icon button with blood sugar label and value
 */
const BloodSugarLabel: React.FC<{
  value: number;
  unit: string;
}> = ({ value, unit }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 1.5, md: 2 },
      }}
    >
      {/* Circular icon button */}
      <IconButton
        sx={{
          bgcolor: theme.palette.primary.main,
          width: { xs: 44, md: 56 },
          height: { xs: 44, md: 56 },
          borderRadius: 3,
          '&:hover': {
            bgcolor: theme.palette.primary.dark,
          },
        }}
        disableRipple
      >
        {/* Progress indicator inside button */}
        <CircularProgress
          variant="determinate"
          value={75}
          size={24}
          thickness={3}
          sx={{
            color: 'rgba(202, 230, 223, 1)',
          }}
        />
      </IconButton>
      
      {/* Label and value */}
      <Box>
        <Typography
          sx={{
            fontSize: { xs: 14, md: 16 },
            fontWeight: 500,
            color: theme.palette.primary.dark,
            lineHeight: '22px',
          }}
        >
          Blood Sugar
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: 18, md: 22 },
            fontWeight: 500,
            color: theme.palette.primary.dark,
            lineHeight: '26px',
          }}
        >
          {value > 0 ? `${value} ${unit}` : 'No data'}
        </Typography>
      </Box>
    </Box>
  );
};

/**
 * HeartStatusCard Organism
 *
 * Displays heart status with a 3D heart image and blood sugar metrics.
 * Features a circular progress meter and labeled blood sugar reading.
 */
export const HeartStatusCard: React.FC<HeartStatusCardProps> = ({
  bloodSugarValue,
  bloodSugarUnit = 'mm/Dl',
  daysAgo = 2,
  sx,
}) => {
  const theme = useTheme();

  return (
    <DashboardCard
      title="Heart Status"
      fullWidth
      compact
      sx={{
        minHeight: { xs: 'auto', md: 320 },
        maxHeight: { md: 420 },
        ...sx,
      }}
      contentSx={{ p: 0, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Left side - Blood Sugar Meter */}
        <Box
          sx={{
            bgcolor: theme.palette.grey[200],
            borderRadius: { xs: 4, md: 7 },
            width: { xs: '100%', sm: 240, md: 280 },
            maxWidth: { sm: 280 },
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: { xs: 2, md: 3 },
            gap: { xs: 1.5, md: 2 },
            m: { xs: 1.5, md: 2 },
          }}
        >
          {/* Blood Sugar Label with Icon */}
          <BloodSugarLabel value={bloodSugarValue} unit={bloodSugarUnit} />
          
          {/* Thin Divider Line */}
          <Divider sx={{ width: '100%', borderColor: theme.palette.divider }} />
          
          {/* Circular Progress Meter */}
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: { xs: 1, md: 2 } }}>
            <BloodSugarMeter
              value={bloodSugarValue}
              unit="mg/Dl"
              daysAgo={daysAgo}
            />
          </Box>
        </Box>

        {/* Right side - Heart Image */}
        <Box
          sx={{
            flex: 1,
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            p: { xs: 1, md: 2 },
            minWidth: 0,
          }}
        >
          <Box
            component="img"
            src={HEART_IMAGE_URL}
            alt="Heart"
            sx={{
              maxWidth: 380,
              maxHeight: 380,
              width: '90%',
              height: 'auto',
              objectFit: 'contain',
              filter: 'saturate(2.5) contrast(1.35) brightness(0.8) hue-rotate(-5deg))',
            }}
          />
        </Box> 
      </Box>
    </DashboardCard>
  );
};

export default HeartStatusCard;
