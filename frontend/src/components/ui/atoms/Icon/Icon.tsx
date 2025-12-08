import React from 'react';
import { useTheme } from '@mui/material';
import type { IconProps, IconSize, IconColor } from './Icon.types';

/**
 * Icon Atom Component
 * 
 * A reusable icon wrapper component for Material UI icons.
 * Provides consistent sizing and coloring across the application.
 * Uses theme values for consistent styling.
 * 
 * @example
 * import FavoriteIcon from '@mui/icons-material/Favorite';
 * <Icon icon={FavoriteIcon} size="large" color="primary" />
 */
export const Icon: React.FC<IconProps> = ({
  icon: IconComponent,
  size = 'medium',
  color = 'on-surface',
  customSize,
  ...props
}) => {
  const theme = useTheme();

  // Size mappings using theme values
  const getSizeValue = (iconSize: IconSize): number => {
    const sizes: Record<IconSize, number> = {
      small: theme.customSizes.icon.sm,
      medium: theme.customSizes.icon.md,
      large: theme.customSpacing.xl + 8,
      xlarge: theme.customSpacing['4xl'],
    };
    return sizes[iconSize];
  };

  // Color mappings using theme palette
  const getColorValue = (iconColor: IconColor): string => {
    const colors: Record<IconColor, string> = {
      primary: theme.palette.primary.main,
      secondary: theme.palette.secondary.main,
      'on-surface': theme.palette.text.primary,
      'on-surface-variant': theme.palette.text.secondary,
      error: theme.palette.error.main,
      success: theme.palette.success.main,
      inherit: 'inherit',
    };
    return colors[iconColor];
  };

  const iconSize = customSize ?? getSizeValue(size);
  const iconColor = getColorValue(color);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <IconComponent
        sx={{
          fontSize: iconSize,
          color: iconColor,
        }}
        {...props}
      />
    </span>
  );
};

export default Icon;
