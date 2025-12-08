import {
  Box,
  Paper,
  Typography,
  Chip,
  CircularProgress,
  useTheme,
} from '@mui/material';
import OpacityIcon from '@mui/icons-material/Opacity';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import BedtimeIcon from '@mui/icons-material/Bedtime';

export interface ReminderStatCardProps {
  /**
   * Type of stat card
   */
  type: 'water' | 'calories' | 'sleep';
  /**
   * Current value
   */
  value: string;
  /**
   * Unit (ml, kcal, hrs)
   */
  unit: string;
  /**
   * Label text above value
   */
  label?: string;
  /**
   * Progress percentage (0-100)
   */
  progress?: number;
  /**
   * Callback when Done is clicked
   */
  onDone?: () => void;
}

const iconMap = {
  water: OpacityIcon,
  calories: LocalFireDepartmentIcon,
  sleep: BedtimeIcon,
};

const titleMap = {
  water: 'Water Intake',
  calories: 'Calories',
  sleep: 'Sleep Time',
};

const labelMap = {
  water: "Today's Progress",
  calories: 'Targeted Calorie Intake',
  sleep: "Today's Progress",
};

/**
 * ReminderStatCard Component
 *
 * Displays a stat card for Water Intake, Calories, or Sleep Time.
 * Based on Figma design nodes 2320-12633, 2320-12663, 2320-12648.
 */
export const ReminderStatCard: React.FC<ReminderStatCardProps> = ({
  type,
  value,
  unit,
  label,
  progress = 60,
  onDone,
}) => {
  const theme = useTheme();
  const Icon = iconMap[type];
  const title = titleMap[type];
  const defaultLabel = label || labelMap[type];

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 7,
        bgcolor: theme.palette.background.paper,
        overflow: 'hidden',
        height: '100%',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          pb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Icon
            sx={{
              fontSize: 24,
              color: theme.palette.primary.dark,
            }}
          />
          <Typography
            variant="subtitle1"
            sx={{
              color: theme.palette.primary.dark,
              fontWeight: 500,
              fontSize: 16,
            }}
          >
            {title}
          </Typography>
        </Box>
        <Chip
          label="Done"
          size="small"
          onClick={onDone}
          sx={{
            bgcolor: theme.palette.background.default,
            color: theme.palette.text.primary,
            fontWeight: 500,
            fontSize: 12,
            height: 28,
            cursor: 'pointer',
            '&:hover': {
              bgcolor: theme.palette.action.hover,
            },
          }}
        />
      </Box>

      {/* Content */}
      <Box
        sx={{
          p: 2,
          pt: 1,
          bgcolor: theme.customColors?.background?.mint || '#F4FBF8',
          mx: 2,
          mb: 2,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: 12,
            display: 'block',
            mb: 1,
          }}
        >
          {defaultLabel}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Progress Circle */}
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant="determinate"
              value={progress}
              size={40}
              thickness={4}
              sx={{
                color: theme.palette.primary.main,
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                },
              }}
            />
            <CircularProgress
              variant="determinate"
              value={100}
              size={40}
              thickness={4}
              sx={{
                color: theme.palette.divider,
                position: 'absolute',
                left: 0,
                zIndex: -1,
              }}
            />
          </Box>

          {/* Value */}
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
            {type === 'calories' && (
              <LocalFireDepartmentIcon
                sx={{
                  fontSize: 20,
                  color: theme.palette.primary.dark,
                  mr: 0.5,
                }}
              />
            )}
            <Typography
              variant="h4"
              sx={{
                color: theme.palette.primary.dark,
                fontWeight: 400,
                fontSize: 32,
              }}
            >
              {value}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: 16,
                ml: 0.5,
              }}
            >
              {unit}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default ReminderStatCard;
