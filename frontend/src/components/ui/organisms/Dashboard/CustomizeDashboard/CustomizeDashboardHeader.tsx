import React from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  useTheme,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export interface CustomizeDashboardHeaderProps {
  onBack: () => void;
  onSave: () => void;
  onReset: () => void;
  lastSavedText?: string;
  isSaving?: boolean;
  isResetting?: boolean;
  hasUnsavedChanges?: boolean;
}

export const CustomizeDashboardHeader: React.FC<CustomizeDashboardHeaderProps> = ({
  onBack,
  onSave,
  onReset,
  lastSavedText,
  isSaving = false,
  isResetting = false,
  hasUnsavedChanges = false,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 2,
        px: 3,
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        position: 'sticky',
        top: 0,
        zIndex: theme.zIndex.appBar,
      }}
    >
      {/* Left Section: Back Button + Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <IconButton
          onClick={onBack}
          size="small"
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            width: 36,
            height: 36,
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: 18,
              color: theme.palette.text.primary,
              lineHeight: 1.2,
            }}
          >
            Customize Dashboard
          </Typography>
          {lastSavedText && (
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                display: 'block',
              }}
            >
              {lastSavedText}
              {hasUnsavedChanges && (
                <Box
                  component="span"
                  sx={{
                    color: theme.palette.warning.main,
                    ml: 1,
                    fontWeight: 500,
                  }}
                >
                  • Unsaved changes
                </Box>
              )}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Right Section: Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Button
          variant="outlined"
          onClick={onReset}
          disabled={isSaving || isResetting}
          sx={{
            minWidth: 100,
            borderColor: theme.palette.divider,
            color: theme.palette.text.secondary,
            '&:hover': {
              borderColor: theme.palette.primary.main,
              backgroundColor: 'transparent',
            },
          }}
        >
          {isResetting ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            'Reset'
          )}
        </Button>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={isSaving || isResetting || !hasUnsavedChanges}
          sx={{
            minWidth: 100,
            backgroundColor: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
            '&.Mui-disabled': {
              backgroundColor: theme.palette.action.disabledBackground,
            },
          }}
        >
          {isSaving ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            'Save'
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default CustomizeDashboardHeader;
