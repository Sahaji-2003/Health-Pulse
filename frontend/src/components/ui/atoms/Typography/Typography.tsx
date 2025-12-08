import React from 'react';
import { Typography as MuiTypography, useTheme } from '@mui/material';
import type { TypographyProps, TypographyVariant, TypographyColor } from './Typography.types';

// Weight mappings
const getWeightValue = (weight: 'regular' | 'medium' | 'semibold' | 'bold') => {
  const weights = {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  };
  return weights[weight];
};

// Map custom variants to MUI typography variants
const mapVariantToMui = (variant: TypographyVariant): React.ComponentProps<typeof MuiTypography>['variant'] => {
  const variantMap: Record<TypographyVariant, React.ComponentProps<typeof MuiTypography>['variant']> = {
    'display-large': 'h1',
    'display-medium': 'h2',
    'display-small': 'h3',
    'headline-large': 'h4',
    'headline-medium': 'h5',
    'headline-small': 'h6',
    'title-large': 'h6',
    'title-medium': 'body1',
    'title-small': 'body2',
    'body-large': 'body1',
    'body-medium': 'body2',
    'body-small': 'caption',
    'label-large': 'button',
    'label-medium': 'overline',
    'label-small': 'overline',
  };
  return variantMap[variant] || 'body1';
};

/**
 * Typography Atom Component
 * 
 * A reusable typography component following Material Design 3 type scale.
 * Uses theme values for consistent colors and styling.
 * 
 * @example
 * <Typography variant="display-large" color="primary">Health Pulse</Typography>
 * <Typography variant="body-medium" color="on-surface-variant">Description text</Typography>
 */
export const Typography: React.FC<TypographyProps> = ({
  variant = 'body-medium',
  color = 'on-surface',
  weight,
  align = 'left',
  children,
  ...props
}) => {
  const theme = useTheme();
  const muiVariant = mapVariantToMui(variant);
  const weightValue = weight ? getWeightValue(weight) : undefined;

  // Color mappings using theme palette
  const getColorValue = (colorProp: TypographyColor) => {
    const colors: Record<TypographyColor, string> = {
      'primary': theme.palette.primary.main,
      'secondary': theme.palette.secondary.main,
      'on-surface': theme.palette.text.primary,
      'on-surface-variant': theme.palette.text.secondary,
      'error': theme.palette.error.main,
      'success': theme.palette.success.main,
      'inherit': 'inherit',
    };
    return colors[colorProp];
  };

  const colorValue = getColorValue(color);

  return (
    <MuiTypography
      variant={muiVariant}
      align={align as any}
      sx={{
        color: colorValue,
        fontWeight: weightValue,
      }}
      {...props}
    >
      {children}
    </MuiTypography>
  );
};

export default Typography;
