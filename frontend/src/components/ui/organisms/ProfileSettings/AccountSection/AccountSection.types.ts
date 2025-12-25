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

export interface AccountSectionProps {
  /** Current form data state */
  formData: ProfileFormData;
  /** Handler for form field changes */
  onInputChange: (field: keyof ProfileFormData, value: string) => void;
  /** Whether the form is in editing mode */
  isEditing: boolean;
  /** Whether an update is in progress */
  isUpdating: boolean;
  /** Handler for save action */
  onSave: () => void;
  /** Handler for edit action */
  onEdit: () => void;
  /** URL of the user's avatar from server */
  avatarUrl?: string;
  /** Selected avatar file for preview (not yet uploaded) */
  selectedAvatarFile?: File | null;
  /** Handler for avatar file selection */
  onAvatarSelect?: (file: File | null) => void;
  /** Whether avatar upload is in progress */
  isUploadingAvatar?: boolean;
}
