import React, { useState } from 'react';
import {
  Box,
  Drawer,
  Avatar,
  Fab,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DirectionsRunOutlinedIcon from '@mui/icons-material/DirectionsRunOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import MoveToInboxOutlinedIcon from '@mui/icons-material/MoveToInboxOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import type { SidebarProps } from './Sidebar.types';

// Get API base URL for avatar images
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper to build avatar URL
const getAvatarUrl = (avatarPath: string | undefined): string | undefined => {
  if (!avatarPath) return undefined;
  if (avatarPath.startsWith('http') || avatarPath.startsWith('data:')) return avatarPath;
  // Remove /api suffix for static files
  const staticBaseUrl = API_BASE_URL.replace(/\/api$/, '');
  return `${staticBaseUrl}${avatarPath}`;
};

const SIDEBAR_WIDTH = 96;

// Navigation items configuration
const navigationItems = [
  { label: 'Fitness\nActivity', path: '/fitness', icon: DirectionsRunOutlinedIcon },
  { label: 'Vitals', path: '/vitals', icon: FavoriteBorderOutlinedIcon },
  { label: 'Healthcare\nSystems', path: '/healthcare-systems', icon: MoveToInboxOutlinedIcon },
  { label: 'Library', path: '/resources', icon: FolderOutlinedIcon },
  { label: 'Settings', path: '/profile', icon: SettingsOutlinedIcon },
];

export const Sidebar: React.FC<SidebarProps> = ({
  open = false,
  onClose,
  width = SIDEBAR_WIDTH,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isLoggingOut } = useAuth();
  const { profile } = useProfile();

  // Menu anchor state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleAvatarHover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/profile');
    if (isMobile && onClose) onClose();
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    logout();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile && onClose) onClose();
  };

  const sidebarContent = (
    <Stack
      sx={{
        height: '100%',
        width: width,
        bgcolor: theme.customColors.background.mint,
        py: 3,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Top Section: Home FAB + Nav Items */}
      <Stack spacing={3} alignItems="center">
        {/* Home FAB */}
        <Fab
          size="medium"
          aria-label="dashboard"
          onClick={() => handleNavigation('/dashboard')}
          sx={{
            bgcolor: theme.customColors.accent.mint,
            color: theme.customColors.accent.dark,
            width: theme.customSpacing['2xl'],
            height: theme.customSpacing['2xl'],
            borderRadius: theme.customSizes.borderRadius.md,
            boxShadow: 'none',
            '&:hover': { bgcolor: theme.customColors.accent.mintHover },
          }}
        >
          <HomeOutlinedIcon />
        </Fab>

        {/* Navigation Items */}
        <Stack component="nav" spacing={1.5} alignItems="center">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Box
                key={item.path + item.label}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  py: 0.5,
                  px: 1,
                  cursor: 'pointer',
                  borderRadius: theme.customSizes.borderRadius.sm,
                  transition: 'background-color 0.2s',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: theme.customSpacing['2xl'],
                    height: theme.customSpacing.lg + 4,
                    borderRadius: theme.customSizes.borderRadius.md,
                    bgcolor: isActive ? theme.customColors.accent.mint : 'transparent',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <Icon
                    sx={{
                      fontSize: theme.customSizes.icon.sm,
                      color: isActive ? theme.palette.text.primary : 'text.secondary',
                    }}
                  />
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: theme.typography.overline.fontSize,
                    fontWeight: 500,
                    lineHeight: 1.2,
                    color: isActive ? 'text.primary' : 'text.secondary',
                    textAlign: 'center',
                    mt: 0.5,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </Stack>

      {/* Bottom Section: User Avatar with Dropdown */}
      <Box
        onMouseEnter={!isMobile ? handleAvatarHover : undefined}
        onMouseLeave={!isMobile ? handleMenuClose : undefined}
        onClick={isMobile ? handleAvatarHover : undefined}
        sx={{ position: 'relative' }}
      >
        <Avatar
          src={getAvatarUrl(profile?.avatarUrl)}
          sx={{
            width: 44,
            height: 44,
            bgcolor: '#E8DEF8',
            color: '#65558F',
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': { 
              bgcolor: '#D0BCFF',
            },
          }}
        >
          {!profile?.avatarUrl && <PersonOutlineRoundedIcon sx={{ fontSize: 26 }} />}
        </Avatar>

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          slotProps={{
            paper: {
              sx: {
                mt: -1,
                ml: 1,
                minWidth: 160,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              },
              onMouseEnter: !isMobile ? () => setAnchorEl(anchorEl) : undefined,
              onMouseLeave: !isMobile ? handleMenuClose : undefined,
            },
          }}
          MenuListProps={{
            onMouseEnter: !isMobile ? () => setAnchorEl(anchorEl) : undefined,
            onMouseLeave: !isMobile ? handleMenuClose : undefined,
          }}
        >
          <MenuItem 
            onClick={handleProfileClick} 
            sx={{ 
              py: 1.5,
              '&:hover': { bgcolor: 'transparent' },
              '&.Mui-focusVisible': { bgcolor: 'transparent' },
            }}
          >
            <ListItemIcon>
              <AccountCircleRoundedIcon fontSize="small" sx={{ color: 'primary.main' }} />
            </ListItemIcon>
            <ListItemText primary="Profile" sx={{ '& .MuiTypography-root': { color: 'primary.main' } }} />
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem 
            onClick={handleLogoutClick} 
            disabled={isLoggingOut} 
            sx={{ 
              py: 1.5,
              '&:hover': { bgcolor: 'transparent' },
              '&.Mui-focusVisible': { bgcolor: 'transparent' },
            }}
          >
            <ListItemIcon>
              <LogoutRoundedIcon fontSize="small" sx={{ color: 'error.main' }} />
            </ListItemIcon>
            <ListItemText 
              primary={isLoggingOut ? 'Logging out...' : 'Logout'} 
              sx={{ '& .MuiTypography-root': { color: 'error.main' } }}
            />
          </MenuItem>
        </Menu>
      </Box>
    </Stack>
  );

  const drawerPaperSx = {
    width: width,
    boxSizing: 'border-box',
    border: 'none',
    bgcolor: theme.customColors.background.mint,
  };

  // Mobile: Temporary Drawer
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        anchor="left"
        open={open}
        onClose={onClose}
        slotProps={{ root: { keepMounted: true } }}
        sx={{ '& .MuiDrawer-paper': drawerPaperSx }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  // Desktop: Permanent Drawer
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: width,
        flexShrink: 0,
        '& .MuiDrawer-paper': drawerPaperSx,
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};

export default Sidebar;
