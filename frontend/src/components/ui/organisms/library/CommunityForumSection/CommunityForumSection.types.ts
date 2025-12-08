import type { SxProps, Theme } from '@mui/material';

/**
 * Comment on a forum topic
 */
export interface ForumComment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date | string;
  isLiked?: boolean;
}

/**
 * Forum topic item interface
 */
export interface ForumTopic {
  id: string;
  title: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  imageUrl?: string;
  createdAt: Date | string;
  likes: number;
  comments: number;
  commentsList?: ForumComment[];
  isLiked?: boolean;
}

/**
 * Props for the CommunityForumSection component
 */
export interface CommunityForumSectionProps {
  /**
   * Array of forum topics to display
   */
  topics?: ForumTopic[];
  
  /**
   * Whether topics are currently loading
   */
  isLoading?: boolean;
  
  /**
   * Callback when Create New Post button is clicked
   */
  onCreatePost?: () => void;
  
  /**
   * Callback when a topic is clicked
   */
  onTopicClick?: (topic: ForumTopic) => void;
  
  /**
   * Callback when like button is clicked
   */
  onLikeToggle?: (topic: ForumTopic) => void;
  
  /**
   * Callback when comment button is clicked
   */
  onCommentClick?: (topic: ForumTopic) => void;
  
  /**
   * Selected topic ID for showing detail view (from URL)
   */
  selectedTopicId?: string;
  
  /**
   * Callback when navigating back from topic detail
   */
  onBack?: () => void;
  
  /**
   * Custom styles
   */
  sx?: SxProps<Theme>;
}
