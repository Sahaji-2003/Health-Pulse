import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import type { AppointmentScheduleFormProps, AppointmentFormData } from './AppointmentScheduleForm.types';

// Generate time slots from 8:00 AM to 8:00 PM
const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 8; hour <= 20; hour++) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    slots.push(`${displayHour}:00 ${period}`);
    if (hour < 20) {
      slots.push(`${displayHour}:30 ${period}`);
    }
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

/**
 * AppointmentScheduleForm Component
 *
 * A form component for scheduling appointments with healthcare providers.
 * Based on Figma design showing provider selection, date/time pickers,
 * and consultation purpose.
 */
export const AppointmentScheduleForm: React.FC<AppointmentScheduleFormProps> = ({
  providers,
  selectedProvider,
  onSubmit,
  onCancel,
  isLoading = false,
  sx,
}) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    providerId: selectedProvider?.id || '',
    date: null,
    startTime: '',
    endTime: '',
    consultationPurpose: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof AppointmentFormData, string>>>({});

  const handleProviderChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, providerId: event.target.value }));
    setErrors((prev) => ({ ...prev, providerId: undefined }));
  }, []);

  const handleDateChange = useCallback((date: Date | null) => {
    setFormData((prev) => ({ ...prev, date }));
    setErrors((prev) => ({ ...prev, date: undefined }));
  }, []);

  const handleStartTimeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, startTime: event.target.value }));
    setErrors((prev) => ({ ...prev, startTime: undefined }));
  }, []);

  const handleEndTimeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, endTime: event.target.value }));
    setErrors((prev) => ({ ...prev, endTime: undefined }));
  }, []);

  const handlePurposeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, consultationPurpose: event.target.value }));
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AppointmentFormData, string>> = {};

    if (!formData.providerId) {
      newErrors.providerId = 'Please select a provider';
    }
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    if (!formData.startTime) {
      newErrors.startTime = 'Please select a start time';
    }
    if (!formData.endTime) {
      newErrors.endTime = 'Please select an end time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback(() => {
    if (validateForm()) {
      onSubmit(formData);
      setShowSuccess(true);
    }
  }, [formData, onSubmit]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 7,
          p: 3,
          maxWidth: 480,
          ...sx,
        }}
      >
        {/* Title */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 500,
            color: 'text.primary',
            mb: 3,
          }}
        >
          Appointment Schedule
        </Typography>

        {/* Provider Select */}
        <TextField
          select
          fullWidth
          label="Select Provider/Insurer"
          value={formData.providerId}
          onChange={handleProviderChange}
          error={!!errors.providerId}
          helperText={errors.providerId}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <ArrowDropDownIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        >
          {providers.map((provider) => (
            <MenuItem key={provider.id} value={provider.id}>
              {provider.name} - {provider.specialty}
            </MenuItem>
          ))}
        </TextField>

        {/* Date Picker */}
        <DatePicker
          label="Date"
          value={formData.date}
          onChange={handleDateChange}
          disablePast
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!errors.date,
              helperText: errors.date,
              sx: { mb: 2 },
              InputProps: {
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            },
          }}
        />

        {/* Time Selects Row */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            select
            fullWidth
            label="Start Time"
            value={formData.startTime}
            onChange={handleStartTimeChange}
            error={!!errors.startTime}
            helperText={errors.startTime}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ArrowDropDownIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          >
            {TIME_SLOTS.map((time) => (
              <MenuItem key={`start-${time}`} value={time}>
                {time}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="End Time"
            value={formData.endTime}
            onChange={handleEndTimeChange}
            error={!!errors.endTime}
            helperText={errors.endTime}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ArrowDropDownIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          >
            {TIME_SLOTS.map((time) => (
              <MenuItem key={`end-${time}`} value={time}>
                {time}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Consultation Purpose */}
        <TextField
          fullWidth
          label="Consultation Purpose"
          placeholder="Optional"
          value={formData.consultationPurpose}
          onChange={handlePurposeChange}
          multiline
          minRows={2}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                <EditIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          helperText="Optional"
          sx={{ mb: 3 }}
        />

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={isLoading}
            sx={{
              borderRadius: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Schedule Appointment'
            )}
          </Button>
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={isLoading}
            sx={{
              borderRadius: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 500,
              borderColor: 'divider',
              color: 'text.secondary',
            }}
          >
            Cancel
          </Button>
        </Box>

        {/* Success Snackbar */}
        <Snackbar
          open={showSuccess}
          autoHideDuration={3000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            Booking successful.
          </Alert>
        </Snackbar>
      </Paper>
    </LocalizationProvider>
  );
};

export default AppointmentScheduleForm;
