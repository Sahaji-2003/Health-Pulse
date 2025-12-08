import apiClient from '../apiClient';

/**
 * Community post author interface
 */
export interface PostAuthor {
  id: string;
  name: string;
  avatar?: string;
}

/**
 * Community comment interface
 */
export interface CommunityComment {
  id: string;
  content: string;
  author: PostAuthor;
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

/**
 * Community post interface
 */
export interface CommunityPost {
  id?: string;
  _id?: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: PostAuthor;
  createdAt: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  commentsList?: CommunityComment[];
}

/**
 * Create post request data
 */
export interface CreatePostData {
  title: string;
  content: string;
  imageUrl?: string;
}

/**
 * Pagination info
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: PaginationInfo;
}

/**
 * Community Forum API Service
 */
export const communityApi = {
  /**
   * Get all community posts with pagination
   */
  getPosts: async (page = 1, limit = 10, sortBy = 'createdAt'): Promise<ApiResponse<CommunityPost[]>> => {
    const response = await apiClient.get('/community/posts', {
      params: { page, limit, sortBy },
    });
    return response.data;
  },

  /**
   * Get a single post by ID with comments
   */
  getPostById: async (postId: string): Promise<ApiResponse<CommunityPost>> => {
    const response = await apiClient.get(`/community/posts/${postId}`);
    return response.data;
  },

  /**
   * Create a new community post
   */
  createPost: async (data: CreatePostData): Promise<ApiResponse<CommunityPost>> => {
    const response = await apiClient.post('/community/posts', data);
    return response.data;
  },

  /**
   * Toggle like on a post
   */
  togglePostLike: async (postId: string): Promise<ApiResponse<{ id: string; likes: number; isLiked: boolean }>> => {
    const response = await apiClient.post(`/community/posts/${postId}/like`);
    return response.data;
  },

  /**
   * Add a comment to a post
   */
  addComment: async (postId: string, content: string): Promise<ApiResponse<CommunityComment>> => {
    const response = await apiClient.post(`/community/posts/${postId}/comments`, { content });
    return response.data;
  },

  /**
   * Toggle like on a comment
   */
  toggleCommentLike: async (commentId: string): Promise<ApiResponse<{ id: string; likes: number; isLiked: boolean }>> => {
    const response = await apiClient.post(`/community/comments/${commentId}/like`);
    return response.data;
  },

  /**
   * Delete a post (owner only)
   */
  deletePost: async (postId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/community/posts/${postId}`);
    return response.data;
  },

  /**
   * Delete a comment (owner only)
   */
  deleteComment: async (commentId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/community/comments/${commentId}`);
    return response.data;
  },
};

export default communityApi;
