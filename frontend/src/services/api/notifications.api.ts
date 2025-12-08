import apiClient from '../apiClient';
import type { ApiResponse, PaginatedResponse } from '@/types';

export type NotificationSeverity = 'info' | 'warning' | 'critical';
export type NotificationType = 'vital_alert' | 'reminder' | 'appointment' | 'system';

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  severity: NotificationSeverity;
  isRead: boolean;
  relatedVitalId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse extends PaginatedResponse<Notification> {
  unreadCount: number;
}

export interface NotificationFilters {
  isRead?: boolean;
  type?: NotificationType;
  page?: number;
  limit?: number;
}

export const notificationsApi = {
  /**
   * Get all notifications for the authenticated user
   */
  getNotifications: async (filters?: NotificationFilters): Promise<NotificationsResponse> => {
    const response = await apiClient.get('/notifications', { params: filters });
    return response.data;
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: async (): Promise<ApiResponse<{ unreadCount: number }>> => {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data;
  },

  /**
   * Mark a notification as read
   */
  markAsRead: async (id: string): Promise<ApiResponse<Notification>> => {
    const response = await apiClient.put(`/notifications/${id}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<ApiResponse<null>> => {
    const response = await apiClient.put('/notifications/read-all');
    return response.data;
  },

  /**
   * Delete a notification
   */
  deleteNotification: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/notifications/${id}`);
    return response.data;
  },

  /**
   * Delete all notifications
   */
  deleteAllNotifications: async (): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete('/notifications');
    return response.data;
  },
};

export default notificationsApi;
