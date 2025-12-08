import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Switch,
  FormControlLabel,
  useTheme,
  Skeleton,
  Grid,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import type { WorkoutEntryProps, WorkoutEntryData } from './WorkoutEntry.types';

const WORKOUT_TYPES = [
  { value: 'walking', label: 'Walking', icon: DirectionsWalkIcon },
  { value: 'running', label: 'Running' },
  { value: 'cycling', label: 'Cycling' },
  { value: 'swimming', label: 'Swimming' },
  { value: 'weight_training', label: 'Weight Training' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'cardio', label: 'Cardio' },
];

// Helper to get current date in format YYYY-MM-DD
const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Helper to get current time in format HH:MM
const getCurrentTime = (): string => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

// Calculate estimated calories based on workout type, duration, and distance
const calculateCalories = (workoutType: string, durationMinutes: number, distanceKm: number): number => {
  const caloriesPerMinute: Record<string, number> = {
    walking: 4,
    running: 10,
    cycling: 8,
    swimming: 9,
    weight_training: 6,
    yoga: 3,
    cardio: 8,
  };
  // Additional calories per km for distance-based workouts
  const caloriesPerKm: Record<string, number> = {
    walking: 50,
    running: 70,
    cycling: 30,
    swimming: 60,
    weight_training: 0,
    yoga: 0,
    cardio: 0,
  };
  const ratePerMinute = caloriesPerMinute[workoutType] || 5;
  const ratePerKm = caloriesPerKm[workoutType] || 0;
  return Math.round((durationMinutes * ratePerMinute) + (distanceKm * ratePerKm));
};

/**
 * WorkoutEntry Organism Component
 *
 * Form for logging new workouts with fields for workout type,
 * duration, distance, auto-calculated calories, and share toggle.
 */
export const WorkoutEntry: React.FC<WorkoutEntryProps> = ({
  initialData,
  onChange,
  onSave,
  isSubmitting = false,
  isLoading = false,
}) => {
  const theme = useTheme();

  // Form state
  const [formData, setFormData] = useState<WorkoutEntryData>({
    workoutType: initialData?.workoutType || 'walking',
    duration: initialData?.duration || '',
    distance: initialData?.distance || '',
    caloriesBurnt: initialData?.caloriesBurnt || '',
    time: initialData?.time || getCurrentTime(),
    date: initialData?.date || getCurrentDate(),
    shareWithFriends: initialData?.shareWithFriends ?? true,
  });

  // State for MUI pickers
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(
    dayjs(`2024-01-01T${formData.time}`)
  );
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    dayjs(formData.date)
  );

  // Update calories when workout type, duration, or distance changes
  useEffect(() => {
    const durationMinutes = parseInt(formData.duration) || 0;
    const distanceKm = parseFloat(formData.distance) || 0;
    if (durationMinutes > 0 || distanceKm > 0) {
      const calories = calculateCalories(formData.workoutType, durationMinutes, distanceKm);
      setFormData((prev) => ({
        ...prev,
        caloriesBurnt: calories.toString(),
      }));
    }
  }, [formData.workoutType, formData.duration, formData.distance]);

  // Notify parent of changes
  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);

  const handleChange = (field: keyof WorkoutEntryData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'shareWithFriends' ? event.target.checked : event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTimeChange = (newTime: Dayjs | null) => {
    setSelectedTime(newTime);
    if (newTime) {
      setFormData((prev) => ({
        ...prev,
        time: newTime.format('HH:mm'),
      }));
    }
  };

  const handleDateChange = (newDate: Dayjs | null) => {
    setSelectedDate(newDate);
    if (newDate) {
      setFormData((prev) => ({
        ...prev,
        date: newDate.format('YYYY-MM-DD'),
      }));
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <Box>
        <Skeleton variant="text" width={150} height={40} sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid size={{ xs: 12, sm: 6 }} key={i}>
              <Skeleton variant="rounded" height={72} />
            </Grid>
          ))}
        </Grid>
        <Skeleton variant="rounded" width={80} height={40} sx={{ mt: 3 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 480 }}>
      {/* Section Title */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 400,
          color: theme.palette.primary.dark,
          mb: 3,
        }}
      >
        Daily Goals
      </Typography>

      {/* Form Fields */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Workout Type */}
        <Grid size={{ xs: 12 }}>
          <TextField
            select
            fullWidth
            label="Workout Type"
            value={formData.workoutType}
            onChange={handleChange('workoutType')}
            helperText="Male, Female, Other"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DirectionsWalkIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              },
            }}
          >
            {WORKOUT_TYPES.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Workout Duration */}
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Workout Duration"
            value={formData.duration}
            onChange={handleChange('duration')}
            helperText="min"
            type="number"
            placeholder="Enter duration"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              },
            }}
          />
        </Grid>

        {/* Distance */}
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Distance"
            value={formData.distance}
            onChange={handleChange('distance')}
            helperText="kms"
            type="number"
            placeholder="Enter distance"
            inputProps={{
              step: 0.1,
              min: 0,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              },
            }}
          />
        </Grid>

        {/* Calories Burnt (Auto-calculated, disabled) */}
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Calories Burnt"
            value={formData.caloriesBurnt}
            helperText="Kcal (auto calculated)"
            disabled
            InputProps={{
              readOnly: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              },
            }}
          />
        </Grid>

        {/* Time (MUI TimePicker) */}
        <Grid size={{ xs: 12 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Time"
              value={selectedTime}
              onChange={handleTimeChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  helperText: 'Select time',
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
        </Grid>

        {/* Date (MUI DatePicker) */}
        <Grid size={{ xs: 12 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date"
              value={selectedDate}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  helperText: 'Select date',
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

      {/* Share with Friends Toggle */}
      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.shareWithFriends}
              onChange={handleChange('shareWithFriends')}
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
          }
          label={
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Share with friends
            </Typography>
          }
          labelPlacement="start"
          sx={{
            ml: 0,
            gap: 1,
          }}
        />
      </Box>

      {/* Save Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        disabled={isSubmitting || !formData.duration}
        sx={{
          borderRadius: 3,
          px: 4,
          py: 1.25,
          textTransform: 'none',
          fontWeight: 500,
        }}
      >
        {isSubmitting ? 'Saving...' : 'Save'}
      </Button>
    </Box>
  );
};

export default WorkoutEntry;
