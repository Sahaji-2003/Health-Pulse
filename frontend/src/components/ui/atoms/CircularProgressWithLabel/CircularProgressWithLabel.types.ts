export interface CircularProgressWithLabelProps {
  /** Current value */
  value: number;
  /** Maximum value for the progress */
  max: number;
  /** Size of the circular progress (default: 180) */
  size?: number;
  /** Thickness of the progress circle */
  thickness?: number;
  /** Label to display below the value (e.g., "Count", "Kcal") */
  label?: string;
  /** Format function for displaying the value */
  formatValue?: (value: number, max: number) => string;
}
