import { SxProps, Theme } from '@mui/material/styles';
import { Resource } from '../ResourceCard';

/**
 * Props for the PodcastsSection component
 */
export interface PodcastsSectionProps {
  /** Array of podcast resources to display */
  resources?: Resource[];
  /** Whether the section is loading */
  isLoading?: boolean;
  /** Callback when a podcast's save/bookmark is toggled */
  onSaveToggle?: (resourceId: string, isSaved: boolean) => void;
  /** Callback when a podcast card is clicked */
  onResourceClick?: (resource: Resource) => void;
  /** Optional sx prop for styling */
  sx?: SxProps<Theme>;
}
