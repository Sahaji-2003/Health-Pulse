import type { SxProps, Theme } from '@mui/material/styles';

/**
 * Resource type representing a library resource (article, video, podcast)
 */
export interface Resource {
  /** Unique identifier for the resource */
  id: string;
  /** Title of the resource */
  title: string;
  /** Description/excerpt of the resource */
  description: string;
  /** Image URL for the resource thumbnail */
  imageUrl?: string;
  /** Date label (e.g., "Today", "2 days ago", "Aug 20, 2025") */
  dateLabel: string;
  /** Category of the resource */
  category?: string;
  /** Whether the resource is saved/bookmarked */
  isSaved: boolean;
  /** Type of resource */
  type: 'article' | 'video' | 'podcast';
  /** Optional external URL for the resource */
  url?: string;
}

/**
 * Props for the ResourceCard component
 */
export interface ResourceCardProps {
  /** Resource data to display */
  resource: Resource;
  /** Callback when bookmark/save button is clicked */
  onSaveToggle?: (resourceId: string, isSaved: boolean) => void;
  /** Callback when the card is clicked */
  onClick?: (resource: Resource) => void;
  /** Optional sx prop for styling */
  sx?: SxProps<Theme>;
}
