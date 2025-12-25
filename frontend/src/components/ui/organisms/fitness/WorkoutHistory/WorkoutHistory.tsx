import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  MenuItem,
  Button,
  Typography,
  Chip,
  useTheme,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { Dayjs } from 'dayjs';
import DownloadIcon from '@mui/icons-material/Download';
import type { WorkoutHistoryProps, WorkoutHistoryFilter, WorkoutHistoryItem } from './WorkoutHistory.types';

const ACTIVITY_TYPES = [
  { value: '', label: 'Select activity' },
  { value: 'walking', label: 'Walking' },
  { value: 'running', label: 'Running' },
  { value: 'cycling', label: 'Cycling' },
  { value: 'swimming', label: 'Swimming' },
  { value: 'weight_training', label: 'Weight Training' },
  { value: 'other', label: 'Other' },
];

const COLUMN_HEADERS = ['Workout Type', 'Date', 'Duration', 'Calories', 'Distance'];

const DEFAULT_WORKOUTS: WorkoutHistoryItem[] = [
  { id: '1', workoutType: 'Walking', date: '15-10-2025', duration: '30 min', calories: '200 kcal', distance: '3 kms' },
  { id: '2', workoutType: 'Running', date: '15-10-2025', duration: '20 min', calories: '200 kcal', distance: '5 kms' },
  { id: '3', workoutType: 'Cycling', date: '15-10-2025', duration: '40 min', calories: '200 kcal', distance: '5 kms' },
  { id: '4', workoutType: 'Swimming', date: '15-10-2025', duration: '30 min', calories: '200 kcal', distance: '5 kms' },
  { id: '5', workoutType: 'Weight Training', date: '15-10-2025', duration: '30 min', calories: '200 kcal', distance: '-' },
];

/**
 * WorkoutHistory Organism Component
 *
 * Displays workout history in a table format with filters for
 * activity type and date range. Includes export functionality.
 */
export const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({
  workouts = DEFAULT_WORKOUTS,
  filters: propsFilters,
  onFilterChange,
  onExport,
  isLoading = false,
}) => {
  const theme = useTheme();

  // Local filter state if not controlled
  const [localFilters, setLocalFilters] = useState<WorkoutHistoryFilter>({
    activityType: '',
    fromDate: '',
    toDate: '',
  });

  // State for MUI DatePickers
  const [fromDateValue, setFromDateValue] = useState<Dayjs | null>(null);
  const [toDateValue, setToDateValue] = useState<Dayjs | null>(null);

  const filters = propsFilters || localFilters;

  const handleFilterChange = (field: keyof WorkoutHistoryFilter) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newFilters = { ...filters, [field]: event.target.value };
    if (onFilterChange) {
      onFilterChange(newFilters);
    } else {
      setLocalFilters(newFilters);
    }
  };

  const handleFromDateChange = (newDate: unknown) => {
    const dayjsDate = newDate as Dayjs | null;
    setFromDateValue(dayjsDate);
    const dateStr = dayjsDate ? dayjsDate.format('MM/DD/YYYY') : '';
    const newFilters = { ...filters, fromDate: dateStr };
    if (onFilterChange) {
      onFilterChange(newFilters);
    } else {
      setLocalFilters(newFilters);
    }
  };

  const handleToDateChange = (newDate: unknown) => {
    const dayjsDate = newDate as Dayjs | null;
    setToDateValue(dayjsDate);
    const dateStr = dayjsDate ? dayjsDate.format('MM/DD/YYYY') : '';
    const newFilters = { ...filters, toDate: dateStr };
    if (onFilterChange) {
      onFilterChange(newFilters);
    } else {
      setLocalFilters(newFilters);
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <Box>
        {/* Filters skeleton */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" width={180} height={56} />
          ))}
        </Box>

        {/* Table skeleton */}
        <Paper sx={{ borderRadius: 7, p: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} variant="rounded" width={100} height={32} />
            ))}
          </Box>
          {[1, 2, 3, 4, 5].map((i) => (
            <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2 }}>
              {[1, 2, 3, 4, 5].map((j) => (
                <Skeleton key={j} variant="rounded" width={100} height={40} />
              ))}
            </Box>
          ))}
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      {/* Filters Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          mb: 3,
          justifyContent: 'flex-end',
        }}
      >
        <TextField
          select
          label="Type"
          value={filters.activityType}
          onChange={handleFilterChange('activityType')}
          helperText="Select activity"
          size="small"
          sx={{
            minWidth: { xs: '100%', sm: 180 },
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
            },
          }}
        >
          {ACTIVITY_TYPES.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="From"
            value={fromDateValue}
            onChange={handleFromDateChange}
            slotProps={{
              textField: {
                size: 'small',
                helperText: 'MM/DD/YYYY',
                sx: {
                  minWidth: { xs: '100%', sm: 160 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  },
                },
              },
            }}
          />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="To"
            value={toDateValue}
            onChange={handleToDateChange}
            slotProps={{
              textField: {
                size: 'small',
                helperText: 'MM/DD/YYYY',
                sx: {
                  minWidth: { xs: '100%', sm: 160 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  },
                },
              },
            }}
          />
        </LocalizationProvider>
      </Box>

      {/* Workout History Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 4,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {COLUMN_HEADERS.map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: theme.palette.text.primary,
                    borderBottom: `2px solid ${theme.palette.divider}`,
                    py: 2,
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {workouts.map((workout) => (
              <TableRow
                key={workout.id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <TableCell>
                  <Chip
                    label={workout.workoutType}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderRadius: 2,
                      minWidth: 80,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.primary">
                    {workout.date}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.primary">
                    {workout.duration}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={workout.calories}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderRadius: 2,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={workout.distance}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderRadius: 2,
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Export Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={onExport}
          sx={{
            borderRadius: 3,
            px: 3,
            py: 1.25,
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Export Workout History
        </Button>
      </Box>
    </Box>
  );
};

export default WorkoutHistory;
