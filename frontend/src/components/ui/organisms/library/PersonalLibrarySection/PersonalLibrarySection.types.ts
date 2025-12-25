import type { SxProps, Theme } from '@mui/material/styles';
import type { Resource } from '../ResourceCard';

/**
 * Props for the PersonalLibrarySection component
 */
export interface PersonalLibrarySectionProps {
  /** Array of saved resources */
  resources?: Resource[];
  /** Whether data is loading */
  isLoading?: boolean;
  /** Selected category filter */
  category?: string;
  /** Callback when category changes */
  onCategoryChange?: (category: string) => void;
  /** Callback when bookmark/save is toggled */
  onSaveToggle?: (resourceId: string, isSaved: boolean) => void;
  /** Callback when a resource card is clicked */
  onResourceClick?: (resource: Resource) => void;
  /** Optional sx prop for styling */
  sx?: SxProps<Theme>;
}
