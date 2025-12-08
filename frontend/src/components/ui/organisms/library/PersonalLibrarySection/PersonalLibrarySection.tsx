import React from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
} from '@mui/material';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import { ResourceCard } from '../ResourceCard';
import type { PersonalLibrarySectionProps } from './PersonalLibrarySection.types';

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'exercise', label: 'Exercise' },
  { value: 'nutrition', label: 'Nutrition' },
  { value: 'mental_health', label: 'Mental Health' },
  { value: 'sleep', label: 'Sleep' },
  { value: 'wellness', label: 'Wellness' },
];

/**
 * EmptyState Component
 * 
 * Displays when the personal library has no saved resources.
 * Based on Figma design node 2233-7043.
 */
const EmptyState: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 8,
      px: 4,
      minHeight: 400,
    }}
  >
    <Typography
      variant="subtitle1"
      sx={{
        color: 'primary.main',
        fontWeight: 600,
        textAlign: 'center',
        mb: 4,
      }}
    >
      No saved resources.
    </Typography>
    
    {/* Books illustration using MUI icon */}
    <Box
      sx={{
        width: 120,
        height: 120,
        borderRadius: '50%',
        bgcolor: '#FDF3E7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 2,
      }}
    >
      <AutoStoriesOutlinedIcon
        sx={{
          fontSize: 56,
          color: '#4CAF50',
        }}
      />
    </Box>
  </Box>
);

/**
 * PersonalLibrarySkeleton Component
 * 
 * Loading skeleton for the personal library section
 */
const PersonalLibrarySkeleton: React.FC = () => (
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
    {Array.from({ length: 4 }).map((_, index) => (
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
 * PersonalLibrarySection Component
 * 
 * Displays the user's saved resources with category filtering.
 * Shows empty state when no resources are saved.
 * Based on Figma design node 2233-7043.
 */
export const PersonalLibrarySection: React.FC<PersonalLibrarySectionProps> = ({
  resources = [],
  isLoading = false,
  category = 'all',
  onCategoryChange,
  onSaveToggle,
  onResourceClick,
  sx,
}) => {
  const handleCategoryChange = (event: { target: { value: string } }) => {
    onCategoryChange?.(event.target.value);
  };

  return (
    <Box sx={{ width: '100%', ...sx }}>
      {/* Category Filter - Top Right */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mb: 2,
        }}
      >
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={category}
            label="Category"
            onChange={handleCategoryChange}
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
            }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.value} value={cat.value}>
                {cat.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Content Area */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 6,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'rgba(111, 121, 118, 0.16)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          minHeight: 500,
        }}
      >
        {isLoading ? (
          <PersonalLibrarySkeleton />
        ) : resources.length === 0 ? (
          <EmptyState />
        ) : (
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
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onSaveToggle={onSaveToggle}
                onClick={onResourceClick}
                sx={{ maxWidth: 'none' }}
              />
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default PersonalLibrarySection;
