import { BoxProps } from '@mui/material/Box';

export type CardVariant = 'elevated' | 'outlined' | 'filled';
export type CardPadding = 'none' | 'small' | 'medium' | 'large';

export interface CardProps extends Omit<BoxProps, 'padding'> {
  /** Visual variant of the card */
  variant?: CardVariant;
  /** Padding size */
  padding?: CardPadding;
  /** Max width of the card */
  maxWidth?: string | number;
  /** Whether the card takes full width */
  fullWidth?: boolean;
  /** Children elements */
  children: React.ReactNode;
}
