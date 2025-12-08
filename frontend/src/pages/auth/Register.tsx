import React, { useState } from 'react';
import {
  Box,
  Stack,
  useMediaQuery,
  useTheme,
  Alert,
  TextField,
  Button,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { SelectChangeEvent } from '@mui/material/Select';

import { LogoBrand } from '../../components/ui/molecules';
import { useAuth } from '../../hooks/useAuth';

// Types for form data
interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  medicalConditions: string;
}

// Gender options for Select
const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

/**
 * Register Page
 * 
 * Registration form for new users with fields for:
 * - First Name, Last Name
 * - Email, Password
 * - Age, Gender
 * - Height (cm), Weight (kg)
 * - Medical Conditions
 * 
 * Fully responsive for mobile, tablet, and desktop views.
 * Follows atomic design - uses only atoms and molecules from component library.
 * Uses proper MUI components with sx prop and theme values for styling.
 */
export const Register: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    medicalConditions: '',
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Use registration mutation from auth hook
  const { registerAsync, isRegistering, registerError } = useAuth();

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'firstName':
      case 'lastName':
        return !value.trim() ? `${field === 'firstName' ? 'First' : 'Last'} Name is required` : '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      case 'password':
        if (!value.trim()) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (field: keyof RegisterFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Validate field on change
    const error = validateField(field, value);
    setFieldErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setFormData((prev) => ({
      ...prev,
      gender: event.target.value,
    }));
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    setFormError(null);
    
    // Validate all required fields
    const newErrors: Record<string, string> = {};
    newErrors.firstName = validateField('firstName', formData.firstName);
    newErrors.lastName = validateField('lastName', formData.lastName);
    newErrors.email = validateField('email', formData.email);
    newErrors.password = validateField('password', formData.password);
    
    setFieldErrors(newErrors);
    
    // Check if there are any errors
    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    try {
      await registerAsync({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        age: formData.age || undefined,
        gender: formData.gender as 'male' | 'female' | 'other' | undefined,
        height: formData.height || undefined,
        weight: formData.weight || undefined,
        medicalConditions: formData.medicalConditions || undefined,
      });
      // Navigation is handled by useAuth hook on success
    } catch (error: any) {
      setFormError(error?.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        bgcolor: theme.customColors.background.mint,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: { xs: 2, sm: 4 },
      }}
    >
      {/* Logo */}
      <LogoBrand
        size={isMobile ? 'small' : 'medium'}
        onClick={() => navigate('/')}
      />

      {/* Register Card */}
      <Box sx={{ width: '100%', maxWidth: theme.customSizes.maxWidth.md, mt: { xs: 2, sm: 4 } }}>
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: 4,
          }}
        >
          <Stack spacing={4}>
            {/* Title */}
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: theme.typography.h4.fontSize, sm: theme.typography.h3.fontSize },
                fontWeight: 400,
                lineHeight: 1.25,
                color: 'primary.main',
                textAlign: 'center',
              }}
            >
              Register
            </Typography>

            {/* Form Fields */}
            <Stack spacing={2}>
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
                error={!!fieldErrors.firstName}
                helperText={fieldErrors.firstName}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2.5,
                    backgroundColor: fieldErrors.firstName ? '#ffebee' : 'transparent',
                    transition: 'all 0.3s ease',
                  },
                  '& .MuiOutlinedInput-root.Mui-error': {
                    '& fieldset': {
                      borderColor: '#d32f2f',
                      borderWidth: 2,
                    },
                    backgroundColor: '#ffebee',
                  },
                  '& .MuiFormHelperText-root.Mui-error': {
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#d32f2f',
                    marginTop: '8px',
                  },
                }}
              />

              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
                error={!!fieldErrors.lastName}
                helperText={fieldErrors.lastName}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2.5,
                    backgroundColor: fieldErrors.lastName ? '#ffebee' : 'transparent',
                    transition: 'all 0.3s ease',
                  },
                  '& .MuiOutlinedInput-root.Mui-error': {
                    '& fieldset': {
                      borderColor: '#d32f2f',
                      borderWidth: 2,
                    },
                    backgroundColor: '#ffebee',
                  },
                  '& .MuiFormHelperText-root.Mui-error': {
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#d32f2f',
                    marginTop: '8px',
                  },
                }}
              />

              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2.5,
                    backgroundColor: fieldErrors.email ? '#ffebee' : 'transparent',
                    transition: 'all 0.3s ease',
                  },
                  '& .MuiOutlinedInput-root.Mui-error': {
                    '& fieldset': {
                      borderColor: '#d32f2f',
                      borderWidth: 2,
                    },
                    backgroundColor: '#ffebee',
                  },
                  '& .MuiFormHelperText-root.Mui-error': {
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#d32f2f',
                    marginTop: '8px',
                  },
                }}
              />

              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
                error={!!fieldErrors.password}
                helperText={fieldErrors.password}
                fullWidth
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        tabIndex={-1}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2.5,
                    backgroundColor: fieldErrors.password ? '#ffebee' : 'transparent',
                    transition: 'all 0.3s ease',
                  },
                  '& .MuiOutlinedInput-root.Mui-error': {
                    '& fieldset': {
                      borderColor: '#d32f2f',
                      borderWidth: 2,
                    },
                    backgroundColor: '#ffebee',
                  },
                  '& .MuiFormHelperText-root.Mui-error': {
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#d32f2f',
                    marginTop: '8px',
                  },
                }}
              />

              {/* Age and Gender Row */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange('age')}
                  helperText="Must be between 1 and 120"
                  inputProps={{ min: 1, max: 120 }}
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2.5,
                    },
                  }}
                />
                <FormControl fullWidth variant="outlined" sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2.5,
                  },
                }}>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    label="Gender"
                    value={formData.gender}
                    onChange={handleSelectChange}
                    sx={{
                      borderRadius: 2.5,
                    }}
                  >
                    {genderOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Male, Female, Other</FormHelperText>
                </FormControl>
              </Stack>

              {/* Height and Weight Row */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Height"
                  type="number"
                  value={formData.height}
                  onChange={handleInputChange('height')}
                  helperText="Height in cm"
                  inputProps={{ min: 0 }}
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2.5,
                    },
                  }}
                />
                <TextField
                  label="Weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleInputChange('weight')}
                  helperText="Weight in kg"
                  inputProps={{ min: 0 }}
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2.5,
                    },
                  }}
                />
              </Stack>

              <TextField
                label="Medical Conditions"
                multiline
                rows={3}
                value={formData.medicalConditions}
                onChange={handleInputChange('medicalConditions')}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2.5,
                  },
                }}
              />
            </Stack>

            {/* Error Message */}
            {(formError || registerError) && (
              <Alert severity="error">
                {formError || registerError?.message || 'Registration failed. Please try again.'}
              </Alert>
            )}

            {/* Register Button */}
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={isRegistering}
              onClick={handleRegister}
              sx={{ borderRadius: 2.5 }}
            >
              {isRegistering ? <CircularProgress size={24} color="inherit" /> : 'Register'}
            </Button>

            {/* Login Link */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Already have an account?{' '}
                <Box
                  component="span"
                  onClick={() => navigate('/login')}
                  sx={{
                    color: 'primary.main',
                    fontWeight: 500,
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      navigate('/login');
                    }
                  }}
                >
                  Log in
                </Box>
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default Register;
