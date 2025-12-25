import { useState, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { DashboardLayout } from '../../components/layout';
import {
  VitalsDashboard,
} from '../../components/ui/organisms';
import type {
  VitalsTab,
  VitalReading,
} from '../../components/ui/organisms';
import { useVitals, useVitalsStats } from '../../hooks/useVitals';
import { useProfile } from '../../hooks/useProfile';
import { userApi } from '../../services/api/user.api';

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

// Helper function to transform API vitals data to VitalReading format
const transformVitalsData = (
  apiData: any,
  isLoading: boolean,
  isError: boolean
): VitalReading[] => {
  const latestVital = apiData?.data?.[0] || null;

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
      { position: 0, status: 'good' },
      { position: 50, status: 'warning' },
    ],
    currentPosition: latestVital?.heartRate
      ? Math.min(100, Math.max(0, ((latestVital.heartRate - 40) / 80) * 100))
      : 55,
  };

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

  // Return in order: Blood Pressure, Heart Rate, Weight (matching Figma design for Vitals page)
  return [bloodPressureVital, heartRateVital, weightVital];
};

export const Vitals = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Derive selected tab from URL
  const selectedTab = useMemo((): VitalsTab => {
    const path = location.pathname;
    if (path.endsWith('/history')) return 'Vitals History';
    if (path.endsWith('/entry')) return 'Vitals Entry';
    if (path.endsWith('/reminders')) return 'Reminders and Alerts';
    return 'Dashboard';
  }, [location.pathname]);

  // Tab change handler using navigation
  const handleTabChange = useCallback((tab: VitalsTab) => {
    switch (tab) {
      case 'Dashboard':
        navigate('/vitals');
        break;
      case 'Vitals History':
        navigate('/vitals/history');
        break;
      case 'Vitals Entry':
        navigate('/vitals/entry');
        break;
      case 'Reminders and Alerts':
        navigate('/vitals/reminders');
        break;
    }
  }, [navigate]);

  // Fetch user profile data
  const { profile } = useProfile();

  // Fetch vitals data from backend API
  const {
    data: vitalsData,
    isLoading: vitalsLoading,
    isError: vitalsError,
    refetch: refetchVitals,
  } = useVitals({ limit: 1 });

  // Fetch vitals stats for blood sugar
  const { data: vitalsStats } = useVitalsStats('month');

  // Build profile data from API response
  const profileData = useMemo(() => {
    if (!profile) {
      return {
        name: 'Loading...',
        avatarUrl: undefined,
        age: '',
        dateOfBirth: '',
        gender: '',
        bloodGroup: 'O+', // Default blood group
        weight: '',
      };
    }
    return {
      name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'User',
      avatarUrl: userApi.getAvatarUrl(profile.avatarUrl),
      age: calculateAge(profile.dateOfBirth),
      dateOfBirth: formatDateOfBirth(profile.dateOfBirth),
      gender: formatGender(profile.gender),
      bloodGroup: 'O+', // Default since not stored in backend
      weight: profile.weight ? `${profile.weight}kgs` : '',
    };
  }, [profile]);

  // Get blood sugar value and days ago from stats
  const bloodSugarData = useMemo(() => {
    const latestBloodSugar = vitalsStats?.data?.latestBloodSugar;
    if (latestBloodSugar) {
      return {
        value: latestBloodSugar.value,
        daysAgo: latestBloodSugar.daysAgo,
      };
    }
    return { value: 0, daysAgo: 0 };
  }, [vitalsStats]);

  // Transform API data to VitalReading format
  const vitalsDisplayData = useMemo(
    () => transformVitalsData(vitalsData, vitalsLoading, vitalsError),
    [vitalsData, vitalsLoading, vitalsError]
  );

  // Handle refresh for individual vital cards
  const handleVitalsRefresh = useCallback((vitalLabel: string) => {
    console.log(`Refreshing ${vitalLabel}...`);
    refetchVitals();
  }, [refetchVitals]);

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

  return (
    <DashboardLayout
      title="Vitals"
    >
      <Box sx={{ pb: 3 }}>
        <VitalsDashboard
          selectedTab={selectedTab}
          onTabChange={handleTabChange}
          profileData={profileData}
          vitalsData={vitalsDisplayData}
          vitalsLoading={vitalsLoading}
          bloodSugarValue={bloodSugarData.value}
          bloodSugarDaysAgo={bloodSugarData.daysAgo}
          onScheduleClick={() => console.log('Schedule clicked')}
          onDownloadClick={handleDownloadProfilePdf}
          isDownloading={isDownloadingPdf}
          onRecommendationsClick={() => console.log('Recommendations clicked')}
          onReceiveRecommendations={() => console.log('Receive recommendations clicked')}
          onVitalsNavigate={(direction) => console.log('Navigate:', direction)}
          onVitalsRefresh={handleVitalsRefresh}
        />
      </Box>
    </DashboardLayout>
  );
};

export default Vitals;
