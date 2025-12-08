import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Avatar,
  IconButton,
  useTheme,
  Skeleton,
  InputAdornment,
  Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import type { NetworkFeedProps, FriendWorkout } from './NetworkFeed.types';

// 3D Avatar image path
const avatar3D = '/assets/9bf85657768890adce0bc6ec7465d29b46d08d7d.png';

const DEFAULT_WORKOUTS: FriendWorkout[] = [
  { id: '1', userName: 'Jennifer Gylnn', workoutType: 'Weight Lifting', caloriesBurnt: 1500, duration: '2hrs', likes: 564, isLiked: true },
  { id: '2', userName: 'Jennifer Gylnn', workoutType: 'Weight Lifting', caloriesBurnt: 1500, duration: '2hrs', likes: 564, isLiked: true },
  { id: '3', userName: 'Jennifer Gylnn', workoutType: 'Weight Lifting', caloriesBurnt: 1500, duration: '2hrs', likes: 564, isLiked: true },
  { id: '4', userName: 'Jennifer Gylnn', workoutType: 'Weight Lifting', caloriesBurnt: 1500, duration: '2hrs', likes: 564, isLiked: true },
  { id: '5', userName: 'Jennifer Gylnn', workoutType: 'Weight Lifting', caloriesBurnt: 1500, duration: '2hrs', likes: 564, isLiked: false },
  { id: '6', userName: 'Jennifer Gylnn', workoutType: 'Weight Lifting', caloriesBurnt: 1500, duration: '2hrs', likes: 564, isLiked: false },
];

/**
 * WorkoutCard Component
 *
 * Individual card showing a friend's workout with like functionality
 */
interface WorkoutCardProps {
  workout: FriendWorkout;
  onLikeToggle?: (workoutId: string) => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onLikeToggle }) => {
  const theme = useTheme();
  const [isLiked, setIsLiked] = useState(workout.isLiked);
  const [likes, setLikes] = useState(workout.likes);

  const handleLikeClick = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikes((prev) => (newLikedState ? prev + 1 : prev - 1));
    if (onLikeToggle) {
      onLikeToggle(workout.id);
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 6,
        border: `1px solid rgba(111, 121, 118, 0.16)`,
        bgcolor: theme.palette.background.paper,
        height: '100%',
        maxWidth: 340,
      }}
    >
      <CardContent sx={{ p: 2, pb: 1.5 }}>
        {/* User Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            pb: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Avatar
            src={workout.userAvatar || avatar3D}
            alt={workout.userName}
            sx={{
              width: 28,
              height: 28,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              fontSize: '1.25rem',
              lineHeight: '28px',
              color: theme.palette.primary.dark,
            }}
          >
            {workout.userName}
          </Typography>
        </Box>

        {/* Workout Details */}
        <Box sx={{ py: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.875rem' }}>
              Workout Type:
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
              {workout.workoutType}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.875rem' }}>
              Calories burnt:
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
              {workout.caloriesBurnt}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.875rem' }}>
              Duration:
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
              {workout.duration}
            </Typography>
          </Box>
        </Box>

        {/* Likes Section */}
        <Box
          sx={{
            pt: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <IconButton
            onClick={handleLikeClick}
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              width: 36,
              height: 36,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            {isLiked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography
              sx={{
                fontSize: '1.75rem',
                lineHeight: '36px',
                fontWeight: 400,
                color: 'text.secondary',
              }}
            >
              {likes}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: 'text.secondary',
              }}
            >
              Likes
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

/**
 * NetworkFeed Organism Component
 *
 * Social feed showing friends' workout posts with search
 * functionality and like interactions.
 */
export const NetworkFeed: React.FC<NetworkFeedProps> = ({
  workouts = DEFAULT_WORKOUTS,
  searchQuery: propsSearchQuery,
  onSearchChange,
  onLikeToggle,
  isLoading = false,
}) => {
  const theme = useTheme();

  // Local search state if not controlled
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const searchQuery = propsSearchQuery ?? localSearchQuery;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setLocalSearchQuery(value);
    }
  };

  // Filter workouts based on search query
  const filteredWorkouts = workouts.filter((workout) =>
    workout.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading skeleton
  if (isLoading) {
    return (
      <Box>
        {/* Search skeleton */}
        <Skeleton variant="rounded" height={48} sx={{ mb: 3, borderRadius: 6 }} />

        {/* Cards skeleton */}
        <Grid container spacing={2}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Skeleton variant="rounded" height={280} sx={{ borderRadius: 6 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      {/* Search Bar */}
      <TextField
        placeholder="Search Friends"
        value={searchQuery}
        onChange={handleSearchChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 3,
          width: '100%',
          maxWidth: 500,
          '& .MuiOutlinedInput-root': {
            borderRadius: 6,
            bgcolor: 'rgba(0, 0, 0, 0.03)',
            boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.15)',
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.12)',
            },
            '&:hover fieldset': {
              borderColor: theme.palette.divider,
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.main,
            },
          },
        }}
      />

      {/* Workout Cards Grid */}
      <Grid container spacing={2}>
        {filteredWorkouts.map((workout) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={workout.id}>
            <WorkoutCard workout={workout} onLikeToggle={onLikeToggle} />
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {filteredWorkouts.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            color: 'text.secondary',
          }}
        >
          <Typography variant="h6">No workouts found</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {searchQuery
              ? `No friends matching "${searchQuery}"`
              : "Your friends haven't shared any workouts yet"}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default NetworkFeed;
