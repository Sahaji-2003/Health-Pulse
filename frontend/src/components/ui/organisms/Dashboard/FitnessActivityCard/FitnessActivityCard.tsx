import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { DashboardCard } from '../../../molecules/DashboardCard';
import type { FitnessActivityCardProps, FitnessHistoryItem } from './FitnessActivityCard.types';

/**
 * FitnessActivityCard Organism
 *
 * Displays fitness activity summary with calories burned,
 * today's progress, and activity history.
 */
export const FitnessActivityCard: React.FC<FitnessActivityCardProps> = ({
  caloriesBurned,
  progressPercent,
  history,
  onMoreClick,
  sx,
}) => {
  const theme = useTheme();

  const headerActions = (
    <IconButton size="small" onClick={onMoreClick}>
      <MoreVertIcon sx={{ fontSize: 18 }} />
    </IconButton>
  );

  const HistoryListItem: React.FC<{ item: FitnessHistoryItem }> = ({ item }) => (
    <>
      <ListItem
        sx={{
          px: { xs: 1, sm: 1.5 },
          py: { xs: 0.5, sm: 0.75 },
          minHeight: { xs: 40, sm: 48 },
        }}
      >
        <ListItemIcon sx={{ minWidth: { xs: 28, sm: 32 } }}>
          {item.status === 'pending' ? (
            <PendingIcon sx={{ fontSize: { xs: 18, sm: 20 }, color: theme.palette.warning.main }} />
          ) : (
            <CheckCircleIcon sx={{ fontSize: { xs: 18, sm: 20 }, color: theme.palette.success.main }} />
          )}
        </ListItemIcon>
        <ListItemText
          primary={item.activity}
          secondary={item.date}
          primaryTypographyProps={{
            variant: 'body2',
            color: 'text.primary',
            fontWeight: 400,
            fontSize: { xs: 12, sm: 14 },
          }}
          secondaryTypographyProps={{
            variant: 'caption',
            color: 'text.secondary',
            fontWeight: 500,
            fontSize: { xs: 10, sm: 11 },
          }}
          sx={{
            '& .MuiListItemText-primary': {
              order: 2,
            },
            '& .MuiListItemText-secondary': {
              order: 1,
            },
            display: 'flex',
            flexDirection: 'column-reverse',
          }}
        />
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
            fontSize: { xs: 9, sm: 10 },
          }}
        >
          {item.duration}
        </Typography>
      </ListItem>
      <Divider component="li" sx={{ mx: { xs: 1, sm: 1.5 } }} />
    </>
  );

  return (
    <DashboardCard
      title="Fitness Activity"
      icon={<HistoryIcon />}
      headerActions={headerActions}
      fullWidth
      compact
      sx={{ ...sx, height: '100%' }}
      noPadding
      contentSx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      {/* Stats Row */}
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 1, sm: 1.5 },
          px: { xs: 1.5, sm: 2 },
          py: { xs: 1.5, sm: 2 },
        }}
      >
        {/* Calories Burned */}
        <Box
          sx={{
            flex: 1,
            bgcolor: theme.customColors?.background?.mintLight || '#EFF5F2',
            borderRadius: 2.5,
            p: { xs: 1, sm: 1.25 },
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 1, sm: 1.5 },
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.primary.dark,
              fontWeight: 500,
              fontSize: { xs: 9, sm: 10 },
            }}
          >
            Calories Burned
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: { xs: 0.5, sm: 1 } }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.25 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
                <LocalFireDepartmentIcon sx={{ fontSize: { xs: 16, sm: 20 }, color: theme.palette.warning.main }} />
              </Box>
              <Typography
                sx={{
                  fontSize: { xs: 24, sm: 30 },
                  fontWeight: 400,
                  color: 'text.secondary',
                  lineHeight: { xs: '28px', sm: '36px' },
                }}
              >
                {caloriesBurned}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: { xs: 12, sm: 14 },
                fontWeight: 500,
                color: 'text.secondary',
                pb: 0.25,
              }}
            >
              kcal
            </Typography>
          </Box>
        </Box>

        {/* Today's Progress */}
        <Box
          sx={{
            flex: 1,
            bgcolor: theme.customColors?.background?.mintLight || '#EFF5F2',
            borderRadius: 2.5,
            p: { xs: 1, sm: 1.25 },
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 1, sm: 1.5 },
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.primary.dark,
              fontWeight: 500,
              fontSize: { xs: 9, sm: 10 },
            }}
          >
            Today's Progress
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                variant="determinate"
                value={100}
                size={32}
                thickness={4}
                sx={{
                  color: '#CAE6DF',
                  position: 'absolute',
                }}
              />
              <CircularProgress
                variant="determinate"
                value={progressPercent}
                size={32}
                thickness={4}
                sx={{
                  color: theme.palette.primary.main,
                }}
              />
            </Box>
            <Typography
              sx={{
                fontSize: { xs: 24, sm: 30 },
                fontWeight: 400,
                color: 'text.secondary',
                lineHeight: { xs: '28px', sm: '36px' },
              }}
            >
              {progressPercent}%
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* History Section */}
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          px: 0.75,
        }}
      >
        <Box sx={{ px: 1.5, py: 0.25 }}>
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 500,
              fontSize: { xs: 10, sm: 11 },
            }}
          >
            History
          </Typography>
        </Box>
        <List
          sx={{
            flex: 1,
            overflow: 'auto',
            py: 0,
            pb: 1.5,
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {history.map((item, index) => (
            <HistoryListItem key={index} item={item} />
          ))}
        </List>
      </Box>
    </DashboardCard>
  );
};

export default FitnessActivityCard;
