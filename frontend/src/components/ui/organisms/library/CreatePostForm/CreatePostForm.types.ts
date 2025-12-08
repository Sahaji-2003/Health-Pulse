import type { SxProps, Theme } from '@mui/material';

/**
 * Form data for creating a new forum post
 */
export interface CreatePostFormData {
  title: string;
  description: string;
  imageUrl?: string;
  imageFile?: File;
}

/**
 * Props for the CreatePostForm component
 */
export interface CreatePostFormProps {
  /**
   * Whether the form dialog is open
   */
  open: boolean;
  
  /**
   * Callback when dialog is closed
   */
  onClose: () => void;
  
  /**
   * Callback when form is submitted
   */
  onSubmit: (data: CreatePostFormData) => void;
  
  /**
   * Whether the form is currently submitting
   */
  isSubmitting?: boolean;
  
  /**
   * Initial form values (for editing)
   */
  initialValues?: Partial<CreatePostFormData>;
  
  /**
   * Custom styles
   */
  sx?: SxProps<Theme>;
}
