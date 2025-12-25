import type { SxProps, Theme } from '@mui/material/styles';

/**
 * Possible tab values for the library section
 */
export type LibraryTabValue = 'articles' | 'videos' | 'podcasts' | 'personal' | 'community';

/**
 * Props for the LibraryTabs component
 */
export interface LibraryTabsProps {
  /** Currently selected tab */
  value: LibraryTabValue;
  /** Callback when tab changes */
  onChange: (value: LibraryTabValue) => void;
  /** Optional sx prop for styling */
  sx?: SxProps<Theme>;
}
