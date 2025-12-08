import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resourcesApi, type ResourcesQueryParams, type ResourceData, type SavedResourceData } from '../services/api/resources.api';
import type { Resource } from '../components/ui/organisms/library/ResourceCard';

// Query keys for caching
export const resourcesKeys = {
  all: ['resources'] as const,
  lists: () => [...resourcesKeys.all, 'list'] as const,
  list: (params: ResourcesQueryParams) => [...resourcesKeys.lists(), params] as const,
  details: () => [...resourcesKeys.all, 'detail'] as const,
  detail: (id: string) => [...resourcesKeys.details(), id] as const,
  saved: () => [...resourcesKeys.all, 'saved'] as const,
};

// Helper to transform backend data to frontend Resource format
const transformToResource = (
  data: ResourceData,
  savedResourceIds: Set<string>
): Resource => {
  // Calculate relative date label
  const getDateLabel = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return 'Last week';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return {
    id: data._id,
    title: data.title,
    description: data.description,
    imageUrl: data.imageUrl,
    dateLabel: getDateLabel(data.createdAt),
    category: data.category,
    isSaved: savedResourceIds.has(data._id),
    type: data.type,
    url: data.url,
  };
};

// Helper to transform saved resource to frontend Resource format
const transformSavedToResource = (savedData: SavedResourceData): Resource | null => {
  const resource = savedData.resourceId;
  
  // Handle case where resource was deleted but saved reference remains
  if (!resource) {
    console.warn('Saved resource has null resourceId:', savedData._id);
    return null;
  }
  
  // Calculate saved date label
  const getSavedDateLabel = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Saved today';
    if (diffDays === 1) return 'Saved yesterday';
    if (diffDays < 7) return `Saved ${diffDays} days ago`;
    if (diffDays < 14) return 'Saved last week';
    if (diffDays < 30) return `Saved ${Math.floor(diffDays / 7)} weeks ago`;
    return `Saved on ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  return {
    id: resource._id,
    title: resource.title,
    description: resource.description,
    imageUrl: resource.imageUrl,
    dateLabel: getSavedDateLabel(savedData.savedAt),
    category: resource.category,
    isSaved: true,
    type: resource.type,
    url: resource.url,
  };
};

/**
 * Hook to fetch resources with filters
 */
export const useResources = (params: ResourcesQueryParams = {}) => {
  return useQuery({
    queryKey: resourcesKeys.list(params),
    queryFn: async () => {
      const response = await resourcesApi.getResources(params);
      if (!response.success) throw new Error('Failed to fetch resources');
      // Return resources without isSaved - it will be computed in the component
      return {
        resources: response.data.map(r => transformToResource(r, new Set())),
        pagination: response.pagination,
      };
    },
  });
};

/**
 * Hook to fetch user's saved resources
 */
export const useSavedResources = () => {
  return useQuery({
    queryKey: resourcesKeys.saved(),
    queryFn: async () => {
      console.log('useSavedResources: fetching saved resources...');
      const response = await resourcesApi.getSavedResources();
      console.log('useSavedResources: raw API response:', response);
      if (!response.success) throw new Error('Failed to fetch saved resources');
      // Filter out null resources (orphaned saved entries)
      const transformed = response.data
        .map(transformSavedToResource)
        .filter((r): r is Resource => r !== null);
      console.log('useSavedResources: transformed resources:', transformed);
      return transformed;
    },
    staleTime: 30000, // 30 seconds
  });
};

/**
 * Hook to toggle save/unsave a resource
 */
export const useToggleSaveResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ resourceId, notes }: { resourceId: string; notes?: string }) => {
      console.log('useToggleSaveResource mutationFn called with:', resourceId);
      try {
        const response = await resourcesApi.toggleSaveResource(resourceId, notes);
        console.log('API response:', response);
        if (!response.success) {
          console.error('API returned success: false', response);
          throw new Error('Failed to toggle save');
        }
        return response.data;
      } catch (error) {
        console.error('API call failed:', error);
        throw error;
      }
    },
    onMutate: async ({ resourceId }) => {
      console.log('onMutate called for:', resourceId);
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: resourcesKeys.saved() });
      await queryClient.cancelQueries({ queryKey: resourcesKeys.lists() });

      // Snapshot the previous value
      const previousSaved = queryClient.getQueryData<Resource[]>(resourcesKeys.saved());

      // Check if resource is currently saved
      const isSaved = previousSaved?.some(r => r.id === resourceId);

      // Optimistically update the saved resources
      if (isSaved) {
        // Remove from saved
        queryClient.setQueryData<Resource[]>(resourcesKeys.saved(), (old) => 
          old?.filter(r => r.id !== resourceId) || []
        );
      }
      // Note: For adding, we'd need the full resource data, so we'll rely on refetch

      return { previousSaved, resourceId, wasSaved: isSaved };
    },
    onError: (err, _variables, context) => {
      console.error('Mutation error:', err);
      // Rollback on error
      if (context?.previousSaved) {
        queryClient.setQueryData(resourcesKeys.saved(), context.previousSaved);
      }
    },
    onSuccess: (data) => {
      console.log('Mutation success:', data);
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: resourcesKeys.saved() });
      queryClient.invalidateQueries({ queryKey: resourcesKeys.lists() });
    },
  });
};

/**
 * Hook to rate a resource
 */
export const useRateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ resourceId, rating, review }: { resourceId: string; rating: number; review?: string }) => {
      const response = await resourcesApi.rateResource(resourceId, rating, review);
      if (!response.success) throw new Error('Failed to rate resource');
      return response.data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate the specific resource detail
      queryClient.invalidateQueries({ queryKey: resourcesKeys.detail(variables.resourceId) });
      // Also invalidate list to update average ratings
      queryClient.invalidateQueries({ queryKey: resourcesKeys.lists() });
    },
  });
};

/**
 * Hook to get articles only
 */
export const useArticles = (params: Omit<ResourcesQueryParams, 'type'> = {}) => {
  return useResources({ ...params, type: 'article' });
};

/**
 * Hook to get videos only
 */
export const useVideos = (params: Omit<ResourcesQueryParams, 'type'> = {}) => {
  return useResources({ ...params, type: 'video' });
};

/**
 * Hook to get podcasts only
 */
export const usePodcasts = (params: Omit<ResourcesQueryParams, 'type'> = {}) => {
  return useResources({ ...params, type: 'podcast' });
};
