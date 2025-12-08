import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Switch,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  useTheme,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AppointmentCard } from '../AppointmentCard';
import type { AppointmentDashboardProps, AppointmentViewMode } from './AppointmentDashboard.types';
import type { Appointment } from '../AppointmentCard/AppointmentCard.types';

/**
 * AppointmentListItem Component
 *
 * Renders an individual appointment in list view
 */
const AppointmentListItem: React.FC<{
  appointment: Appointment;
  onClick: (appointment: Appointment) => void;
}> = ({ appointment, onClick }) => {
  const { provider, title, dateTime } = appointment;

  // Format time display
  const isToday = new Date().toDateString() === dateTime.toDateString();
  const isYesterday =
    new Date(Date.now() - 86400000).toDateString() === dateTime.toDateString();

  let timeDisplay = '';
  if (isToday) {
    timeDisplay = `Today ${dateTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })}`;
  } else if (isYesterday) {
    timeDisplay = 'Yesterday';
  } else {
    timeDisplay = dateTime.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  return (
    <ListItemButton
      onClick={() => onClick(appointment)}
      sx={{
        py: 1.5,
        px: 0,
        '&:hover': {
          bgcolor: 'transparent',
        },
      }}
    >
      <ListItemText
        primary={title}
        secondary={provider.name}
        primaryTypographyProps={{
          variant: 'body1',
          fontWeight: 500,
          color: 'text.primary',
        }}
        secondaryTypographyProps={{
          variant: 'body2',
          color: 'text.secondary',
        }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {timeDisplay}
        </Typography>
        <ChevronRightIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
      </Box>
    </ListItemButton>
  );
};

/**
 * AppointmentDashboard Component
 *
 * Main dashboard component for viewing appointments with a toggle
 * between list and calendar views. Displays upcoming and past appointments.
 */
export const AppointmentDashboard: React.FC<AppointmentDashboardProps> = ({
  upcomingAppointments,
  pastAppointments,
  selectedAppointment,
  viewMode: controlledViewMode,
  selectedDate: controlledSelectedDate,
  userName = 'User',
  onViewModeChange,
  onDateSelect,
  onAppointmentSelect,
  onJoinSession,
  sx,
}) => {
  const theme = useTheme();
  const [internalViewMode, setInternalViewMode] = useState<AppointmentViewMode>('list');
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | null>(new Date());

  const viewMode = controlledViewMode ?? internalViewMode;
  const selectedDate = controlledSelectedDate !== undefined ? controlledSelectedDate : internalSelectedDate;

  const handleViewModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMode: AppointmentViewMode = event.target.checked ? 'calendar' : 'list';
    setInternalViewMode(newMode);
    onViewModeChange?.(newMode);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDateChange = (date: any) => {
    // Handle both Date and Dayjs objects
    let dateObj: Date | null = null;
    if (date) {
      if (date instanceof Date) {
        dateObj = date;
      } else if (typeof date.toDate === 'function') {
        dateObj = date.toDate();
      }
    }
    setInternalSelectedDate(dateObj);
    onDateSelect?.(dateObj);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    onAppointmentSelect?.(appointment);
  };

  // Get appointments for selected date in calendar view
  const appointmentsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    const selectedDateStr = selectedDate.toDateString();
    return upcomingAppointments.filter(
      (apt) => apt.dateTime.toDateString() === selectedDateStr
    );
  }, [selectedDate, upcomingAppointments]);

  // Get the appointment to display in the detail card
  const displayAppointment = selectedAppointment || appointmentsForSelectedDate[0] || upcomingAppointments[0];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ ...sx }}>
        {/* Greeting */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 500,
            color: 'text.primary',
            mb: 0.5,
          }}
        >
          Good morning, {userName}!
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color: 'primary.main',
            mb: 2,
          }}
        >
          Here are your appointments.
        </Typography>

        {/* View Mode Toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 500,
              color: viewMode === 'list' ? 'text.primary' : 'text.disabled',
            }}
          >
            List
          </Typography>
          <Switch
            checked={viewMode === 'calendar'}
            onChange={handleViewModeChange}
            size="medium"
            sx={{
              width: 52,
              height: 28,
              padding: 0,
              '& .MuiSwitch-switchBase': {
                padding: '3px',
                '&.Mui-checked': {
                  transform: 'translateX(24px)',
                  '& + .MuiSwitch-track': {
                    backgroundColor: theme.palette.primary.main,
                    opacity: 1,
                  },
                },
              },
              '& .MuiSwitch-thumb': {
                width: 22,
                height: 22,
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              },
              '& .MuiSwitch-track': {
                borderRadius: 14,
                backgroundColor: theme.palette.primary.main,
                opacity: 1,
              },
            }}
          />
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 500,
              color: viewMode === 'calendar' ? 'text.primary' : 'text.disabled',
            }}
          >
            Calendar
          </Typography>
        </Box>

        {/* Main Content Area */}
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            flexWrap: 'wrap',
          }}
        >
          {/* Left Panel - List or Calendar */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 7,
              p: 3,
              flex: '1 1 380px',
              minWidth: 320,
              maxWidth: 450,
            }}
          >
            {viewMode === 'list' ? (
              /* List View */
              <Box>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <CalendarIcon sx={{ color: 'text.secondary' }} />
                  <Typography variant="subtitle1" fontWeight={500}>
                    Appointments
                  </Typography>
                </Box>

                {/* Upcoming Appointments */}
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 500, mb: 1 }}
                >
                  Upcoming Appointments
                </Typography>
                <List disablePadding>
                  {upcomingAppointments.map((appointment, index) => (
                    <React.Fragment key={appointment.id}>
                      <AppointmentListItem
                        appointment={appointment}
                        onClick={handleAppointmentClick}
                      />
                      {index < upcomingAppointments.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                  {upcomingAppointments.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      No upcoming appointments
                    </Typography>
                  )}
                </List>

                {/* Past Appointments */}
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 500, mt: 3, mb: 1 }}
                >
                  Past Appointments
                </Typography>
                <List disablePadding>
                  {pastAppointments.map((appointment, index) => (
                    <React.Fragment key={appointment.id}>
                      <AppointmentListItem
                        appointment={appointment}
                        onClick={handleAppointmentClick}
                      />
                      {index < pastAppointments.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                  {pastAppointments.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      No past appointments
                    </Typography>
                  )}
                </List>
              </Box>
            ) : (
              /* Calendar View */
              <Box>
                <DateCalendar
                  value={selectedDate}
                  onChange={handleDateChange}
                  sx={{
                    width: '100%',
                    '& .MuiPickersCalendarHeader-root': {
                      pl: 0,
                    },
                    '& .MuiPickersDay-root.Mui-selected': {
                      bgcolor: 'primary.main',
                    },
                  }}
                />
              </Box>
            )}
          </Paper>

          {/* Right Panel - Appointment Cards */}
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              flexWrap: 'wrap',
              flex: '1 1 400px',
            }}
          >
            {displayAppointment ? (
              <AppointmentCard
                appointment={displayAppointment}
                onJoinSession={onJoinSession}
                sx={{ flex: '1 1 340px', maxWidth: 372 }}
              />
            ) : null}

            {/* Second appointment card for list view */}
            {viewMode === 'list' && upcomingAppointments.length > 1 && (
              <AppointmentCard
                appointment={upcomingAppointments[1]}
                onJoinSession={onJoinSession}
                sx={{ flex: '1 1 340px', maxWidth: 372 }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default AppointmentDashboard;
