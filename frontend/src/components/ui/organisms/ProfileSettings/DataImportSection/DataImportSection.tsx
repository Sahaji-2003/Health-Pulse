import React, { useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  Checkbox,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Modal,
  useTheme,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import type {
  DataImportSectionProps,
  HealthApp,
  DataField,
  ImportStatus,
} from './DataImportSection.types';

// Import health app icons
import googleFitIcon from '../../../../../assets/bba9d9660ee14a3c8a19011d84b7792ec2cda7b6.png';
import appleHealthIcon from '../../../../../assets/7362ac0d0381d374ff4bd0c2cae12827e797f8c7.png';

// Default available health apps
const defaultHealthApps: HealthApp[] = [
  { id: 'google-fit', name: 'Google Fit', icon: googleFitIcon },
  { id: 'apple-health', name: 'Apple Health', icon: appleHealthIcon },
];

// Default data fields that can be imported
const defaultDataFields: DataField[] = [
  { id: 'age', label: 'Age', selected: true },
  { id: 'height', label: 'Height', selected: true },
  { id: 'weight', label: 'Weight', selected: true },
  { id: 'heart-rate', label: 'Heart rate', selected: true },
  { id: 'activity-level', label: 'Activity level', selected: true },
  { id: 'sleep-patterns', label: 'Sleep patterns', selected: true },
];

/**
 * DataImportSection Organism Component
 *
 * Manages health data import from connected health apps.
 * Supports multiple states: app selection, data field selection,
 * import progress, and success confirmation.
 *
 * @example
 * <DataImportSection
 *   status="selecting-app"
 *   onAppSelect={handleAppSelect}
 *   onImportStart={handleImport}
 * />
 */
export const DataImportSection: React.FC<DataImportSectionProps> = ({
  status: controlledStatus,
  availableApps = defaultHealthApps,
  selectedApp: controlledSelectedApp,
  dataFields: controlledDataFields,
  importProgress: controlledProgress,
  onAppSelect,
  onDataFieldToggle,
  onImportStart,
  onConfirmDataSelection,
  onSuccessClose,
  // errorMessage is available for future error handling
  errorMessage: _errorMessage,
}) => {
  const theme = useTheme();
  // Internal state for uncontrolled usage
  const [internalStatus, setInternalStatus] = useState<ImportStatus>('idle');
  const [internalSelectedApp, setInternalSelectedApp] = useState<HealthApp | null>(null);
  const [internalDataFields, setInternalDataFields] = useState<DataField[]>(defaultDataFields);
  const [internalProgress, setInternalProgress] = useState(0);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

  // Use controlled or internal state
  const status = controlledStatus ?? internalStatus;
  const selectedApp = controlledSelectedApp ?? internalSelectedApp;
  const dataFields = controlledDataFields ?? internalDataFields;
  const importProgress = controlledProgress ?? internalProgress;

  // Handle app selection (just select, don't navigate)
  const handleAppSelect = (app: HealthApp) => {
    if (onAppSelect) {
      onAppSelect(app);
    } else {
      // Toggle selection - if same app clicked, deselect; otherwise select
      if (internalSelectedApp?.id === app.id) {
        setInternalSelectedApp(null);
      } else {
        setInternalSelectedApp(app);
      }
    }
  };

  // Handle data field toggle
  const handleDataFieldToggle = (fieldId: string) => {
    if (onDataFieldToggle) {
      onDataFieldToggle(fieldId);
    } else {
      setInternalDataFields((prev) =>
        prev.map((field) =>
          field.id === fieldId ? { ...field, selected: !field.selected } : field
        )
      );
    }
  };

  // Handle import button click - navigate to data selection
  const handleImportClick = () => {
    if (onImportStart) {
      onImportStart();
    } else {
      // Navigate to data selection step
      setInternalStatus('selecting-data');
    }
  };

  // Handle confirm data selection
  const handleConfirmClick = () => {
    if (onConfirmDataSelection) {
      onConfirmDataSelection();
    } else {
      // Internal simulation of import process
      setInternalStatus('importing');
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setInternalProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setInternalStatus('success');
          setShowSuccessSnackbar(true);
        }
      }, 300);
    }
  };

  // Handle success snackbar close
  const handleSuccessClose = () => {
    if (onSuccessClose) {
      onSuccessClose();
    } else {
      setShowSuccessSnackbar(false);
      setInternalStatus('idle');
      setInternalSelectedApp(null);
      setInternalProgress(0);
    }
  };

  // Render the Connect Health App section (default state)
  const renderAppSelection = () => (
    <>
      <Typography
        variant="h6"
        sx={{
          color: 'primary.main',
          fontWeight: 400,
          fontSize: theme.typography.h5.fontSize,
          lineHeight: theme.customSpacing['3xl'] / 2 + 'px',
        }}
      >
        Connect Health App/Device
      </Typography>

      <Divider sx={{ borderColor: 'primary.main', my: 2 }} />

      <Typography
        variant="body2"
        sx={{
          color: 'primary.main',
          fontWeight: 500,
          fontSize: theme.typography.caption.fontSize,
          mb: 2,
        }}
      >
        Selects and connect preferred app
      </Typography>

      {/* Health App Icons */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        {availableApps.map((app) => (
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

      <Divider sx={{ borderColor: 'primary.main', mb: 2.5 }} />

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
          fontSize: theme.typography.body2.fontSize,
          fontWeight: 500,
          bgcolor: selectedApp ? 'primary.main' : 'action.disabledBackground',
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
    </>
  );

  // Render the Data Selection section
  const renderDataSelection = () => (
    <>
      <Typography
        variant="h6"
        sx={{
          color: 'primary.main',
          fontWeight: 400,
          fontSize: theme.typography.h5.fontSize,
          lineHeight: theme.customSpacing['3xl'] / 2 + 'px',
        }}
      >
        Importing Health Data
      </Typography>

      <Divider sx={{ borderColor: 'primary.main', my: 2 }} />

      {/* Data Fields List */}
      <List sx={{ py: 0, maxWidth: 404 }}>
        {dataFields.map((field) => (
          <ListItem
            key={field.id}
            dense
            sx={{
              py: 0.5,
              px: 0,
            }}
          >
            <ListItemText
              primary={field.label}
              primaryTypographyProps={{
                fontSize: theme.typography.body1.fontSize,
                fontWeight: 400,
                color: 'text.primary',
              }}
            />
            <ListItemIcon sx={{ minWidth: 'auto' }}>
              <Checkbox
                edge="end"
                checked={field.selected}
                onChange={() => handleDataFieldToggle(field.id)}
                sx={{
                  color: 'primary.main',
                  '&.Mui-checked': {
                    color: 'primary.main',
                  },
                }}
              />
            </ListItemIcon>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: 'primary.main', mt: 2, mb: 2.5 }} />

      {/* Confirm Button */}
      <Button
        variant="contained"
        onClick={handleConfirmClick}
        sx={{
          borderRadius: 1.5,
          textTransform: 'none',
          px: 2,
          py: 1.25,
          fontSize: theme.typography.body2.fontSize,
          fontWeight: 500,
        }}
      >
        Confirm
      </Button>
    </>
  );

  // Render the Import Progress section
  const renderImportProgress = () => (
    <>
      <Typography
        variant="h6"
        sx={{
          color: 'primary.main',
          fontWeight: 400,
          fontSize: theme.typography.h5.fontSize,
          lineHeight: theme.customSpacing['3xl'] / 2 + 'px',
        }}
      >
        Importing Health Data
      </Typography>

      <Divider sx={{ borderColor: 'primary.main', my: 2 }} />

      <Typography
        variant="body2"
        sx={{
          color: 'primary.main',
          fontWeight: 500,
          fontSize: theme.typography.caption.fontSize,
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
          height: 8,
          borderRadius: 4,
          maxWidth: 404,
          mb: 2,
          bgcolor: 'secondary.light',
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            bgcolor: 'primary.main',
          },
        }}
      />

      {/* Data Fields List (Read-only) */}
      <List sx={{ py: 0, maxWidth: 404 }}>
        {dataFields
          .filter((field) => field.selected)
          .map((field) => (
            <ListItem
              key={field.id}
              dense
              sx={{
                py: 0.5,
                px: 0,
              }}
            >
              <ListItemText
                primary={field.label}
                primaryTypographyProps={{
                  fontSize: theme.typography.body1.fontSize,
                  fontWeight: 400,
                  color: 'text.primary',
                }}
              />
              <ListItemIcon sx={{ minWidth: 'auto' }}>
                <Checkbox
                  edge="end"
                  checked={true}
                  disabled
                  sx={{
                    color: 'primary.main',
                    '&.Mui-checked': {
                      color: 'primary.main',
                    },
                    '&.Mui-disabled': {
                      color: 'primary.main',
                    },
                  }}
                />
              </ListItemIcon>
            </ListItem>
          ))}
      </List>

      <Divider sx={{ borderColor: 'primary.main', mt: 2, mb: 2.5 }} />

      {/* Disabled Confirm Button during import */}
      <Button
        variant="contained"
        disabled
        sx={{
          borderRadius: 1.5,
          textTransform: 'none',
          px: 2,
          py: 1.25,
          fontSize: theme.typography.body2.fontSize,
          fontWeight: 500,
          bgcolor: 'rgba(23, 29, 27, 0.1)',
          color: 'text.disabled',
          opacity: 0.38,
          '&:disabled': {
            bgcolor: 'rgba(23, 29, 27, 0.1)',
            color: 'text.disabled',
          },
        }}
      >
        Confirm
      </Button>
    </>
  );

  // Render content based on status
  const renderContent = () => {
    switch (status) {
      case 'selecting-data':
        return renderDataSelection();
      case 'importing':
        return renderImportProgress();
      case 'success':
        return renderImportProgress();
      case 'idle':
      case 'selecting-app':
      default:
        return renderAppSelection();
    }
  };

  return (
    <Box>
      {renderContent()}

      {/* Success Modal with Blur Backdrop */}
      <Modal
        open={showSuccessSnackbar || status === 'success'}
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
            bgcolor: theme.customColors.snackbar.background,
            color: theme.customColors.snackbar.text,
            borderRadius: theme.customSizes.borderRadius.xs,
            px: 2,
            py: 1.5,
            minWidth: 320,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
            zIndex: 1,
          }}
        >
          <CheckIcon sx={{ color: theme.customColors.snackbar.text, fontSize: theme.customSizes.icon.sm }} />
          <Typography
            sx={{
              flex: 1,
              fontSize: theme.typography.body2.fontSize,
              fontWeight: 400,
              color: theme.customColors.snackbar.text,
            }}
          >
            Successfully imported data from the apps.
          </Typography>
          <CloseIcon
            onClick={handleSuccessClose}
            sx={{
              cursor: 'pointer',
              fontSize: theme.customSizes.icon.sm,
              color: theme.customColors.snackbar.text,
              '&:hover': {
                opacity: 0.8,
              },
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default DataImportSection;
