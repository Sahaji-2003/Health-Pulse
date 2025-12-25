import type { SxProps, Theme } from '@mui/material';

export interface ResourceItem {
  /** Item ID */
  id: string;
  /** Date label (e.g., "Today", "Yesterday") */
  date: string;
  /** Title of the resource */
  title: string;
  /** Description/content preview */
  description: string;
  /** Thumbnail image URL (optional) */
  thumbnailUrl?: string;
  /** Image URL for consistency with library resources */
  imageUrl?: string;
  /** Category of the resource */
  category?: string;
  /** Whether the resource is saved/bookmarked */
  isSaved?: boolean;
}

export type ResourceTab = 'Community' | 'Starred' | 'Articles' | 'Videos' | 'Podcasts';

export interface ResourcesTabsCardProps {
  /** Currently selected tab */
  selectedTab: ResourceTab;
  /** Array of resource items to display */
  items: ResourceItem[];
  /** Callback when tab is changed */
  onTabChange?: (tab: ResourceTab) => void;
  /** Callback when a resource item is clicked */
  onItemClick?: (item: ResourceItem) => void;
  /** Additional sx props */
  sx?: SxProps<Theme>;
}
