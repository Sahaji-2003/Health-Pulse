import { Router } from 'express';
import * as communityController from '../controllers/community.controller';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * Community Forum Routes
 * 
 * All routes are under /api/community
 */

// Get all posts (public, but with optional auth for like status)
router.get('/posts', optionalAuthenticate, communityController.getPosts);

// Get single post by ID (public, but with optional auth for like status)
router.get('/posts/:id', optionalAuthenticate, communityController.getPostById);

// Create a new post (requires auth)
router.post('/posts', authenticate, communityController.createPost);

// Toggle like on a post (requires auth)
router.post('/posts/:id/like', authenticate, communityController.togglePostLike);

// Add a comment to a post (requires auth)
router.post('/posts/:id/comments', authenticate, communityController.addComment);

// Toggle like on a comment (requires auth)
router.post('/comments/:commentId/like', authenticate, communityController.toggleCommentLike);

// Delete a post (requires auth, owner only)
router.delete('/posts/:id', authenticate, communityController.deletePost);

// Delete a comment (requires auth, owner only)
router.delete('/comments/:commentId', authenticate, communityController.deleteComment);

export default router;
