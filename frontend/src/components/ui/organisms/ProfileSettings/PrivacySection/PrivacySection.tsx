import React, { useState } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  useTheme,
} from '@mui/material';
import type { PrivacySectionProps, HealthcareProvider } from './PrivacySection.types';

// Default healthcare providers
const defaultProviders: HealthcareProvider[] = [
  { id: 'practo', name: 'Practo', enabled: true },
  { id: 'pharmeasy', name: 'PharmEasy', enabled: true },
  { id: 'mfine', name: 'mFine', enabled: false },
  { id: 'tata1mg', name: 'Tata1Mg', enabled: true },
  { id: 'apollo24x7', name: 'Apollo24x7', enabled: true },
];

/**
 * PrivacySection Organism Component
 *
 * Manages privacy settings for sharing health data with healthcare providers.
 * Shows a card with a list of healthcare providers and checkboxes to enable/disable sharing.
 * Uses theme values for consistent styling.
 *
 * @example
 * <PrivacySection onSave={handleSave} />
 */
export const PrivacySection: React.FC<PrivacySectionProps> = ({
  title = 'Share Health Data',
  providers: controlledProviders,
  onSave,
  isSaving = false,
  children,
}) => {
  const theme = useTheme();
  const [providers, setProviders] = useState<HealthcareProvider[]>(
    controlledProviders ?? defaultProviders
  );

  const handleToggle = (providerId: string) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleSave = () => {
    if (onSave) {
      onSave(providers);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, transform: 'scale(0.9)', transformOrigin: 'top left' }}>
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          borderRadius: theme.customSizes.borderRadius.lg / 8,
          px: 2,
          py: 2.5,
          maxWidth: 340,
          width: '100%',
        }}
      >
        {/* Section Title */}
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            pb: 2.5,
            mb: 2.5,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.primary.dark,
              fontWeight: 500,
              lineHeight: 1.3,
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Healthcare Providers List */}
        <List sx={{ py: 0 }}>
          {providers.map((provider) => (
            <ListItem
              key={provider.id}
              dense
              sx={{
                py: 0.5,
                px: 0,
              }}
            >
              <ListItemText
                primary={provider.name}
                primaryTypographyProps={{
                  variant: 'body2',
                  fontWeight: 400,
                  color: 'text.primary',
                }}
              />
              <ListItemIcon sx={{ minWidth: 'auto' }}>
                <Checkbox
                  edge="end"
                  checked={provider.enabled}
                  onChange={() => handleToggle(provider.id)}
                  size="small"
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

        {/* Save Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleSave}
          disabled={isSaving}
          sx={{
            mt: 2.5,
            borderRadius: theme.customSizes.borderRadius.lg / 8,
            textTransform: 'none',
            py: 1,
            fontWeight: 500,
          }}
        >
          {isSaving ? 'Saving...' : 'Save Privacy Settings'}
        </Button>
      </Paper>

      {/* Custom content if provided */}
      {children && <Box>{children}</Box>}
    </Box>
  );
};

export default PrivacySection;
