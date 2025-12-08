/**
 * NetworkFeed Types
 *
 * Type definitions for the NetworkFeed organism component
 */

export interface FriendWorkout {
  id: string;
  userName: string;
  userAvatar?: string;
  workoutType: string;
  caloriesBurnt: number;
  duration: string;
  likes: number;
  isLiked?: boolean;
}

export interface NetworkFeedProps {
  /**
   * Array of friend workout items to display
   */
  workouts?: FriendWorkout[];
  /**
   * Search query for filtering friends
   */
  searchQuery?: string;
  /**
   * Callback when search query changes
   */
  onSearchChange?: (query: string) => void;
  /**
   * Callback when a workout is liked/unliked
   */
  onLikeToggle?: (workoutId: string) => void;
  /**
   * Whether the data is loading
   */
  isLoading?: boolean;
}
