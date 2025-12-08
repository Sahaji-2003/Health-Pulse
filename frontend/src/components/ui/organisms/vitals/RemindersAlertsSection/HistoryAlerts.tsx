import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckIcon from '@mui/icons-material/Check';
import type { HistoryAlertsProps, AlertHistoryItem } from './RemindersAlertsSection.types';

// Default alert history data
const defaultAlerts: AlertHistoryItem[] = [
  { id: '1', date: 'Yesterday', title: 'Intake', value: '3ltr', isCompleted: true },
  { id: '2', date: '13th Oct', title: 'Intake', value: '2ltr', isCompleted: true },
  { id: '3', date: '13th Oct', title: 'Walking', value: '45m', isCompleted: true },
  { id: '4', date: '13th Oct', title: 'Walking', value: '45m', isCompleted: true },
  { id: '5', date: '13th Oct', title: 'Walking', value: '45m', isCompleted: true },
];

/**
 * HistoryAlerts Component
 *
 * Displays a list of alert history items with completion status.
 * Shows an empty state when no alerts are available.
 * Based on Figma design node 2161-9825.
 */
export const HistoryAlerts: React.FC<HistoryAlertsProps> = ({
  alerts = defaultAlerts,
  isEmpty = false,
  onInfoClick,
  sx,
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 7,
        bgcolor: theme.palette.background.paper,
        height: 'auto',
        maxHeight: 380,
        overflow: 'hidden',
        ...sx,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          pb: 0.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon
            sx={{
              fontSize: 20,
              color: theme.palette.primary.dark,
            }}
          />
          <Typography
            variant="subtitle1"
            sx={{
              color: theme.palette.primary.dark,
              fontWeight: 500,
              fontSize: 14,
            }}
          >
            History Alerts
          </Typography>
        </Box>
        <ErrorOutlineIcon
          onClick={onInfoClick}
          sx={{
            fontSize: 20,
            color: theme.palette.error.main,
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8,
            },
          }}
        />
      </Box>

      {/* History Label */}
      <Box sx={{ px: 2, py: 0.25 }}>
        <Typography
          variant="overline"
          sx={{
            color: theme.palette.primary.main,
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: 0.5,
          }}
        >
          HISTORY
        </Typography>
      </Box>

      {/* Alerts List or Empty State */}
      {isEmpty ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
            px: 2,
          }}
        >
          {/* Empty state illustration placeholder */}
          <Box
            sx={{
              width: 80,
              height: 80,
              mb: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: theme.customColors?.background?.mint || '#F4FBF8',
              borderRadius: '50%',
            }}
          >
            <Typography fontSize={36}>🧘</Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.primary.main,
              textAlign: 'center',
              fontWeight: 500,
              fontSize: 13,
            }}
          >
            No recommendations for today.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.primary.main,
              textAlign: 'center',
              fontWeight: 500,
              fontSize: 13,
            }}
          >
            Wishing you a productive and positive day ahead!
          </Typography>
        </Box>
      ) : (
        <List sx={{ px: 1.5, py: 0, maxHeight: 280, overflow: 'auto' }}>
          {alerts.slice(0, 5).map((alert) => (
            <ListItem
              key={alert.id}
              sx={{
                py: 1,
                px: 0.5,
                borderBottom: `1px solid ${theme.palette.divider}`,
                '&:last-child': {
                  borderBottom: 'none',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 28 }}>
                <CheckIcon
                  sx={{
                    fontSize: 18,
                    color: alert.isCompleted
                      ? theme.palette.primary.main
                      : theme.palette.text.disabled,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: 10,
                      display: 'block',
                    }}
                  >
                    {alert.date}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 500,
                      fontSize: 14,
                    }}
                  >
                    {alert.title}
                  </Typography>
                }
              />
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: 12,
                }}
              >
                {alert.value}
              </Typography>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default HistoryAlerts;
