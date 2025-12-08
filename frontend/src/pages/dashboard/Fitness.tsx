import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Chip, Stack, Snackbar, Alert } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { DashboardLayout } from '../../components/layout';
import { FitnessDashboard } from '../../components/ui/organisms/FitnessDashboard';
import { WorkoutHistory, WorkoutEntry, NetworkFeed } from '../../components/ui/organisms/fitness';
import type { FitnessTab, DailyGoals } from '../../components/ui/organisms/FitnessDashboard';
import type { WorkoutEntryData, WorkoutHistoryFilter, WorkoutHistoryItem } from '../../components/ui/organisms/fitness';
import { useFitnessStats, useFitnessActivities, useCreateActivity, useFitnessGoals, useCreateGoal, useUpdateGoal } from '../../hooks/useFitness';
import type { ActivityFilters } from '../../services/api/fitness.api';

// Map workout type from form to API type
const mapWorkoutTypeToApi = (workoutType: string): 'running' | 'cycling' | 'walking' | 'swimming' | 'gym' | 'yoga' | 'other' => {
  const typeMap: Record<string, 'running' | 'cycling' | 'walking' | 'swimming' | 'gym' | 'yoga' | 'other'> = {
    walking: 'walking',
    running: 'running',
    cycling: 'cycling',
    swimming: 'swimming',
    weight_training: 'gym',
    yoga: 'yoga',
    cardio: 'other',
  };
  return typeMap[workoutType] || 'other';
};

// Format date for display
const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
};

// Map duration selection to API period
const mapDurationToApiPeriod = (duration: string): 'week' | 'month' | 'year' => {
  switch (duration) {
    case 'this_week':
    case 'last_week':
      return 'week';
    case 'this_month':
    case 'last_month':
      return 'month';
    default:
      return 'week';
  }
};

export const Fitness: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Derive active tab from URL
  const activeTab = useMemo((): FitnessTab => {
    const path = location.pathname;
    if (path.endsWith('/history')) return 'history';
    if (path.endsWith('/entry')) return 'entry';
    if (path.endsWith('/feed')) return 'feed';
    return 'dashboard';
  }, [location.pathname]);
  
  // State management
  const [selectedDuration, setSelectedDuration] = useState('this_week');
  const [isEditing, setIsEditing] = useState(false);
  const [dailyGoals, setDailyGoals] = useState<DailyGoals>({
    workouts: '',
    calories: '',
    duration: '',
    distance: '',
  });

  // Snackbar state for feedback
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Workout History filters state
  const [historyFilters, setHistoryFilters] = useState<WorkoutHistoryFilter>({
    activityType: '',
    fromDate: '',
    toDate: '',
  });

  // Convert history filters to API filters
  const activityApiFilters: ActivityFilters = useMemo(() => {
    const filters: ActivityFilters = {};
    if (historyFilters.activityType) {
      filters.type = mapWorkoutTypeToApi(historyFilters.activityType);
    }
    if (historyFilters.fromDate) {
      // Convert MM/DD/YYYY to ISO date
      const [month, day, year] = historyFilters.fromDate.split('/');
      if (month && day && year) {
        filters.startDate = new Date(`${year}-${month}-${day}`).toISOString();
      }
    }
    if (historyFilters.toDate) {
      const [month, day, year] = historyFilters.toDate.split('/');
      if (month && day && year) {
        filters.endDate = new Date(`${year}-${month}-${day}`).toISOString();
      }
    }
    return filters;
  }, [historyFilters]);

  // Fetch fitness stats with proper period
  const { data: statsData, isLoading: statsLoading, refetch: refetchStats } = useFitnessStats(
    mapDurationToApiPeriod(selectedDuration)
  );

  // Fetch fitness goals
  const { data: goalsData, refetch: refetchGoals } = useFitnessGoals();

  // Create/Update goal mutations
  const createGoalMutation = useCreateGoal();
  const updateGoalMutation = useUpdateGoal();

  // Fetch activities for history
  const { data: activitiesData, isLoading: activitiesLoading } = useFitnessActivities(activityApiFilters);

  // Create activity mutation
  const createActivityMutation = useCreateActivity();

  // Populate daily goals from API data when loaded
  useEffect(() => {
    if (goalsData?.data && goalsData.data.length > 0) {
      const newGoals: DailyGoals = {
        workouts: '',
        calories: '',
        duration: '',
        distance: '',
      };

      goalsData.data.forEach((goal) => {
        switch (goal.goalType) {
          case 'workouts':
            newGoals.workouts = goal.targetValue.toString();
            break;
          case 'calories':
            newGoals.calories = goal.targetValue.toString();
            break;
          case 'duration':
            newGoals.duration = goal.targetValue.toString();
            break;
          case 'distance':
            newGoals.distance = goal.targetValue.toString();
            break;
        }
      });

      // Only update if values are different to avoid infinite loop
      if (
        newGoals.workouts !== dailyGoals.workouts ||
        newGoals.calories !== dailyGoals.calories ||
        newGoals.duration !== dailyGoals.duration ||
        newGoals.distance !== dailyGoals.distance
      ) {
        setDailyGoals(newGoals);
      }
    }
  }, [goalsData]); // Only depend on goalsData, not dailyGoals

  // Transform API activities to WorkoutHistoryItem format
  const workoutHistoryItems: WorkoutHistoryItem[] = useMemo(() => {
    if (!activitiesData?.data) return [];
    return activitiesData.data.map((activity) => ({
      id: activity._id,
      workoutType: activity.type.charAt(0).toUpperCase() + activity.type.slice(1),
      date: formatDate(activity.date),
      duration: `${activity.duration} min`,
      calories: activity.caloriesBurned ? `${activity.caloriesBurned} kcal` : '-',
      distance: activity.distance ? `${activity.distance} kms` : '-',
    }));
  }, [activitiesData]);

  // Get goal values from API or use daily goals form values
  const getGoalValue = useCallback((goalType: string, defaultValue: number): number => {
    // First check if user has set a value in the form
    switch (goalType) {
      case 'workouts':
        if (dailyGoals.workouts) return parseInt(dailyGoals.workouts) || defaultValue;
        break;
      case 'calories':
        if (dailyGoals.calories) return parseInt(dailyGoals.calories) || defaultValue;
        break;
      case 'duration':
        if (dailyGoals.duration) return parseInt(dailyGoals.duration) || defaultValue;
        break;
      case 'distance':
        if (dailyGoals.distance) return parseFloat(dailyGoals.distance) || defaultValue;
        break;
    }

    // Then check API goals
    if (goalsData?.data) {
      const goal = goalsData.data.find((g) => g.goalType === goalType);
      if (goal) return goal.targetValue;
    }

    return defaultValue;
  }, [dailyGoals, goalsData]);

  // Transform API data to component format with dynamic goals
  const stats = useMemo(() => {
    const workoutsGoal = getGoalValue('workouts', 4);
    const caloriesGoal = getGoalValue('calories', 5000);
    const durationGoal = getGoalValue('duration', 350);
    const distanceGoal = getGoalValue('distance', 10.0);

    return {
      totalWorkouts: { 
        current: statsData?.data?.totalWorkouts || 0, 
        goal: workoutsGoal 
      },
      totalCalories: { 
        current: statsData?.data?.totalCalories || 0, 
        goal: caloriesGoal 
      },
      totalDuration: { 
        current: statsData?.data?.totalDuration || 0, 
        goal: durationGoal 
      },
      totalDistance: { 
        current: statsData?.data?.totalDistance || 0, 
        goal: distanceGoal 
      },
    };
  }, [statsData, getGoalValue]);

  // Handlers
  const handleTabChange = useCallback((tab: FitnessTab) => {
    if (tab === 'dashboard') {
      navigate('/fitness');
    } else {
      navigate(`/fitness/${tab}`);
    }
  }, [navigate]);

  const handleDurationChange = useCallback((duration: string) => {
    setSelectedDuration(duration);
  }, []);

  const handleDailyGoalsChange = useCallback((goals: DailyGoals) => {
    setDailyGoals(goals);
  }, []);

  // Helper to show snackbar
  const showSnackbar = useCallback((message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  // Save daily goals to API
  const handleSave = useCallback(async () => {
    const now = new Date();
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (7 - now.getDay()));

    const goalPromises: Promise<unknown>[] = [];

    // Create/update workouts goal
    if (dailyGoals.workouts) {
      const existingGoal = goalsData?.data?.find((g) => g.goalType === 'workouts');
      if (existingGoal) {
        goalPromises.push(
          updateGoalMutation.mutateAsync({
            id: existingGoal._id,
            data: { targetValue: parseInt(dailyGoals.workouts) },
          })
        );
      } else {
        goalPromises.push(
          createGoalMutation.mutateAsync({
            goalType: 'workouts',
            targetValue: parseInt(dailyGoals.workouts),
            unit: 'count',
            startDate: now.toISOString(),
            endDate: endOfWeek.toISOString(),
          })
        );
      }
    }

    // Create/update calories goal
    if (dailyGoals.calories) {
      const existingGoal = goalsData?.data?.find((g) => g.goalType === 'calories');
      if (existingGoal) {
        goalPromises.push(
          updateGoalMutation.mutateAsync({
            id: existingGoal._id,
            data: { targetValue: parseInt(dailyGoals.calories) },
          })
        );
      } else {
        goalPromises.push(
          createGoalMutation.mutateAsync({
            goalType: 'calories',
            targetValue: parseInt(dailyGoals.calories),
            unit: 'kcal',
            startDate: now.toISOString(),
            endDate: endOfWeek.toISOString(),
          })
        );
      }
    }

    // Create/update duration goal
    if (dailyGoals.duration) {
      const existingGoal = goalsData?.data?.find((g) => g.goalType === 'duration');
      if (existingGoal) {
        goalPromises.push(
          updateGoalMutation.mutateAsync({
            id: existingGoal._id,
            data: { targetValue: parseInt(dailyGoals.duration) },
          })
        );
      } else {
        goalPromises.push(
          createGoalMutation.mutateAsync({
            goalType: 'duration',
            targetValue: parseInt(dailyGoals.duration),
            unit: 'min',
            startDate: now.toISOString(),
            endDate: endOfWeek.toISOString(),
          })
        );
      }
    }

    // Create/update distance goal
    if (dailyGoals.distance) {
      const existingGoal = goalsData?.data?.find((g) => g.goalType === 'distance');
      if (existingGoal) {
        goalPromises.push(
          updateGoalMutation.mutateAsync({
            id: existingGoal._id,
            data: { targetValue: parseFloat(dailyGoals.distance) },
          })
        );
      } else {
        goalPromises.push(
          createGoalMutation.mutateAsync({
            goalType: 'distance',
            targetValue: parseFloat(dailyGoals.distance),
            unit: 'kms',
            startDate: now.toISOString(),
            endDate: endOfWeek.toISOString(),
          })
        );
      }
    }

    if (goalPromises.length === 0) {
      showSnackbar('Please enter at least one goal value', 'warning');
      return;
    }

    try {
      await Promise.all(goalPromises);
      showSnackbar('Goals saved successfully!', 'success');
      setIsEditing(false);
      // Refetch goals to update the cards
      refetchGoals();
      refetchStats();
    } catch (error) {
      console.error('Failed to save goals:', error);
      showSnackbar('Failed to save goals. Please try again.', 'error');
    }
  }, [dailyGoals, goalsData, createGoalMutation, updateGoalMutation, showSnackbar, refetchGoals, refetchStats]);

  const handleEditToggle = useCallback(() => {
    setIsEditing(true);
  }, []);

  // Workout Entry handlers
  const handleWorkoutEntrySave = useCallback((data: WorkoutEntryData) => {
    // Transform form data to API format
    const apiData = {
      type: mapWorkoutTypeToApi(data.workoutType),
      duration: parseInt(data.duration) || 0,
      distance: data.distance ? parseFloat(data.distance) : undefined,
      caloriesBurned: data.caloriesBurnt ? parseInt(data.caloriesBurnt) : undefined,
      intensity: 'medium' as const, // Default intensity
      notes: data.shareWithFriends ? 'Shared with friends' : undefined,
      date: new Date(`${data.date}T${data.time}`).toISOString(),
    };
    
    createActivityMutation.mutate(apiData, {
      onSuccess: () => {
        showSnackbar('Workout saved successfully!', 'success');
        // Navigate to history tab
        navigate('/fitness/history');
      },
      onError: (error) => {
        console.error('Failed to save workout:', error);
        showSnackbar('Failed to save workout. Please try again.', 'error');
      },
    });
  }, [createActivityMutation, showSnackbar]);

  // Workout History filter change handler
  const handleHistoryFilterChange = useCallback((filters: WorkoutHistoryFilter) => {
    setHistoryFilters(filters);
  }, []);

  // Workout History handlers
  const handleExportHistory = useCallback(() => {
    console.log('Exporting workout history...');
    // TODO: Implement export functionality
  }, []);

  // Network Feed handlers
  const handleLikeToggle = useCallback((workoutId: string) => {
    console.log('Toggling like for workout:', workoutId);
    // TODO: Implement API call to toggle like
  }, []);

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'history':
        return (
          <WorkoutHistory
            workouts={workoutHistoryItems}
            filters={historyFilters}
            onFilterChange={handleHistoryFilterChange}
            isLoading={activitiesLoading}
            onExport={handleExportHistory}
          />
        );
      case 'entry':
        return (
          <WorkoutEntry
            onSave={handleWorkoutEntrySave}
            isSubmitting={createActivityMutation.isPending}
            isLoading={statsLoading}
          />
        );
      case 'feed':
        return (
          <NetworkFeed
            isLoading={statsLoading}
            onLikeToggle={handleLikeToggle}
          />
        );
      case 'dashboard':
      default:
        return (
          <FitnessDashboard
            activeTab={activeTab}
            onTabChange={handleTabChange}
            selectedDuration={selectedDuration}
            onDurationChange={handleDurationChange}
            dailyGoals={dailyGoals}
            onDailyGoalsChange={handleDailyGoalsChange}
            onSave={handleSave}
            isEditing={isEditing}
            onEditToggle={handleEditToggle}
            isLoading={statsLoading}
            stats={stats}
            hideTabs
          />
        );
    }
  };

  // Tab chip configuration
  const TABS: { label: string; value: FitnessTab }[] = [
    { label: 'Dashboard', value: 'dashboard' },
    { label: 'Workout History', value: 'history' },
    { label: 'Workout Entry', value: 'entry' },
    { label: 'Network Feed', value: 'feed' },
  ];

  return (
    <DashboardLayout
      title="Fitness Activity"
      headerSubtitle={<Chip label="Weekly" size="small" />}
    >
      {/* Tab Navigation Chips */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          mb: 3,
          flexWrap: 'wrap',
          gap: 1,
          '& > *': { flexShrink: 0 },
        }}
      >
        {TABS.map((tab) => (
          <Chip
            key={tab.value}
            label={tab.label}
            onClick={() => handleTabChange(tab.value)}
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

      {/* Tab Content */}
      <Box>{renderTabContent()}</Box>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default Fitness;
