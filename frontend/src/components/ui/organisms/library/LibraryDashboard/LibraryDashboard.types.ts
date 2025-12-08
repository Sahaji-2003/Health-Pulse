import type { SxProps, Theme } from '@mui/material';
import type { Resource } from '../ResourceCard/ResourceCard.types';
import type { ForumTopic } from '../CommunityForumSection/CommunityForumSection.types';

/**
 * Tab values for the library dashboard
 */
export type LibraryTabValue = 'articles' | 'videos' | 'podcasts' | 'personal' | 'community';

/**
 * Props for the LibraryDashboard component
 */
export interface LibraryDashboardProps {
  /**
   * Currently active tab
   */
  activeTab?: LibraryTabValue;
  
  /**
   * Callback when tab changes
   */
  onTabChange?: (tab: LibraryTabValue) => void;
  
  /**
   * Articles to display
   */
  articles?: Resource[];
  
  /**
   * Videos to display
   */
  videos?: Resource[];
  
  /**
   * Podcasts to display
   */
  podcasts?: Resource[];
  
  /**
   * Saved resources for personal library
   */
  savedResources?: Resource[];
  
  /**
   * Forum topics to display
   */
  forumTopics?: ForumTopic[];
  
  /**
   * Whether data is loading
   */
  isLoading?: boolean;
  
  /**
   * Current category filter for personal library
   */
  personalLibraryCategory?: string;
  
  /**
   * Callback when personal library category changes
   */
  onPersonalLibraryCategoryChange?: (category: string) => void;
  
  /**
   * Callback when resource is bookmarked/saved
   */
  onSaveToggle?: (resource: Resource) => void;
  
  /**
   * Callback when resource card is clicked
   */
  onResourceClick?: (resource: Resource) => void;
  
  /**
   * Callback when forum topic is clicked
   */
  onTopicClick?: (topic: ForumTopic) => void;
  
  /**
   * Callback when forum topic like is toggled
   */
  onTopicLikeToggle?: (topic: ForumTopic) => void;
  
  /**
   * Callback when forum topic comment is clicked
   */
  onTopicCommentClick?: (topic: ForumTopic) => void;
  
  /**
   * Callback when create new post is requested
   */
  onCreatePost?: () => void;
  
  /**
   * Selected topic ID for detail view (from URL)
   */
  selectedTopicId?: string;
  
  /**
   * Callback when navigating back from topic detail view
   */
  onBackFromTopic?: () => void;
  
  /**
   * Whether create post view is active (from URL)
   */
  isCreatePostView?: boolean;
  
  /**
   * Callback when create post form is closed
   */
  onCreatePostClose?: () => void;
  
  /**
   * Callback when create post form is submitted
   */
  onCreatePostSubmit?: (data: import('../CreatePostForm/CreatePostForm.types').CreatePostFormData) => void;
  
  /**
   * Whether post is being submitted
   */
  isSubmittingPost?: boolean;
  
  /**
   * Custom styles
   */
  sx?: SxProps<Theme>;
}
