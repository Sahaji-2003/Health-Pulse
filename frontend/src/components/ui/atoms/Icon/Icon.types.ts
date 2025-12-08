import type { SvgIconProps } from '@mui/material/SvgIcon';

export type IconSize = 'small' | 'medium' | 'large' | 'xlarge';

export type IconColor = 
  | 'primary'
  | 'secondary'
  | 'on-surface'
  | 'on-surface-variant'
  | 'error'
  | 'success'
  | 'inherit';

export interface IconProps extends Omit<SvgIconProps, 'fontSize' | 'color'> {
  /** Icon component from MUI icons */
  icon: React.ElementType;
  /** Size of the icon */
  size?: IconSize;
  /** Color of the icon */
  color?: IconColor;
  /** Custom size in pixels (overrides size prop) */
  customSize?: number;
}
