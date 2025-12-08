import type { ReactNode } from 'react';

export interface FitnessStatCardProps {
  /** Title of the stat (e.g., "Total Workouts") */
  title: string;
  /** Goal description (e.g., "Goal - 4") */
  goal: string;
  /** Current value */
  currentValue: number;
  /** Target/maximum value */
  targetValue: number;
  /** Label for the progress (e.g., "Count", "Kcal", "min", "kms") */
  progressLabel: string;
  /** Icon to display in the card header */
  icon?: ReactNode;
  /** Day label (e.g., "Tue") */
  dayLabel?: string;
  /** Format function for displaying progress value */
  formatValue?: (value: number, max: number) => string;
}
