/**
 * Library - Educational Resources and Community Forum components
 * 
 * This module contains all components for the Library section of the application,
 * including educational resources (articles, videos, podcasts), personal saved items,
 * and community discussion forum.
 */

// ResourceCard - Reusable card for displaying resource items
export { ResourceCard } from './ResourceCard';
export type { ResourceCardProps, Resource } from './ResourceCard';

// LibraryTabs - Tab navigation for library sections
export { LibraryTabs } from './LibraryTabs';
export type { LibraryTabsProps } from './LibraryTabs';

// ArticlesSection - Grid display of article resources
export { ArticlesSection } from './ArticlesSection';
export type { ArticlesSectionProps } from './ArticlesSection';

// VideosSection - Grid display of video resources with play button overlay
export { VideosSection } from './VideosSection';
export type { VideosSectionProps } from './VideosSection';

// PodcastsSection - Grid display of podcast resources with audio visualization
export { PodcastsSection } from './PodcastsSection';
export type { PodcastsSectionProps } from './PodcastsSection';

// PersonalLibrarySection - User's saved resources with category filter
export { PersonalLibrarySection } from './PersonalLibrarySection';
export type { PersonalLibrarySectionProps } from './PersonalLibrarySection';

// CommunityForumSection - Forum topics list with interactions
export { CommunityForumSection } from './CommunityForumSection';
export type { CommunityForumSectionProps, ForumTopic } from './CommunityForumSection';

// CreatePostForm - Dialog for creating new forum posts
export { CreatePostForm } from './CreatePostForm';
export type { CreatePostFormProps, CreatePostFormData } from './CreatePostForm';

// LibraryDashboard - Main component combining all library sections
export { LibraryDashboard } from './LibraryDashboard';
export type { LibraryDashboardProps, LibraryTabValue } from './LibraryDashboard';
