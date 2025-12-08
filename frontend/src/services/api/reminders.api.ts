import apiClient from '../apiClient';
import type { ApiResponse, Reminder } from '@/types';

export interface CreateReminderData {
  name: string;
  description?: string;
  time: string; // 24h format "HH:MM"
  frequency?: 'daily' | 'weekly' | 'monthly' | 'once';
  daysOfWeek?: number[]; // 0-6 for weekly reminders
  dayOfMonth?: number; // 1-31 for monthly reminders
  pushNotification?: boolean;
  category?: 'medication' | 'appointment' | 'vitals' | 'exercise' | 'water' | 'other';
}

export interface UpdateReminderData {
  name?: string;
  description?: string;
  time?: string;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'once';
  daysOfWeek?: number[];
  dayOfMonth?: number;
  pushNotification?: boolean;
  isActive?: boolean;
  category?: 'medication' | 'appointment' | 'vitals' | 'exercise' | 'water' | 'other';
}

export interface ReminderFilters {
  category?: string;
  isActive?: boolean;
}

export interface RemindersListResponse {
  success: boolean;
  data: Reminder[];
  count: number;
}

export const remindersApi = {
  /**
   * Get all reminders for the authenticated user
   */
  getReminders: async (filters?: ReminderFilters): Promise<RemindersListResponse> => {
    const response = await apiClient.get('/reminders', { params: filters });
    return response.data;
  },

  /**
   * Get upcoming reminders for today
   */
  getUpcomingReminders: async (): Promise<RemindersListResponse> => {
    const response = await apiClient.get('/reminders/upcoming');
    return response.data;
  },

  /**
   * Get single reminder by ID
   */
  getReminder: async (id: string): Promise<ApiResponse<Reminder>> => {
    const response = await apiClient.get(`/reminders/${id}`);
    return response.data;
  },

  /**
   * Create a new reminder
   */
  createReminder: async (data: CreateReminderData): Promise<ApiResponse<Reminder>> => {
    const response = await apiClient.post('/reminders', data);
    return response.data;
  },

  /**
   * Update a reminder
   */
  updateReminder: async (id: string, data: UpdateReminderData): Promise<ApiResponse<Reminder>> => {
    const response = await apiClient.put(`/reminders/${id}`, data);
    return response.data;
  },

  /**
   * Toggle reminder active status
   */
  toggleReminder: async (id: string): Promise<ApiResponse<Reminder>> => {
    const response = await apiClient.patch(`/reminders/${id}/toggle`);
    return response.data;
  },

  /**
   * Delete a reminder
   */
  deleteReminder: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/reminders/${id}`);
    return response.data;
  },
};

export default remindersApi;
