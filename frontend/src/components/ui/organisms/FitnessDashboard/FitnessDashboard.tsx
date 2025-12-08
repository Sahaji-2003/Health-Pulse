import React, { useState } from 'react';
import {
  Box,
  Chip,
  TextField,
  MenuItem,
  Button,
  Typography,
  Stack,
  useTheme,
  Skeleton,
  Grid,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { FitnessStatCard } from '../../molecules/FitnessStatCard';
import type { FitnessDashboardProps, FitnessTab, DailyGoals } from './FitnessDashboard.types';

const TABS: { label: string; value: FitnessTab }[] = [
  { label: 'Dashboard', value: 'dashboard' },
  { label: 'Workout History', value: 'history' },
  { label: 'Workout Entry', value: 'entry' },
  { label: 'Network Feed', value: 'feed' },
];

const DURATION_OPTIONS = [
  { value: 'this_week', label: 'This Week' },
  { value: 'last_week', label: 'Last Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
];

/**
 * FitnessDashboard Organism Component
 *
 * Main dashboard view for the Fitness Activity page.
 * Contains filter chips, stat cards, and daily goals form.
 */
export const FitnessDashboard: React.FC<FitnessDashboardProps> = ({
  activeTab = 'dashboard',
  onTabChange,
  selectedDuration = 'this_week',
  onDurationChange,
  dailyGoals: propsDailyGoals,
  onDailyGoalsChange,
  onSave,
  isEditing = false,
  onEditToggle,
  isLoading = false,
  stats,
  hideTabs = false,
}) => {
  const theme = useTheme();

  // Local state for daily goals if not controlled
  const [localDailyGoals, setLocalDailyGoals] = useState<DailyGoals>({
    workouts: '',
    calories: '',
    duration: '',
    distance: '',
  });

  const dailyGoals = propsDailyGoals || localDailyGoals;

  const handleGoalChange = (field: keyof DailyGoals) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newGoals = { ...dailyGoals, [field]: event.target.value };
    if (onDailyGoalsChange) {
      onDailyGoalsChange(newGoals);
    } else {
      setLocalDailyGoals(newGoals);
    }
  };

  const handleTabClick = (tab: FitnessTab) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  // Default stats if not provided
  const defaultStats = {
    totalWorkouts: { current: 2, goal: 4 },
    totalCalories: { current: 2500, goal: 5000 },
    totalDuration: { current: 175, goal: 350 },
    totalDistance: { current: 5.0, goal: 10.0 },
  };

  const fitnessStats = stats || defaultStats;

  // Loading skeleton
  if (isLoading) {
    return (
      <Box>
        {/* Filter chips skeleton */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rounded" width={120} height={32} sx={{ borderRadius: 4 }} />
          ))}
        </Box>

        {/* Stat cards skeleton */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[1, 2, 3, 4].map((i) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={i}>
              <Skeleton variant="rounded" height={400} sx={{ borderRadius: 7 }} />
            </Grid>
          ))}
        </Grid>

        {/* Daily goals skeleton */}
        <Skeleton variant="text" width={150} height={40} sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((i) => (
            <Grid size={{ xs: 12, sm: 6 }} key={i}>
              <Skeleton variant="rounded" height={56} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      {/* Filter chips and Duration selector */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' },
          gap: 2,
          mb: 3,
        }}
      >
        {/* Filter chips - only show if hideTabs is false */}
        {!hideTabs ? (
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexWrap: 'wrap',
              gap: 1,
              '& > *': { flexShrink: 0 },
            }}
          >
            {TABS.map((tab) => (
              <Chip
                key={tab.value}
                label={tab.label}
                onClick={() => handleTabClick(tab.value)}
                icon={activeTab === tab.value ? <CheckIcon /> : undefined}
                variant={activeTab === tab.value ? 'filled' : 'outlined'}
                color={activeTab === tab.value ? 'primary' : 'default'}
                sx={{
                  borderRadius: 2,
                  fontWeight: 500,
                  px: 1,
                  '& .MuiChip-icon': {
                    fontSize: 18,
                  },
                }}
              />
            ))}
          </Stack>
        ) : (
          <Box sx={{ flex: 1 }} />
        )}

        {/* Duration selector */}
        <TextField
          select
          label="Duration"
          value={selectedDuration}
          onChange={(e) => onDurationChange?.(e.target.value)}
          size="small"
          helperText="Select duration"
          sx={{
            minWidth: { xs: '100%', sm: 180 },
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
            },
          }}
        >
          {DURATION_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Stat Cards Grid */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <FitnessStatCard
            title="Total Workouts"
            goal={`Goal - ${fitnessStats.totalWorkouts.goal}`}
            currentValue={fitnessStats.totalWorkouts.current}
            targetValue={fitnessStats.totalWorkouts.goal}
            progressLabel="Count"
            icon={<FitnessCenterIcon />}
            dayLabel="Tue"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <FitnessStatCard
            title="Total Calories"
            goal={`Goal - ${fitnessStats.totalCalories.goal} Kcal`}
            currentValue={fitnessStats.totalCalories.current}
            targetValue={fitnessStats.totalCalories.goal}
            progressLabel="Kcal"
            icon={<FitnessCenterIcon />}
            dayLabel="Tue"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <FitnessStatCard
            title="Total Duration"
            goal={`Goal - ${fitnessStats.totalDuration.goal} min`}
            currentValue={fitnessStats.totalDuration.current}
            targetValue={fitnessStats.totalDuration.goal}
            progressLabel="min"
            icon={<FitnessCenterIcon />}
            dayLabel="Tue"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <FitnessStatCard
            title="Total Distance"
            goal={`Goal - ${fitnessStats.totalDistance.goal.toFixed(1)} Kms`}
            currentValue={fitnessStats.totalDistance.current}
            targetValue={fitnessStats.totalDistance.goal}
            progressLabel="kms"
            icon={<FitnessCenterIcon />}
            dayLabel="Tue"
            formatValue={(v, m) => `${v.toFixed(1)}/${m.toFixed(1)}`}
          />
        </Grid>
      </Grid>

      {/* Daily Goals Section */}
      <Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 400,
            color: theme.palette.primary.dark,
            mb: 3,
          }}
        >
          Daily Goals
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="No. of Workouts"
              value={dailyGoals.workouts}
              onChange={handleGoalChange('workouts')}
              helperText="count"
              variant="outlined"
              disabled={!isEditing}
              type="number"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Calories Burnt"
              value={dailyGoals.calories}
              onChange={handleGoalChange('calories')}
              helperText="Kcal"
              variant="outlined"
              disabled={!isEditing}
              type="number"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Workout Duration"
              value={dailyGoals.duration}
              onChange={handleGoalChange('duration')}
              helperText="min"
              variant="outlined"
              disabled={!isEditing}
              type="number"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Distance to cover"
              value={dailyGoals.distance}
              onChange={handleGoalChange('distance')}
              helperText="kms"
              variant="outlined"
              disabled={!isEditing}
              type="number"
            />
          </Grid>
        </Grid>

        {/* Action buttons */}
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="primary"
            onClick={onSave}
            disabled={!isEditing}
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1.25,
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            Save
          </Button>
          <Button
            variant="contained"
            onClick={onEditToggle}
            disabled={isEditing}
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1.25,
              textTransform: 'none',
              fontWeight: 500,
              bgcolor: 'rgba(23, 29, 27, 0.1)',
              color: 'text.primary',
              '&:hover': {
                bgcolor: 'rgba(23, 29, 27, 0.15)',
              },
              '&.Mui-disabled': {
                bgcolor: 'rgba(23, 29, 27, 0.1)',
                color: 'text.disabled',
              },
            }}
          >
            Edit
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default FitnessDashboard;
