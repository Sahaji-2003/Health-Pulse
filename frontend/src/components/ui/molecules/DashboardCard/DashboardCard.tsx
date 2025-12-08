import React from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import type { DashboardCardProps } from './DashboardCard.types';

/**
 * DashboardCard Molecule Component
 *
 * A consistent card component for dashboard sections with optional header and actions.
 * Uses theme values for spacing and styling following Material Design 3.
 */
export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  icon,
  headerActions,
  children,
  maxWidth,
  height,
  fullWidth = false,
  sx,
  contentSx,
  noPadding = false,
  compact = false, // New prop for smaller sizing
}) => {
  const theme = useTheme();

  // Responsive padding
  const padding = { xs: compact ? 1.5 : 2, sm: compact ? 2 : 3 };
  const headerPaddingTop = { xs: compact ? 1.5 : 2, sm: compact ? 2 : 3 };

  // Extract height from sx if provided, otherwise use height prop
  const containerHeight = (sx as any)?.height || height || 'auto';

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: { xs: compact ? 4 : 5, sm: compact ? 5 : 6 }, // Responsive border radius
        border: `1px solid rgba(111, 121, 118, 0.16)`,
        bgcolor: theme.palette.background.paper,
        width: fullWidth ? '100%' : 'auto',
        maxWidth: maxWidth || '100%', // Prevent overflow beyond container
        height: containerHeight,
        minHeight: 0, // Allow shrinking in flex/grid contexts
        minWidth: 0, // Critical: prevents grid blowout
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        ...sx,
      }}
    >
      {/* Header */}
      {(title || headerActions) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pt: headerPaddingTop,
            px: padding,
            pb: 0,
            flexShrink: 0, // Header should not shrink
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.75, sm: 1 }, flex: 1, minWidth: 0 }}>
            {icon && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'secondary.main',
                  '& svg': { fontSize: { xs: compact ? 18 : 20, sm: compact ? 20 : 24 } },
                }}
              >
                {icon}
              </Box>
            )}
            {title && (
              <Typography
                variant={compact ? 'body1' : 'subtitle1'}
                sx={{
                  color: theme.palette.primary.dark,
                  fontWeight: 500,
                  fontSize: { xs: compact ? 12 : 14, sm: compact ? 14 : 16 },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {title}
              </Typography>
            )}
          </Box>
          {headerActions && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>{headerActions}</Box>
          )}
        </Box>
      )}

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0, // Critical: allows content to shrink and scroll
          overflow: 'visible', // Changed to visible to prevent clipping of chips
          display: 'flex',
          flexDirection: 'column',
          ...(noPadding ? {} : { p: padding }),
          ...contentSx,
        }}
      >
        {children}
      </Box>
    </Paper>
  );
};

export default DashboardCard;
