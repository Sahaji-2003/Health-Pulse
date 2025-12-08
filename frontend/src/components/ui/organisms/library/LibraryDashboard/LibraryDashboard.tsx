import React, { useState, useCallback, useMemo } from 'react';
import { Box } from '@mui/material';
import { LibraryTabs } from '../LibraryTabs';
import { ArticlesSection } from '../ArticlesSection';
import { VideosSection } from '../VideosSection';
import { PodcastsSection } from '../PodcastsSection';
import { PersonalLibrarySection } from '../PersonalLibrarySection';
import { CommunityForumSection } from '../CommunityForumSection';
import { CreatePostForm } from '../CreatePostForm';
import type { LibraryDashboardProps, LibraryTabValue } from './LibraryDashboard.types';
import type { CreatePostFormData } from '../CreatePostForm/CreatePostForm.types';

/**
 * LibraryDashboard Component
 * 
 * Main component that combines all library sections with tab navigation.
 * Displays educational resources, personal saved items, and community forum.
 * Based on multiple Figma design nodes for the Library section.
 */
export const LibraryDashboard: React.FC<LibraryDashboardProps> = ({
  activeTab: controlledActiveTab,
  onTabChange,
  articles,
  videos,
  podcasts,
  savedResources,
  forumTopics,
  isLoading = false,
  personalLibraryCategory = 'all',
  onPersonalLibraryCategoryChange,
  onSaveToggle,
  onResourceClick,
  onTopicClick,
  onTopicLikeToggle,
  onTopicCommentClick,
  onCreatePost,
  selectedTopicId,
  onBackFromTopic,
  isCreatePostView = false,
  onCreatePostClose,
  onCreatePostSubmit,
  isSubmittingPost = false,
  sx,
}) => {
  // Internal state for uncontrolled mode
  const [internalActiveTab, setInternalActiveTab] = useState<LibraryTabValue>('articles');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use controlled or uncontrolled mode
  const activeTab = controlledActiveTab ?? internalActiveTab;

  // Create a set of saved resource IDs for quick lookup
  const savedResourceIds = useMemo(() => {
    const ids = new Set<string>();
    (savedResources || []).forEach(r => ids.add(r.id));
    console.log('savedResourceIds computed:', Array.from(ids), 'from savedResources:', savedResources?.length || 0);
    return ids;
  }, [savedResources]);

  // Update articles with correct isSaved status
  const articlesWithSavedStatus = useMemo(() => {
    if (!articles) return undefined;
    const result = articles.map(article => ({
      ...article,
      isSaved: savedResourceIds.has(article.id),
    }));
    console.log('articlesWithSavedStatus:', result.map(a => ({ id: a.id, title: a.title.substring(0, 20), isSaved: a.isSaved })));
    return result;
  }, [articles, savedResourceIds]);

  // Update videos with correct isSaved status
  const videosWithSavedStatus = useMemo(() => {
    if (!videos) return undefined;
    return videos.map(video => ({
      ...video,
      isSaved: savedResourceIds.has(video.id),
    }));
  }, [videos, savedResourceIds]);

  // Update podcasts with correct isSaved status
  const podcastsWithSavedStatus = useMemo(() => {
    if (!podcasts) return undefined;
    return podcasts.map(podcast => ({
      ...podcast,
      isSaved: savedResourceIds.has(podcast.id),
    }));
  }, [podcasts, savedResourceIds]);

  // Filter personal library resources by category
  const filteredSavedResources = useMemo(() => {
    const resources = savedResources || [];
    if (personalLibraryCategory === 'all') {
      return resources;
    }
    return resources.filter(r => 
      r.category?.toLowerCase().replace(/\s+/g, '_') === personalLibraryCategory ||
      r.category?.toLowerCase() === personalLibraryCategory
    );
  }, [savedResources, personalLibraryCategory]);

  const handleTabChange = useCallback(
    (newTab: LibraryTabValue) => {
      if (onTabChange) {
        onTabChange(newTab);
      } else {
        setInternalActiveTab(newTab);
      }
    },
    [onTabChange]
  );

  const handleCreatePostClick = useCallback(() => {
    if (onCreatePost) {
      onCreatePost();
    } else {
      setIsCreatePostOpen(true);
    }
  }, [onCreatePost]);

  const handleCreatePostClose = useCallback(() => {
    setIsCreatePostOpen(false);
  }, []);

  const handleCreatePostSubmit = useCallback(async (data: CreatePostFormData) => {
    setIsSubmitting(true);
    try {
      // In a real app, this would call an API
      console.log('Creating post:', data);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsCreatePostOpen(false);
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Adapter function to convert Resource callback to ArticlesSection signature
  const handleSaveToggle = useCallback(
    (resourceId: string, isSaved: boolean) => {
      console.log('LibraryDashboard handleSaveToggle called:', { resourceId, isSaved, hasOnSaveToggle: !!onSaveToggle });
      if (onSaveToggle) {
        // Find the resource by ID to pass the full object
        const allResources = [
          ...(articlesWithSavedStatus || articles || []), 
          ...(videosWithSavedStatus || videos || []), 
          ...(podcastsWithSavedStatus || podcasts || []), 
          ...(savedResources || [])
        ];
        console.log('All resources count:', allResources.length);
        const resource = allResources.find((r) => r.id === resourceId);
        if (resource) {
          console.log('Found resource, calling onSaveToggle with:', resource);
          onSaveToggle(resource);
        } else {
          // If resource not found in props, create a minimal resource object
          // This handles the case when sections use their internal default data
          console.log('Resource not found, creating minimal object');
          onSaveToggle({
            id: resourceId,
            title: '',
            description: '',
            dateLabel: '',
            isSaved: isSaved,
            type: 'article',
          });
        }
      } else {
        console.warn('onSaveToggle prop is not provided to LibraryDashboard!');
      }
    },
    [onSaveToggle, articles, videos, podcasts, savedResources, articlesWithSavedStatus, videosWithSavedStatus, podcastsWithSavedStatus]
  );

  /**
   * Render the active tab content
   */
  const renderContent = () => {
    // Show create post form if isCreatePostView is true (from URL)
    if (isCreatePostView && activeTab === 'community') {
      return (
        <CreatePostForm
          open={true}
          onClose={onCreatePostClose || handleCreatePostClose}
          onSubmit={onCreatePostSubmit || handleCreatePostSubmit}
          isSubmitting={isSubmittingPost || isSubmitting}
        />
      );
    }

    switch (activeTab) {
      case 'articles':
        return (
          <ArticlesSection
            resources={articlesWithSavedStatus}
            isLoading={isLoading}
            onSaveToggle={handleSaveToggle}
            onResourceClick={onResourceClick}
          />
        );
      
      case 'videos':
        return (
          <VideosSection
            resources={videosWithSavedStatus}
            isLoading={isLoading}
            onSaveToggle={handleSaveToggle}
            onResourceClick={onResourceClick}
          />
        );
      
      case 'podcasts':
        return (
          <PodcastsSection
            resources={podcastsWithSavedStatus}
            isLoading={isLoading}
            onSaveToggle={handleSaveToggle}
            onResourceClick={onResourceClick}
          />
        );
      
      case 'personal':
        return (
          <PersonalLibrarySection
            resources={filteredSavedResources}
            isLoading={isLoading}
            category={personalLibraryCategory}
            onCategoryChange={onPersonalLibraryCategoryChange}
            onSaveToggle={handleSaveToggle}
            onResourceClick={onResourceClick}
          />
        );
      
      case 'community':
        return (
          <CommunityForumSection
            topics={forumTopics}
            isLoading={isLoading}
            onCreatePost={handleCreatePostClick}
            onTopicClick={onTopicClick}
            onLikeToggle={onTopicLikeToggle}
            onCommentClick={onTopicCommentClick}
            selectedTopicId={selectedTopicId}
            onBack={onBackFromTopic}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 4 },
        py: 3,
        ...sx,
      }}
    >
      {/* Tab Navigation */}
      <LibraryTabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{ mb: 3 }}
      />

      {/* Tab Content */}
      <Box sx={{ minHeight: 400 }}>
        {renderContent()}
      </Box>

      {/* Create Post Dialog (internal handling) */}
      {!onCreatePost && (
        <CreatePostForm
          open={isCreatePostOpen}
          onClose={handleCreatePostClose}
          onSubmit={handleCreatePostSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </Box>
  );
};

export default LibraryDashboard;
