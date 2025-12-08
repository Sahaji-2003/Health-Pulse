import type { TypographyProps as MuiTypographyProps } from '@mui/material/Typography';
import type { ReactNode } from 'react';

export type TypographyVariant = 
  | 'display-large'
  | 'display-medium'
  | 'display-small'
  | 'headline-large'
  | 'headline-medium'
  | 'headline-small'
  | 'title-large'
  | 'title-medium'
  | 'title-small'
  | 'body-large'
  | 'body-medium'
  | 'body-small'
  | 'label-large'
  | 'label-medium'
  | 'label-small';

export type TypographyColor = 
  | 'primary'
  | 'secondary'
  | 'on-surface'
  | 'on-surface-variant'
  | 'error'
  | 'success'
  | 'inherit';

export interface TypographyProps extends Omit<MuiTypographyProps, 'variant' | 'color'> {
  /** Material Design 3 typography variant */
  variant?: TypographyVariant;
  /** Text color */
  color?: TypographyColor;
  /** Font weight override */
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Content */
  children: ReactNode;
}
