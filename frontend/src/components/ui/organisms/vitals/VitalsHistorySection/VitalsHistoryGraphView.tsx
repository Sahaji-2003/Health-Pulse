import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Switch,
  useTheme,
  InputAdornment,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DownloadIcon from '@mui/icons-material/Download';
import type { VitalsHistoryGraphViewProps, WeeklyDataPoint } from './VitalsHistorySection.types';

// Default weekly data for demonstration
const defaultWeeklyData: WeeklyDataPoint[] = [
  { day: 'Mon', value: 72, percentage: 57 },
  { day: 'Tue', value: 65, percentage: 36 },
  { day: 'Wed', value: 68, percentage: 44 },
  { day: 'Thu', value: 72, percentage: 57 },
  { day: 'Fri', value: 85, percentage: 100, isHighlighted: true },
  { day: 'Sat', value: 78, percentage: 71 },
  { day: 'Sun', value: 75, percentage: 61 },
];

const vitalTypeOptions = [
  { value: 'heart_rate', label: 'Heart Rate' },
  { value: 'blood_pressure', label: 'Blood Pressure' },
  { value: 'temperature', label: 'Temperature' },
  { value: 'oxygen_saturation', label: 'Oxygen Saturation' },
  { value: 'weight', label: 'Weight' },
  { value: 'blood_sugar', label: 'Blood Sugar' },
];

/**
 * VitalsHistoryGraphView Component
 *
 * Displays vitals history in a bar graph format with filters and controls.
 * Based on Figma design node 2124-3515.
 */
export const VitalsHistoryGraphView: React.FC<VitalsHistoryGraphViewProps> = ({
  title = 'Heart Rate Trend',
  data = defaultWeeklyData,
  onViewModeChange,
  onExport,
  vitalType = 'heart_rate',
  onVitalTypeChange,
  fromDate = '08/12/2025',
  toDate = '08/12/2025',
  onDateRangeChange,
  sx,
}) => {
  const theme = useTheme();
  const [isTableView, setIsTableView] = useState(false);

  const handleViewToggle = () => {
    const newMode = isTableView ? 'graph' : 'table';
    setIsTableView(!isTableView);
    onViewModeChange?.(newMode);
  };

  // Calculate the max bar height in pixels
  const maxBarHeight = 178;

  return (
    <Box sx={sx}>
      {/* Filter Controls - Positioned to the right */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 2,
          mb: 2,
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          justifyContent: 'flex-end',
        }}
      >
        {/* Vital Type Select */}
        <TextField
          select
          label="Type"
          value={vitalType}
          onChange={(e) => onVitalTypeChange?.(e.target.value as any)}
          size="small"
          helperText="Select vital"
          sx={{
            minWidth: 140,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
            },
          }}
        >
          {vitalTypeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        {/* From Date */}
        <TextField
          label="From"
          value={fromDate}
          onChange={(e) => onDateRangeChange?.(e.target.value, toDate)}
          size="small"
          helperText="MM/DD/YYYY"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <CalendarTodayIcon sx={{ fontSize: 20, color: 'action.active' }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            minWidth: 140,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
            },
          }}
        />

        {/* To Date */}
        <TextField
          label="To"
          value={toDate}
          onChange={(e) => onDateRangeChange?.(fromDate, e.target.value)}
          size="small"
          helperText="MM/DD/YYYY"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <CalendarTodayIcon sx={{ fontSize: 20, color: 'action.active' }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            minWidth: 140,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
            },
          }}
        />
      </Box>

      {/* Paper Card */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 7, // 28px
          bgcolor: theme.palette.background.paper,
          p: 3,
        }}
      >
        {/* Header with title and view toggle */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: theme.palette.primary.dark,
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            {title}
          </Typography>

          {/* View Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography
              variant="body2"
              sx={{
                color: !isTableView ? theme.palette.primary.main : theme.palette.text.secondary,
                fontWeight: 600,
                fontSize: 13,
                transition: 'all 0.3s ease',
              }}
            >
              Graph
            </Typography>
            <Switch
              checked={isTableView}
              onChange={handleViewToggle}
              size="medium"
              sx={{
                width: 52,
                height: 28,
                padding: 0,
                '& .MuiSwitch-switchBase': {
                  padding: '3px',
                  '&.Mui-checked': {
                    transform: 'translateX(24px)',
                    '& + .MuiSwitch-track': {
                      backgroundColor: theme.palette.primary.main,
                      opacity: 1,
                    },
                  },
                },
                '& .MuiSwitch-thumb': {
                  width: 22,
                  height: 22,
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                },
                '& .MuiSwitch-track': {
                  borderRadius: 14,
                  backgroundColor: theme.palette.primary.main,
                  opacity: 1,
                },
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: isTableView ? theme.palette.primary.main : theme.palette.text.secondary,
                fontWeight: 600,
                fontSize: 13,
                transition: 'all 0.3s ease',
              }}
            >
              Table
            </Typography>
          </Box>
        </Box>

      {/* Bar Chart */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          height: maxBarHeight + 40, // Extra space for labels
          mb: 3,
          position: 'relative',
        }}
      >
        {data.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                textAlign: 'center',
              }}
            >
              No vitals data found for the selected date range. Try adjusting the filters or add new vitals entries.
            </Typography>
          </Box>
        ) : (
          <>
            {/* Y-axis labels */}
            <Box
              sx={{
                position: 'absolute',
                right: 0,
                top: 0,
                height: maxBarHeight,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                pr: 1,
              }}
            >
              {['100 %', '80 %', '30 %', '0 %'].map((label) => (
                <Typography
                  key={label}
                  variant="caption"
                  sx={{
                    color: theme.palette.primary.dark,
                    fontWeight: 600,
                    fontSize: 12,
                    textAlign: 'right',
                  }}
                >
                  {label}
                </Typography>
              ))}
            </Box>

            {/* Bars */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: { xs: 1, sm: 2, md: 2.5 },
                flex: 1,
                pr: 7,
              }}
            >
              {data.map((item) => {
                const barHeight = (item.percentage / 100) * maxBarHeight;
                return (
                  <Box
                    key={item.day}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      flex: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 30, sm: 45, md: 60 },
                        height: barHeight,
                        bgcolor: item.isHighlighted
                          ? theme.palette.primary.dark
                          : theme.customColors?.accent?.mint || '#9EF2E3',
                        borderRadius: 2,
                        transition: 'height 0.3s ease',
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 0.5,
                        color: theme.palette.primary.dark,
                        fontWeight: 600,
                        fontSize: 12,
                      }}
                    >
                      {item.day}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </>
        )}
      </Box>

      {/* Export Button - at the bottom */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mt: 3,
        }}
      >
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={onExport}
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            px: 2,
            bgcolor: theme.palette.primary.main,
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
            },
          }}
        >
          Export History
        </Button>
      </Box>
      </Paper>
    </Box>
  );
};

export default VitalsHistoryGraphView;
