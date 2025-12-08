import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fitnessApi, type CreateActivityData, type CreateGoalData, type ActivityFilters } from '@/services/api/fitness.api';

export const FITNESS_ACTIVITIES_KEY = ['fitness', 'activities'];
export const FITNESS_GOALS_KEY = ['fitness', 'goals'];
export const FITNESS_STATS_KEY = ['fitness', 'stats'];

export const useFitnessActivities = (filters?: ActivityFilters) => {
  return useQuery({
    queryKey: [...FITNESS_ACTIVITIES_KEY, filters],
    queryFn: () => fitnessApi.getActivities(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useFitnessActivity = (id: string) => {
  return useQuery({
    queryKey: [...FITNESS_ACTIVITIES_KEY, id],
    queryFn: () => fitnessApi.getActivity(id),
    enabled: !!id,
  });
};

export const useCreateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateActivityData) => fitnessApi.createActivity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FITNESS_ACTIVITIES_KEY });
      queryClient.invalidateQueries({ queryKey: FITNESS_STATS_KEY });
    },
  });
};

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateActivityData> }) =>
      fitnessApi.updateActivity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FITNESS_ACTIVITIES_KEY });
      queryClient.invalidateQueries({ queryKey: FITNESS_STATS_KEY });
    },
  });
};

export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => fitnessApi.deleteActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FITNESS_ACTIVITIES_KEY });
      queryClient.invalidateQueries({ queryKey: FITNESS_STATS_KEY });
    },
  });
};

export const useFitnessGoals = (params?: { isCompleted?: boolean; goalType?: string }) => {
  return useQuery({
    queryKey: [...FITNESS_GOALS_KEY, params],
    queryFn: () => fitnessApi.getGoals(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGoalData) => fitnessApi.createGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FITNESS_GOALS_KEY });
    },
  });
};

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateGoalData & { isCompleted?: boolean }> }) =>
      fitnessApi.updateGoal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FITNESS_GOALS_KEY });
    },
  });
};

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => fitnessApi.deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FITNESS_GOALS_KEY });
    },
  });
};

export const useFitnessStats = (period: 'week' | 'month' | 'year' = 'week') => {
  return useQuery({
    queryKey: [...FITNESS_STATS_KEY, period],
    queryFn: () => fitnessApi.getStats(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
