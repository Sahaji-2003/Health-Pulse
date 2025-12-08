import React, { useState, useRef, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  MenuItem,
  CircularProgress,
  IconButton,
  Collapse,
  useTheme,
} from '@mui/material';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import type { AccountSectionProps } from './AccountSection.types';

// Get API base URL for avatar images
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * AccountSection Organism Component
 * 
 * Displays and manages user profile account information including
 * personal details, physical metrics, and medical conditions.
 * Uses theme values for consistent styling.
 * 
 * @example
 * <AccountSection
 *   formData={formData}
 *   onInputChange={handleInputChange}
 *   isEditing={isEditing}
 *   isUpdating={isUpdating}
 *   onSave={handleSave}
 *   onEdit={handleEdit}
 *   avatarUrl={avatarUrl}
 *   selectedAvatarFile={selectedAvatarFile}
 *   onAvatarSelect={handleAvatarSelect}
 * />
 */
export const AccountSection: React.FC<AccountSectionProps> = ({
  formData,
  onInputChange,
  isEditing,
  isUpdating,
  onSave,
  onEdit,
  avatarUrl,
  selectedAvatarFile,
  onAvatarSelect,
  isUploadingAvatar,
}) => {
  const theme = useTheme();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create local preview URL for selected file
  const previewUrl = useMemo(() => {
    if (selectedAvatarFile) {
      return URL.createObjectURL(selectedAvatarFile);
    }
    return null;
  }, [selectedAvatarFile]);

  // Clean up object URL when component unmounts or file changes
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle avatar edit button click
  const handleAvatarEditClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection - just store locally for preview
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onAvatarSelect) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      onAvatarSelect(file);
    }
    // Reset input value to allow selecting the same file again
    event.target.value = '';
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (formData.age && isNaN(Number(formData.age))) {
      newErrors.age = 'Age must be a valid number';
    }
    if (formData.age && (Number(formData.age) < 0 || Number(formData.age) > 150)) {
      newErrors.age = 'Age must be between 0 and 150';
    }
    if (formData.height && isNaN(Number(formData.height))) {
      newErrors.height = 'Height must be a valid number';
    }
    if (formData.height && Number(formData.height) <= 0) {
      newErrors.height = 'Height must be greater than 0';
    }
    if (formData.weight && isNaN(Number(formData.weight))) {
      newErrors.weight = 'Weight must be a valid number';
    }
    if (formData.weight && Number(formData.weight) <= 0) {
      newErrors.weight = 'Weight must be greater than 0';
    }
    // Password validation - only if user is trying to change password
    if (formData.newPassword || formData.currentPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to change password';
      }
      if (!formData.newPassword) {
        newErrors.newPassword = 'New password is required';
      } else if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'New password must be at least 8 characters';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChangeWithValidation = (field: keyof typeof formData, value: string) => {
    onInputChange(field, value);
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSaveWithValidation = () => {
    if (validateForm()) {
      onSave();
    }
  };

  // Common text field styles using theme
  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      fontSize: theme.typography.body2.fontSize,
    },
    '& .MuiInputLabel-root': {
      fontSize: theme.typography.caption.fontSize,
    },
  };

  // Get avatar source - prioritize local preview over server URL
  const getAvatarSrc = () => {
    // If there's a selected file, show the local preview
    if (previewUrl) {
      return previewUrl;
    }
    // Otherwise, show the server avatar URL
    if (!avatarUrl) {
      return undefined;
    }
    // If it's already a full URL, use it as is
    if (avatarUrl.startsWith('http')) return avatarUrl;
    // If it's a data URL (base64), use it as is
    if (avatarUrl.startsWith('data:')) return avatarUrl;
    // Otherwise, prepend the base URL (without /api for static files)
    const staticBaseUrl = API_BASE_URL.replace(/\/api$/, '');
    const fullUrl = `${staticBaseUrl}${avatarUrl}`;
    return fullUrl;
  };

  return (
    <Box>
      {/* Section Title */}
      <Typography
        variant="h6"
        sx={{
          color: 'primary.main',
          fontWeight: 400,
          mb: 1.5,
        }}
      >
        My Profile
      </Typography>

      {/* Divider */}
      <Divider sx={{ borderColor: 'primary.main', mb: 2.5 }} />

      {/* Avatar with edit button */}
      <Box sx={{ position: 'relative', width: 'fit-content', mb: 2.5 }}>
        <Avatar
          variant="circular"
          src={getAvatarSrc()}
          sx={{
            width: 72,
            height: 72,
            bgcolor: '#E8DEF8',
            border: 2,
            borderColor: 'primary.main',
            color: 'primary.main',
          }}
        >
          {!avatarUrl && !previewUrl && <PersonOutlineRoundedIcon sx={{ fontSize: 40 }} />}
        </Avatar>
        
        {/* Pencil edit button overlay - only show when editing */}
        {isEditing && (
          <IconButton
            onClick={handleAvatarEditClick}
            disabled={isUploadingAvatar}
            sx={{
              position: 'absolute',
              bottom: -4,
              right: -4,
              width: 28,
              height: 28,
              bgcolor: 'primary.main',
              color: 'white',
              boxShadow: 2,
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              '&:disabled': {
                bgcolor: 'primary.light',
                color: 'white',
              },
            }}
          >
            {isUploadingAvatar ? (
              <CircularProgress size={14} sx={{ color: 'white' }} />
            ) : (
              <EditRoundedIcon sx={{ fontSize: 16 }} />
            )}
          </IconButton>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </Box>

      {/* Form Fields */}
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: theme.customSizes.maxWidth.xl,
        }}
      >
        {/* Row 1: First Name & Last Name */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          <TextField
            label="First Name"
            variant="outlined"
            size="small"
            fullWidth
            value={formData.firstName}
            onChange={(e) => handleInputChangeWithValidation('firstName', e.target.value)}
            disabled={!isEditing}
            error={!!errors.firstName}
            helperText={errors.firstName}
            sx={textFieldSx}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            size="small"
            fullWidth
            value={formData.lastName}
            onChange={(e) => handleInputChangeWithValidation('lastName', e.target.value)}
            disabled={!isEditing}
            error={!!errors.lastName}
            helperText={errors.lastName}
            sx={textFieldSx}
          />
        </Box>

        {/* Row 2: Age & Gender */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          <TextField
            label="Age"
            variant="outlined"
            size="small"
            fullWidth
            type="number"
            value={formData.age}
            onChange={(e) => handleInputChangeWithValidation('age', e.target.value)}
            disabled={!isEditing}
            error={!!errors.age}
            helperText={errors.age}
            sx={textFieldSx}
          />
          <TextField
            label="Gender"
            variant="outlined"
            size="small"
            fullWidth
            select
            value={formData.gender}
            onChange={(e) => handleInputChangeWithValidation('gender', e.target.value)}
            disabled={!isEditing}
            sx={textFieldSx}
          >
            <MenuItem value="">Select Gender</MenuItem>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
            <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
          </TextField>
        </Box>

        {/* Row 3: Height & Weight */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          <TextField
            label="Height"
            variant="outlined"
            size="small"
            fullWidth
            type="number"
            placeholder="in cm"
            value={formData.height}
            onChange={(e) => handleInputChangeWithValidation('height', e.target.value)}
            disabled={!isEditing}
            error={!!errors.height}
            helperText={errors.height}
            sx={textFieldSx}
          />
          <TextField
            label="Weight"
            variant="outlined"
            size="small"
            fullWidth
            type="number"
            placeholder="in kg"
            value={formData.weight}
            onChange={(e) => handleInputChangeWithValidation('weight', e.target.value)}
            disabled={!isEditing}
            error={!!errors.weight}
            helperText={errors.weight}
            sx={textFieldSx}
          />
        </Box>

        {/* Row 4: Blood Group */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          <TextField
            label="Blood Group"
            variant="outlined"
            size="small"
            fullWidth
            select
            value={formData.bloodGroup}
            onChange={(e) => handleInputChangeWithValidation('bloodGroup', e.target.value)}
            disabled={!isEditing}
            sx={textFieldSx}
          >
            <MenuItem value="">Select Blood Group</MenuItem>
            <MenuItem value="A+">A+</MenuItem>
            <MenuItem value="A-">A-</MenuItem>
            <MenuItem value="B+">B+</MenuItem>
            <MenuItem value="B-">B-</MenuItem>
            <MenuItem value="AB+">AB+</MenuItem>
            <MenuItem value="AB-">AB-</MenuItem>
            <MenuItem value="O+">O+</MenuItem>
            <MenuItem value="O-">O-</MenuItem>
          </TextField>
        </Box>

        {/* Row 5: Password Change Section */}
        <Box sx={{ mt: 1 }}>
          <Button
            variant="text"
            onClick={() => setShowPasswordChange(!showPasswordChange)}
            disabled={!isEditing}
            endIcon={showPasswordChange ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            sx={{
              textTransform: 'none',
              color: 'primary.main',
              p: 0,
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            Change Password
          </Button>
          <Collapse in={showPasswordChange && isEditing}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Current Password"
                variant="outlined"
                size="small"
                fullWidth
                type="password"
                value={formData.currentPassword}
                onChange={(e) => handleInputChangeWithValidation('currentPassword', e.target.value)}
                disabled={!isEditing}
                error={!!errors.currentPassword}
                helperText={errors.currentPassword}
                sx={textFieldSx}
              />
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2,
                }}
              >
                <TextField
                  label="New Password"
                  variant="outlined"
                  size="small"
                  fullWidth
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => handleInputChangeWithValidation('newPassword', e.target.value)}
                  disabled={!isEditing}
                  error={!!errors.newPassword}
                  helperText={errors.newPassword || 'Minimum 8 characters'}
                  sx={textFieldSx}
                />
                <TextField
                  label="Confirm New Password"
                  variant="outlined"
                  size="small"
                  fullWidth
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChangeWithValidation('confirmPassword', e.target.value)}
                  disabled={!isEditing}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  sx={textFieldSx}
                />
              </Box>
            </Box>
          </Collapse>
        </Box>

        {/* Row 6: Medical Conditions */}
        <TextField
          label="Medical Conditions"
          variant="outlined"
          size="small"
          fullWidth
          multiline
          rows={3}
          value={formData.medicalConditions}
          onChange={(e) => handleInputChangeWithValidation('medicalConditions', e.target.value)}
          disabled={!isEditing}
          placeholder="Enter medical conditions separated by commas"
          sx={textFieldSx}
        />

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
          <Button
            variant="contained"
            size="medium"
            onClick={handleSaveWithValidation}
            disabled={!isEditing || isUpdating}
            sx={(buttonTheme) => ({
              borderRadius: buttonTheme.customSizes.borderRadius.sm,
              textTransform: 'none',
              px: 2.5,
              py: 0.75,
              fontSize: buttonTheme.typography.body2.fontSize,
              boxShadow: 1,
              '&:disabled': {
                bgcolor: 'primary.main',
                color: 'white',
                opacity: isUpdating ? 0.7 : 1,
              },
            })}
          >
            {isUpdating ? (
              <CircularProgress size={16} sx={{ color: 'white', mr: 0.5 }} />
            ) : null}
            Save
          </Button>
          <Button
            variant="contained"
            size="medium"
            onClick={onEdit}
            disabled={isEditing}
            sx={(buttonTheme) => ({
              borderRadius: buttonTheme.customSizes.borderRadius.sm,
              textTransform: 'none',
              px: 2.5,
              py: 0.75,
              fontSize: buttonTheme.typography.body2.fontSize,
              bgcolor: 'action.disabledBackground',
              color: 'text.primary',
              '&:hover': {
                bgcolor: 'action.hover',
              },
              '&:disabled': {
                bgcolor: 'action.disabledBackground',
                color: 'text.disabled',
              },
            })}
          >
            Edit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AccountSection;
