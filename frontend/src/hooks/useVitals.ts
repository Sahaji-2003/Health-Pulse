import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vitalsApi, type CreateVitalsData, type VitalsFilters } from '../services/api/vitals.api';
import { NOTIFICATIONS_KEY, NOTIFICATIONS_COUNT_KEY } from './useNotifications';

export const VITALS_KEY = ['vitals'];
export const VITALS_ALERTS_KEY = ['vitals', 'alerts'];
export const VITALS_STATS_KEY = ['vitals', 'stats'];

export const useVitals = (filters?: VitalsFilters) => {
  return useQuery({
    queryKey: [...VITALS_KEY, filters],
    queryFn: () => vitalsApi.getVitals(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useVital = (id: string) => {
  return useQuery({
    queryKey: [...VITALS_KEY, id],
    queryFn: () => vitalsApi.getVital(id),
    enabled: !!id,
  });
};

export const useCreateVital = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVitalsData) => vitalsApi.createVital(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VITALS_KEY });
      queryClient.invalidateQueries({ queryKey: VITALS_ALERTS_KEY });
      queryClient.invalidateQueries({ queryKey: VITALS_STATS_KEY });
      // Invalidate notifications as new vital might create alerts
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_COUNT_KEY });
    },
  });
};

export const useUpdateVital = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateVitalsData> }) =>
      vitalsApi.updateVital(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VITALS_KEY });
      queryClient.invalidateQueries({ queryKey: VITALS_STATS_KEY });
    },
  });
};

export const useDeleteVital = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vitalsApi.deleteVital(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VITALS_KEY });
      queryClient.invalidateQueries({ queryKey: VITALS_STATS_KEY });
    },
  });
};

export const useVitalAlerts = () => {
  return useQuery({
    queryKey: VITALS_ALERTS_KEY,
    queryFn: () => vitalsApi.getAlerts(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useMarkAlertRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vitalsApi.markAlertRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VITALS_ALERTS_KEY });
    },
  });
};

export const useVitalsStats = (period: 'week' | 'month' | 'year' = 'week') => {
  return useQuery({
    queryKey: [...VITALS_STATS_KEY, period],
    queryFn: () => vitalsApi.getStats(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useVitalsHistory = (filters?: VitalsFilters) => {
  return useQuery({
    queryKey: [...VITALS_KEY, 'history', filters],
    queryFn: () => vitalsApi.getVitalsHistory(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
