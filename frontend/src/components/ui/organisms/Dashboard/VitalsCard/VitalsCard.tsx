import React from 'react';
import { Box, Typography, IconButton, Button, useTheme, CircularProgress } from '@mui/material';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DashboardCard } from '../../../molecules/DashboardCard';
import type { VitalsCardProps, VitalReading, VitalRange } from './VitalsCard.types';

// 3D Avatar image for error state
const ERROR_ILLUSTRATION_URL = '/assets/74debf751b71f1118c2d863d917678bd8987743a.png';

/**
 * RangeIndicator Sub-component
 * Displays a range bar with colored segments and position marker
 */
const RangeIndicator: React.FC<{
  ranges?: VitalRange[];
  label?: string;
  markerPosition?: number;
}> = ({ ranges, label, markerPosition = 50 }) => {
  if (!ranges) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 1 }}>
      {label && (
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', flexShrink: 0, fontSize: 12, minWidth: 'fit-content' }}
        >
          {label}:
        </Typography>
      )}
      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', flex: 1, position: 'relative' }}>
        {ranges.map((range, index) => (
          <Box
            key={index}
            sx={{
              height: 6,
              flex: 1,
              borderRadius: 3,
              bgcolor:
                range.status === 'good'
                  ? '#04BB87'
                  : range.status === 'warning'
                  ? '#E5A000'
                  : '#DE674E',
            }}
          />
        ))}
        {/* Indicator position marker */}
        <Box
          sx={{
            position: 'absolute',
            left: `${markerPosition}%`,
            transform: 'translateX(-50%)',
            width: 3,
            height: 20,
            bgcolor: 'text.primary',
            borderRadius: 1,
            top: -7,
          }}
        />
      </Box>
    </Box>
  );
};

/**
 * VitalItem Sub-component for displaying data
 */
const VitalItemWithData: React.FC<{
  vital: VitalReading;
}> = ({ vital }) => {
  const theme = useTheme();
  const isWarning = vital.textColor === 'warning';
  const textColor = isWarning ? '#BF8302' : theme.palette.text.secondary;
  const labelColor = isWarning ? '#BF8302' : theme.palette.primary.dark;

  return (
    <Box
      sx={{
        bgcolor: '#F7F2FA', // Gray background from Figma
        borderRadius: 2.5,
        p: { xs: 1.5, sm: 2 },
        pt: { xs: 2, sm: 2.5 },
        flex: { xs: 'none', sm: 1 },
        minWidth: 0,
        height: { xs: 'auto', sm: '100%' },
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 1, sm: 1.5 },
      }}
    >
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Typography
          variant="caption"
          sx={{
            color: labelColor,
            fontWeight: 500,
            fontSize: 11,
            letterSpacing: 0.5,
          }}
        >
          {vital.label}
        </Typography>
        {isWarning && (
          <ErrorOutlineIcon sx={{ fontSize: 14, color: '#BF8302' }} />
        )}
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {/* Value and Unit */}
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
          <Typography
            sx={{
              fontSize: { xs: 28, md: 32 },
              fontWeight: 400,
              color: textColor,
              lineHeight: 1.2,
            }}
          >
            {vital.value}
          </Typography>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 500,
              color: textColor,
              pb: 0.5,
            }}
          >
            {vital.unit}
          </Typography>
        </Box>

        {/* Range Indicators */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {vital.label === 'Weight' && vital.ranges && (
            <RangeIndicator
              ranges={vital.ranges}
              label="Normal Range"
              markerPosition={vital.currentPosition || 70}
            />
          )}
          {vital.label === 'Heart Rate' && vital.ranges && (
            <>
              <RangeIndicator
                ranges={vital.ranges.slice(0, 3)}
                label="Normal Range"
                markerPosition={vital.currentPosition || 55}
              />
              {vital.ranges.length > 3 && (
                <RangeIndicator
                  ranges={vital.ranges.slice(3)}
                  label="Optimal Range"
                  markerPosition={45}
                />
              )}
            </>
          )}
          {vital.label === 'Blood Pressure' && vital.ranges && (
            <>
              <RangeIndicator
                ranges={vital.ranges.slice(0, 4)}
                label="SYS"
                markerPosition={vital.currentPosition || 25}
              />
              {vital.ranges.length > 4 && (
                <RangeIndicator
                  ranges={vital.ranges.slice(4)}
                  label="DIA"
                  markerPosition={30}
                />
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

/**
 * VitalItem Sub-component for error state (no data)
 */
const VitalItemError: React.FC<{
  vital: VitalReading;
  onRefresh?: () => void;
}> = ({ vital, onRefresh }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: '#F7F2FA', // Gray background from Figma
        borderRadius: 2.5,
        p: { xs: 1.5, sm: 2 },
        pt: { xs: 2, sm: 2.5 },
        flex: { xs: 'none', sm: 1 },
        minWidth: 0,
        height: { xs: 'auto', sm: '100%' },
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 1, sm: 1.5 },
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: theme.palette.primary.dark,
          fontWeight: 500,
          fontSize: 11,
          letterSpacing: 0.5,
        }}
      >
        {vital.label}
      </Typography>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 1,
        }}
      >
        {/* 3D Avatar illustration */}
        <Box
          component="img"
          src={ERROR_ILLUSTRATION_URL}
          alt="Error"
          sx={{
            width: 64,
            height: 64,
            objectFit: 'cover',
          }}
        />

        {/* Error message */}
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 400,
            color: theme.palette.text.secondary,
            textAlign: 'center',
            lineHeight: '16px',
          }}
        >
          No data available. Verify if all connected devices are functioning correctly.
        </Typography>

        {/* Refresh button */}
        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
          onClick={onRefresh}
          sx={{
            borderRadius: 100,
            borderColor: theme.palette.divider,
            color: theme.palette.text.secondary,
            textTransform: 'none',
            fontWeight: 500,
            fontSize: 14,
            px: 1.5,
            py: 0.5,
            '&:hover': {
              borderColor: theme.palette.primary.main,
              bgcolor: 'transparent',
            },
          }}
        >
          Refresh
        </Button>
      </Box>
    </Box>
  );
};

/**
 * VitalItem Sub-component for loading state
 */
const VitalItemLoading: React.FC<{
  label: string;
}> = ({ label }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: '#F7F2FA',
        borderRadius: 2.5,
        p: { xs: 1.5, sm: 2 },
        pt: { xs: 2, sm: 2.5 },
        flex: { xs: 'none', sm: 1 },
        minWidth: 0,
        height: { xs: 100, sm: '100%' },
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 1, sm: 1.5 },
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: theme.palette.primary.dark,
          fontWeight: 500,
          fontSize: 11,
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={40} sx={{ color: theme.palette.primary.main }} />
      </Box>
    </Box>
  );
};

/**
 * VitalsCard Organism
 *
 * Displays vital signs information with 3 cards: Weight, Blood Pressure, Heart Rate
 * Shows error state with refresh button when data is not available
 */
export const VitalsCard: React.FC<VitalsCardProps> = ({
  vitals,
  onNavigate,
  onMoreClick,
  onRefresh,
  isLoading,
  sx,
}) => {
  const headerActions = (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton size="small" onClick={() => onNavigate?.('prev')}>
        <NavigateBeforeIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={() => onNavigate?.('next')}>
        <NavigateNextIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={onMoreClick}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
    </Box>
  );

  return (
    <DashboardCard
      title="Vitals"
      icon={<MonitorHeartIcon />}
      headerActions={headerActions}
      fullWidth
      compact
      sx={{ ...sx, height: '100%' }}
      noPadding
      contentSx={{ pt: 0, pb: 2, px: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1.5,
          px: 2,
          flex: 1,
          minHeight: 0,
          overflow: { xs: 'auto', sm: 'hidden' },
        }}
      >
        {vitals.map((vital, index) => {
          if (vital.isLoading || isLoading) {
            return <VitalItemLoading key={index} label={vital.label} />;
          }
          if (vital.hasError || vital.value === null) {
            return (
              <VitalItemError
                key={index}
                vital={vital}
                onRefresh={() => onRefresh?.(vital.label)}
              />
            );
          }
          return <VitalItemWithData key={index} vital={vital} />;
        })}
      </Box>
    </DashboardCard>
  );
};

export default VitalsCard;
