import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/services/api';
import type { LoginCredentials, RegisterData } from '@/types';

export const AUTH_QUERY_KEY = ['auth', 'user'];

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Get current user
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;
      const response = await authApi.getCurrentUser();
      return response.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (response) => {
      const { user, tokens } = response.data;
      localStorage.setItem('accessToken', tokens.accessToken);
      if (tokens.refreshToken) {
        localStorage.setItem('refreshToken', tokens.refreshToken);
      }
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
      // Small delay to ensure state is updated before navigation
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 0);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: (response) => {
      const { user, tokens } = response.data;
      localStorage.setItem('accessToken', tokens.accessToken);
      if (tokens.refreshToken) {
        localStorage.setItem('refreshToken', tokens.refreshToken);
      }
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
      // Small delay to ensure state is updated before navigation
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 0);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.clear();
      navigate('/login');
    },
    onError: () => {
      // Clear tokens even if logout fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.clear();
      navigate('/login');
    },
  });

  return {
    user,
    isLoading,
    isError,
    error,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
};

export default useAuth;
