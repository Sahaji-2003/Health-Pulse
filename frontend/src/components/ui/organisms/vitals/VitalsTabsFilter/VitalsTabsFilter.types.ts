import type { SxProps, Theme } from '@mui/material';

export type VitalsTab = 'Dashboard' | 'Vitals History' | 'Vitals Entry' | 'Reminders and Alerts';

export interface VitalsTabsFilterProps {
  /**
   * Currently selected tab
   */
  selectedTab: VitalsTab;
  /**
   * Callback when tab is changed
   */
  onTabChange: (tab: VitalsTab) => void;
  /**
   * Custom styles
   */
  sx?: SxProps<Theme>;
}
