import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { DashboardLayout } from '../../components/layout';
import {
  LibraryDashboard,
  type LibraryTabValue,
  type Resource,
  type ForumTopic,
  type CreatePostFormData,
} from '../../components/ui/organisms';
import {
  useCommunityPosts,
  useTogglePostLike,
  useCreatePost,
  useSavedResources,
  useToggleSaveResource,
  useArticles,
  useVideos,
  usePodcasts,
} from '../../hooks';

/**
 * Community images array for assigning to forum topics
 */
const communityImages = ['/assets/community/a.jpg', '/assets/community/b.webp', '/assets/community/c.webp', '/assets/community/d.webp', '/assets/community/e.webp'];

/**
 * Map URL paths to tab values
 */
const pathToTab: Record<string, LibraryTabValue> = {
  'articles': 'articles',
  'videos': 'videos',
  'podcasts': 'podcasts',
  'personal': 'personal',
  'community': 'community',
};

/**
 * Resources Page
 * 
 * Displays the Educational Resources Library with articles, videos, podcasts,
 * personal saved resources, and community forum.
 * Each section has its own route for proper navigation.
 */
export const Resources = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { topicId } = useParams();

  // Determine current view from URL
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentSection = pathParts[1] || 'articles';
  const isCreatePostView = pathParts[2] === 'create';
  const isTopicDetailView = pathParts[2] === 'topic' && topicId;

  // Get active tab from URL
  const activeTab: LibraryTabValue = pathToTab[currentSection] || 'articles';

  const [personalLibraryCategory, setPersonalLibraryCategory] = useState('all');

  // Resources hooks - these return { resources, pagination } format
  const { data: articlesData, isLoading: isLoadingArticles } = useArticles();
  const { data: videosData, isLoading: isLoadingVideos } = useVideos();
  const { data: podcastsData, isLoading: isLoadingPodcasts } = usePodcasts();

  // Saved resources hook
  const { data: savedResources, isLoading: isLoadingSavedResources } = useSavedResources();
  const toggleSaveResourceMutation = useToggleSaveResource();

  // Transform API data to Resource format - these already have the correct format from useResources hook
  // Pass undefined while loading so section components show loading state, not fallback data
  const articles: Resource[] | undefined = useMemo(() => {
    if (!articlesData?.resources) return undefined;
    return articlesData.resources;
  }, [articlesData]);

  const videos: Resource[] | undefined = useMemo(() => {
    if (!videosData?.resources) return undefined;
    return videosData.resources;
  }, [videosData]);

  const podcasts: Resource[] | undefined = useMemo(() => {
    if (!podcastsData?.resources) return undefined;
    return podcastsData.resources;
  }, [podcastsData]);

  // Community forum hooks
  const { data: postsData, isLoading: isLoadingPosts } = useCommunityPosts(1, 20);
  const togglePostLikeMutation = useTogglePostLike();
  const createPostMutation = useCreatePost();

  // Transform API data to ForumTopic format
  const forumTopics: ForumTopic[] = useMemo(() => {
    if (!postsData?.data) return [];
    return postsData.data.map((post, index) => ({
      id: post._id || post.id || '',
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl || communityImages[index % communityImages.length],
      author: {
        id: post.author?.id || '',
        name: post.author?.name || 'Anonymous',
        avatar: post.author?.avatar,
      },
      createdAt: post.createdAt,
      likes: post.likes,
      comments: post.comments,
      isLiked: post.isLiked,
    }));
  }, [postsData]);

  // Handle tab change - navigate to appropriate route
  const handleTabChange = useCallback((tab: LibraryTabValue) => {
    navigate(`/resources/${tab}`);
  }, [navigate]);

  // Handle resource save/bookmark toggle
  const handleSaveToggle = useCallback((resource: Resource) => {
    console.log('Resources page handleSaveToggle called:', resource);
    console.log('Calling mutation with resourceId:', resource.id);
    toggleSaveResourceMutation.mutate({ resourceId: resource.id });
  }, [toggleSaveResourceMutation]);

  // Handle resource card click
  const handleResourceClick = useCallback((resource: Resource) => {
    console.log('Resource clicked:', resource.id);
    // TODO: Navigate to resource detail or open external link
    if (resource.url) {
      window.open(resource.url, '_blank');
    }
  }, []);

  // Handle forum topic click - navigate to topic detail view
  const handleTopicClick = useCallback((topic: ForumTopic) => {
    navigate(`/resources/community/topic/${topic.id}`);
  }, [navigate]);

  // Handle forum topic like toggle
  const handleTopicLikeToggle = useCallback((topic: ForumTopic) => {
    togglePostLikeMutation.mutate(topic.id);
  }, [togglePostLikeMutation]);

  // Handle forum topic comment click - navigate to topic detail
  const handleTopicCommentClick = useCallback((topic: ForumTopic) => {
    navigate(`/resources/community/topic/${topic.id}`);
  }, [navigate]);

  // Handle create post button click - navigate to create post view
  const handleCreatePost = useCallback(() => {
    navigate('/resources/community/create');
  }, [navigate]);

  // Handle create post form close - navigate back to community
  const handleCreatePostClose = useCallback(() => {
    navigate('/resources/community');
  }, [navigate]);

  // Handle create post form submit
  const handleCreatePostSubmit = useCallback(async (data: CreatePostFormData) => {
    try {
      await createPostMutation.mutateAsync({
        title: data.title,
        content: data.description,
        imageUrl: data.imageUrl,
      });
      navigate('/resources/community');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  }, [navigate, createPostMutation]);

  // Handle back from topic detail
  const handleBackFromTopic = useCallback(() => {
    navigate('/resources/community');
  }, [navigate]);

  return (
    <DashboardLayout
      title="Library"
    >
      <Box sx={{ mx: -3, mt: -2 }}>
        <LibraryDashboard
          activeTab={activeTab}
          onTabChange={handleTabChange}
          articles={articles}
          videos={videos}
          podcasts={podcasts}
          savedResources={savedResources}
          forumTopics={forumTopics}
          isLoading={
            activeTab === 'articles' ? isLoadingArticles :
              activeTab === 'videos' ? isLoadingVideos :
                activeTab === 'podcasts' ? isLoadingPodcasts :
                  activeTab === 'community' ? isLoadingPosts :
                    activeTab === 'personal' ? isLoadingSavedResources :
                      false
          }
          personalLibraryCategory={personalLibraryCategory}
          onPersonalLibraryCategoryChange={setPersonalLibraryCategory}
          onSaveToggle={handleSaveToggle}
          onResourceClick={handleResourceClick}
          onTopicClick={handleTopicClick}
          onTopicLikeToggle={handleTopicLikeToggle}
          onTopicCommentClick={handleTopicCommentClick}
          onCreatePost={handleCreatePost}
          selectedTopicId={isTopicDetailView ? topicId : undefined}
          onBackFromTopic={handleBackFromTopic}
          isCreatePostView={isCreatePostView}
          onCreatePostClose={handleCreatePostClose}
          onCreatePostSubmit={handleCreatePostSubmit}
          isSubmittingPost={createPostMutation.isPending}
        />
      </Box>
    </DashboardLayout>
  );
};

export default Resources;
