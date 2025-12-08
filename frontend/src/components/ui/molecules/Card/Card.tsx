import React from 'react';
import { Paper, useTheme } from '@mui/material';
import type { CardProps, CardVariant, CardPadding } from './Card.types';

/**
 * Card Molecule Component
 * 
 * A container component for grouping related content.
 * Uses theme values for consistent spacing and styling.
 * 
 * @example
 * <Card variant="outlined" padding="medium" maxWidth="md">
 *   <Typography>Card content</Typography>
 * </Card>
 */
export const Card: React.FC<CardProps> = ({
  variant = 'outlined',
  padding = 'medium',
  maxWidth,
  fullWidth = false,
  children,
  sx,
}) => {
  const theme = useTheme();

  const getPaddingValue = (paddingSize: CardPadding): number => {
    const paddingMap: Record<CardPadding, number> = {
      none: 0,
      small: 2,    // 16px (theme.spacing(2))
      medium: 3,   // 24px (theme.spacing(3))
      large: 4,    // 32px (theme.spacing(4))
    };
    return paddingMap[paddingSize];
  };

  const getVariantStyles = (cardVariant: CardVariant) => {
    const variantMap: Record<CardVariant, { elevation?: number; variant?: 'elevation' | 'outlined' }> = {
      elevated: {
        elevation: 1,
        variant: 'elevation',
      },
      outlined: {
        variant: 'outlined',
      },
      filled: {
        elevation: 0,
        variant: 'elevation',
      },
    };
    return variantMap[cardVariant];
  };

  const variantConfig = getVariantStyles(variant);
  const paperVariant = variantConfig.variant === 'outlined' ? 'outlined' : 'elevation';

  return (
    <Paper
      variant={paperVariant}
      elevation={variantConfig.elevation || 0}
      sx={{
        borderRadius: theme.customSizes.borderRadius.xs,
        p: getPaddingValue(padding),
        width: fullWidth ? '100%' : 'auto',
        maxWidth: maxWidth || 'none',
        bgcolor: variant === 'filled' ? theme.customColors.background.mint : theme.customColors.surface.elevated,
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
        ...(sx as object),
      }}
    >
      {children}
    </Paper>
  );
};

export default Card;
