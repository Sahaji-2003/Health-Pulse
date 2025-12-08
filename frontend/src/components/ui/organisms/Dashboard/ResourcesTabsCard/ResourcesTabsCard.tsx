import React from 'react';
import { Box, Typography, Tabs, Tab, useTheme } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import StarIcon from '@mui/icons-material/Star';
import ArticleIcon from '@mui/icons-material/AutoStories';
import VideocamIcon from '@mui/icons-material/Videocam';
import PodcastsIcon from '@mui/icons-material/Podcasts';
import { DashboardCard } from '../../../molecules/DashboardCard';
import type { ResourcesTabsCardProps, ResourceItem, ResourceTab } from './ResourcesTabsCard.types';

const tabConfig: { label: ResourceTab; icon: React.ReactElement }[] = [
  { label: 'Community', icon: <GroupsIcon /> },
  { label: 'Starred', icon: <StarIcon /> },
  { label: 'Articles', icon: <ArticleIcon /> },
  { label: 'Videos', icon: <VideocamIcon /> },
  { label: 'Podcasts', icon: <PodcastsIcon /> },
];

/**
 * ResourceCard Sub-component
 * Displays a single resource item card
 */
const ResourceCard: React.FC<{
  item: ResourceItem;
  onClick?: () => void;
}> = ({ item, onClick }) => {
  const theme = useTheme();

  return (
    <Box
      onClick={onClick}
      sx={{
        bgcolor: theme.palette.grey[200],
        borderRadius: { xs: 2, sm: 3 },
        overflow: 'hidden',
        width: { xs: 160, sm: 200, md: 260 }, // More responsive widths
        minWidth: { xs: 160, sm: 200, md: 260 },
        height: '100%',
        flexShrink: 0,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: theme.shadows[2],
        },
      }}
    >
      {/* Thumbnail with Image */}
      <Box
        sx={{
          flex: 1,
          bgcolor: theme.palette.grey[300],
          minHeight: { xs: 80, sm: 100 },
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {item.imageUrl ? (
          <Box
            component="img"
            src={item.imageUrl}
            alt={item.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : item.thumbnailUrl ? (
          <Box
            component="img"
            src={item.thumbnailUrl}
            alt={item.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : null}
      </Box>

      {/* Content */}
      <Box sx={{ p: { xs: 1, sm: 1.5 }, display: 'flex', flexDirection: 'column', gap: { xs: 0.5, sm: 0.75 } }}>
        <Box>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              fontSize: { xs: 9, sm: 10 },
            }}
          >
            {item.date}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 400,
              fontSize: { xs: 12, sm: 14 },
            }}
          >
            {item.title}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: 'text.primary',
            fontSize: { xs: 10, sm: 12 },
            lineHeight: { xs: '14px', sm: '18px' },
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {item.description}
        </Typography>
      </Box>
    </Box>
  );
};

/**
 * ResourcesTabsCard Organism
 *
 * Displays resources in a tabbed interface with horizontal
 * scrolling cards.
 */
export const ResourcesTabsCard: React.FC<ResourcesTabsCardProps> = ({
  selectedTab,
  items,
  onTabChange,
  onItemClick,
  sx,
}) => {
  const theme = useTheme();

  const selectedIndex = tabConfig.findIndex((t) => t.label === selectedTab);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    onTabChange?.(tabConfig[newValue].label);
  };

  return (
    <DashboardCard
      fullWidth
      compact
      sx={{ ...sx, height: '100%' }}
      noPadding
      contentSx={{
        display: 'flex',
        flexDirection: 'column',
        pt: 1.5,
        pb: 0,
        overflow: 'hidden',
      }}
    >
      {/* Tabs */}
      <Box sx={{ bgcolor: theme.customColors?.background?.mint || '#F4FBF8' }}>
        <Tabs
          value={selectedIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: { xs: 44, sm: 52 },
            '& .MuiTab-root': {
              minHeight: { xs: 44, sm: 52 },
              minWidth: { xs: 70, sm: 100 },
              textTransform: 'none',
              flexDirection: 'column',
              gap: 0.25,
              py: { xs: 0.75, sm: 1 },
              px: { xs: 1, sm: 1.5 },
              fontSize: { xs: 10, sm: 12 },
              color: 'text.secondary',
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              },
              '& .MuiSvgIcon-root': {
                fontSize: { xs: 16, sm: 18 },
              },
            },
            '& .MuiTabs-indicator': {
              height: 2,
              borderRadius: '100px 100px 0 0',
            },
          }}
        >
          {tabConfig.map((tab) => (
            <Tab
              key={tab.label}
              icon={tab.icon}
              label={tab.label}
              iconPosition="top"
            />
          ))}
        </Tabs>
      </Box>

      {/* Content Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          gap: { xs: 1, sm: 1.5 },
          p: { xs: 1.5, sm: 2 },
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {items.map((item) => (
          <ResourceCard
            key={item.id}
            item={item}
            onClick={() => onItemClick?.(item)}
          />
        ))}
      </Box>
    </DashboardCard>
  );
};

export default ResourcesTabsCard;
