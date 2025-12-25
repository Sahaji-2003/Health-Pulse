import type { SxProps, Theme } from '@mui/material/styles';
import type { Resource } from '../ResourceCard';

/**
 * Props for the VideosSection component
 */
export interface VideosSectionProps {
  /** Array of video resources to display */
  resources?: Resource[];
  /** Whether the section is loading */
  isLoading?: boolean;
  /** Callback when a video's save/bookmark is toggled */
  onSaveToggle?: (resourceId: string, isSaved: boolean) => void;
  /** Callback when a video card is clicked */
  onResourceClick?: (resource: Resource) => void;
  /** Optional sx prop for styling */
  sx?: SxProps<Theme>;
}
