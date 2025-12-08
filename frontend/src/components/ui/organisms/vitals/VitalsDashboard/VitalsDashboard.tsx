import React from 'react';
import { Box } from '@mui/material';
import { VitalsTabsFilter } from '../VitalsTabsFilter';
import { HeartStatusCard } from '../HeartStatusCard';
import { VitalsHistorySection } from '../VitalsHistorySection';
import { VitalsEntrySection } from '../VitalsEntrySection';
import { RemindersAlertsSection } from '../RemindersAlertsSection';
import { ProfileCard, VitalsCard, RecommendationsCard } from '../../Dashboard';
import type { VitalsDashboardProps } from './VitalsDashboard.types';

/**
 * VitalsDashboard Organism
 *
 * Main vitals dashboard that combines all vitals-related sections.
 * Displays profile card, vitals card, heart status, and recommendations.
 * Supports tab-based navigation for different vitals views.
 */
export const VitalsDashboard: React.FC<VitalsDashboardProps> = ({
  selectedTab,
  onTabChange,
  profileData,
  vitalsData,
  vitalsLoading = false,
  bloodSugarValue = 0,
  bloodSugarDaysAgo = 0,
  onScheduleClick,
  onDownloadClick,
  isDownloading = false,
  onRecommendationsClick,
  onReceiveRecommendations,
  onVitalsNavigate,
  onVitalsRefresh,
  sx,
}) => {
  // Render content based on selected tab
  const renderTabContent = () => {
    switch (selectedTab) {
      case 'Dashboard':
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {/* Row 1: Profile Card + Vitals Card */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '340px 1fr' },
                gap: 2,
                minHeight: 280,
              }}
            >
              <ProfileCard
                {...profileData}
                isDownloading={isDownloading}
                onScheduleClick={onScheduleClick}
                onDownloadClick={onDownloadClick}
                onMoreDetailsClick={onRecommendationsClick}
                sx={{ height: '100%' }}
              />
              <VitalsCard
                vitals={vitalsData}
                isLoading={vitalsLoading}
                onNavigate={onVitalsNavigate}
                onMoreClick={() => console.log('Vitals more clicked')}
                onRefresh={onVitalsRefresh}
                sx={{ height: '100%' }}
              />
            </Box>

            {/* Row 2: Heart Status Card + Recommendations Card */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '1fr 389px' },
                gap: 2,
                minHeight: 320,
              }}
            >
              <HeartStatusCard
                bloodSugarValue={bloodSugarValue}
                daysAgo={bloodSugarDaysAgo}
                sx={{ height: '100%' }}
              />
              <RecommendationsCard
                onReceiveRecommendations={onReceiveRecommendations}
                onMoreClick={() => console.log('Recommendations more clicked')}
                sx={{ height: '100%' }}
              />
            </Box>
          </Box>
        );

      case 'Vitals History':
        return <VitalsHistorySection />;

      case 'Vitals Entry':
        return <VitalsEntrySection />;

      case 'Reminders and Alerts':
        return <RemindersAlertsSection />;

      default:
        return null;
    }
  };

  return (
    <Box sx={sx}>
      {/* Tabs Filter */}
      <VitalsTabsFilter
        selectedTab={selectedTab}
        onTabChange={onTabChange}
        sx={{ mx: -3, mt: -2 }}
      />

      {/* Tab Content */}
      <Box sx={{ pt: 1 }}>
        {renderTabContent()}
      </Box>
    </Box>
  );
};

export default VitalsDashboard;
