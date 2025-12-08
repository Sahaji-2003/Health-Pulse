import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  Popover,
  useTheme,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import type { NotificationPanelProps, NotificationCategory, NotificationItem } from './NotificationPanel.types';

// Figma design colors
const COLORS = {
  surface: '#F4FBF8',
  onSurface: '#171D1B',
  primary: '#006B60',
  onSecondaryContainer: '#334B47',
  surfaceContainerHigh: '#E3EAE7',
  highlightedBackground: 'rgba(86, 197, 149, 0.5)',
  cautionPrimary: '#BF8302',
  outlineVariant: '#CAC4D0',
  secondaryContainer: '#E8DEF8',
  onSurfaceVariant: '#49454F',
};

const CATEGORIES: NotificationCategory[] = ['All', 'Critical', 'Activities', 'Promotions'];

/**
 * NotificationPanel Organism
 *
 * Dropdown panel displaying notifications with filter chips
 * and action buttons per notification item.
 */
export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  anchorEl,
  open,
  onClose,
  notifications,
  selectedCategory = 'All',
  onCategoryChange,
  onNotificationAction,
  isLoading = false,
  isError = false,
  sx,
}) => {
  const theme = useTheme();

  // Filter notifications based on selected category
  const filteredNotifications = React.useMemo(() => {
    if (selectedCategory === 'All') return notifications;
    
    return notifications.filter((notification) => {
      switch (selectedCategory) {
        case 'Critical':
          return notification.type === 'health_alert';
        case 'Activities':
          return notification.type === 'activity';
        case 'Promotions':
          return notification.type === 'promotion';
        default:
          return true;
      }
    });
  }, [notifications, selectedCategory]);

  const FilterChip: React.FC<{
    label: NotificationCategory;
    selected: boolean;
    onClick: () => void;
  }> = ({ label, selected, onClick }) => (
    <Chip
      label={label}
      icon={selected ? <CheckIcon sx={{ fontSize: 18 }} /> : undefined}
      variant={selected ? 'filled' : 'outlined'}
      size="small"
      onClick={onClick}
      sx={{
        borderRadius: 2,
        height: 32,
        fontSize: 14,
        fontWeight: 500,
        bgcolor: selected ? COLORS.secondaryContainer : 'transparent',
        borderColor: selected ? 'transparent' : COLORS.outlineVariant,
        color: selected ? COLORS.onSurfaceVariant : COLORS.onSurfaceVariant,
        '& .MuiChip-icon': {
          color: 'inherit',
          ml: 0.5,
          fontSize: 18,
        },
        '&:hover': {
          bgcolor: selected ? COLORS.secondaryContainer : theme.palette.action.hover,
        },
      }}
    />
  );

  const NotificationCard: React.FC<{ notification: NotificationItem }> = ({ notification }) => {
    const isHighlighted = notification.isHighlighted || !notification.isRead;
    
    return (
      <Box
        sx={{
          bgcolor: isHighlighted ? COLORS.highlightedBackground : COLORS.surfaceContainerHigh,
          borderRadius: '20px',
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
        }}
      >
        {/* Icon and Content */}
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
          {/* Alert Icon */}
          <Box
            sx={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ReportProblemOutlinedIcon
              sx={{
                fontSize: 28,
                color: COLORS.cautionPrimary,
              }}
            />
          </Box>

          {/* Text Content */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 500,
                lineHeight: '24px',
                color: COLORS.cautionPrimary,
              }}
            >
              {notification.title}
            </Typography>
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 400,
                lineHeight: '24px',
                color: COLORS.onSecondaryContainer,
              }}
            >
              {notification.message}
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        {(notification.primaryAction || notification.secondaryAction) && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1,
              mt: 1,
            }}
          >
            {notification.secondaryAction && (
              <Button
                variant="text"
                onClick={(e) => {
                  e.stopPropagation();
                  notification.secondaryAction?.onClick();
                  onNotificationAction?.(notification.id, 'secondary');
                }}
                sx={{
                  color: COLORS.primary,
                  fontSize: 14,
                  fontWeight: 500,
                  textTransform: 'none',
                  px: 2,
                  py: 1,
                  borderRadius: '100px',
                  minWidth: 'auto',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'rgba(0, 107, 96, 0.08)',
                  },
                }}
              >
                {notification.secondaryAction.label}
              </Button>
            )}
            {notification.primaryAction && (
              <Button
                variant="text"
                onClick={(e) => {
                  e.stopPropagation();
                  notification.primaryAction?.onClick();
                  onNotificationAction?.(notification.id, 'primary');
                }}
                sx={{
                  color: COLORS.primary,
                  fontSize: 14,
                  fontWeight: 500,
                  textTransform: 'none',
                  px: 2,
                  py: 1,
                  borderRadius: '100px',
                  minWidth: 'auto',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'rgba(0, 107, 96, 0.08)',
                  },
                }}
              >
                {notification.primaryAction.label}
              </Button>
            )}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      slotProps={{
        paper: {
          elevation: 8,
          sx: {
            width: { xs: 340, sm: 400 },
            maxHeight: 520,
            bgcolor: COLORS.surface,
            borderRadius: '20px',
            overflow: 'hidden',
            mt: 1,
            boxShadow: '0px 8px 12px 6px rgba(0,0,0,0.15), 0px 4px 4px 0px rgba(0,0,0,0.3)',
            ...sx,
          },
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          p: 2,
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {/* App Bar - Back Button & Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                width: 40,
                height: 40,
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ArrowBackIcon sx={{ color: COLORS.onSurface, fontSize: 22 }} />
            </IconButton>
            <Typography
              variant="h6"
              sx={{
                fontSize: 22,
                fontWeight: 400,
                lineHeight: '28px',
                color: COLORS.onSurface,
              }}
            >
              Notifications
            </Typography>
          </Box>

          {/* Filter Chips */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', px: 0.5 }}>
            {CATEGORIES.map((category) => (
              <FilterChip
                key={category}
                label={category}
                selected={selectedCategory === category}
                onClick={() => onCategoryChange?.(category)}
              />
            ))}
          </Box>
        </Box>

        {/* Notifications List */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            overflow: 'auto',
            maxHeight: 360,
            px: 0.5,
            pb: 1,
          }}
        >
          {isLoading ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 6,
                gap: 2,
              }}
            >
              <CircularProgress size={32} sx={{ color: COLORS.primary }} />
              <Typography
                sx={{
                  color: COLORS.onSurfaceVariant,
                  fontSize: 14,
                }}
              >
                Loading notifications...
              </Typography>
            </Box>
          ) : isError ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 6,
                gap: 1.5,
              }}
            >
              <ErrorOutlineIcon sx={{ fontSize: 40, color: COLORS.cautionPrimary }} />
              <Typography
                sx={{
                  color: COLORS.cautionPrimary,
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                Failed to fetch notifications
              </Typography>
              <Typography
                sx={{
                  color: COLORS.onSurfaceVariant,
                  fontSize: 12,
                  textAlign: 'center',
                }}
              >
                Please try again later
              </Typography>
            </Box>
          ) : filteredNotifications.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 6,
                gap: 1.5,
              }}
            >
              <NotificationsOffIcon sx={{ fontSize: 40, color: COLORS.onSurfaceVariant }} />
              <Typography
                sx={{
                  color: COLORS.onSurfaceVariant,
                  fontSize: 14,
                }}
              >
                No notifications found
              </Typography>
            </Box>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))
          )}
        </Box>
      </Box>
    </Popover>
  );
};

export default NotificationPanel;
