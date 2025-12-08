export interface LogoBrandProps {
  /** Size variant of the logo */
  size?: 'small' | 'medium' | 'large';
  /** Show tagline below the logo */
  showTagline?: boolean;
  /** Custom tagline text */
  tagline?: string;
  /** Click handler */
  onClick?: () => void;
}
