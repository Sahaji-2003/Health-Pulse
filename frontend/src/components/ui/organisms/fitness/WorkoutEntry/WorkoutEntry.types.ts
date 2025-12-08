/**
 * WorkoutEntry Types
 *
 * Type definitions for the WorkoutEntry organism component
 */

export interface WorkoutEntryData {
  workoutType: string;
  duration: string;
  distance: string;
  caloriesBurnt: string;
  time: string;
  date: string;
  shareWithFriends: boolean;
}

export interface WorkoutEntryProps {
  /**
   * Initial form data
   */
  initialData?: Partial<WorkoutEntryData>;
  /**
   * Callback when form data changes
   */
  onChange?: (data: WorkoutEntryData) => void;
  /**
   * Callback when save button is clicked
   */
  onSave?: (data: WorkoutEntryData) => void;
  /**
   * Whether the form is being submitted
   */
  isSubmitting?: boolean;
  /**
   * Whether to show loading skeleton
   */
  isLoading?: boolean;
}
