import apiClient from '../apiClient';
import type { ApiResponse, PaginatedResponse, VitalSigns } from '@/types';

export interface CreateVitalsData {
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  weight?: number;
  temperature?: number;
  oxygenSaturation?: number;
  bloodSugar?: number;
  notes?: string;
  date?: string;
}

export interface VitalsFilters {
  startDate?: string;
  endDate?: string;
  vitalType?: 'heart_rate' | 'blood_pressure' | 'temperature' | 'oxygen_saturation' | 'weight' | 'blood_sugar';
  isAbnormal?: boolean;
  page?: number;
  limit?: number;
}

export const vitalsApi = {
  /**
   * Get vital signs history
   */
  getVitals: async (filters?: VitalsFilters): Promise<PaginatedResponse<VitalSigns>> => {
    const response = await apiClient.get('/vitals', { params: filters });
    return response.data;
  },

  /**
   * Get single vital record by ID
   */
  getVital: async (id: string): Promise<ApiResponse<VitalSigns>> => {
    const response = await apiClient.get(`/vitals/${id}`);
    return response.data;
  },

  /**
   * Add new vital signs entry
   */
  createVital: async (data: CreateVitalsData): Promise<ApiResponse<VitalSigns>> => {
    const response = await apiClient.post('/vitals', data);
    return response.data;
  },

  /**
   * Update vital signs record
   */
  updateVital: async (id: string, data: Partial<CreateVitalsData>): Promise<ApiResponse<VitalSigns>> => {
    const response = await apiClient.put(`/vitals/${id}`, data);
    return response.data;
  },

  /**
   * Delete vital signs record
   */
  deleteVital: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/vitals/${id}`);
    return response.data;
  },

  /**
   * Get vitals history with filtering
   */
  getVitalsHistory: async (filters?: VitalsFilters): Promise<PaginatedResponse<{
    id: string;
    date: string;
    value: number | string;
    unit: string;
    isAbnormal?: boolean;
    notes?: string;
  }>> => {
    const response = await apiClient.get('/vitals/history', { params: filters });
    return response.data;
  },

  /**
   * Get vitals statistics
   */
  getStats: async (period: 'week' | 'month' | 'year'): Promise<ApiResponse<{
    averageHeartRate: number;
    averageBloodPressure: { systolic: number; diastolic: number };
    averageBloodSugar: number;
    latestBloodSugar: {
      value: number;
      date: Date;
      daysAgo: number;
    } | null;
    weightTrend: number[];
    alertsCount: number;
  }>> => {
    const response = await apiClient.get('/vitals/stats', { params: { period } });
    return response.data;
  },

  /**
   * Get vitals alerts (abnormal readings)
   * Returns vitals records that have been flagged as abnormal
   */
  getAlerts: async (): Promise<PaginatedResponse<VitalSigns>> => {
    const response = await apiClient.get('/vitals', { params: { isAbnormal: true, limit: 20 } });
    return response.data;
  },

  /**
   * Mark an alert as read (updates notes on the vital record)
   * Since alerts are derived from abnormal vitals, we update the vital record
   */
  markAlertRead: async (id: string): Promise<ApiResponse<VitalSigns>> => {
    const response = await apiClient.put(`/vitals/${id}`, {
      notes: `[Alert acknowledged at ${new Date().toISOString()}]`
    });
    return response.data;
  },

  /**
   * Get latest blood sugar reading
   */
  getLatestBloodSugar: async (): Promise<ApiResponse<{
    value: number;
    date: Date;
    daysAgo: number;
  } | null>> => {
    const response = await apiClient.get('/vitals', {
      params: {
        limit: 1
      }
    });
    const vitals = response.data.data;
    if (vitals && vitals.length > 0 && vitals[0].bloodSugar) {
      const vitalDate = new Date(vitals[0].date);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - vitalDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        success: true,
        data: {
          value: vitals[0].bloodSugar,
          date: vitalDate,
          daysAgo: diffDays
        }
      };
    }
    return {
      success: true,
      data: null
    };
  },
};

export default vitalsApi;
