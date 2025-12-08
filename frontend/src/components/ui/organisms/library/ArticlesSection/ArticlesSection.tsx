import React from 'react';
import { Box, Paper, Skeleton, Typography } from '@mui/material';
import { ResourceCard } from '../ResourceCard';
import type { ArticlesSectionProps } from './ArticlesSection.types';
import type { Resource } from '../ResourceCard';

// Mock data for articles with images from assets/library
const defaultArticles: Resource[] = [
  {
    id: '1',
    title: 'Heart Health Essentials',
    description: 'Learn the fundamentals of maintaining a healthy heart through proper diet, exercise, and stress management techniques.',
    imageUrl: '/assets/library/1.jpeg',
    dateLabel: 'Today',
    category: 'Cardiology',
    isSaved: false,
    type: 'article',
  },
  {
    id: '2',
    title: 'Fitness for Beginners',
    description: 'A comprehensive guide to starting your fitness journey with beginner-friendly exercises and workout plans.',
    imageUrl: '/assets/library/2.jpeg',
    dateLabel: 'Yesterday',
    category: 'Exercise',
    isSaved: true,
    type: 'article',
  },
  {
    id: '3',
    title: 'Nutrition and Wellness',
    description: 'Discover the best foods and nutrition tips to boost your energy and improve overall wellness and health.',
    imageUrl: '/assets/library/6.jpeg',
    dateLabel: '2 days ago',
    category: 'Nutrition',
    isSaved: true,
    type: 'article',
  },
  {
    id: '4',
    title: 'Mental Health Guide',
    description: 'Understanding mental health, stress management, and techniques for maintaining psychological well-being.',
    imageUrl: '/assets/library/4.jpeg',
    dateLabel: '3 days ago',
    category: 'Mental Health',
    isSaved: false,
    type: 'article',
  },
  {
    id: '5',
    title: 'Sleep and Recovery',
    description: 'Improve sleep quality with evidence-based tips and create a healthy sleep schedule for better rest.',
    imageUrl: '/assets/library/5.jpeg',
    dateLabel: '4 days ago',
    category: 'Sleep',
    isSaved: true,
    type: 'article',
  },
  {
    id: '6',
    title: 'Healthy Aging Tips',
    description: 'A guide to maintaining vitality and health as you age with proper lifestyle and preventive care.',
    imageUrl: '/assets/library/3.jpeg',
    dateLabel: '5 days ago',
    category: 'Wellness',
    isSaved: false,
    type: 'article',
  },
  {
    id: '7',
    title: 'Chronic Disease Management',
    description: 'Learn how to effectively manage chronic conditions through lifestyle changes and medical care.',
    imageUrl: '/assets/library/7.jpeg',
    dateLabel: '6 days ago',
    category: 'Health',
    isSaved: true,
    type: 'article',
  },
  {
    id: '8',
    title: 'Immune System Boost',
    description: 'Strengthen your immune system naturally with proper nutrition, exercise, and healthy lifestyle habits.',
    imageUrl: '/assets/library/8.jpeg',
    dateLabel: '1 week ago',
    category: 'Immunity',
    isSaved: false,
    type: 'article',
  },
];

/**
 * ArticlesSkeleton Component
 * 
 * Loading skeleton for the articles grid
 */
const ArticlesSkeleton: React.FC = () => (
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
          p: 2,
          borderRadius: 4,
          bgcolor: 'background.paper',
        }}
      >
        <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2, mb: 2 }} />
        <Skeleton variant="text" width="60%" height={20} />
        <Skeleton variant="text" width="40%" height={16} />
        <Skeleton variant="text" width="80%" height={16} />
        <Skeleton variant="text" width="100%" height={48} />
      </Paper>
    ))}
  </Box>
);

/**
 * ArticlesSection Component
 * 
 * Displays a grid of article resource cards with bookmark functionality.
 * Based on Figma design node 2226-2125.
 */
export const ArticlesSection: React.FC<ArticlesSectionProps> = ({
  resources,
  isLoading = false,
  onSaveToggle,
  onResourceClick,
  sx,
}) => {
  // Use provided resources or fall back to default only if resources is explicitly undefined
  const displayResources = resources ?? defaultArticles;

  if (isLoading) {
    return (
      <Box sx={{ p: 3, ...sx }}>
        <ArticlesSkeleton />
      </Box>
    );
  }

  if (displayResources.length === 0) {
    return (
      <Box
        sx={{
          p: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 400,
          ...sx,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: 'primary.main',
            fontWeight: 600,
            textAlign: 'center',
            mb: 2,
          }}
        >
          No articles available
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
          }}
        >
          Check back later for new health articles and resources.
        </Typography>
      </Box>
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
          <ResourceCard
            key={resource.id}
            resource={resource}
            onSaveToggle={onSaveToggle}
            onClick={onResourceClick}
            sx={{ maxWidth: 'none' }}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default ArticlesSection;
