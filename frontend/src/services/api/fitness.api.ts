import apiClient from '../apiClient';
import type { ApiResponse, PaginatedResponse, FitnessActivity, FitnessGoal } from '@/types';

export interface CreateActivityData {
  type: 'running' | 'cycling' | 'walking' | 'swimming' | 'gym' | 'yoga' | 'other';
  duration: number;
  distance?: number;
  caloriesBurned?: number;
  intensity: 'low' | 'medium' | 'high';
  notes?: string;
  date?: string;
}

export interface CreateGoalData {
  goalType: 'steps' | 'calories' | 'distance' | 'workouts' | 'duration' | 'weight';
  targetValue: number;
  currentValue?: number;
  unit: string;
  startDate: string;
  endDate: string;
}

export interface ActivityFilters {
  type?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface FitnessStats {
  totalWorkouts: number;
  totalDuration: number;
  totalCalories: number;
  totalDistance: number;
  averageIntensity: string;
  period: string;
  startDate: string;
  endDate: string;
}

export const fitnessApi = {
  /**
   * Get user activities with optional filters
   */
  getActivities: async (filters?: ActivityFilters): Promise<PaginatedResponse<FitnessActivity>> => {
    const response = await apiClient.get('/fitness/activities', { params: filters });
    return response.data;
  },

  /**
   * Get single activity by ID
   */
  getActivity: async (id: string): Promise<ApiResponse<FitnessActivity>> => {
    const response = await apiClient.get(`/fitness/activities/${id}`);
    return response.data;
  },

  /**
   * Log new activity
   */
  createActivity: async (data: CreateActivityData): Promise<ApiResponse<FitnessActivity>> => {
    const response = await apiClient.post('/fitness/activities', data);
    return response.data;
  },

  /**
   * Update activity
   */
  updateActivity: async (id: string, data: Partial<CreateActivityData>): Promise<ApiResponse<FitnessActivity>> => {
    const response = await apiClient.put(`/fitness/activities/${id}`, data);
    return response.data;
  },

  /**
   * Delete activity
   */
  deleteActivity: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/fitness/activities/${id}`);
    return response.data;
  },

  /**
   * Get user fitness goals
   */
  getGoals: async (params?: { isCompleted?: boolean; goalType?: string }): Promise<ApiResponse<FitnessGoal[]>> => {
    const response = await apiClient.get('/fitness/goals', { params });
    return response.data;
  },

  /**
   * Create new goal
   */
  createGoal: async (data: CreateGoalData): Promise<ApiResponse<FitnessGoal>> => {
    const response = await apiClient.post('/fitness/goals', data);
    return response.data;
  },

  /**
   * Update goal progress
   */
  updateGoal: async (id: string, data: Partial<CreateGoalData & { isCompleted?: boolean }>): Promise<ApiResponse<FitnessGoal>> => {
    const response = await apiClient.put(`/fitness/goals/${id}`, data);
    return response.data;
  },

  /**
   * Delete goal
   */
  deleteGoal: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/fitness/goals/${id}`);
    return response.data;
  },

  /**
   * Get fitness statistics
   */
  getStats: async (period: 'week' | 'month' | 'year'): Promise<ApiResponse<FitnessStats>> => {
    const response = await apiClient.get('/fitness/stats', { params: { period } });
    return response.data;
  },
};

export default fitnessApi;
