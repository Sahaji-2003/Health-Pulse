import apiClient from '../apiClient';
import type { ApiResponse, Recommendation } from '@/types';

export interface RecommendationFilters {
  category?: string;
  status?: string;
  priority?: string;
}

export const recommendationsApi = {
  /**
   * Get personalized recommendations
   */
  getRecommendations: async (filters?: RecommendationFilters): Promise<ApiResponse<Recommendation[]>> => {
    const response = await apiClient.get('/recommendations', { params: filters });
    return response.data;
  },

  /**
   * Get single recommendation by ID
   */
  getRecommendation: async (id: string): Promise<ApiResponse<Recommendation>> => {
    const response = await apiClient.get(`/recommendations/${id}`);
    return response.data;
  },

  /**
   * Update recommendation status
   */
  updateStatus: async (id: string, status: Recommendation['status']): Promise<ApiResponse<Recommendation>> => {
    const response = await apiClient.put(`/recommendations/${id}/status`, { status });
    return response.data;
  },

  /**
   * Dismiss recommendation
   */
  dismiss: async (id: string): Promise<ApiResponse<Recommendation>> => {
    const response = await apiClient.put(`/recommendations/${id}/dismiss`);
    return response.data;
  },

  /**
   * Generate new recommendations
   * Note: Recommendations are auto-generated when first requested via GET /recommendations
   * This method forces a refresh by re-fetching recommendations
   */
  generate: async (): Promise<ApiResponse<Recommendation[]>> => {
    // Recommendations are auto-generated on first request
    const response = await apiClient.get('/recommendations');
    return response.data;
  },
};

export default recommendationsApi;
