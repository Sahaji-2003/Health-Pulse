import apiClient from '../apiClient';
import type { ApiResponse, PaginatedResponse } from '../../types';

// Provider Types matching backend model
export interface ProviderLocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ProviderAvailability {
  day: string;
  slots: string[];
}

export interface Provider {
  _id: string;
  name: string;
  specialty: string;
  location: ProviderLocation;
  phone: string;
  email: string;
  acceptsInsurance: string[];
  rating: number;
  reviewCount: number;
  availability: ProviderAvailability[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  _id: string;
  userId: string;
  providerId: string | Provider;
  dateTime: Date;
  type: 'in-person' | 'video' | 'chat';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  meetingLink?: string;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  senderType: 'user' | 'provider';
  content: string;
  type: 'text' | 'image' | 'link';
  imageUrl?: string;
  linkTitle?: string;
  linkDescription?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  _id: string;
  userId: string;
  providerId: string | Provider;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Query filters
export interface ProviderFilters {
  specialty?: string;
  city?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AppointmentFilters {
  status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  page?: number;
  limit?: number;
}

// Request types
export interface CreateAppointmentData {
  providerId: string;
  dateTime: Date | string;
  type: 'in-person' | 'video' | 'chat';
  notes?: string;
}

export interface UpdateAppointmentData {
  dateTime?: Date | string;
  notes?: string;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
}

export interface SendMessageData {
  providerId: string;
  content: string;
  type?: 'text' | 'image' | 'link';
  imageUrl?: string;
  linkTitle?: string;
  linkDescription?: string;
}

// Providers API
export const providersApi = {
  // Get all providers with optional filters
  getProviders: async (filters?: ProviderFilters): Promise<PaginatedResponse<Provider>> => {
    const params = new URLSearchParams();
    if (filters?.specialty) params.append('specialty', filters.specialty);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));

    const response = await apiClient.get<PaginatedResponse<Provider>>(`/providers?${params.toString()}`);
    return response.data;
  },

  // Get a single provider by ID
  getProviderById: async (id: string): Promise<ApiResponse<Provider>> => {
    const response = await apiClient.get<ApiResponse<Provider>>(`/providers/${id}`);
    return response.data;
  },

  // Get list of unique specialties
  getSpecialties: async (): Promise<string[]> => {
    const response = await apiClient.get<PaginatedResponse<Provider>>('/providers?limit=100');
    const providers = response.data.data;
    const specialties = [...new Set(providers.map(p => p.specialty))];
    return specialties;
  },

  // Schedule an appointment
  createAppointment: async (data: CreateAppointmentData): Promise<ApiResponse<Appointment>> => {
    const response = await apiClient.post<ApiResponse<Appointment>>('/providers/appointments', data);
    return response.data;
  },

  // Get user's appointments
  getAppointments: async (filters?: AppointmentFilters): Promise<PaginatedResponse<Appointment>> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));

    const response = await apiClient.get<PaginatedResponse<Appointment>>(`/providers/appointments/list?${params.toString()}`);
    return response.data;
  },

  // Update an appointment
  updateAppointment: async (id: string, data: UpdateAppointmentData): Promise<ApiResponse<Appointment>> => {
    const response = await apiClient.put<ApiResponse<Appointment>>(`/providers/appointments/${id}`, data);
    return response.data;
  },

  // Cancel an appointment
  cancelAppointment: async (id: string, cancelReason?: string): Promise<ApiResponse<Appointment>> => {
    const response = await apiClient.post<ApiResponse<Appointment>>(`/providers/appointments/${id}/cancel`, { cancelReason });
    return response.data;
  },

  // Get user's conversations
  getConversations: async (): Promise<ApiResponse<Conversation[]>> => {
    const response = await apiClient.get<ApiResponse<Conversation[]>>('/providers/messages/conversations');
    return response.data;
  },

  // Get or create a conversation with a provider
  getOrCreateConversation: async (providerId: string): Promise<ApiResponse<Conversation>> => {
    const response = await apiClient.post<ApiResponse<Conversation>>('/providers/messages/conversations', { providerId });
    return response.data;
  },

  // Get messages for a conversation
  getMessages: async (conversationId: string, page = 1, limit = 50): Promise<PaginatedResponse<Message>> => {
    const response = await apiClient.get<PaginatedResponse<Message>>(
      `/providers/messages/${conversationId}?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Send a message
  sendMessage: async (conversationId: string, data: Omit<SendMessageData, 'providerId'>): Promise<ApiResponse<Message>> => {
    const response = await apiClient.post<ApiResponse<Message>>(`/providers/messages/${conversationId}`, data);
    return response.data;
  },

  // Mark messages as read
  markMessagesAsRead: async (conversationId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.patch<ApiResponse<void>>(`/providers/messages/${conversationId}/read`);
    return response.data;
  },
};

export default providersApi;
