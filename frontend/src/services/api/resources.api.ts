import apiClient from '../apiClient';
import type { ApiResponse } from '@/types';

// Resource type from backend
export interface ResourceData {
  _id: string;
  type: 'article' | 'video' | 'podcast';
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  category: string;
  tags: string[];
  author?: string;
  publishedDate?: string;
  duration?: number;
  averageRating: number;
  totalRatings: number;
  createdAt: string;
  updatedAt: string;
}

// Saved resource from backend
export interface SavedResourceData {
  _id: string;
  userId: string;
  resourceId: ResourceData;
  notes?: string;
  savedAt: string;
}

export interface ResourcesQueryParams {
  type?: 'article' | 'video' | 'podcast';
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ResourcesPaginatedResponse {
  data: ResourceData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ToggleSaveResponse {
  isSaved: boolean;
}

export const resourcesApi = {
  /**
   * Get all resources with optional filters
   */
  getResources: async (params: ResourcesQueryParams = {}): Promise<ApiResponse<ResourceData[]> & { pagination?: ResourcesPaginatedResponse['pagination'] }> => {
    const response = await apiClient.get('/resources', { params });
    return response.data;
  },

  /**
   * Get a single resource by ID
   */
  getResourceById: async (id: string): Promise<ApiResponse<ResourceData>> => {
    const response = await apiClient.get(`/resources/${id}`);
    return response.data;
  },

  /**
   * Toggle save/unsave a resource (bookmark)
   */
  toggleSaveResource: async (resourceId: string, notes?: string): Promise<ApiResponse<ToggleSaveResponse>> => {
    const response = await apiClient.post(`/resources/${resourceId}/save`, { notes });
    return response.data;
  },

  /**
   * Get user's saved resources
   */
  getSavedResources: async (): Promise<ApiResponse<SavedResourceData[]>> => {
    const response = await apiClient.get('/resources/saved/list');
    return response.data;
  },

  /**
   * Rate a resource
   */
  rateResource: async (resourceId: string, rating: number, review?: string): Promise<ApiResponse<ResourceData>> => {
    const response = await apiClient.post(`/resources/${resourceId}/rate`, { rating, review });
    return response.data;
  },
};

export default resourcesApi;
