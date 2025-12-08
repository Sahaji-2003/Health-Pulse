import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { communityApi, type CommunityPost, type CreatePostData } from '../services/api';

/**
 * Hook for fetching community posts
 */
export const useCommunityPosts = (page = 1, limit = 10, sortBy = 'createdAt') => {
  return useQuery({
    queryKey: ['community', 'posts', { page, limit, sortBy }],
    queryFn: () => communityApi.getPosts(page, limit, sortBy),
  });
};

/**
 * Hook for fetching a single post with comments
 */
export const useCommunityPost = (postId: string | undefined) => {
  return useQuery({
    queryKey: ['community', 'post', postId],
    queryFn: () => communityApi.getPostById(postId!),
    enabled: !!postId,
  });
};

/**
 * Hook for creating a new post
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostData) => communityApi.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', 'posts'] });
    },
  });
};

/**
 * Hook for toggling post like
 */
export const useTogglePostLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => communityApi.togglePostLike(postId),
    onSuccess: (response, postId) => {
      // Update posts list cache
      queryClient.setQueriesData<{ success: boolean; data: CommunityPost[] }>(
        { queryKey: ['community', 'posts'] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((post) => {
              const id = post._id || post.id;
              if (id === postId) {
                return {
                  ...post,
                  likes: response.data.likes,
                  isLiked: response.data.isLiked,
                };
              }
              return post;
            }),
          };
        }
      );
      // Also update single post cache if it exists
      queryClient.setQueryData(
        ['community', 'post', postId],
        (oldData: { success: boolean; data: CommunityPost } | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: {
              ...oldData.data,
              likes: response.data.likes,
              isLiked: response.data.isLiked,
            },
          };
        }
      );
    },
  });
};

/**
 * Hook for adding a comment to a post
 */
export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) =>
      communityApi.addComment(postId, content),
    onSuccess: (response, { postId }) => {
      // Invalidate single post query to refetch with new comment
      queryClient.invalidateQueries({ queryKey: ['community', 'post', postId] });
      // Also invalidate posts list to update comment counts
      queryClient.invalidateQueries({ queryKey: ['community', 'posts'] });
    },
  });
};

/**
 * Hook for toggling comment like
 */
export const useToggleCommentLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => communityApi.toggleCommentLike(commentId),
    onSuccess: () => {
      // Invalidate all post queries to refetch comment data
      queryClient.invalidateQueries({ queryKey: ['community', 'post'] });
    },
  });
};

/**
 * Hook for deleting a post
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => communityApi.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', 'posts'] });
    },
  });
};

/**
 * Hook for deleting a comment
 */
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => communityApi.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', 'post'] });
      queryClient.invalidateQueries({ queryKey: ['community', 'posts'] });
    },
  });
};
