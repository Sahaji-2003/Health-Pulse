import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { remindersApi, type CreateReminderData, type UpdateReminderData, type ReminderFilters } from '../services/api/reminders.api';

export const REMINDERS_KEY = ['reminders'];
export const REMINDERS_UPCOMING_KEY = ['reminders', 'upcoming'];

/**
 * Hook to get all reminders with optional filters
 */
export const useReminders = (filters?: ReminderFilters) => {
  return useQuery({
    queryKey: [...REMINDERS_KEY, filters],
    queryFn: () => remindersApi.getReminders(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to get upcoming reminders for today
 */
export const useUpcomingReminders = () => {
  return useQuery({
    queryKey: REMINDERS_UPCOMING_KEY,
    queryFn: () => remindersApi.getUpcomingReminders(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

/**
 * Hook to get a single reminder by ID
 */
export const useReminder = (id: string) => {
  return useQuery({
    queryKey: [...REMINDERS_KEY, id],
    queryFn: () => remindersApi.getReminder(id),
    enabled: !!id,
  });
};

/**
 * Hook to create a new reminder
 */
export const useCreateReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReminderData) => remindersApi.createReminder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REMINDERS_KEY });
      queryClient.invalidateQueries({ queryKey: REMINDERS_UPCOMING_KEY });
    },
  });
};

/**
 * Hook to update a reminder
 */
export const useUpdateReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReminderData }) =>
      remindersApi.updateReminder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REMINDERS_KEY });
      queryClient.invalidateQueries({ queryKey: REMINDERS_UPCOMING_KEY });
    },
  });
};

/**
 * Hook to toggle reminder active status
 */
export const useToggleReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => remindersApi.toggleReminder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REMINDERS_KEY });
      queryClient.invalidateQueries({ queryKey: REMINDERS_UPCOMING_KEY });
    },
  });
};

/**
 * Hook to delete a reminder
 */
export const useDeleteReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => remindersApi.deleteReminder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REMINDERS_KEY });
      queryClient.invalidateQueries({ queryKey: REMINDERS_UPCOMING_KEY });
    },
  });
};
