import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Modal,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Divider,
  useTheme,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import type {
  VitalsDataImportModalProps,
  VitalsImportStatus,
  VitalsDataField,
  VitalsHealthApp,
  ImportedVitals,
} from './VitalsDataImportModal.types';

// Import health app icons
import googleFitIcon from '../../../../../assets/bba9d9660ee14a3c8a19011d84b7792ec2cda7b6.png';
import appleHealthIcon from '../../../../../assets/7362ac0d0381d374ff4bd0c2cae12827e797f8c7.png';

// Default available health apps
const defaultHealthApps: VitalsHealthApp[] = [
  { id: 'google-fit', name: 'Google Fit', icon: googleFitIcon },
  { id: 'apple-health', name: 'Apple Health', icon: appleHealthIcon },
];

// Default data fields that can be imported for vitals
const defaultVitalsDataFields: VitalsDataField[] = [
  { id: 'bloodPressure', label: 'Blood Pressure', selected: true },
  { id: 'bloodSugar', label: 'Blood Sugar', selected: true },
  { id: 'weight', label: 'Weight', selected: true },
  { id: 'heartRate', label: 'Heart rate', selected: true },
  { id: 'cholesterol', label: 'Cholesterol', selected: true },
];

// Mock imported values (simulating data from health apps)
const mockImportedValues: ImportedVitals = {
  bloodPressureSystolic: '120',
  bloodPressureDiastolic: '80',
  bloodSugar: '100',
  weight: '75',
  heartRate: '72',
  cholesterol: '180',
};

/**
 * VitalsDataImportModal Component
 *
 * A modal that handles the data import flow from health apps (Google Fit, Apple Health).
 * Shows data field selection, import progress, and success state.
 */
export const VitalsDataImportModal: React.FC<VitalsDataImportModalProps> = ({
  open,
  onClose,
  onImportComplete,
  sourceApp,
  sx,
}) => {
  const theme = useTheme();

  // Internal state
  const [status, setStatus] = useState<VitalsImportStatus>('selecting-data');
  const [selectedApp, setSelectedApp] = useState<VitalsHealthApp | null>(null);
  const [dataFields, setDataFields] = useState<VitalsDataField[]>(defaultVitalsDataFields);
  const [importProgress, setImportProgress] = useState(0);

  // Set the selected app based on sourceApp prop
  useEffect(() => {
    if (sourceApp && open) {
      const app = defaultHealthApps.find((a) => a.id === sourceApp);
      if (app) {
        setSelectedApp(app);
        setStatus('selecting-data');
      }
    }
  }, [sourceApp, open]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      // Reset after close animation
      const timeout = setTimeout(() => {
        setStatus('selecting-data');
        setDataFields(defaultVitalsDataFields);
        setImportProgress(0);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  /**
   * Handle data field toggle
   */
  const handleDataFieldToggle = useCallback((fieldId: keyof ImportedVitals | 'bloodPressure') => {
    setDataFields((prev) =>
      prev.map((field) =>
        field.id === fieldId ? { ...field, selected: !field.selected } : field
      )
    );
  }, []);

  /**
   * Handle start import
   */
  const handleStartImport = useCallback(() => {
    setStatus('importing');
    let progress = 0;

    const interval = setInterval(() => {
      progress += 10;
      setImportProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setStatus('success');
      }
    }, 200);
  }, []);

  /**
   * Handle cancel
   */
  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  /**
   * Handle success close and import complete
   */
  const handleSuccessClose = useCallback(() => {
    // Build imported data based on selected fields
    const importedData: ImportedVitals = {};

    dataFields.forEach((field) => {
      if (field.selected) {
        if (field.id === 'bloodPressure') {
          importedData.bloodPressureSystolic = mockImportedValues.bloodPressureSystolic;
          importedData.bloodPressureDiastolic = mockImportedValues.bloodPressureDiastolic;
        } else if (field.id === 'bloodSugar') {
          importedData.bloodSugar = mockImportedValues.bloodSugar;
        } else if (field.id === 'weight') {
          importedData.weight = mockImportedValues.weight;
        } else if (field.id === 'heartRate') {
          importedData.heartRate = mockImportedValues.heartRate;
        } else if (field.id === 'cholesterol') {
          importedData.cholesterol = mockImportedValues.cholesterol;
        }
      }
    });

    onImportComplete?.(importedData);
    onClose();
  }, [dataFields, onClose, onImportComplete]);

  /**
   * Render data selection view
   */
  const renderDataSelection = () => (
    <Box
      sx={{
        bgcolor: theme.customColors?.background?.mint || '#F4FBF8',
        borderRadius: 3,
        p: 3,
        minWidth: 404,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.primary.main,
          fontWeight: 500,
          fontSize: '12px',
          mb: 2,
        }}
      >
        Select data to import from {selectedApp?.name || 'health app'}:
      </Typography>

      {/* Data Fields List */}
      <List sx={{ py: 0, mb: 2 }}>
        {dataFields.map((field) => (
          <ListItem
            key={field.id}
            dense
            sx={{
              py: 0.5,
              px: 2,
              minHeight: 40,
              bgcolor: theme.customColors?.background?.mint || '#F4FBF8',
              '&:hover': {
                bgcolor: 'rgba(0, 107, 96, 0.04)',
              },
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

      <Divider sx={{ borderColor: theme.palette.primary.main, mb: 2 }} />

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
            bgcolor: theme.palette.primary.main,
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
            },
          }}
        >
          Start
        </Button>
        <Button
          variant="outlined"
          onClick={handleCancel}
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

  /**
   * Render import progress view
   */
  const renderImportProgress = () => (
    <Box
      sx={{
        bgcolor: theme.customColors?.background?.mint || '#F4FBF8',
        borderRadius: 3,
        p: 3,
        minWidth: 404,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.primary.main,
          fontWeight: 500,
          fontSize: '12px',
          mb: 2,
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
          mb: 2,
          bgcolor: 'rgba(0, 107, 96, 0.12)',
          '& .MuiLinearProgress-bar': {
            borderRadius: 2,
            bgcolor: theme.palette.primary.main,
          },
        }}
      />

      {/* Data Fields List (Read-only) */}
      <List sx={{ py: 0, mb: 2 }}>
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

      <Divider sx={{ borderColor: theme.palette.primary.main, mb: 2 }} />

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

  /**
   * Render success message
   */
  const renderSuccessMessage = () => (
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
  );

  /**
   * Render content based on status
   */
  const renderContent = () => {
    switch (status) {
      case 'importing':
        return renderImportProgress();
      case 'success':
        return renderSuccessMessage();
      case 'selecting-data':
      default:
        return renderDataSelection();
    }
  };

  return (
    <Modal
      open={open}
      onClose={status === 'success' ? handleSuccessClose : handleCancel}
      closeAfterTransition
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(4px)',
        },
        ...sx,
      }}
    >
      <Box>{renderContent()}</Box>
    </Modal>
  );
};

export default VitalsDataImportModal;
