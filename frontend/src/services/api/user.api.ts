import apiClient from '../apiClient';
import type { ApiResponse, User } from '@/types';

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  height?: number;
  weight?: number;
  currentPassword?: string;
  newPassword?: string;
  medicalConditions?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

// Widget configuration for dashboard customization
export interface WidgetConfig {
  id: string;
  type: 'profile' | 'vitals' | 'fitness' | 'recommendations' | 'weekly-chart' | 'awards' | 'resources';
  visible: boolean;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  category: 'vitals' | 'fitness' | 'social' | 'recommendations' | 'profile';
}

export interface DashboardLayoutData {
  widgets: WidgetConfig[];
  lastModified: string;
}

export const userApi = {
  /**
   * Get user profile
   */
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileData): Promise<ApiResponse<User>> => {
    const response = await apiClient.put('/users/profile', data);
    return response.data;
  },

  /**
   * Delete user account
   */
  deleteAccount: async (): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete('/users/profile');
    return response.data;
  },

  /**
   * Upload profile picture
   */
  uploadAvatar: async (file: File): Promise<ApiResponse<{ avatarUrl: string }>> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await apiClient.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get full avatar URL from relative path
   */
  getAvatarUrl: (avatarPath: string | undefined): string | undefined => {
    if (!avatarPath) return undefined;
    if (avatarPath.startsWith('http') || avatarPath.startsWith('data:')) return avatarPath;
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    // Remove /api prefix if present in base URL for static files
    const staticBaseUrl = baseUrl.replace(/\/api$/, '');
    return `${staticBaseUrl}${avatarPath}`;
  },

  /**
   * Get dashboard layout configuration
   */
  getDashboardLayout: async (): Promise<ApiResponse<DashboardLayoutData>> => {
    const response = await apiClient.get('/users/dashboard-layout');
    return response.data;
  },

  /**
   * Update dashboard layout configuration
   */
  updateDashboardLayout: async (widgets: WidgetConfig[]): Promise<ApiResponse<DashboardLayoutData>> => {
    const response = await apiClient.put('/users/dashboard-layout', { widgets });
    return response.data;
  },

  /**
   * Reset dashboard layout to default
   */
  resetDashboardLayout: async (): Promise<ApiResponse<DashboardLayoutData>> => {
    const response = await apiClient.post('/users/dashboard-layout/reset');
    return response.data;
  },

  /**
   * Download profile as PDF
   * Returns a blob that can be downloaded as a file
   */
  downloadProfilePdf: async (): Promise<Blob> => {
    const response = await apiClient.get('/users/profile/download-pdf', {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default userApi;
