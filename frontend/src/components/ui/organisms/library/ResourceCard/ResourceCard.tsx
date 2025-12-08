import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Skeleton,
} from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import type { ResourceCardProps } from './ResourceCard.types';

/**
 * ResourceCard Component
 * 
 * A card component for displaying library resources (articles, videos, podcasts)
 * with bookmark functionality. Based on Figma design node 2226-2125.
 */
export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onSaveToggle,
  onClick,
  sx,
}) => {
  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Bookmark clicked for resource:', resource.id, 'Current saved state:', resource.isSaved);
    if (onSaveToggle) {
      console.log('Calling onSaveToggle...');
      onSaveToggle(resource.id, !resource.isSaved);
    } else {
      console.warn('onSaveToggle is not provided!');
    }
  };

  const handleCardClick = () => {
    // Open external URL in new tab if available
    if (resource.url) {
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    }
    onClick?.(resource);
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        width: '100%',
        maxWidth: 304,
        borderRadius: 4,
        bgcolor: 'background.paper',
        boxShadow: 'none',
        border: '1px solid',
        borderColor: 'rgba(111, 121, 118, 0.16)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        } : {},
        overflow: 'hidden',
        ...sx,
      }}
    >
      {/* Image Placeholder */}
      <CardMedia
        sx={{
          height: 160,
          bgcolor: '#E3EAE7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {resource.imageUrl ? (
          <Box
            component="img"
            src={resource.imageUrl}
            alt={resource.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Skeleton 
            variant="rectangular" 
            width="100%" 
            height="100%" 
            animation={false}
            sx={{ bgcolor: '#D9D9D9' }}
          />
        )}
      </CardMedia>

      {/* Card Content */}
      <CardContent sx={{ p: 2 }}>
        {/* Date and Bookmark Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              letterSpacing: 0.5,
              lineHeight: '16px',
            }}
          >
            {resource.dateLabel}
          </Typography>
          <IconButton
            size="small"
            onClick={handleSaveClick}
            sx={{
              p: 0.5,
              color: resource.isSaved ? 'primary.main' : 'text.secondary',
            }}
            aria-label={resource.isSaved ? 'Remove from library' : 'Add to library'}
          >
            {resource.isSaved ? (
              <BookmarkIcon fontSize="small" />
            ) : (
              <BookmarkBorderIcon fontSize="small" />
            )}
          </IconButton>
        </Box>

        {/* Category */}
        <Box sx={{ mb: 1 }}>
          {resource.category && (
            <Typography
              variant="body1"
              sx={{
                color: 'primary.main',
                fontWeight: 400,
                letterSpacing: 0.5,
                lineHeight: '24px',
              }}
            >
              {resource.category}
            </Typography>
          )}
        </Box>

        {/* Title/Description */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.primary',
            fontWeight: 400,
            letterSpacing: 0.25,
            lineHeight: '20px',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {resource.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
