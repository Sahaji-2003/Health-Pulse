import React from 'react';
import { Box, useTheme } from '@mui/material';
import { Typography } from '../../atoms/Typography';
import type { LogoBrandProps } from './LogoBrand.types';

/**
 * LogoBrand Molecule Component
 * 
 * Displays the Health Pulse brand logo with optional tagline.
 * Combines Typography and Icon atoms.
 * 
 * @example
 * <LogoBrand size="large" showTagline />
 * <LogoBrand size="small" onClick={() => navigate('/')} />
 */
export const LogoBrand: React.FC<LogoBrandProps> = ({
  size = 'large',
  showTagline = false,
  tagline = 'Track your fitness journey, fuel your strength, balance your mind and live healthier every day.',
  onClick,
}) => {
  const theme = useTheme();

  // Size configurations using theme values
  const getSizeConfig = (sizeVariant: 'small' | 'medium' | 'large') => {
    const configs = {
      small: {
        gap: theme.spacing(0.5),
        typographyVariant: 'headline-small' as const,
      },
      medium: {
        gap: theme.spacing(0.75),
        typographyVariant: 'display-small' as const,
      },
      large: {
        gap: theme.spacing(1),
        typographyVariant: 'display-large' as const,
      },
    };
    return configs[sizeVariant];
  };

  const config = getSizeConfig(size);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? { opacity: 0.8 } : {},
        transition: 'opacity 0.2s ease',
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: config.gap,
        }}
      >
        <Typography
          variant={config.typographyVariant}
          color="primary"
          weight="bold"
        >
          HealthPulse
        </Typography>
      </Box>
      
      {showTagline && (
        <Box
          sx={{
            mt: 3,
            maxWidth: theme.customSizes.maxWidth.sm,
            textAlign: 'center',
            px: 2,
            transition: 'all 0.3s ease',
          }}
        >
          <Typography
            variant="title-small"
            color="on-surface-variant"
            weight="semibold"
            align="center"
          >
            {tagline}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default LogoBrand;
