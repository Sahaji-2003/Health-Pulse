import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/services/api/user.api';
import type { UpdateProfileData } from '@/services/api/user.api';
import type { User } from '@/types';

export const PROFILE_QUERY_KEY = ['user', 'profile'];

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  age: string;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say' | '';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | '';
  height: string;
  weight: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  medicalConditions: string;
}

export const useProfile = () => {
  const queryClient = useQueryClient();

  // Get user profile
  const {
    data: profile,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async () => {
      const response = await userApi.getProfile();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileData) => userApi.updateProfile(data),
    onSuccess: (response) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, response.data);
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    },
  });

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: () => userApi.deleteAccount(),
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      queryClient.clear();
    },
  });

  // Upload avatar mutation
  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => userApi.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });

  // Helper to convert profile to form data
  const profileToFormData = (user: User | undefined): ProfileFormData => {
    if (!user) {
      return {
        firstName: '',
        lastName: '',
        age: '',
        gender: '',
        bloodGroup: '',
        height: '',
        weight: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        medicalConditions: '',
      };
    }

    // Calculate age from dateOfBirth
    let age = '';
    if (user.dateOfBirth) {
      const birthDate = new Date(user.dateOfBirth);
      const today = new Date();
      const calculatedAge = today.getFullYear() - birthDate.getFullYear();
      age = calculatedAge.toString();
    }

    return {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      age,
      gender: user.gender || '',
      bloodGroup: user.bloodGroup || '',
      height: user.height?.toString() || '',
      weight: user.weight?.toString() || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      medicalConditions: user.medicalConditions?.join(', ') || '',
    };
  };

  // Helper to convert form data to API data
  const formDataToApiData = (formData: ProfileFormData): UpdateProfileData => {
    const data: UpdateProfileData = {};

    if (formData.firstName) data.firstName = formData.firstName;
    if (formData.lastName) data.lastName = formData.lastName;
    if (formData.gender) {
      data.gender = formData.gender as 'male' | 'female' | 'other' | 'prefer-not-to-say';
    }
    if (formData.bloodGroup) {
      data.bloodGroup = formData.bloodGroup as 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    }
    if (formData.height) data.height = parseFloat(formData.height);
    if (formData.weight) data.weight = parseFloat(formData.weight);
    if (formData.medicalConditions) {
      data.medicalConditions = formData.medicalConditions
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c.length > 0);
    }
    // Include password fields only if user is changing password
    if (formData.currentPassword && formData.newPassword) {
      data.currentPassword = formData.currentPassword;
      data.newPassword = formData.newPassword;
    }

    return data;
  };

  return {
    profile,
    isLoading,
    isError,
    error,
    refetch,
    profileToFormData,
    formDataToApiData,
    updateProfile: updateProfileMutation.mutate,
    updateProfileAsync: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
    updateError: updateProfileMutation.error,
    deleteAccount: deleteAccountMutation.mutate,
    isDeleting: deleteAccountMutation.isPending,
    deleteError: deleteAccountMutation.error,
    uploadAvatar: uploadAvatarMutation.mutate,
    isUploadingAvatar: uploadAvatarMutation.isPending,
    uploadAvatarError: uploadAvatarMutation.error,
  };
};

export default useProfile;
