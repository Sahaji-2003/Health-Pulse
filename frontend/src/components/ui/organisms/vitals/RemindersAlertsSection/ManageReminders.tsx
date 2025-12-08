import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
  useTheme,
  IconButton,
  CircularProgress,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DeleteIcon from '@mui/icons-material/Delete';
import type { ManageRemindersProps } from './RemindersAlertsSection.types';

/**
 * ManageReminders Component
 *
 * Displays a list of reminders with edit and cancel actions.
 * Based on Figma design node 2161-9823.
 */
export const ManageReminders: React.FC<ManageRemindersProps> = ({
  reminderData = [],
  isLoading = false,
  onEditReminder,
  onCancel,
  onReminderClick,
  sx,
}) => {
  const theme = useTheme();

  // Get formatted time display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Get frequency display
  const getFrequencyDisplay = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      case 'once': return 'Once';
      default: return frequency;
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 7,
        bgcolor: theme.palette.background.paper,
        p: 2,
        height: 'auto',
        maxHeight: 380,
        overflow: 'hidden',
        ...sx,
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <CalendarTodayIcon
          sx={{
            fontSize: 20,
            color: theme.palette.primary.dark,
          }}
        />
        <Typography
          variant="subtitle1"
          sx={{
            color: theme.palette.primary.dark,
            fontWeight: 500,
            fontSize: 14,
          }}
        >
          Manage Reminders
        </Typography>
      </Box>

      {/* Reminders List */}
      <List sx={{ py: 0, maxHeight: 260, overflow: 'auto' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : reminderData.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No reminders set yet
            </Typography>
          </Box>
        ) : (
          reminderData.slice(0, 5).map((reminder, index) => (
            <Box key={reminder._id}>
              <ListItem
                sx={{
                  px: 0,
                  py: 0.75,
                  cursor: 'pointer',
                  opacity: reminder.isActive ? 1 : 0.6,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
                onClick={() => onReminderClick?.(reminder)}
                secondaryAction={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: 12,
                      }}
                    >
                      {formatTime(reminder.time)}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCancel?.(reminder._id);
                      }}
                      sx={{ ml: 0.5 }}
                    >
                      <DeleteIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                        fontSize: 14,
                      }}
                    >
                      {reminder.name}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: 12,
                      }}
                    >
                      {getFrequencyDisplay(reminder.frequency)} • {reminder.category}
                    </Typography>
                  }
                />
              </ListItem>
              {index < reminderData.slice(0, 5).length - 1 && <Divider />}
            </Box>
          ))
        )}
      </List>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
        <Button
          variant="contained"
          onClick={() => onEditReminder?.()}
          size="small"
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            px: 1.5,
            py: 0.75,
            bgcolor: theme.palette.primary.main,
            fontSize: 12,
            fontWeight: 500,
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
            },
          }}
        >
          Add Reminder
        </Button>
      </Box>
    </Paper>
  );
};

export default ManageReminders;
