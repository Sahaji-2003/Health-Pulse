import React from 'react';
import {
  Box,
  Paper,
  Skeleton,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
} from '@mui/material';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import type { VideosSectionProps } from './VideosSection.types';
import type { Resource } from '../ResourceCard';

// Mock data for videos with health-related content
const defaultVideos: Resource[] = [
  {
    id: 'v1',
    title: '10-Minute Morning Yoga Routine',
    description: 'Start your day with this energizing yoga flow designed to wake up your body and calm your mind.',
    dateLabel: 'Today',
    category: 'Fitness',
    isSaved: false,
    type: 'video',
    url: 'https://www.youtube.com/watch?v=4pKly2JojMw',
  },
  {
    id: 'v2',
    title: 'Understanding Blood Pressure',
    description: 'Learn what your blood pressure numbers mean and how to maintain healthy levels naturally.',
    dateLabel: 'Yesterday',
    category: 'Health Education',
    isSaved: true,
    type: 'video',
    url: 'https://www.youtube.com/watch?v=Ab9OZsDECZw',
  },
  {
    id: 'v3',
    title: 'Healthy Meal Prep for Beginners',
    description: 'Step-by-step guide to preparing nutritious meals for the entire week in just 2 hours.',
    dateLabel: '2 days ago',
    category: 'Nutrition',
    isSaved: false,
    type: 'video',
    url: 'https://www.youtube.com/watch?v=N3-cxA__bP8',
  },
  {
    id: 'v4',
    title: 'Sleep Hygiene Tips',
    description: 'Expert advice on creating the perfect sleep environment and developing healthy bedtime habits.',
    dateLabel: '3 days ago',
    category: 'Sleep',
    isSaved: true,
    type: 'video',
    url: 'https://www.youtube.com/watch?v=t0kACis_dJE',
  },
  {
    id: 'v5',
    title: 'Stress Management Techniques',
    description: 'Practical breathing exercises and mindfulness techniques to reduce daily stress and anxiety.',
    dateLabel: 'Last week',
    category: 'Mental Health',
    isSaved: false,
    type: 'video',
    url: 'https://www.youtube.com/watch?v=15GaKTP0gFE',
  },
  {
    id: 'v6',
    title: 'Home Workout: No Equipment Needed',
    description: 'Full-body workout routine you can do anywhere without any gym equipment.',
    dateLabel: 'Last week',
    category: 'Fitness',
    isSaved: true,
    type: 'video',
    url: 'https://www.youtube.com/watch?v=cbKkB3POqaY',
  },
  {
    id: 'v7',
    title: 'Heart-Healthy Diet Explained',
    description: 'Cardiologist explains the best foods for maintaining a healthy heart and cardiovascular system.',
    dateLabel: '2 weeks ago',
    category: 'Nutrition',
    isSaved: false,
    type: 'video',
    url: 'https://www.youtube.com/watch?v=xJN5L_reFaI',
  },
  {
    id: 'v8',
    title: 'Meditation for Beginners',
    description: 'A gentle introduction to meditation practice with guided exercises for newcomers.',
    dateLabel: '2 weeks ago',
    category: 'Mental Health',
    isSaved: false,
    type: 'video',
    url: 'https://www.youtube.com/watch?v=U9YKY7fdwyg',
  },
];

/**
 * VideoCard Component
 * 
 * Individual video card with play button overlay
 */
interface VideoCardProps {
  resource: Resource;
  onSaveToggle?: (resourceId: string, isSaved: boolean) => void;
  onClick?: (resource: Resource) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ resource, onSaveToggle, onClick }) => {
  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSaveToggle?.(resource.id, !resource.isSaved);
  };

  const handleCardClick = () => {
    // Open external URL in new tab if available
    if (resource.url) {
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    }
    onClick?.(resource);
  };

  // Generate placeholder color based on category
  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      'Fitness': '#E8F5E9',
      'Health Education': '#E3F2FD',
      'Nutrition': '#FFF3E0',
      'Sleep': '#EDE7F6',
      'Mental Health': '#FCE4EC',
    };
    return colors[category || ''] || '#E0E0E0';
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        cursor: 'pointer',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'rgba(111, 121, 118, 0.08)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      {/* Video Thumbnail with Play Button */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          sx={{
            height: 160,
            bgcolor: getCategoryColor(resource.category),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Play Button Overlay */}
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: 'rgba(0, 107, 96, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          >
            <PlayCircleFilledIcon
              sx={{
                fontSize: 40,
                color: 'white',
              }}
            />
          </Box>
        </CardMedia>

        {/* Bookmark Button */}
        <IconButton
          onClick={handleSaveClick}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              bgcolor: 'white',
            },
          }}
          size="small"
        >
          {resource.isSaved ? (
            <BookmarkIcon sx={{ color: 'primary.main' }} />
          ) : (
            <BookmarkBorderIcon sx={{ color: 'text.secondary' }} />
          )}
        </IconButton>

        {/* Duration Badge */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: 12,
          }}
        >
          <AccessTimeIcon sx={{ fontSize: 14 }} />
          <Typography variant="caption" sx={{ color: 'inherit' }}>
            10:30
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ p: 2 }}>
        {/* Category Chip */}
        {resource.category && (
          <Chip
            label={resource.category}
            size="small"
            sx={{
              mb: 1,
              height: 24,
              fontSize: 11,
              bgcolor: 'rgba(0, 107, 96, 0.08)',
              color: 'primary.main',
              fontWeight: 500,
            }}
          />
        )}

        {/* Title */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 0.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.3,
          }}
        >
          {resource.title}
        </Typography>

        {/* Date */}
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            display: 'block',
            mb: 1,
          }}
        >
          {resource.dateLabel}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.5,
          }}
        >
          {resource.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

/**
 * VideosSkeleton Component
 * 
 * Loading skeleton for the videos grid
 */
const VideosSkeleton: React.FC = () => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(4, 1fr)',
      },
      gap: 2,
    }}
  >
    {Array.from({ length: 8 }).map((_, index) => (
      <Paper
        key={index}
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          bgcolor: 'background.paper',
        }}
      >
        <Skeleton variant="rectangular" height={160} />
        <Box sx={{ p: 2 }}>
          <Skeleton variant="rounded" width={80} height={24} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="90%" height={24} />
          <Skeleton variant="text" width="40%" height={16} />
          <Skeleton variant="text" width="100%" height={40} />
        </Box>
      </Paper>
    ))}
  </Box>
);

/**
 * VideosSection Component
 * 
 * Displays a grid of video resource cards with play buttons and bookmark functionality.
 */
export const VideosSection: React.FC<VideosSectionProps> = ({
  resources,
  isLoading = false,
  onSaveToggle,
  onResourceClick,
  sx,
}) => {
  // Use provided resources or fall back to default only if resources is explicitly undefined
  const displayResources = resources ?? defaultVideos;

  if (isLoading) {
    return (
      <Box sx={{ ...sx }}>
        <VideosSkeleton />
      </Box>
    );
  }

  if (displayResources.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 6,
          borderRadius: 6,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'rgba(111, 121, 118, 0.16)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 400,
          ...sx,
        }}
      >
        <PlayCircleFilledIcon
          sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }}
        />
        <Typography
          variant="h6"
          sx={{
            color: 'primary.main',
            fontWeight: 600,
            textAlign: 'center',
            mb: 1,
          }}
        >
          No videos available
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
          }}
        >
          Check back later for new health and wellness videos.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 6,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'rgba(111, 121, 118, 0.16)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden',
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 2,
        }}
      >
        {displayResources.map((resource) => (
          <VideoCard
            key={resource.id}
            resource={resource}
            onSaveToggle={onSaveToggle}
            onClick={onResourceClick}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default VideosSection;
