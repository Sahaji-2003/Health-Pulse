import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Switch,
  Chip,
  useTheme,
  Menu,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import type { Reminder } from '@/types';

export interface SetReminderFormProps {
  /**
   * Reminder to edit (if editing)
   */
  editReminder?: Reminder | null;
  /**
   * Whether form is submitting
   */
  isSubmitting?: boolean;
  /**
   * Callback when save is clicked
   */
  onSave?: (data: ReminderFormData) => void;
  /**
   * Callback when cancel is clicked
   */
  onCancel?: () => void;
}

export interface ReminderFormData {
  name: string;
  hour: string;
  minute: string;
  pushNotification: boolean;
  frequency: 'daily' | 'weekly' | 'monthly' | 'once';
  category?: 'medication' | 'appointment' | 'vitals' | 'exercise' | 'water' | 'other';
}

const frequencyOptions: { label: string; value: ReminderFormData['frequency'] }[] = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Once', value: 'once' },
];

/**
 * SetReminderForm Component
 *
 * Form for setting a new reminder with time picker and options.
 * Based on Figma design.
 */
export const SetReminderForm: React.FC<SetReminderFormProps> = ({
  editReminder,
  isSubmitting = false,
  onSave,
  onCancel,
}) => {
  const theme = useTheme();
  const [reminderName, setReminderName] = useState('');
  const [hour, setHour] = useState('20');
  const [minute, setMinute] = useState('00');
  const [pushNotification, setPushNotification] = useState(true);
  const [frequency, setFrequency] = useState<ReminderFormData['frequency']>('daily');
  const [frequencyAnchorEl, setFrequencyAnchorEl] = useState<null | HTMLElement>(null);

  // Populate form when editing
  useEffect(() => {
    if (editReminder) {
      setReminderName(editReminder.name);
      const [h, m] = editReminder.time.split(':');
      setHour(h || '20');
      setMinute(m || '00');
      setPushNotification(editReminder.pushNotification);
      setFrequency(editReminder.frequency);
    } else {
      // Reset form for new reminder
      setReminderName('');
      setHour('20');
      setMinute('00');
      setPushNotification(true);
      setFrequency('daily');
    }
  }, [editReminder]);

  const handleSave = () => {
    if (!reminderName.trim()) return;
    
    onSave?.({
      name: reminderName,
      hour,
      minute,
      pushNotification,
      frequency,
    });
  };

  const handleFrequencyClick = (event: React.MouseEvent<HTMLElement>) => {
    setFrequencyAnchorEl(event.currentTarget);
  };

  const handleFrequencySelect = (value: ReminderFormData['frequency']) => {
    setFrequency(value);
    setFrequencyAnchorEl(null);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 7,
        bgcolor: theme.palette.background.paper,
        p: 2,
        height: '100%',
      }}
    >
      {/* Reminder Name Field */}
      <TextField
        label={editReminder ? 'Edit Reminder' : 'Set Reminder'}
        placeholder="Reminder Name"
        value={reminderName}
        onChange={(e) => setReminderName(e.target.value)}
        fullWidth
        size="small"
        disabled={isSubmitting}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            bgcolor: theme.palette.grey[100],
          },
        }}
      />

      {/* Time Picker */}
      <Box
        sx={{
          bgcolor: theme.customColors?.background?.mint || '#F4FBF8',
          borderRadius: 3,
          p: 2,
          mb: 2,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: 12,
            display: 'block',
            mb: 1.5,
          }}
        >
          Reminder
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Hour */}
          <TextField
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            size="small"
            sx={{
              width: 60,
              '& .MuiOutlinedInput-root': {
                bgcolor: theme.customColors?.accent?.mint || '#9EF2E3',
                fontSize: 24,
                fontWeight: 500,
                textAlign: 'center',
              },
              '& input': {
                textAlign: 'center',
                p: 1,
              },
            }}
          />

          <Typography variant="h5" sx={{ color: theme.palette.text.primary }}>
            :
          </Typography>

          {/* Minute */}
          <TextField
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            size="small"
            sx={{
              width: 60,
              '& .MuiOutlinedInput-root': {
                bgcolor: theme.palette.background.paper,
                fontSize: 24,
                fontWeight: 500,
              },
              '& input': {
                textAlign: 'center',
                p: 1,
              },
            }}
          />

        </Box>

        {/* Labels */}
        <Box sx={{ display: 'flex', gap: 1, mt: 0.5, ml: 0.5 }}>
          <Typography
            variant="caption"
            sx={{ color: theme.palette.text.secondary, width: 60, textAlign: 'center' }}
          >
            Hour
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: theme.palette.text.secondary, width: 60, textAlign: 'center', ml: 1.5 }}
          >
            Minute
          </Typography>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
          <AccessTimeIcon sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={handleSave}
              disabled={isSubmitting || !reminderName.trim()}
              sx={{
                color: theme.palette.primary.main,
                textTransform: 'none',
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              {isSubmitting ? <CircularProgress size={16} /> : 'Save'}
            </Button>
            <Button
              onClick={onCancel}
              disabled={isSubmitting}
              sx={{
                color: theme.palette.error.main,
                textTransform: 'none',
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Push Notification Toggle */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.primary,
            fontSize: 14,
          }}
        >
          Push Notification
        </Typography>
        <Switch
          checked={pushNotification}
          onChange={(e) => setPushNotification(e.target.checked)}
          disabled={isSubmitting}
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
      </Box>

      {/* Reminder Frequency */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.primary,
            fontSize: 14,
          }}
        >
          Reminder Frequency
        </Typography>
        <Chip
          label={frequencyOptions.find(f => f.value === frequency)?.label || 'Daily'}
          size="small"
          onClick={handleFrequencyClick}
          deleteIcon={<span style={{ fontSize: 10, marginLeft: 4 }}>▼</span>}
          onDelete={handleFrequencyClick}
          disabled={isSubmitting}
          sx={{
            bgcolor: theme.palette.background.default,
            color: theme.palette.text.primary,
            fontWeight: 500,
            fontSize: 12,
            cursor: 'pointer',
            '& .MuiChip-deleteIcon': {
              color: theme.palette.text.primary,
            },
          }}
        />
        <Menu
          anchorEl={frequencyAnchorEl}
          open={Boolean(frequencyAnchorEl)}
          onClose={() => setFrequencyAnchorEl(null)}
        >
          {frequencyOptions.map((option) => (
            <MenuItem
              key={option.value}
              onClick={() => handleFrequencySelect(option.value)}
              selected={frequency === option.value}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Paper>
  );
};

export default SetReminderForm;
