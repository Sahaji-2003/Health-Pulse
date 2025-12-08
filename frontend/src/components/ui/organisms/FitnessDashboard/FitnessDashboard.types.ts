export type FitnessTab = 'dashboard' | 'history' | 'entry' | 'feed';

export interface DailyGoals {
  workouts: string;
  calories: string;
  duration: string;
  distance: string;
}

export interface FitnessDashboardProps {
  /** Currently selected tab */
  activeTab?: FitnessTab;
  /** Handler for tab change */
  onTabChange?: (tab: FitnessTab) => void;
  /** Selected duration filter (e.g., "This Week") */
  selectedDuration?: string;
  /** Handler for duration filter change */
  onDurationChange?: (duration: string) => void;
  /** Daily goals form values */
  dailyGoals?: DailyGoals;
  /** Handler for daily goals change */
  onDailyGoalsChange?: (goals: DailyGoals) => void;
  /** Handler for save button */
  onSave?: () => void;
  /** Whether to show edit mode */
  isEditing?: boolean;
  /** Handler for edit mode toggle */
  onEditToggle?: () => void;
  /** Loading state */
  isLoading?: boolean;
  /** Fitness stats data */
  stats?: {
    totalWorkouts: { current: number; goal: number };
    totalCalories: { current: number; goal: number };
    totalDuration: { current: number; goal: number };
    totalDistance: { current: number; goal: number };
  };
  /** Whether to hide the tab chips (when managed externally) */
  hideTabs?: boolean;
}
