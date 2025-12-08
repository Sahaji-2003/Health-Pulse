import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Chip } from '@mui/material';
import { DashboardLayout } from '../../components/layout';
import {
  ProfileCard,
  VitalsCard,
  FitnessActivityCard,
  RecommendationsCard,
  WeeklyChartCard,
  AwardsCard,
  ResourcesTabsCard,
} from '../../components/ui/organisms';
import type {
  VitalReading,
  FitnessHistoryItem,
  ChartDataPoint,
  ResourceItem,
  ResourceTab,
} from '../../components/ui/organisms';
import { libraryArticlesData } from '../../components/ui/organisms/library/data';
import { useVitals, useVitalsStats } from '../../hooks/useVitals';
import { useProfile } from '../../hooks/useProfile';
import { userApi } from '../../services/api/user.api';
import { useFitnessActivities, useFitnessStats } from '../../hooks/useFitness';
import { useRecommendations, useGenerateRecommendations } from '../../hooks/useRecommendations';
import { useCommunityPosts } from '../../hooks/useCommunity';
import { useDashboardLayout } from '../../hooks/useDashboardLayout';
import { CustomizeDashboardView } from './CustomizeDashboardView';
import type { WidgetConfig } from '../../services/api/user.api';
import type { FitnessActivity } from '../../types';

// Helper to format date of birth
const formatDateOfBirth = (dateOfBirth: Date | string | undefined): string => {
  if (!dateOfBirth) return '';
  const date = new Date(dateOfBirth);
  if (isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper to calculate age from date of birth
const calculateAge = (dateOfBirth: Date | string | undefined): string => {
  if (!dateOfBirth) return '';
  const birthDate = new Date(dateOfBirth);
  if (isNaN(birthDate.getTime())) return '';
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return `${age}yrs`;
};

// Helper to format gender
const formatGender = (gender: string | undefined): string => {
  if (!gender) return '';
  return gender.charAt(0).toUpperCase() + gender.slice(1).replace('-', ' ');
};

// Helper to format activity date
const formatActivityDate = (date: Date | string): string => {
  const activityDate = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (activityDate.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (activityDate.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    const day = activityDate.getDate();
    const month = activityDate.toLocaleString('en-US', { month: 'short' });
    return `${day}${getOrdinalSuffix(day)} ${month}`;
  }
};

// Helper to get ordinal suffix
const getOrdinalSuffix = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};

// Helper to format activity type
const formatActivityType = (type: string): string => {
  return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
};

// Helper to format duration
const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

// Helper to transform fitness activities to history items
const transformActivitiesToHistory = (activities: FitnessActivity[]): FitnessHistoryItem[] => {
  return activities.slice(0, 5).map((activity) => ({
    date: formatActivityDate(activity.date),
    activity: formatActivityType(activity.type),
    duration: formatDuration(activity.duration),
    status: new Date(activity.date).toDateString() === new Date().toDateString() ? 'pending' : 'completed',
  }));
};

// Helper function to transform API vitals data to VitalReading format
const transformVitalsData = (
  apiData: any,
  isLoading: boolean,
  isError: boolean
): VitalReading[] => {
  // Get the latest vital record from API response
  const latestVital = apiData?.data?.[0] || null;

  // Weight card
  const weightVital: VitalReading = {
    label: 'Weight',
    value: latestVital?.weight ? String(latestVital.weight) : null,
    unit: 'Kgs',
    isLoading,
    hasError: isError || !latestVital?.weight,
    textColor: latestVital?.weight && (latestVital.weight > 85 || latestVital.weight < 50) ? 'warning' : 'default',
    ranges: [
      { position: 0, status: 'danger' },
      { position: 20, status: 'warning' },
      { position: 40, status: 'good' },
      { position: 60, status: 'warning' },
      { position: 80, status: 'danger' },
    ],
    currentPosition: latestVital?.weight ? Math.min(100, Math.max(0, ((latestVital.weight - 40) / 80) * 100)) : 70,
  };

  // Blood Pressure card
  const bpValue = latestVital?.bloodPressureSystolic && latestVital?.bloodPressureDiastolic
    ? `${latestVital.bloodPressureSystolic}/${latestVital.bloodPressureDiastolic}`
    : null;

  const bloodPressureVital: VitalReading = {
    label: 'Blood Pressure',
    value: bpValue,
    unit: 'mm Hg',
    isLoading,
    hasError: isError || !bpValue,
    ranges: [
      { position: 0, status: 'good' },
      { position: 25, status: 'good' },
      { position: 50, status: 'warning' },
      { position: 75, status: 'danger' },
      // DIA ranges
      { position: 0, status: 'good' },
      { position: 33, status: 'warning' },
      { position: 66, status: 'danger' },
    ],
    currentPosition: latestVital?.bloodPressureSystolic
      ? Math.min(100, Math.max(0, ((latestVital.bloodPressureSystolic - 90) / 70) * 100))
      : 25,
  };

  // Heart Rate card
  const heartRateVital: VitalReading = {
    label: 'Heart Rate',
    value: latestVital?.heartRate ? String(latestVital.heartRate) : null,
    unit: 'BPM',
    isLoading,
    hasError: isError || !latestVital?.heartRate,
    ranges: [
      { position: 0, status: 'danger' },
      { position: 33, status: 'good' },
      { position: 66, status: 'danger' },
      // Optimal ranges
      { position: 0, status: 'good' },
      { position: 50, status: 'warning' },
    ],
    currentPosition: latestVital?.heartRate
      ? Math.min(100, Math.max(0, ((latestVital.heartRate - 40) / 80) * 100))
      : 55,
  };

  // Return in order: Blood Pressure, Heart Rate, Weight (matching Figma design)
  return [bloodPressureVital, heartRateVital, weightVital];
};

// Helper to generate weekly chart data from vitals/fitness data
const generateWeeklyChartData = (
  vitalsData: any,
  fitnessData: FitnessActivity[] | undefined,
  filterType: 'Walking' | 'Heart Rate' | 'Weight'
): ChartDataPoint[] => {
  // Use distinctive day labels to avoid confusion
  const days = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];
  const today = new Date();
  const weekData: ChartDataPoint[] = [];
  
  // Get dates for the past 7 days (including today)
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const dateStr = date.toDateString();
    const isToday = i === 0;
    
    let value = 0;
    let isHighlighted = false;
    
    if (filterType === 'Walking') {
      // Sum walking distance for this day from fitness activities
      if (fitnessData) {
        const dayActivities = fitnessData.filter((a) => {
          const actDate = new Date(a.date).toDateString();
          return actDate === dateStr && (a.type === 'walking' || a.type === 'running');
        });
        value = dayActivities.reduce((sum, a) => sum + (a.distance || 0), 0);
        isHighlighted = value >= 5 || isToday; // Highlight if walked 5km or more, or if today
      }
    } else if (filterType === 'Heart Rate') {
      // Get average heart rate for this day from vitals
      if (vitalsData?.data) {
        const dayVitals = vitalsData.data.filter((v: any) => {
          const vitDate = new Date(v.date).toDateString();
          return vitDate === dateStr && v.heartRate;
        });
        if (dayVitals.length > 0) {
          value = Math.round(dayVitals.reduce((sum: number, v: any) => sum + v.heartRate, 0) / dayVitals.length);
          isHighlighted = (value >= 70 && value <= 100) || isToday; // Optimal heart rate range or today
        }
      }
    } else if (filterType === 'Weight') {
      // Get weight for this day from vitals
      if (vitalsData?.data) {
        const dayVitals = vitalsData.data.filter((v: any) => {
          const vitDate = new Date(v.date).toDateString();
          return vitDate === dateStr && v.weight;
        });
        if (dayVitals.length > 0) {
          value = dayVitals[0].weight;
          isHighlighted = isToday;
        }
      }
    }
    
    weekData.push({
      day: days[dayOfWeek],
      value,
      isHighlighted,
    });
  }
  
  return weekData;
};

// Helper to transform community posts to resource items
const communityImages = ['/assets/community/a.jpg', '/assets/community/b.webp', '/assets/community/c.webp', '/assets/community/d.webp', '/assets/community/e.webp'];

const transformCommunityPosts = (posts: any[]): ResourceItem[] => {
  return posts.slice(0, 5).map((post, index) => ({
    id: post._id || post.id,
    date: formatActivityDate(post.createdAt),
    title: post.title,
    description: post.content.substring(0, 150) + (post.content.length > 150 ? '...' : ''),
    imageUrl: communityImages[index % communityImages.length],
  }));
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<'Walking' | 'Heart Rate' | 'Weight'>(
    'Walking'
  );
  const [selectedResourceTab, setSelectedResourceTab] = useState<ResourceTab>('Articles');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Dashboard layout customization
  const {
    visibleWidgets,
    isCustomizeMode,
    enterCustomizeMode,
    exitCustomizeMode,
  } = useDashboardLayout();

  // Fetch user profile data
  const { profile, isLoading: profileLoading } = useProfile();

  // Fetch vitals data from backend API
  const {
    data: vitalsData,
    isLoading: vitalsLoading,
    isError: vitalsError,
    refetch: refetchVitals,
  } = useVitals({ limit: 10 }); // Get last 10 vital records for charts

  // Fetch vitals stats for additional metrics
  useVitalsStats('week');

  // Fetch fitness activities
  const { data: fitnessActivitiesData } = useFitnessActivities({ limit: 10 });

  // Fetch fitness stats
  const { data: fitnessStatsData } = useFitnessStats('week');

  // Fetch recommendations
  const { data: recommendationsData } = useRecommendations({ status: 'pending' });
  const generateRecommendations = useGenerateRecommendations();

  // Fetch community posts
  const { data: communityData } = useCommunityPosts(1, 5);

  // Build profile data from API response
  const profileData = useMemo(() => {
    if (!profile) {
      return {
        name: profileLoading ? 'Loading...' : 'User',
        avatarUrl: undefined,
        age: '',
        dateOfBirth: '',
        gender: '',
        bloodGroup: 'NA',
        weight: '',
      };
    }
    return {
      name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'User',
      avatarUrl: userApi.getAvatarUrl(profile.avatarUrl),
      age: calculateAge(profile.dateOfBirth),
      dateOfBirth: formatDateOfBirth(profile.dateOfBirth),
      gender: formatGender(profile.gender),
      bloodGroup: profile.bloodGroup || 'NA',
      weight: profile.weight ? `${profile.weight}kgs` : '',
    };
  }, [profile, profileLoading]);

  // Transform API data to VitalReading format (using latest vital)
  const vitalsDisplayData = useMemo(
    () => transformVitalsData(vitalsData, vitalsLoading, vitalsError),
    [vitalsData, vitalsLoading, vitalsError]
  );

  // Transform fitness activities to history items
  const fitnessHistory = useMemo(() => {
    const activities = fitnessActivitiesData?.data || [];
    if (activities.length === 0) {
      return [
        { date: 'Today', activity: 'No activities yet', duration: '-', status: 'pending' as const },
      ];
    }
    return transformActivitiesToHistory(activities);
  }, [fitnessActivitiesData]);

  // Calculate fitness progress and calories
  const fitnessMetrics = useMemo(() => {
    const stats = fitnessStatsData?.data;
    const activities = fitnessActivitiesData?.data || [];
    
    // Calculate today's calories burned
    const todayActivities = activities.filter((a) => 
      new Date(a.date).toDateString() === new Date().toDateString()
    );
    const todayCalories = todayActivities.reduce((sum, a) => sum + (a.caloriesBurned || 0), 0);
    
    // Calculate progress (based on a daily goal of 300 calories for example)
    const dailyGoal = 300;
    const progressPercent = Math.min(100, Math.round((todayCalories / dailyGoal) * 100));
    
    return {
      caloriesBurned: todayCalories || (stats?.totalCalories || 0),
      progressPercent: progressPercent || (stats?.totalWorkouts ? 80 : 0),
    };
  }, [fitnessStatsData, fitnessActivitiesData]);

  // Generate weekly chart data based on selected filter
  const weeklyChartData = useMemo(() => {
    const fitnessActivities = fitnessActivitiesData?.data || [];
    return generateWeeklyChartData(vitalsData, fitnessActivities, selectedFilter);
  }, [vitalsData, fitnessActivitiesData, selectedFilter]);

  // Get chart insight text based on filter and data
  const chartInsightText = useMemo(() => {
    const totalValue = weeklyChartData.reduce((sum, d) => sum + d.value, 0);
    const avgValue = weeklyChartData.length > 0 ? Math.round(totalValue / weeklyChartData.length) : 0;
    
    if (selectedFilter === 'Walking') {
      return totalValue > 0 
        ? `You've walked ${totalValue.toFixed(1)} km this week. Average: ${avgValue.toFixed(1)} km/day.`
        : 'Start logging your walks to see weekly progress here.';
    } else if (selectedFilter === 'Heart Rate') {
      return avgValue > 0
        ? `Your average heart rate this week is ${avgValue} BPM.`
        : 'Record your vitals to see heart rate trends here.';
    } else {
      return avgValue > 0
        ? `Your weight trend this week. Latest: ${weeklyChartData[weeklyChartData.length - 1]?.value || 0} kg.`
        : 'Record your weight to see trends here.';
    }
  }, [weeklyChartData, selectedFilter]);

  // Transform community posts to resource items
  const communityItems = useMemo(() => {
    // Use library articles data for the Articles tab
    if (selectedResourceTab === 'Articles') {
      return libraryArticlesData.map((article) => ({
        id: article.id,
        date: article.dateLabel,
        title: article.title,
        description: article.description,
        imageUrl: article.imageUrl,
        category: article.category,
      }));
    }
    
    // For Community tab, use actual community posts
    const posts = communityData?.data || [];
    if (posts.length === 0) {
      return [{
        id: '0',
        date: 'Today',
        title: 'Welcome to the Community',
        description: 'No posts yet. Be the first to share your health journey with the community!',
      }];
    }
    return transformCommunityPosts(posts);
  }, [selectedResourceTab, communityData]);

  // Get target value for chart based on filter
  const chartTargetValue = useMemo(() => {
    if (selectedFilter === 'Walking') return 5; // 5 km target
    if (selectedFilter === 'Heart Rate') return 80; // Optimal heart rate
    return 70; // Target weight (placeholder)
  }, [selectedFilter]);

  // Handle refresh for individual vital cards
  const handleVitalsRefresh = useCallback((vitalLabel: string) => {
    console.log(`Refreshing ${vitalLabel}...`);
    refetchVitals();
  }, [refetchVitals]);

  const handleCustomizeClick = useCallback(() => {
    enterCustomizeMode();
  }, [enterCustomizeMode]);

  const handleExitCustomize = useCallback(() => {
    exitCustomizeMode();
  }, [exitCustomizeMode]);

  const handleReceiveRecommendations = useCallback(() => {
    generateRecommendations.mutate();
  }, [generateRecommendations]);

  // Handle profile PDF download
  const handleDownloadProfilePdf = useCallback(async () => {
    setIsDownloadingPdf(true);
    try {
      const blob = await userApi.downloadProfilePdf();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `health_pulse_profile_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download profile PDF:', error);
    } finally {
      setIsDownloadingPdf(false);
    }
  }, []);

  // Define which widgets are wide (span 2 columns)
  const isWideWidget = (type: string) => type === 'vitals' || type === 'resources';

  // Common card height for consistency - adjusted for mobile
  const cardHeight = { xs: 'auto', sm: 'auto', md: 320 };

  // Render a single widget based on its type
  const renderWidget = useCallback((widget: WidgetConfig) => {
    const isWide = isWideWidget(widget.type);
    // On mobile (xs): all widgets span full width
    // On tablet (sm): wide widgets span 2 columns, regular widgets span 1
    // On desktop (md): wide widgets span 2 columns, regular widgets span 1 in 3-column grid
    const gridColumnStyle = { 
      xs: 'span 1', 
      sm: isWide ? 'span 2' : 'span 1',
      md: isWide ? 'span 2' : 'span 1' 
    };
    
    // Common styles to prevent grid overflow
    const gridItemStyle = {
      gridColumn: gridColumnStyle,
      height: cardHeight,
      minWidth: 0, // Critical: prevents grid blowout
      overflow: 'hidden',
      width: '100%',
    };

    switch (widget.type) {
      case 'profile':
        return (
          <Box key={widget.id} sx={gridItemStyle}>
            <ProfileCard
              {...profileData}
              isDownloading={isDownloadingPdf}
              onScheduleClick={() => navigate('/healthcare')}
              onDownloadClick={handleDownloadProfilePdf}
              onMoreDetailsClick={() => navigate('/profile')}
              sx={{ height: '100%' }}
            />
          </Box>
        );
      case 'vitals':
        return (
          <Box key={widget.id} sx={gridItemStyle}>
            <VitalsCard
              vitals={vitalsDisplayData}
              isLoading={vitalsLoading}
              onNavigate={(direction) => console.log('Navigate:', direction)}
              onMoreClick={() => navigate('/vitals')}
              onRefresh={handleVitalsRefresh}
              sx={{ height: '100%' }}
            />
          </Box>
        );
      case 'fitness':
        return (
          <Box key={widget.id} sx={gridItemStyle}>
            <FitnessActivityCard
              caloriesBurned={fitnessMetrics.caloriesBurned}
              progressPercent={fitnessMetrics.progressPercent}
              history={fitnessHistory}
              onMoreClick={() => navigate('/fitness')}
              sx={{ height: '100%' }}
            />
          </Box>
        );
      case 'recommendations':
        return (
          <Box key={widget.id} sx={gridItemStyle}>
            <RecommendationsCard
              onReceiveRecommendations={handleReceiveRecommendations}
              onMoreClick={() => console.log('Recommendations more clicked')}
              sx={{ height: '100%' }}
            />
          </Box>
        );
      case 'weekly-chart':
        return (
          <Box key={widget.id} sx={gridItemStyle}>
            <WeeklyChartCard
              data={weeklyChartData}
              selectedFilter={selectedFilter}
              targetValue={chartTargetValue}
              insightText={chartInsightText}
              onFilterChange={setSelectedFilter}
              onMoreClick={() => navigate('/fitness')}
              sx={{ height: '100%' }}
            />
          </Box>
        );
      case 'awards':
        return (
          <Box key={widget.id} sx={gridItemStyle}>
            <AwardsCard
              badgeName="Stride Starter"
              earnedDate="2nd Oct"
              streakDays={fitnessStatsData?.data?.totalWorkouts || 0}
              newRewards={recommendationsData?.data?.length || 0}
              onReviewActivities={() => navigate('/fitness')}
              onRewardShop={() => console.log('Reward shop clicked')}
              onMoreClick={() => console.log('Awards more clicked')}
              sx={{ height: '100%' }}
            />
          </Box>
        );
      case 'resources':
        return (
          <Box key={widget.id} sx={gridItemStyle}>
            <ResourcesTabsCard
              selectedTab={selectedResourceTab}
              items={communityItems}
              onTabChange={setSelectedResourceTab}
              onItemClick={() => navigate('/resources')}
              sx={{ height: '100%' }}
            />
          </Box>
        );
      default:
        return null;
    }
  }, [
    profileData, 
    vitalsDisplayData, 
    vitalsLoading, 
    handleVitalsRefresh, 
    fitnessMetrics, 
    fitnessHistory, 
    weeklyChartData,
    selectedFilter, 
    chartTargetValue,
    chartInsightText,
    selectedResourceTab, 
    communityItems,
    handleReceiveRecommendations,
    handleDownloadProfilePdf,
    isDownloadingPdf,
    fitnessStatsData,
    recommendationsData,
    navigate,
  ]);

  // If in customize mode, render the customize view inside DashboardLayout
  if (isCustomizeMode) {
    return (
      <DashboardLayout
        title=""
        hideHeader={true}
      >
        <CustomizeDashboardView onBack={handleExitCustomize} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Health Dashboard"
      headerSubtitle={
        <Chip
          label="Customize"
          variant="outlined"
          size="small"
          onClick={handleCustomizeClick}
          sx={{
            borderRadius: 1.5,
            borderColor: 'grey.400',
            color: 'grey.600',
            bgcolor: 'grey.100',
            '& .MuiChip-label': {
              px: 1.5,
              textAlign: 'center',
            },
          }}
        />
      }
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gridAutoRows: { xs: 'minmax(280px, auto)', sm: 'minmax(300px, auto)', md: '320px' },
          gap: { xs: 1.5, sm: 2 },
          pb: { xs: 2, sm: 3 },
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {/* Render widgets dynamically based on their order in visibleWidgets */}
        {visibleWidgets.map((widget) => renderWidget(widget))}
      </Box>
    </DashboardLayout>
  );
};

export default Dashboard;
