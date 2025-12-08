import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { NavLink } from 'react-router-dom';
import type { NavigationItemProps } from './NavigationItem.types';

export const NavigationItem: React.FC<NavigationItemProps> = ({
  label,
  icon: Icon,
  to,
  isActive = false,
  onClick,
  showLabel = true,
}) => {
  const theme = useTheme();

  return (
    <NavLink 
      to={to} 
      onClick={onClick}
      style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
    >
      {({ isActive: navActive }) => {
        const active = isActive || navActive;
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 0.75,
              width: '100%',
              cursor: 'pointer',
              borderRadius: theme.customSizes.borderRadius.lg,
              transition: 'background-color 0.2s ease',
              '&:hover': {
                bgcolor: 'rgba(0, 106, 106, 0.08)',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 32,
                borderRadius: theme.customSizes.borderRadius.lg,
                bgcolor: active ? theme.customColors.accent.mint : 'transparent',
                transition: 'background-color 0.2s ease',
                '& svg': {
                  fontSize: theme.customSizes.icon.md,
                  color: active ? theme.customColors.accent.dark : theme.palette.text.secondary,
                },
              }}
            >
              <Icon />
            </Box>
            {showLabel && (
              <Typography
                sx={{
                  fontSize: theme.typography.caption.fontSize,
                  fontWeight: 500,
                  lineHeight: 1.33,
                  letterSpacing: 0.5,
                  color: active ? theme.palette.text.primary : theme.palette.text.secondary,
                  textAlign: 'center',
                  mt: 0.5,
                  whiteSpace: 'pre-line',
                }}
              >
                {label}
              </Typography>
            )}
          </Box>
        );
      }}
    </NavLink>
  );
};

export default NavigationItem;
