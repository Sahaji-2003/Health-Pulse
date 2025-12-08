import React from 'react';
import { Snackbar, IconButton, Box, Typography, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { NoMatchesFoundProps } from './NoMatchesFound.types';

/**
 * NoMatchesFound Component
 *
 * Displays a snackbar notification when search returns no matches.
 * Uses Material Design 3 inverse surface colors.
 */
export const NoMatchesFound: React.FC<NoMatchesFoundProps> = ({
  open,
  onClose,
  message = 'No matches found.',
  sx,
}) => {
  const theme = useTheme();

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose?.();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{
        '& .MuiSnackbarContent-root': {
          bgcolor: theme.customColors?.snackbar?.background || '#322F35',
          color: theme.customColors?.snackbar?.text || '#F5EFF7',
          borderRadius: 2,
          minWidth: 200,
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)',
        },
        ...sx,
      }}
      message={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'inherit' }}>
            {message}
          </Typography>
        </Box>
      }
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  );
};

export default NoMatchesFound;
