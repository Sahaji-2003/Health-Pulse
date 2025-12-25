import type { SxProps, Theme } from '@mui/material/styles';
import type { Resource } from '../ResourceCard';

/**
 * Props for the ArticlesSection component
 */
export interface ArticlesSectionProps {
  /** Array of resources (articles) to display */
  resources?: Resource[];
  /** Whether data is loading */
  isLoading?: boolean;
  /** Callback when bookmark/save is toggled */
  onSaveToggle?: (resourceId: string, isSaved: boolean) => void;
  /** Callback when a resource card is clicked */
  onResourceClick?: (resource: Resource) => void;
  /** Optional sx prop for styling */
  sx?: SxProps<Theme>;
}
