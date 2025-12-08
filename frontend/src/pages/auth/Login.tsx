import React, { useState } from 'react';
import {
  Box,
  Container,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Alert,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { LogoBrand } from '../../components/ui/molecules';
import { useAuth } from '../../hooks/useAuth';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
  form?: string;
}

/**
 * Login Page
 *
 * Handles user authentication with email and password.
 * Features error handling, loading states, and responsive design.
 * Uses MUI components directly with theme values for styling.
 */
export const Login: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Form state
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  // Use login mutation hook from auth context
  const { loginAsync, isLoggingIn, loginError } = useAuth();

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name as keyof LoginErrors]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: undefined,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await loginAsync({
        email: formData.email,
        password: formData.password,
      });
      // Navigation is handled by useAuth hook's onSuccess callback
    } catch (error: any) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        form: error?.response?.data?.message || 'Login failed. Please try again.',
      }));
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
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        p: 2,
      }}
    >
      {/* Logo Brand - Positioned at top */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: theme.spacing(1), sm: theme.spacing(2) },
          zIndex: 1,
        }}
      >
        <LogoBrand size={isMobile ? 'small' : 'medium'} showTagline={false} />
      </Box>

      {/* Main Content Container */}
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Login Card */}
        <Paper
          variant="outlined"
          sx={{
            width: '100%',
            maxWidth: theme.customSizes.maxWidth.lg,
            p: 3,
            borderRadius: 4,
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Heading */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontSize: { xs: theme.typography.h4.fontSize, sm: theme.typography.h3.fontSize },
                  fontWeight: 400,
                  lineHeight: 1.25,
                  color: 'primary.main',
                  textAlign: 'center',
                  mb: 2,
                }}
              >
                Log in
              </Typography>
            </Box>

            {/* Form Error Message */}
            {(errors.form || loginError) && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {errors.form || loginError?.message || 'Login failed. Please try again.'}
              </Alert>
            )}

            {/* Input Fields */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                mb: 4,
              }}
            >
              {/* Email Input */}
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
                placeholder="Enter your email"
                disabled={isLoggingIn}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2.5,
                    backgroundColor: errors.email ? '#ffebee' : 'transparent',
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

              {/* Password Input */}
              <TextField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                error={!!errors.password}
                helperText={errors.password}
                placeholder="Enter your password"
                disabled={isLoggingIn}
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
                    backgroundColor: errors.password ? '#ffebee' : 'transparent',
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
            </Box>

            {/* Submit Button */}
            <Button
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              fullWidth
              disabled={isLoggingIn}
              sx={{ mb: 3, borderRadius: 2.5 }}
            >
              Log in
            </Button>

            {/* Footer Links */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  mb: 1,
                }}
              >
                Don't have an account?{' '}
                <Box
                  component="span"
                  onClick={() => navigate('/register')}
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
                      navigate('/register');
                    }
                  }}
                >
                  Register
                </Box>
              </Typography>

              {/* Forgot Password Link */}
              <Box
                component="span"
                onClick={() => navigate('/forgot-password')}
                sx={{
                  color: 'primary.main',
                  fontSize: theme.typography.body2.fontSize,
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
                    navigate('/forgot-password');
                  }
                }}
              >
                Forgot password?
              </Box>
            </Box>
          </form>
        </Paper>
      </Container>

      {/* Loading Overlay */}
      {isLoggingIn && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: theme.customColors.surface.overlay,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default Login;
