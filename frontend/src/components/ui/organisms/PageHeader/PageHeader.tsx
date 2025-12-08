import React from 'react';
import { Box, Typography, IconButton, Badge, Stack, useTheme } from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import type { PageHeaderProps } from './PageHeader.types';

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  showNotification = false,
  notificationCount = 0,
  onNotificationClick,
  showMenuButton = false,
  onMenuClick,
}) => {
  const theme = useTheme();

  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pt: { xs: 2, md: 3 },
        pb: { xs: 1.5, md: 2 },
      }}
    >
      {/* Left Section: Menu Button (mobile), Title and Subtitle */}
      <Stack direction="row" spacing={{ xs: 1, md: 1.5 }} alignItems="center">
        {showMenuButton && (
          <IconButton
            aria-label="open menu"
            onClick={onMenuClick}
            edge="start"
            sx={{
              color: 'text.primary',
              ml: -1,
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontWeight: 600,
            fontSize: { xs: theme.typography.h6.fontSize, md: theme.typography.h4.fontSize },
            lineHeight: 1.3,
            color: 'primary.main',
          }}
        >
          {title}
        </Typography>
        {subtitle}
      </Stack>

      {/* Right Section: Actions and Notification */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mr: { xs: 1, md: 2 } }}>
        {actions}
        {showNotification && (
          <IconButton
            aria-label={`${notificationCount} notifications`}
            onClick={(event) => onNotificationClick?.(event)}
            sx={{
              width: theme.customSpacing['2xl'],
              height: theme.customSpacing['2xl'],
              color: 'text.secondary',
            }}
          >
            <Badge
              badgeContent={notificationCount}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: theme.typography.overline.fontSize,
                  minWidth: 16,
                  height: 16,
                },
              }}
            >
              <NotificationsOutlinedIcon />
            </Badge>
          </IconButton>
        )}
      </Stack>
    </Box>
  );
};

export default PageHeader;
