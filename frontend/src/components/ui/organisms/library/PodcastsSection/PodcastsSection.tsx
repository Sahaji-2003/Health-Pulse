import React from 'react';
import {
  Box,
  Paper,
  Skeleton,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
  Avatar,
} from '@mui/material';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import type { PodcastsSectionProps } from './PodcastsSection.types';
import type { Resource } from '../ResourceCard';

// Mock data for podcasts with health-related content
const defaultPodcasts: Resource[] = [
  {
    id: 'p1',
    title: 'The Science of Sleep',
    description: 'Dr. Sarah Johnson discusses the latest research on sleep cycles and how to optimize your rest for better health.',
    dateLabel: 'Today',
    category: 'Sleep Science',
    isSaved: false,
    type: 'podcast',
    url: 'https://www.youtube.com/watch?v=pwaWilO_Pig',
  },
  {
    id: 'p2',
    title: 'Nutrition Myths Debunked',
    description: 'Registered dietitian breaks down common nutrition misconceptions and reveals what actually works.',
    dateLabel: 'Yesterday',
    category: 'Nutrition',
    isSaved: true,
    type: 'podcast',
    url: 'https://www.youtube.com/watch?v=1xk0yKfrMl0',
  },
  {
    id: 'p3',
    title: 'Mental Health Matters',
    description: 'Weekly conversations about anxiety, depression, and practical coping strategies from mental health experts.',
    dateLabel: '2 days ago',
    category: 'Mental Health',
    isSaved: false,
    type: 'podcast',
    url: 'https://www.youtube.com/watch?v=3QIfkeA6HBY',
  },
  {
    id: 'p4',
    title: 'Fitness Over 40',
    description: 'Age-appropriate exercise routines and tips for staying active and healthy in your 40s, 50s, and beyond.',
    dateLabel: '3 days ago',
    category: 'Fitness',
    isSaved: true,
    type: 'podcast',
    url: 'https://www.youtube.com/watch?v=K7GDXK4VD2c',
  },
  {
    id: 'p5',
    title: 'Heart Health Hour',
    description: 'Cardiologists share insights on preventing heart disease and maintaining cardiovascular wellness.',
    dateLabel: 'Last week',
    category: 'Heart Health',
    isSaved: false,
    type: 'podcast',
    url: 'https://www.youtube.com/watch?v=beHDR6K4Bfo',
  },
  {
    id: 'p6',
    title: 'Mindful Living',
    description: 'Explore meditation, mindfulness practices, and their scientifically-proven benefits for body and mind.',
    dateLabel: 'Last week',
    category: 'Wellness',
    isSaved: true,
    type: 'podcast',
    url: 'https://www.youtube.com/watch?v=lACf4O_eSt0',
  },
  {
    id: 'p7',
    title: 'Diabetes Daily',
    description: 'Managing diabetes through diet, exercise, and lifestyle changes. Expert advice and patient stories.',
    dateLabel: '2 weeks ago',
    category: 'Chronic Conditions',
    isSaved: false,
    type: 'podcast',
    url: 'https://www.youtube.com/watch?v=fYIzwLCmLZQ',
  },
  {
    id: 'p8',
    title: 'Women\'s Wellness',
    description: 'Health topics specifically relevant to women, from hormonal health to preventive care.',
    dateLabel: '2 weeks ago',
    category: 'Women\'s Health',
    isSaved: false,
    type: 'podcast',
    url: 'https://www.youtube.com/watch?v=xB8BX8Q_6Cc',
  },
];

/**
 * PodcastCard Component
 * 
 * Individual podcast card with audio visualization style
 */
interface PodcastCardProps {
  resource: Resource;
  onSaveToggle?: (resourceId: string, isSaved: boolean) => void;
  onClick?: (resource: Resource) => void;
}

const PodcastCard: React.FC<PodcastCardProps> = ({ resource, onSaveToggle, onClick }) => {
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

  // Generate color based on category
  const getCategoryColor = (category?: string) => {
    const colors: Record<string, { bg: string; accent: string }> = {
      'Sleep Science': { bg: '#EDE7F6', accent: '#7C4DFF' },
      'Nutrition': { bg: '#FFF3E0', accent: '#FF9800' },
      'Mental Health': { bg: '#FCE4EC', accent: '#E91E63' },
      'Fitness': { bg: '#E8F5E9', accent: '#4CAF50' },
      'Heart Health': { bg: '#FFEBEE', accent: '#F44336' },
      'Wellness': { bg: '#E0F7FA', accent: '#00BCD4' },
      'Chronic Conditions': { bg: '#FFF8E1', accent: '#FFC107' },
      'Women\'s Health': { bg: '#F3E5F5', accent: '#9C27B0' },
    };
    return colors[category || ''] || { bg: '#E0E0E0', accent: '#757575' };
  };

  const categoryColors = getCategoryColor(resource.category);

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
      {/* Podcast Cover with Audio Visualization */}
      <Box
        sx={{
          height: 160,
          bgcolor: categoryColors.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Audio Visualization Background */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60%',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: 0.5,
            px: 3,
            opacity: 0.3,
          }}
        >
          {[40, 70, 50, 80, 45, 90, 55, 75, 60, 85, 50, 70, 45, 80, 55].map((height, i) => (
            <Box
              key={i}
              sx={{
                width: 4,
                height: `${height}%`,
                bgcolor: categoryColors.accent,
                borderRadius: 1,
              }}
            />
          ))}
        </Box>

        {/* Podcast Icon Avatar */}
        <Avatar
          sx={{
            width: 72,
            height: 72,
            bgcolor: categoryColors.accent,
            zIndex: 1,
          }}
        >
          <HeadphonesIcon sx={{ fontSize: 36, color: 'white' }} />
        </Avatar>

        {/* Play Button */}
        <IconButton
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            bgcolor: 'rgba(0, 107, 96, 0.9)',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.main',
            },
          }}
          size="small"
        >
          <PlayArrowIcon />
        </IconButton>

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
          <GraphicEqIcon sx={{ fontSize: 14 }} />
          <Typography variant="caption" sx={{ color: 'inherit' }}>
            45 min
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
              bgcolor: `${categoryColors.accent}15`,
              color: categoryColors.accent,
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
 * PodcastsSkeleton Component
 * 
 * Loading skeleton for the podcasts grid
 */
const PodcastsSkeleton: React.FC = () => (
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
          <Skeleton variant="rounded" width={100} height={24} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="85%" height={24} />
          <Skeleton variant="text" width="35%" height={16} />
          <Skeleton variant="text" width="100%" height={40} />
        </Box>
      </Paper>
    ))}
  </Box>
);

/**
 * PodcastsSection Component
 * 
 * Displays a grid of podcast resource cards with audio-style visualization and bookmark functionality.
 */
export const PodcastsSection: React.FC<PodcastsSectionProps> = ({
  resources,
  isLoading = false,
  onSaveToggle,
  onResourceClick,
  sx,
}) => {
  // Use provided resources or fall back to default only if resources is explicitly undefined
  const displayResources = resources ?? defaultPodcasts;

  if (isLoading) {
    return (
      <Box sx={{ ...sx }}>
        <PodcastsSkeleton />
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
        <HeadphonesIcon
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
          No podcasts available
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
          }}
        >
          Check back later for new health and wellness podcasts.
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
          <PodcastCard
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

export default PodcastsSection;
