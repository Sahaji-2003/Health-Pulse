import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import CommunityPost from '../models/CommunityPost.model';
import CommunityComment from '../models/CommunityComment.model';
import mongoose from 'mongoose';

/**
 * Get all community posts with pagination
 */
export const getPosts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = '1', limit = '10', sortBy = 'createdAt' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Determine sort order
    const sortOptions: any = {};
    if (sortBy === 'likes') {
      sortOptions.likes = -1;
    } else {
      sortOptions.createdAt = -1;
    }

    const posts = await CommunityPost.find()
      .populate('userId', 'firstName lastName avatar')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await CommunityPost.countDocuments();

    // Transform posts to include isLiked status for current user
    const userId = req.user?.id;
    const transformedPosts = posts.map((post: any) => ({
      ...post,
      isLiked: userId ? post.likedBy.some((id: any) => id.toString() === userId) : false,
      author: post.userId ? {
        id: post.userId._id,
        name: `${post.userId.firstName || ''} ${post.userId.lastName || ''}`.trim() || 'Anonymous',
        avatar: post.userId.avatar,
      } : { id: null, name: 'Anonymous', avatar: undefined },
    }));

    res.status(200).json({
      success: true,
      data: transformedPosts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single post by ID with comments
 */
export const getPostById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid post ID',
      });
      return;
    }

    const post = await CommunityPost.findById(id)
      .populate('userId', 'firstName lastName avatar')
      .lean();

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post not found',
      });
      return;
    }

    // Get comments for this post
    const comments = await CommunityComment.find({ postId: id })
      .populate('userId', 'firstName lastName avatar')
      .sort({ createdAt: 1 })
      .lean();

    const userId = req.user?.id;

    // Transform comments
    const transformedComments = comments.map((comment: any) => ({
      id: comment._id,
      content: comment.content,
      author: comment.userId ? {
        id: comment.userId._id,
        name: `${comment.userId.firstName || ''} ${comment.userId.lastName || ''}`.trim() || 'Anonymous',
        avatar: comment.userId.avatar,
      } : { id: null, name: 'Anonymous', avatar: undefined },
      createdAt: comment.createdAt,
      likes: comment.likes,
      isLiked: userId ? comment.likedBy.some((id: any) => id.toString() === userId) : false,
    }));

    // Transform post
    const postData = post as any;
    const transformedPost = {
      id: postData._id,
      title: postData.title,
      content: postData.content,
      imageUrl: postData.imageUrl,
      author: postData.userId ? {
        id: postData.userId._id,
        name: `${postData.userId.firstName || ''} ${postData.userId.lastName || ''}`.trim() || 'Anonymous',
        avatar: postData.userId.avatar,
      } : { id: null, name: 'Anonymous', avatar: undefined },
      createdAt: postData.createdAt,
      likes: postData.likes,
      comments: postData.commentsCount,
      isLiked: userId ? postData.likedBy.some((id: any) => id.toString() === userId) : false,
      commentsList: transformedComments,
    };

    res.status(200).json({
      success: true,
      data: transformedPost,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new community post
 */
export const createPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const { title, content, imageUrl } = req.body;

    if (!title || !content) {
      res.status(400).json({
        success: false,
        message: 'Title and content are required',
      });
      return;
    }

    const post = await CommunityPost.create({
      userId: req.user.id,
      title,
      content,
      imageUrl,
    });

    // Populate user data
    await post.populate('userId', 'firstName lastName avatar');

    const postData = post.toObject() as any;
    const transformedPost = {
      id: postData._id,
      title: postData.title,
      content: postData.content,
      imageUrl: postData.imageUrl,
      author: postData.userId ? {
        id: postData.userId._id,
        name: `${postData.userId.firstName || ''} ${postData.userId.lastName || ''}`.trim() || 'Anonymous',
        avatar: postData.userId.avatar,
      } : { id: null, name: 'Anonymous', avatar: undefined },
      createdAt: postData.createdAt,
      likes: postData.likes,
      comments: postData.commentsCount,
      isLiked: false,
      commentsList: [],
    };

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: transformedPost,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle like on a post
 */
export const togglePostLike = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid post ID',
      });
      return;
    }

    const post = await CommunityPost.findById(id);

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post not found',
      });
      return;
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);
    const isLiked = post.likedBy.some((id) => id.toString() === req.user!.id);

    if (isLiked) {
      // Unlike
      post.likedBy = post.likedBy.filter((id) => id.toString() !== req.user!.id);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      // Like
      post.likedBy.push(userId);
      post.likes += 1;
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: isLiked ? 'Post unliked' : 'Post liked',
      data: {
        id: post._id,
        likes: post.likes,
        isLiked: !isLiked,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add a comment to a post
 */
export const addComment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const { id } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid post ID',
      });
      return;
    }

    if (!content || !content.trim()) {
      res.status(400).json({
        success: false,
        message: 'Comment content is required',
      });
      return;
    }

    const post = await CommunityPost.findById(id);

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post not found',
      });
      return;
    }

    // Create comment
    const comment = await CommunityComment.create({
      postId: id,
      userId: req.user.id,
      content: content.trim(),
    });

    // Update post comments count
    post.commentsCount += 1;
    await post.save();

    // Populate user data
    await comment.populate('userId', 'firstName lastName avatar');

    const commentData = comment.toObject() as any;
    const transformedComment = {
      id: commentData._id,
      content: commentData.content,
      author: commentData.userId ? {
        id: commentData.userId._id,
        name: `${commentData.userId.firstName || ''} ${commentData.userId.lastName || ''}`.trim() || 'Anonymous',
        avatar: commentData.userId.avatar,
      } : { id: null, name: 'Anonymous', avatar: undefined },
      createdAt: commentData.createdAt,
      likes: commentData.likes,
      isLiked: false,
    };

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: transformedComment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle like on a comment
 */
export const toggleCommentLike = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid comment ID',
      });
      return;
    }

    const comment = await CommunityComment.findById(commentId);

    if (!comment) {
      res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
      return;
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);
    const isLiked = comment.likedBy.some((id) => id.toString() === req.user!.id);

    if (isLiked) {
      // Unlike
      comment.likedBy = comment.likedBy.filter((id) => id.toString() !== req.user!.id);
      comment.likes = Math.max(0, comment.likes - 1);
    } else {
      // Like
      comment.likedBy.push(userId);
      comment.likes += 1;
    }

    await comment.save();

    res.status(200).json({
      success: true,
      message: isLiked ? 'Comment unliked' : 'Comment liked',
      data: {
        id: comment._id,
        likes: comment.likes,
        isLiked: !isLiked,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a post (only by owner)
 */
export const deletePost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid post ID',
      });
      return;
    }

    const post = await CommunityPost.findById(id);

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post not found',
      });
      return;
    }

    // Check ownership
    if (post.userId.toString() !== req.user.id) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post',
      });
      return;
    }

    // Delete all comments for this post
    await CommunityComment.deleteMany({ postId: id });

    // Delete the post
    await CommunityPost.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a comment (only by owner)
 */
export const deleteComment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid comment ID',
      });
      return;
    }

    const comment = await CommunityComment.findById(commentId);

    if (!comment) {
      res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
      return;
    }

    // Check ownership
    if (comment.userId.toString() !== req.user.id) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment',
      });
      return;
    }

    // Decrement post comments count
    await CommunityPost.findByIdAndUpdate(comment.postId, {
      $inc: { commentsCount: -1 },
    });

    // Delete the comment
    await CommunityComment.findByIdAndDelete(commentId);

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
