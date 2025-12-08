import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { providersApi } from '../services/api';
import type { 
  Provider, 
  Appointment, 
  Conversation,
  Message,
  ProviderFilters, 
  AppointmentFilters,
  CreateAppointmentData 
} from '../services/api/providers.api';

// Query keys
export const providerKeys = {
  all: ['providers'] as const,
  lists: () => [...providerKeys.all, 'list'] as const,
  list: (filters?: ProviderFilters) => [...providerKeys.lists(), filters] as const,
  details: () => [...providerKeys.all, 'detail'] as const,
  detail: (id: string) => [...providerKeys.details(), id] as const,
  specialties: () => [...providerKeys.all, 'specialties'] as const,
};

export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (filters?: AppointmentFilters) => [...appointmentKeys.lists(), filters] as const,
};

export const conversationKeys = {
  all: ['conversations'] as const,
  lists: () => [...conversationKeys.all, 'list'] as const,
  messages: (conversationId: string) => [...conversationKeys.all, 'messages', conversationId] as const,
};

// Provider hooks
export const useProviders = (filters?: ProviderFilters) => {
  return useQuery({
    queryKey: providerKeys.list(filters),
    queryFn: () => providersApi.getProviders(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProvider = (id: string) => {
  return useQuery({
    queryKey: providerKeys.detail(id),
    queryFn: () => providersApi.getProviderById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSpecialties = () => {
  return useQuery({
    queryKey: providerKeys.specialties(),
    queryFn: () => providersApi.getSpecialties(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Appointment hooks
export const useAppointments = (filters?: AppointmentFilters) => {
  return useQuery({
    queryKey: appointmentKeys.list(filters),
    queryFn: () => providersApi.getAppointments(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateAppointmentData) => providersApi.createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Appointment> }) => 
      providersApi.updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => 
      providersApi.cancelAppointment(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
};

// Conversation hooks
export const useConversations = () => {
  return useQuery({
    queryKey: conversationKeys.lists(),
    queryFn: () => providersApi.getConversations(),
    staleTime: 10 * 60 * 1000, // 10 minutes - no polling
    refetchOnWindowFocus: false,
  });
};

export const useGetOrCreateConversation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (providerId: string) => providersApi.getOrCreateConversation(providerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.all });
    },
  });
};

export const useMessages = (conversationId: string, page = 1, limit = 50) => {
  return useQuery({
    queryKey: conversationKeys.messages(conversationId),
    queryFn: () => providersApi.getMessages(conversationId, page, limit),
    enabled: !!conversationId,
    staleTime: 10 * 60 * 1000, // 10 minutes - no polling
    refetchOnWindowFocus: false,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ conversationId, content, type }: { 
      conversationId: string; 
      content: string; 
      type?: 'text' | 'image' | 'link' 
    }) => providersApi.sendMessage(conversationId, { content, type }),
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: conversationKeys.messages(variables.conversationId) 
      });

      // Snapshot previous value
      const previousMessages = queryClient.getQueryData(
        conversationKeys.messages(variables.conversationId)
      );

      // Optimistically update with user message only
      queryClient.setQueryData(
        conversationKeys.messages(variables.conversationId),
        (old: any) => {
          if (!old) return old;
          const optimisticUserMessage = {
            _id: `temp-${Date.now()}`,
            conversationId: variables.conversationId,
            senderId: 'user',
            senderType: 'user',
            content: variables.content,
            type: variables.type || 'text',
            createdAt: new Date().toISOString(),
            isRead: true,
          };
          return {
            ...old,
            data: [...(old.data || []), optimisticUserMessage],
          };
        }
      );

      return { previousMessages };
    },
    onError: (_err, variables, context) => {
      // Rollback on error
      if (context?.previousMessages) {
        queryClient.setQueryData(
          conversationKeys.messages(variables.conversationId),
          context.previousMessages
        );
      }
    },
    // Don't immediately refetch - let the typing animation play
    // The caller will invalidate after the typing delay
  });
};

// New hook to add the provider reply after typing delay
export const useAddProviderReply = () => {
  const queryClient = useQueryClient();
  
  return useCallback((conversationId: string) => {
    // Invalidate to fetch the actual messages including provider reply
    queryClient.invalidateQueries({ 
      queryKey: conversationKeys.messages(conversationId) 
    });
  }, [queryClient]);
};

export const useMarkMessagesAsRead = () => {
  return useMutation({
    mutationFn: (conversationId: string) => providersApi.markMessagesAsRead(conversationId),
    // Don't invalidate queries - this was causing infinite loop
  });
};

// Helper types for component usage
export type { Provider, Appointment, Conversation, Message, ProviderFilters, AppointmentFilters };
