import React from 'react';
import { Tabs, Tab, Box, Divider } from '@mui/material';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import PodcastsOutlinedIcon from '@mui/icons-material/PodcastsOutlined';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Diversity2OutlinedIcon from '@mui/icons-material/Diversity2Outlined';
import type { LibraryTabsProps, LibraryTabValue } from './LibraryTabs.types';

interface TabItem {
  value: LibraryTabValue;
  label: string;
  icon: React.ReactElement;
}

const tabs: TabItem[] = [
  { value: 'articles', label: 'Articles', icon: <AutoStoriesOutlinedIcon /> },
  { value: 'videos', label: 'Videos', icon: <VideocamOutlinedIcon /> },
  { value: 'podcasts', label: 'Podcasts', icon: <PodcastsOutlinedIcon /> },
  { value: 'personal', label: 'Personal Library', icon: <BookmarkIcon /> },
  { value: 'community', label: 'Community Forum', icon: <Diversity2OutlinedIcon /> },
];

/**
 * LibraryTabs Component
 * 
 * Navigation tabs for the Library section with icons.
 * Based on Figma design nodes 2226-2125, 2233-7043, 2233-9658.
 */
export const LibraryTabs: React.FC<LibraryTabsProps> = ({
  value,
  onChange,
  sx,
}) => {
  const handleChange = (_event: React.SyntheticEvent, newValue: LibraryTabValue) => {
    onChange(newValue);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default', ...sx }}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          minHeight: 64,
          '& .MuiTabs-indicator': {
            height: 3,
            borderTopLeftRadius: 100,
            borderTopRightRadius: 100,
            bgcolor: 'primary.main',
          },
          '& .MuiTabs-flexContainer': {
            gap: 0,
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            icon={tab.icon}
            label={tab.label}
            iconPosition="top"
            sx={{
              minWidth: 120,
              minHeight: 64,
              px: 2,
              py: 1,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: 14,
              letterSpacing: 0.1,
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'primary.main',
              },
              '& .MuiTab-iconWrapper': {
                mb: 0.5,
              },
            }}
          />
        ))}
      </Tabs>
      <Divider />
    </Box>
  );
};

export default LibraryTabs;
