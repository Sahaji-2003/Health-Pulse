import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recommendationsApi, type RecommendationFilters } from '../services/api/recommendations.api';
import type { Recommendation } from '@/types';

export const RECOMMENDATIONS_KEY = ['recommendations'];

/**
 * Hook to fetch user recommendations with optional filters
 */
export const useRecommendations = (filters?: RecommendationFilters) => {
  return useQuery({
    queryKey: [...RECOMMENDATIONS_KEY, filters],
    queryFn: () => recommendationsApi.getRecommendations(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single recommendation by ID
 */
export const useRecommendation = (id: string) => {
  return useQuery({
    queryKey: [...RECOMMENDATIONS_KEY, id],
    queryFn: () => recommendationsApi.getRecommendation(id),
    enabled: !!id,
  });
};

/**
 * Hook to update recommendation status
 */
export const useUpdateRecommendationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Recommendation['status'] }) =>
      recommendationsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECOMMENDATIONS_KEY });
    },
  });
};

/**
 * Hook to dismiss a recommendation
 */
export const useDismissRecommendation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => recommendationsApi.dismiss(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECOMMENDATIONS_KEY });
    },
  });
};

/**
 * Hook to generate new recommendations
 */
export const useGenerateRecommendations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => recommendationsApi.generate(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECOMMENDATIONS_KEY });
    },
  });
};
