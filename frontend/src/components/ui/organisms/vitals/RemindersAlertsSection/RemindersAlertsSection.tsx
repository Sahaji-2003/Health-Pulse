import { useState } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import type {
  RemindersAlertsSectionProps,
  AlertHistoryItem,
} from './RemindersAlertsSection.types';
import { ManageReminders } from './ManageReminders';
import { HistoryAlerts } from './HistoryAlerts';
import { ReminderStatCard } from './ReminderStatCard';
import { SetReminderForm, type ReminderFormData } from './SetReminderForm';
import { useReminders, useCreateReminder, useUpdateReminder, useDeleteReminder } from '@/hooks';
import type { Reminder } from '@/types';

// Default alert history data
const defaultAlerts: AlertHistoryItem[] = [
  { id: '1', date: 'Yesterday', title: 'Intake', value: '3ltr', isCompleted: true },
  { id: '2', date: '13th Oct', title: 'Intake', value: '2ltr', isCompleted: true },
  { id: '3', date: '13th Oct', title: 'Walking', value: '45m', isCompleted: true },
  { id: '4', date: '13th Oct', title: 'Walking', value: '45m', isCompleted: true },
  { id: '5', date: '13th Oct', title: 'Walking', value: '45m', isCompleted: true },
];

/**
 * RemindersAlertsSection Organism
 *
 * Displays stat cards, Manage Reminders, History Alerts, and Set Reminder form.
 * Based on Figma design node 2320-13070.
 */
export const RemindersAlertsSection: React.FC<RemindersAlertsSectionProps> = ({
  alerts = defaultAlerts,
  showEmptyState = false,
  onEditReminder,
  onCancel,
  onReminderSave,
  sx,
}) => {
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // API hooks
  const { data: remindersData, isLoading: isLoadingReminders } = useReminders();
  const createReminder = useCreateReminder();
  const updateReminder = useUpdateReminder();
  const deleteReminder = useDeleteReminder();

  const remindersList = remindersData?.data || [];

  const handleEditReminder = (reminder?: Reminder) => {
    if (reminder) {
      setEditingReminder(reminder);
    } else {
      setEditingReminder(null);
    }
    onEditReminder?.(reminder);
  };

  const handleReminderClick = (reminder: Reminder) => {
    setEditingReminder(reminder);
  };

  const handleDeleteReminder = async (reminderId?: string) => {
    if (!reminderId) return;
    
    try {
      await deleteReminder.mutateAsync(reminderId);
      setSnackbar({ open: true, message: 'Reminder deleted successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete reminder', severity: 'error' });
    }
  };

  const handleSaveReminder = async (data: ReminderFormData) => {
    try {
      const time = `${data.hour.padStart(2, '0')}:${data.minute.padStart(2, '0')}`;
      
      if (editingReminder) {
        // Update existing reminder
        await updateReminder.mutateAsync({
          id: editingReminder._id,
          data: {
            name: data.name,
            time,
            pushNotification: data.pushNotification,
            frequency: data.frequency,
          },
        });
        setSnackbar({ open: true, message: 'Reminder updated successfully', severity: 'success' });
      } else {
        // Create new reminder
        await createReminder.mutateAsync({
          name: data.name,
          time,
          pushNotification: data.pushNotification,
          frequency: data.frequency,
          category: 'other',
        });
        setSnackbar({ open: true, message: 'Reminder created successfully', severity: 'success' });
      }
      
      setEditingReminder(null);
      onReminderSave?.();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to save reminder', severity: 'error' });
    }
  };

  const handleCancelForm = () => {
    setEditingReminder(null);
    onCancel?.();
  };

  const isSubmitting = createReminder.isPending || updateReminder.isPending;

  return (
    <Box sx={sx}>
      {/* Top Row: Stat Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 2,
          mb: 3,
        }}
      >
        <ReminderStatCard
          type="water"
          value="680"
          unit="ml"
          progress={68}
        />
        <ReminderStatCard
          type="calories"
          value="112"
          unit="kcal"
          progress={45}
        />
        <ReminderStatCard
          type="sleep"
          value="5"
          unit="hrs"
          progress={62}
        />
      </Box>

      {/* Bottom Row: Reminders, Alerts, and Set Reminder Form */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        {/* Manage Reminders Card */}
        <ManageReminders
          reminderData={remindersList}
          isLoading={isLoadingReminders}
          onEditReminder={handleEditReminder}
          onCancel={handleDeleteReminder}
          onReminderClick={handleReminderClick}
        />

        {/* History Alerts Card */}
        <HistoryAlerts
          alerts={alerts}
          isEmpty={showEmptyState}
        />

        {/* Set Reminder Form */}
        <SetReminderForm
          editReminder={editingReminder}
          isSubmitting={isSubmitting}
          onSave={handleSaveReminder}
          onCancel={handleCancelForm}
        />
      </Box>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RemindersAlertsSection;
