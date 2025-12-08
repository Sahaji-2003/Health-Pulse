import React from 'react';
import {
  Box,
  Drawer,
  Typography,
  Checkbox,
  FormControlLabel,
  Divider,
  FormGroup,
  Switch,
  useTheme,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { WidgetConfig } from '@/services/api/user.api';
import { WIDGET_METADATA } from '@/hooks/useDashboardLayout';

export interface WidgetSelectorSidebarProps {
  open: boolean;
  onClose: () => void;
  widgets: WidgetConfig[];
  onToggleWidget: (widgetId: string) => void;
  autoRearrange?: boolean;
  onAutoRearrangeChange?: (enabled: boolean) => void;
}

// Group widgets by category for display
const WIDGET_CATEGORIES = {
  profile: { label: 'Profile', order: 1 },
  vitals: { label: 'Vitals', order: 2 },
  fitness: { label: 'Fitness', order: 3 },
  recommendations: { label: 'Recommendations', order: 4 },
  social: { label: 'Social', order: 5 },
} as const;

export const WidgetSelectorSidebar: React.FC<WidgetSelectorSidebarProps> = ({
  open,
  onClose,
  widgets,
  onToggleWidget,
  autoRearrange = false,
  onAutoRearrangeChange,
}) => {
  const theme = useTheme();

  // Group widgets by category
  const groupedWidgets = React.useMemo(() => {
    const groups: Record<string, WidgetConfig[]> = {};
    
    widgets.forEach((widget) => {
      const category = widget.category || 'other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(widget);
    });

    // Sort by category order
    return Object.entries(groups).sort(([a], [b]) => {
      const orderA = WIDGET_CATEGORIES[a as keyof typeof WIDGET_CATEGORIES]?.order || 99;
      const orderB = WIDGET_CATEGORIES[b as keyof typeof WIDGET_CATEGORIES]?.order || 99;
      return orderA - orderB;
    });
  }, [widgets]);

  const drawerWidth = 320;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      variant="persistent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderLeft: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          top: 0,
          height: '100%',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: 18,
            color: theme.palette.text.primary,
          }}
        >
          Customize Widgets
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Auto-Rearrange Option */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Auto-Rearrange
        </Typography>
        <Switch
          checked={autoRearrange}
          onChange={(e) => onAutoRearrangeChange?.(e.target.checked)}
          size="medium"
          sx={{
            width: 52,
            height: 28,
            padding: 0,
            '& .MuiSwitch-switchBase': {
              padding: '3px',
              '&.Mui-checked': {
                transform: 'translateX(24px)',
                '& + .MuiSwitch-track': {
                  backgroundColor: theme.palette.primary.main,
                  opacity: 1,
                },
              },
            },
            '& .MuiSwitch-thumb': {
              width: 22,
              height: 22,
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            },
            '& .MuiSwitch-track': {
              borderRadius: 14,
              backgroundColor: theme.palette.primary.main,
              opacity: 1,
            },
          }}
        />
      </Box>

      {/* Widget List */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          py: 1,
        }}
      >
        {groupedWidgets.map(([category, categoryWidgets], index) => (
          <React.Fragment key={category}>
            {index > 0 && (
              <Divider sx={{ my: 1.5, mx: 2 }} />
            )}
            
            {/* Category Header */}
            <Box sx={{ px: 2, py: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {WIDGET_CATEGORIES[category as keyof typeof WIDGET_CATEGORIES]?.label || category}
              </Typography>
            </Box>

            {/* Widget Checkboxes */}
            <FormGroup sx={{ px: 2 }}>
              {categoryWidgets.map((widget) => {
                const metadata = WIDGET_METADATA[widget.type];
                return (
                  <FormControlLabel
                    key={widget.id}
                    control={
                      <Checkbox
                        checked={widget.visible}
                        onChange={() => onToggleWidget(widget.id)}
                        size="small"
                        sx={{
                          color: theme.palette.divider,
                          '&.Mui-checked': {
                            color: theme.palette.primary.main,
                          },
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: widget.visible
                              ? theme.palette.text.primary
                              : theme.palette.text.secondary,
                          }}
                        >
                          {metadata?.name || widget.type}
                        </Typography>
                        {metadata?.description && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: theme.palette.text.secondary,
                              display: 'block',
                              mt: -0.5,
                            }}
                          >
                            {metadata.description}
                          </Typography>
                        )}
                      </Box>
                    }
                    sx={{
                      py: 0.75,
                      mx: 0,
                      alignItems: 'flex-start',
                      '& .MuiFormControlLabel-label': {
                        ml: 0.5,
                      },
                    }}
                  />
                );
              })}
            </FormGroup>
          </React.Fragment>
        ))}
      </Box>

      {/* Footer Hint */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.customColors?.background?.mint || '#F4FBF8',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Toggle widgets to show or hide them on your dashboard. Drag widgets to reposition them.
        </Typography>
      </Box>
    </Drawer>
  );
};

export default WidgetSelectorSidebar;
