/**
 * WorkoutHistory Types
 *
 * Type definitions for the WorkoutHistory organism component
 */

export interface WorkoutHistoryItem {
  id: string;
  workoutType: string;
  date: string;
  duration: string;
  calories: string;
  distance: string;
}

export interface WorkoutHistoryFilter {
  activityType: string;
  fromDate: string;
  toDate: string;
}

export interface WorkoutHistoryProps {
  /**
   * Array of workout history items to display
   */
  workouts?: WorkoutHistoryItem[];
  /**
   * Filter state
   */
  filters?: WorkoutHistoryFilter;
  /**
   * Callback when filters change
   */
  onFilterChange?: (filters: WorkoutHistoryFilter) => void;
  /**
   * Callback when export is clicked
   */
  onExport?: () => void;
  /**
   * Whether the data is loading
   */
  isLoading?: boolean;
}
