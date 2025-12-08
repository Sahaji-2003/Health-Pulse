import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Skeleton,
  Divider,
  TextField,
  Paper,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { CommunityForumSectionProps, ForumTopic, ForumComment } from './CommunityForumSection.types';
import { useCommunityPost, useAddComment, useTogglePostLike, useToggleCommentLike } from '../../../../../hooks';

// Fallback community images for posts without imageUrl
const communityImages = [
  '/assets/community/a.jpg',
  '/assets/community/b.webp',
  '/assets/community/c.webp',
  '/assets/community/d.webp',
  '/assets/community/e.webp',
];

/**
 * Get a consistent fallback image for a topic based on its ID
 */
const getFallbackImage = (topicId: string): string => {
  // Use simple hash of topicId to get consistent image
  const hash = topicId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return communityImages[hash % communityImages.length];
};

/**
 * Placeholder image component matching Figma design
 */
const PlaceholderImage: React.FC<{ height?: number }> = ({ height = 180 }) => (
  <Box
    sx={{
      width: '100%',
      height,
      borderRadius: 3,
      bgcolor: '#E3EAE7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}
  >
    {/* Placeholder shapes like in Figma */}
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          width: 0,
          height: 0,
          borderLeft: '24px solid transparent',
          borderRight: '24px solid transparent',
          borderBottom: '40px solid rgba(0, 0, 0, 0.12)',
        }}
      />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            bgcolor: 'rgba(0, 0, 0, 0.12)',
            borderRadius: '50%',
            clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
          }}
        />
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            bgcolor: 'rgba(0, 0, 0, 0.12)',
          }}
        />
      </Box>
    </Box>
  </Box>
);

/**
 * Topic Card for the grid layout - Based on Figma node 2233-9658
 */
interface TopicCardProps {
  topic: ForumTopic;
  onLikeToggle?: (topic: ForumTopic) => void;
  onCommentClick?: (topic: ForumTopic) => void;
  onClick?: (topic: ForumTopic) => void;
}

const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  onLikeToggle,
  onCommentClick,
  onClick,
}) => {
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLikeToggle?.(topic);
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCommentClick?.(topic);
  };

  return (
    <Box
      onClick={() => onClick?.(topic)}
      sx={{
        cursor: 'pointer',
        '&:hover .topic-image': {
          transform: 'scale(1.02)',
        },
      }}
    >
      {/* Image Placeholder */}
      <Box
        className="topic-image"
        sx={{
          transition: 'transform 0.2s ease-in-out',
          mb: 1.5,
        }}
      >
        {topic.imageUrl ? (
          <Box
            component="img"
            src={topic.imageUrl}
            alt={topic.title}
            sx={{
              width: '100%',
              height: 180,
              objectFit: 'cover',
              borderRadius: 3,
            }}
          />
        ) : (
          <PlaceholderImage height={180} />
        )}
      </Box>

      {/* Content Row */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        {/* Text Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 400,
              color: '#171D1B',
              fontSize: 16,
              lineHeight: '24px',
              letterSpacing: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {topic.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#3F4946',
              fontSize: 14,
              lineHeight: '20px',
              letterSpacing: 0.25,
            }}
          >
            {topic.content}
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
          <IconButton
            size="small"
            onClick={handleCommentClick}
            sx={{
              width: 40,
              height: 40,
              bgcolor: '#CAE6DF',
              '&:hover': { bgcolor: '#B8DAD2' },
            }}
          >
            <ChatBubbleOutlineIcon sx={{ fontSize: 20, color: '#1E1E1E' }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleLikeClick}
            sx={{
              width: 40,
              height: 40,
              bgcolor: '#CAE6DF',
              '&:hover': { bgcolor: '#B8DAD2' },
            }}
          >
            {topic.isLiked ? (
              <FavoriteIcon sx={{ fontSize: 20, color: '#006B60' }} />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: 20, color: '#1E1E1E' }} />
            )}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

/**
 * Topic Detail View - Based on Figma node 2284-9745
 * Fetches topic data from API when selectedTopicId is provided
 */
interface TopicDetailViewProps {
  topicId: string;
  onBack: () => void;
}

const TopicDetailView: React.FC<TopicDetailViewProps> = ({
  topicId,
  onBack,
}) => {
  const [commentText, setCommentText] = useState('');
  
  // Fetch topic data from API
  const { data: topicData, isLoading } = useCommunityPost(topicId);
  const addCommentMutation = useAddComment();
  const togglePostLikeMutation = useTogglePostLike();
  const toggleCommentLikeMutation = useToggleCommentLike();

  const topic = topicData?.data;

  const handleSubmit = async () => {
    if (commentText.trim() && topicId) {
      try {
        await addCommentMutation.mutateAsync({ postId: topicId, content: commentText.trim() });
        setCommentText('');
      } catch (error) {
        console.error('Failed to add comment:', error);
      }
    }
  };

  const handleLikePost = () => {
    if (topicId) {
      togglePostLikeMutation.mutate(topicId);
    }
  };

  const handleLikeComment = (comment: ForumComment) => {
    toggleCommentLikeMutation.mutate(comment.id);
  };

  if (isLoading) {
    return (
      <Paper
        elevation={0}
        sx={{
          bgcolor: '#FFFFFF',
          borderRadius: '28px 28px 0 0',
          p: 2,
          minHeight: 600,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <CircularProgress sx={{ color: '#006B60' }} />
        <Typography sx={{ mt: 2, color: '#3F4946' }}>Loading...</Typography>
      </Paper>
    );
  }

  if (!topic) {
    return (
      <Paper
        elevation={0}
        sx={{
          bgcolor: '#FFFFFF',
          borderRadius: '28px 28px 0 0',
          p: 2,
          minHeight: 600,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <IconButton
          onClick={onBack}
          sx={{
            alignSelf: 'flex-start',
            mb: 1,
            color: '#1E1E1E',
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="text.secondary">Topic not found</Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: '#FFFFFF',
        borderRadius: '28px 28px 0 0',
        p: 2,
        minHeight: 600,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Back Button */}
      <IconButton
        onClick={onBack}
        sx={{
          alignSelf: 'flex-start',
          mb: 1,
          color: '#1E1E1E',
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Topic Image */}
      <Box sx={{ px: 2, mb: 2 }}>
        <Box
          component="img"
          src={topic.imageUrl || getFallbackImage(topicId)}
          alt={topic.title}
          sx={{
            width: '100%',
            height: 180,
            objectFit: 'cover',
            borderRadius: 3,
          }}
        />
      </Box>

      {/* Topic Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          px: 4,
          mb: 2,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 400,
              color: '#171D1B',
              fontSize: 16,
              lineHeight: '24px',
            }}
          >
            {topic.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#3F4946',
              fontSize: 14,
              lineHeight: '20px',
            }}
          >
            {topic.content}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#6F7976',
              fontSize: 12,
              mt: 0.5,
              display: 'block',
            }}
          >
            by {topic.author?.name || 'Anonymous'} • {topic.likes} likes • {topic.comments} comments
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton
            size="small"
            sx={{
              width: 40,
              height: 40,
              bgcolor: '#CAE6DF',
              '&:hover': { bgcolor: '#B8DAD2' },
            }}
          >
            <ChatBubbleOutlineIcon sx={{ fontSize: 20, color: '#1E1E1E' }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleLikePost}
            disabled={togglePostLikeMutation.isPending}
            sx={{
              width: 40,
              height: 40,
              bgcolor: '#CAE6DF',
              '&:hover': { bgcolor: '#B8DAD2' },
            }}
          >
            {topic.isLiked ? (
              <FavoriteIcon sx={{ fontSize: 20, color: '#006B60' }} />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: 20, color: '#1E1E1E' }} />
            )}
          </IconButton>
        </Box>
      </Box>

      {/* Comments List */}
      <Box sx={{ px: 1, flex: 1 }}>
        {topic.commentsList && topic.commentsList.length > 0 ? (
          topic.commentsList.map((comment: ForumComment, index: number) => (
            <Box key={comment.id}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  py: 1.5,
                  px: 2,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#006B60',
                      fontSize: 12,
                      fontWeight: 500,
                      display: 'block',
                      mb: 0.5,
                    }}
                  >
                    {comment.author?.name || 'Anonymous'}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#3F4946',
                      fontSize: 14,
                      lineHeight: '20px',
                      letterSpacing: 0.25,
                    }}
                  >
                    {comment.content}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => handleLikeComment(comment)}
                  disabled={toggleCommentLikeMutation.isPending}
                  sx={{ color: comment.isLiked ? '#006B60' : '#3F4946' }}
                >
                  {comment.isLiked ? (
                    <FavoriteIcon sx={{ fontSize: 18 }} />
                  ) : (
                    <FavoriteBorderIcon sx={{ fontSize: 18 }} />
                  )}
                </IconButton>
              </Box>
              {index < (topic.commentsList?.length || 0) - 1 && (
                <Divider sx={{ mx: 2 }} />
              )}
            </Box>
          ))
        ) : (
          <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No comments yet. Be the first to comment!
            </Typography>
          </Box>
        )}
      </Box>

      {/* Comment Input */}
      <Box sx={{ px: 2, pt: 3, pb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Comment"
          placeholder="Write your comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!commentText.trim() || addCommentMutation.isPending}
          sx={{
            bgcolor: '#006B60',
            color: 'white',
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 500,
            px: 2,
            py: 1,
            fontSize: 14,
            '&:hover': {
              bgcolor: '#005A50',
            },
            '&.Mui-disabled': {
              bgcolor: 'rgba(0, 107, 96, 0.3)',
              color: 'white',
            },
          }}
        >
          {addCommentMutation.isPending ? 'Submitting...' : 'Submit'}
        </Button>
      </Box>
    </Paper>
  );
};

/**
 * Loading Skeleton
 */
const ForumSkeleton: React.FC = () => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
      gap: 3,
    }}
  >
    {Array.from({ length: 4 }).map((_, index) => (
      <Box key={index}>
        <Skeleton variant="rounded" height={180} sx={{ borderRadius: 3, mb: 1.5 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="70%" height={24} />
            <Skeleton variant="text" width="30%" height={20} />
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="circular" width={40} height={40} />
          </Box>
        </Box>
      </Box>
    ))}
  </Box>
);

/**
 * CommunityForumSection Component
 * 
 * Displays a grid of community forum topics with topic detail view and create post functionality.
 * Based on Figma design nodes:
 * - 2233-9658: Topic list grid layout
 * - 2284-9745: Topic detail view with comments
 */
export const CommunityForumSection: React.FC<CommunityForumSectionProps> = ({
  topics = [],
  isLoading = false,
  onCreatePost,
  onTopicClick,
  onLikeToggle,
  onCommentClick,
  selectedTopicId,
  onBack,
  sx,
}) => {
  const handleTopicClick = (topic: ForumTopic) => {
    onTopicClick?.(topic);
  };

  const handleCommentClick = (topic: ForumTopic) => {
    onCommentClick?.(topic);
  };

  const handleBack = () => {
    onBack?.();
  };

  // Show detail view if a topic is selected via URL
  if (selectedTopicId) {
    return (
      <Box sx={{ width: '100%', ...sx }}>
        <TopicDetailView
          topicId={selectedTopicId}
          onBack={handleBack}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', ...sx }}>
      {/* Header with Create New Post Button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mb: 3,
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreatePost}
          sx={{
            bgcolor: '#006B60',
            color: 'white',
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
            py: 1,
            fontSize: 14,
            '&:hover': {
              bgcolor: '#005A50',
            },
          }}
        >
          Create New Post
        </Button>
      </Box>

      {/* Topics Grid - 2 columns based on Figma */}
      {isLoading ? (
        <ForumSkeleton />
      ) : topics.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            borderRadius: 4,
            bgcolor: 'background.paper',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          }}
        >
          <Typography variant="subtitle1" color="text.secondary">
            No discussions yet. Start a conversation!
          </Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3,
          }}
        >
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onLikeToggle={onLikeToggle}
              onCommentClick={handleCommentClick}
              onClick={handleTopicClick}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CommunityForumSection;
