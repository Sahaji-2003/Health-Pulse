import React, { useState, useCallback } from 'react';
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  Snackbar,
  Alert,
  CircularProgress,
  Typography,
  Divider,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Modal,
  useTheme,
} from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { DashboardCard } from '../../../molecules/DashboardCard';
import { useCreateVital } from '../../../../../hooks/useVitals';
import type { VitalsEntrySectionProps, VitalsFormData } from './VitalsEntrySection.types';

// Import health app icons
import googleFitIcon from '../../../../../assets/bba9d9660ee14a3c8a19011d84b7792ec2cda7b6.png';
import appleHealthIcon from '../../../../../assets/7362ac0d0381d374ff4bd0c2cae12827e797f8c7.png';

/**
 * Initial empty form state
 */
const initialFormState: VitalsFormData = {
  bloodPressureSystolic: '',
  bloodPressureDiastolic: '',
  heartRate: '',
  bloodSugar: '',
  weight: '',
  cholesterol: '',
};

/**
 * Import status type
 */
type ImportStatus = 'idle' | 'selecting-app' | 'selecting-data' | 'importing' | 'success';

/**
 * Data field type for import
 */
interface VitalsDataField {
  id: string;
  label: string;
  selected: boolean;
}

/**
 * Health app type
 */
interface HealthApp {
  id: 'google-fit' | 'apple-health';
  name: string;
  icon: string;
}

/**
 * Default health apps
 */
const defaultHealthApps: HealthApp[] = [
  { id: 'google-fit', name: 'Google Fit', icon: googleFitIcon },
  { id: 'apple-health', name: 'Apple Health', icon: appleHealthIcon },
];

/**
 * Default data fields for vitals import
 */
const defaultVitalsDataFields: VitalsDataField[] = [
  { id: 'bloodPressure', label: 'Blood Pressure', selected: true },
  { id: 'bloodSugar', label: 'Blood Sugar', selected: true },
  { id: 'weight', label: 'Weight', selected: true },
  { id: 'heartRate', label: 'Heart rate', selected: true },
  { id: 'cholesterol', label: 'Cholesterol', selected: true },
];

/**
 * Mock imported values
 */
const mockImportedValues: VitalsFormData = {
  bloodPressureSystolic: '120',
  bloodPressureDiastolic: '80',
  bloodSugar: '100',
  weight: '75',
  heartRate: '72',
  cholesterol: '180',
};

/**
 * Validation limits for vital signs
 * Each vital has normal, warning (elevated), and critical (danger) ranges
 */
interface VitalLimits {
  min: number;
  max: number;
  warningMin?: number;
  warningMax?: number;
  criticalMin?: number;
  criticalMax?: number;
}

interface VitalFieldConfig {
  id: string;
  label: string;
  unit: string;
  placeholder: string;
  limits: VitalLimits;
}

/**
 * Vital field configurations with validation limits
 */
const vitalFields: VitalFieldConfig[] = [
  {
    id: 'bloodPressureSystolic',
    label: 'Blood Pressure/S',
    unit: 'mmHg',
    placeholder: 'e.g., 120',
    limits: {
      min: 70,
      max: 250,
      warningMin: 90,
      warningMax: 140,
      criticalMin: 80,
      criticalMax: 180,
    },
  },
  {
    id: 'bloodPressureDiastolic',
    label: 'Blood Pressure/D',
    unit: 'mmHg',
    placeholder: 'e.g., 80',
    limits: {
      min: 40,
      max: 150,
      warningMin: 60,
      warningMax: 90,
      criticalMin: 50,
      criticalMax: 110,
    },
  },
  {
    id: 'heartRate',
    label: 'Heart Rate',
    unit: 'bpm',
    placeholder: 'e.g., 72',
    limits: {
      min: 30,
      max: 250,
      warningMin: 60,
      warningMax: 100,
      criticalMin: 40,
      criticalMax: 150,
    },
  },
  {
    id: 'bloodSugar',
    label: 'Blood Sugar',
    unit: 'mg/dL',
    placeholder: 'e.g., 100',
    limits: {
      min: 20,
      max: 600,
      warningMin: 70,
      warningMax: 140,
      criticalMin: 50,
      criticalMax: 200,
    },
  },
  {
    id: 'weight',
    label: 'Weight',
    unit: 'Kg',
    placeholder: 'e.g., 70',
    limits: {
      min: 20,
      max: 300,
      // Weight doesn't have specific critical limits, but we set reasonable bounds
      warningMin: 40,
      warningMax: 150,
      criticalMin: 30,
      criticalMax: 200,
    },
  },
  {
    id: 'cholesterol',
    label: 'Cholesterol',
    unit: 'mg/dL',
    placeholder: 'e.g., 180',
    limits: {
      min: 50,
      max: 400,
      warningMax: 200, // Above 200 is borderline high
      criticalMax: 240, // Above 240 is high
    },
  },
];

/**
 * Validation status type
 */
type ValidationStatus = 'normal' | 'warning' | 'critical' | 'invalid';

/**
 * Get validation status for a vital value
 */
const getValidationStatus = (value: string, limits: VitalLimits): ValidationStatus => {
  if (!value || value.trim() === '') return 'normal';
  
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return 'invalid';
  
  // Check if value is outside absolute bounds
  if (numValue < limits.min || numValue > limits.max) return 'invalid';
  
  // Check critical limits
  if (limits.criticalMin !== undefined && numValue < limits.criticalMin) return 'critical';
  if (limits.criticalMax !== undefined && numValue > limits.criticalMax) return 'critical';
  
  // Check warning limits
  if (limits.warningMin !== undefined && numValue < limits.warningMin) return 'warning';
  if (limits.warningMax !== undefined && numValue > limits.warningMax) return 'warning';
  
  return 'normal';
};

/**
 * Get validation message for a vital value
 */
const getValidationMessage = (value: string, field: VitalFieldConfig): string => {
  const status = getValidationStatus(value, field.limits);
  const numValue = parseFloat(value);
  const normalRange = `${field.limits.warningMin || field.limits.min}-${field.limits.warningMax || field.limits.max}`;
  
  switch (status) {
    case 'invalid':
      return `Value must be between ${field.limits.min}-${field.limits.max} ${field.unit}`;
    case 'critical':
      if (field.limits.criticalMin !== undefined && numValue < field.limits.criticalMin) {
        return `Critically low! Normal range: ${normalRange} ${field.unit}`;
      }
      if (field.limits.criticalMax !== undefined && numValue > field.limits.criticalMax) {
        return `Critically high! Normal range: ${normalRange} ${field.unit}`;
      }
      return `Critical value! Normal range: ${normalRange} ${field.unit}`;
    case 'warning':
      if (field.limits.warningMin !== undefined && numValue < field.limits.warningMin) {
        return `Below normal range (${normalRange} ${field.unit})`;
      }
      if (field.limits.warningMax !== undefined && numValue > field.limits.warningMax) {
        return `Above normal range (${normalRange} ${field.unit})`;
      }
      return `Outside normal range (${normalRange} ${field.unit})`;
    default:
      return '';
  }
};

/**
 * VitalsEntrySection Organism
 *
 * A form section for manually entering vital signs with import options
 * from Google Fit and Apple Health.
 */
export const VitalsEntrySection: React.FC<VitalsEntrySectionProps> = ({
  onSave,
  onReset,
  onImportGoogleFit,
  onImportAppleHealth,
  initialValues = {},
  isLoading: externalLoading = false,
  compact = false,
  sx,
}) => {
  const theme = useTheme();
  
  // API mutation hook for creating vitals
  const createVitalMutation = useCreateVital();
  const isLoading = externalLoading || createVitalMutation.isPending;

  // Form state
  const [formData, setFormData] = useState<VitalsFormData>({
    ...initialFormState,
    ...initialValues,
  });

  // Import flow state (inline, not modal)
  const [importStatus, setImportStatus] = useState<ImportStatus>('idle');
  const [selectedApp, setSelectedApp] = useState<HealthApp | null>(null);
  const [dataFields, setDataFields] = useState<VitalsDataField[]>(defaultVitalsDataFields);
  const [importProgress, setImportProgress] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  /**
   * Check if form has any values
   */
  const hasValues = Object.values(formData).some((value) => value.trim() !== '');

  /**
   * Check if form has any invalid values
   */
  const hasInvalidValues = vitalFields.some((field) => {
    const value = formData[field.id as keyof VitalsFormData];
    const status = getValidationStatus(value, field.limits);
    return status === 'invalid';
  });

  /**
   * Check if form is valid (at least one field filled and no invalid values)
   */
  const isValid = hasValues && !hasInvalidValues;

  /**
   * Handle input change
   */
  const handleChange = useCallback(
    (field: keyof VitalsFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      // Only allow numbers and decimal point
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setFormData((prev) => ({
          ...prev,
          [field]: value,
        }));
      }
    },
    []
  );

  /**
   * Handle form reset
   */
  const handleReset = useCallback(() => {
    setFormData(initialFormState);
    onReset?.();
  }, [onReset]);

  /**
   * Handle form save - sends data to backend API
   */
  const handleSave = useCallback(async () => {
    if (!isValid) return;
    
    // Convert string values to numbers for API
    const apiData = {
      bloodPressureSystolic: formData.bloodPressureSystolic ? parseFloat(formData.bloodPressureSystolic) : undefined,
      bloodPressureDiastolic: formData.bloodPressureDiastolic ? parseFloat(formData.bloodPressureDiastolic) : undefined,
      heartRate: formData.heartRate ? parseFloat(formData.heartRate) : undefined,
      bloodSugar: formData.bloodSugar ? parseFloat(formData.bloodSugar) : undefined,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      // Note: cholesterol is not in backend model, so we skip it
      date: new Date().toISOString(),
    };

    try {
      await createVitalMutation.mutateAsync(apiData);
      setSnackbar({
        open: true,
        message: 'Vitals saved successfully!',
        severity: 'success',
      });
      // Reset form after successful save
      setFormData(initialFormState);
      // Call external callback if provided
      onSave?.(formData);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to save vitals. Please try again.',
        severity: 'error',
      });
    }
  }, [formData, isValid, onSave, createVitalMutation]);

  /**
   * Handle app selection (toggle)
   */
  const handleAppSelect = useCallback((app: HealthApp) => {
    if (selectedApp?.id === app.id) {
      setSelectedApp(null);
    } else {
      setSelectedApp(app);
    }
  }, [selectedApp]);

  /**
   * Handle data field toggle
   */
  const handleDataFieldToggle = useCallback((fieldId: string) => {
    setDataFields((prev) =>
      prev.map((field) =>
        field.id === fieldId ? { ...field, selected: !field.selected } : field
      )
    );
  }, []);

  /**
   * Handle import button click - navigate to data selection
   */
  const handleImportClick = useCallback(() => {
    if (selectedApp) {
      setImportStatus('selecting-data');
    }
  }, [selectedApp]);

  /**
   * Handle start import
   */
  const handleStartImport = useCallback(() => {
    setImportStatus('importing');
    let progress = 0;

    const interval = setInterval(() => {
      progress += 10;
      setImportProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setImportStatus('success');
        setShowSuccessModal(true);

        // Update form data with imported values based on selected fields
        const newFormData: Partial<VitalsFormData> = {};
        dataFields.forEach((field) => {
          if (field.selected) {
            if (field.id === 'bloodPressure') {
              newFormData.bloodPressureSystolic = mockImportedValues.bloodPressureSystolic;
              newFormData.bloodPressureDiastolic = mockImportedValues.bloodPressureDiastolic;
            } else if (field.id === 'bloodSugar') {
              newFormData.bloodSugar = mockImportedValues.bloodSugar;
            } else if (field.id === 'weight') {
              newFormData.weight = mockImportedValues.weight;
            } else if (field.id === 'heartRate') {
              newFormData.heartRate = mockImportedValues.heartRate;
            } else if (field.id === 'cholesterol') {
              newFormData.cholesterol = mockImportedValues.cholesterol;
            }
          }
        });

        setFormData((prev) => ({ ...prev, ...newFormData }));

        // Call external handlers if provided
        if (selectedApp?.id === 'google-fit' && onImportGoogleFit) {
          onImportGoogleFit();
        } else if (selectedApp?.id === 'apple-health' && onImportAppleHealth) {
          onImportAppleHealth();
        }
      }
    }, 200);
  }, [dataFields, selectedApp, onImportGoogleFit, onImportAppleHealth]);

  /**
   * Handle cancel import
   */
  const handleCancelImport = useCallback(() => {
    setImportStatus('idle');
    setSelectedApp(null);
    setDataFields(defaultVitalsDataFields);
    setImportProgress(0);
  }, []);

  /**
   * Handle success modal close
   */
  const handleSuccessClose = useCallback(() => {
    setShowSuccessModal(false);
    setImportStatus('idle');
    setSelectedApp(null);
    setDataFields(defaultVitalsDataFields);
    setImportProgress(0);
  }, []);

  /**
   * Close snackbar
   */
  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  /**
   * Render the import section based on status
   */
  const renderImportSection = () => {
    // Idle state - show app selection
    if (importStatus === 'idle' || importStatus === 'selecting-app') {
      return (
        <Box sx={{ mt: 3 }}>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 500,
              fontSize: '12px',
              mb: 2,
            }}
          >
            Select and connect preferred app
          </Typography>

          {/* Health App Icons */}
          <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
            {defaultHealthApps.map((app) => (
              <Box
                key={app.id}
                sx={{
                  position: 'relative',
                  cursor: 'pointer',
                }}
                onClick={() => handleAppSelect(app)}
              >
                <Box
                  component="img"
                  src={app.icon}
                  alt={app.name}
                  sx={{
                    width: 62,
                    height: 62,
                    objectFit: 'contain',
                    borderRadius: 1,
                  }}
                />
                <Checkbox
                  checked={selectedApp?.id === app.id}
                  onChange={() => handleAppSelect(app)}
                  sx={{
                    position: 'absolute',
                    top: -12,
                    right: -12,
                    p: 0,
                    '& .MuiSvgIcon-root': {
                      fontSize: 24,
                    },
                  }}
                />
              </Box>
            ))}
          </Box>

          <Divider sx={{ borderColor: theme.palette.primary.main, mb: 2.5 }} />

          {/* Import Health Data Button */}
          <Button
            variant="contained"
            disabled={!selectedApp}
            onClick={handleImportClick}
            sx={{
              borderRadius: 1.5,
              textTransform: 'none',
              px: 2,
              py: 1.25,
              fontSize: '14px',
              fontWeight: 500,
              bgcolor: selectedApp ? theme.palette.primary.main : 'rgba(23, 29, 27, 0.1)',
              color: selectedApp ? 'white' : 'text.disabled',
              '&:disabled': {
                bgcolor: 'rgba(23, 29, 27, 0.1)',
                color: 'text.disabled',
                opacity: 0.38,
              },
            }}
          >
            Import Health Data
          </Button>
        </Box>
      );
    }

    // Selecting data state
    if (importStatus === 'selecting-data') {
      return (
        <Box sx={{ mt: 3 }}>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 500,
              fontSize: '12px',
              mb: 2,
            }}
          >
            Select data to import from {selectedApp?.name}:
          </Typography>

          {/* Data Fields List */}
          <List sx={{ py: 0, maxWidth: 404, bgcolor: theme.customColors?.background?.mint || '#F4FBF8' }}>
            {dataFields.map((field) => (
              <ListItem
                key={field.id}
                dense
                sx={{
                  py: 0.5,
                  px: 2,
                  minHeight: 40,
                }}
              >
                <ListItemText
                  primary={field.label}
                  primaryTypographyProps={{
                    fontSize: '16px',
                    fontWeight: 400,
                    color: theme.palette.text.primary,
                  }}
                />
                <ListItemIcon sx={{ minWidth: 'auto' }}>
                  <Checkbox
                    edge="end"
                    checked={field.selected}
                    onChange={() => handleDataFieldToggle(field.id)}
                    sx={{
                      color: theme.palette.primary.main,
                      '&.Mui-checked': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                </ListItemIcon>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ borderColor: theme.palette.primary.main, mt: 2, mb: 2.5 }} />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleStartImport}
              disabled={!dataFields.some((f) => f.selected)}
              sx={{
                borderRadius: 1.5,
                textTransform: 'none',
                px: 2,
                py: 1.25,
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              Start
            </Button>
            <Button
              variant="outlined"
              onClick={handleCancelImport}
              sx={{
                borderRadius: 1.5,
                textTransform: 'none',
                px: 2,
                py: 1.25,
                fontSize: '14px',
                fontWeight: 500,
                borderColor: 'rgba(23, 29, 27, 0.1)',
                color: theme.palette.text.secondary,
                bgcolor: 'rgba(23, 29, 27, 0.1)',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  bgcolor: 'rgba(23, 29, 27, 0.15)',
                },
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      );
    }

    // Importing or success state - show progress
    if (importStatus === 'importing' || importStatus === 'success') {
      return (
        <Box sx={{ mt: 3 }}>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 500,
              fontSize: '12px',
              mb: 1,
            }}
          >
            Data importing in progress :
          </Typography>

          {/* Progress Bar */}
          <LinearProgress
            variant="determinate"
            value={importProgress}
            sx={{
              height: 4,
              borderRadius: 2,
              maxWidth: 404,
              mb: 2,
              bgcolor: 'rgba(0, 107, 96, 0.12)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 2,
                bgcolor: theme.palette.primary.main,
              },
            }}
          />

          {/* Data Fields List (Read-only) */}
          <List sx={{ py: 0, maxWidth: 404, bgcolor: theme.customColors?.background?.mint || '#F4FBF8' }}>
            {dataFields
              .filter((field) => field.selected)
              .map((field) => (
                <ListItem
                  key={field.id}
                  dense
                  sx={{
                    py: 0.5,
                    px: 2,
                    minHeight: 40,
                  }}
                >
                  <ListItemText
                    primary={field.label}
                    primaryTypographyProps={{
                      fontSize: '16px',
                      fontWeight: 400,
                      color: theme.palette.text.primary,
                    }}
                  />
                </ListItem>
              ))}
          </List>

          <Divider sx={{ borderColor: theme.palette.primary.main, mt: 2, mb: 2.5 }} />

          {/* Disabled Buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              disabled
              sx={{
                borderRadius: 1.5,
                textTransform: 'none',
                px: 2,
                py: 1.25,
                fontSize: '14px',
                fontWeight: 500,
                bgcolor: 'rgba(23, 29, 27, 0.1)',
                color: 'rgba(23, 29, 27, 0.38)',
                '&.Mui-disabled': {
                  bgcolor: 'rgba(23, 29, 27, 0.1)',
                  color: 'rgba(23, 29, 27, 0.38)',
                },
              }}
            >
              Start
            </Button>
            <Button
              variant="outlined"
              disabled
              sx={{
                borderRadius: 1.5,
                textTransform: 'none',
                px: 2,
                py: 1.25,
                fontSize: '14px',
                fontWeight: 500,
                borderColor: 'rgba(23, 29, 27, 0.1)',
                color: 'rgba(23, 29, 27, 0.38)',
                bgcolor: 'rgba(23, 29, 27, 0.1)',
                '&.Mui-disabled': {
                  borderColor: 'rgba(23, 29, 27, 0.1)',
                  color: 'rgba(23, 29, 27, 0.38)',
                },
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      );
    }

    return null;
  };

  return (
    <>
      <DashboardCard
        title="Vital Entry Section"
        icon={<EditNoteIcon />}
        fullWidth
        compact={compact}
        sx={{
          bgcolor: theme.palette.background.paper,
          ...sx,
        }}
      >
        <Box
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
          noValidate
          autoComplete="off"
        >
          {/* Input Fields Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 2,
            }}
          >
            {vitalFields.map((field) => {
              const value = formData[field.id as keyof VitalsFormData];
              const validationStatus = getValidationStatus(value, field.limits);
              const validationMessage = getValidationMessage(value, field);
              const hasError = validationStatus === 'critical' || validationStatus === 'invalid';
              const hasWarning = validationStatus === 'warning';
              
              return (
                <TextField
                  key={field.id}
                  id={`vitals-${field.id}`}
                  label={field.label}
                  placeholder={field.placeholder}
                  value={value}
                  onChange={handleChange(field.id as keyof VitalsFormData)}
                  disabled={isLoading || importStatus !== 'idle'}
                  type="text"
                  inputMode="decimal"
                  size="medium"
                  fullWidth
                  error={hasError}
                  helperText={validationMessage}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Box
                            component="span"
                            sx={{
                              color: hasError ? 'error.main' : hasWarning ? 'warning.main' : 'text.secondary',
                              fontSize: '0.875rem',
                            }}
                          >
                            {field.unit}
                          </Box>
                        </InputAdornment>
                      ),
                    },
                    inputLabel: {
                      shrink: true,
                    },
                    formHelperText: {
                      sx: {
                        color: hasError ? 'error.main' : hasWarning ? 'warning.main' : 'text.secondary',
                        fontWeight: hasError || hasWarning ? 500 : 400,
                      },
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: hasError 
                        ? 'rgba(211, 47, 47, 0.08)' 
                        : hasWarning 
                          ? 'rgba(237, 108, 2, 0.08)' 
                          : theme.customColors?.background?.mint || '#F4FBF8',
                      '& fieldset': {
                        borderColor: hasError 
                          ? theme.palette.error.main 
                          : hasWarning 
                            ? theme.palette.warning.main 
                            : 'rgba(111, 121, 118, 0.16)',
                        borderWidth: hasError || hasWarning ? 2 : 1,
                      },
                      '&:hover fieldset': {
                        borderColor: hasError 
                          ? theme.palette.error.dark 
                          : hasWarning 
                            ? theme.palette.warning.dark 
                            : theme.palette.primary.main,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: hasError 
                          ? theme.palette.error.main 
                          : hasWarning 
                            ? theme.palette.warning.main 
                            : theme.palette.primary.main,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: hasError 
                        ? theme.palette.error.main 
                        : hasWarning 
                          ? theme.palette.warning.main 
                          : theme.palette.text.secondary,
                      '&.Mui-focused': {
                        color: hasError 
                          ? theme.palette.error.main 
                          : hasWarning 
                            ? theme.palette.warning.main 
                            : theme.palette.primary.main,
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: hasError 
                        ? theme.palette.error.main 
                        : hasWarning 
                          ? theme.palette.warning.dark 
                          : 'inherit',
                    },
                  }}
                />
              );
            })}
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            {/* Save Button */}
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!isValid || isLoading || importStatus !== 'idle'}
              sx={{
                minWidth: 100,
                borderRadius: 5,
                textTransform: 'none',
                fontWeight: 500,
                px: 3,
                py: 1,
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(0, 0, 0, 0.12)',
                  color: 'rgba(0, 0, 0, 0.38)',
                },
              }}
            >
              {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Save'}
            </Button>

            {/* Reset Button */}
            <Button
              variant="outlined"
              onClick={handleReset}
              disabled={!hasValues || isLoading || importStatus !== 'idle'}
              sx={{
                minWidth: 100,
                borderRadius: 5,
                textTransform: 'none',
                fontWeight: 500,
                px: 3,
                py: 1,
                borderColor: 'rgba(111, 121, 118, 0.32)',
                color: theme.palette.text.secondary,
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: 'transparent',
                },
                '&.Mui-disabled': {
                  borderColor: 'rgba(0, 0, 0, 0.12)',
                  color: 'rgba(0, 0, 0, 0.38)',
                },
              }}
            >
              Reset
            </Button>
          </Box>

          {/* Divider */}
          <Divider sx={{ borderColor: theme.palette.primary.main }} />

          {/* Inline Import Section */}
          {renderImportSection()}
        </Box>
      </DashboardCard>

      {/* Success Modal with Blur Backdrop */}
      <Modal
        open={showSuccessModal}
        onClose={handleSuccessClose}
        closeAfterTransition
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(4px)',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            bgcolor: theme.customColors?.snackbar?.background || '#252B2A',
            color: theme.customColors?.snackbar?.text || '#E9EFEC',
            borderRadius: '4px',
            px: 2,
            py: 1.5,
            minWidth: 344,
            boxShadow: '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.3)',
          }}
        >
          <CheckIcon sx={{ fontSize: 20 }} />
          <Typography
            sx={{
              flex: 1,
              fontSize: '14px',
              fontWeight: 400,
            }}
          >
            Successfully imported data from the apps.
          </Typography>
          <CloseIcon
            onClick={handleSuccessClose}
            sx={{
              cursor: 'pointer',
              fontSize: 24,
              p: 1,
              borderRadius: '50%',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          />
        </Box>
      </Modal>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: '100%',
            borderRadius: 3,
            backgroundColor:
              snackbar.severity === 'success'
                ? theme.palette.primary.main
                : snackbar.severity === 'error'
                  ? theme.palette.error.main
                  : theme.customColors?.snackbar?.background || '#322F35',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default VitalsEntrySection;
