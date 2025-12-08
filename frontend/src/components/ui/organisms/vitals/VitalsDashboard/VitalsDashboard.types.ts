import type { SxProps, Theme } from '@mui/material';
import type { VitalsTab } from '../VitalsTabsFilter';
import type { VitalReading } from '../../Dashboard';

export interface VitalsDashboardProps {
  /**
   * Currently selected tab
   */
  selectedTab: VitalsTab;
  /**
   * Callback when tab is changed
   */
  onTabChange: (tab: VitalsTab) => void;
  /**
   * User profile data
   */
  profileData: {
    name: string;
    avatarUrl?: string;
    age?: string;
    dateOfBirth?: string;
    gender?: string;
    bloodGroup?: string;
    weight?: string;
  };
  /**
   * Vitals data for display
   */
  vitalsData: VitalReading[];
  /**
   * Whether vitals are loading
   */
  vitalsLoading?: boolean;
  /**
   * Blood sugar value for heart status card
   */
  bloodSugarValue?: number;
  /**
   * Days ago blood sugar was measured
   */
  bloodSugarDaysAgo?: number;
  /**
   * Callback for profile schedule click
   */
  onScheduleClick?: () => void;
  /**
   * Callback for profile download click
   */
  onDownloadClick?: () => void;
  /**
   * Whether profile PDF is being downloaded
   */
  isDownloading?: boolean;
  /**
   * Callback for recommendations click
   */
  onRecommendationsClick?: () => void;
  /**
   * Callback for receive recommendations button click
   */
  onReceiveRecommendations?: () => void;
  /**
   * Callback for vitals navigation
   */
  onVitalsNavigate?: (direction: 'prev' | 'next') => void;
  /**
   * Callback for vitals refresh
   */
  onVitalsRefresh?: (vitalLabel: string) => void;
  /**
   * Custom styles
   */
  sx?: SxProps<Theme>;
}
