import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Switch,
  useTheme,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DownloadIcon from '@mui/icons-material/Download';
import type { VitalsHistoryTableViewProps, VitalsHistoryData } from './VitalsHistorySection.types';

// Default table data for demonstration
const defaultTableData: VitalsHistoryData[] = [
  { id: '1', date: '20 Aug, 2025', value: 60, unit: 'bpm' },
  { id: '2', date: '20 Aug, 2025', value: 60, unit: 'bpm' },
  { id: '3', date: '20 Aug, 2025', value: 60, unit: 'bpm' },
  { id: '4', date: '20 Aug, 2025', value: 60, unit: 'bpm' },
];

const vitalTypeOptions = [
  { value: 'heart_rate', label: 'Heart Rate' },
  { value: 'blood_pressure', label: 'Blood Pressure' },
  { value: 'temperature', label: 'Temperature' },
  { value: 'oxygen_saturation', label: 'Oxygen Saturation' },
  { value: 'weight', label: 'Weight' },
  { value: 'blood_sugar', label: 'Blood Sugar' },
];

/**
 * VitalsHistoryTableView Component
 *
 * Displays vitals history in a table format with filters and controls.
 * Based on Figma design node 2124-3559.
 */
export const VitalsHistoryTableView: React.FC<VitalsHistoryTableViewProps> = ({
  title = 'Heart Rate Trend',
  data = defaultTableData,
  onViewModeChange,
  onExport,
  vitalType = 'heart_rate',
  onVitalTypeChange,
  fromDate = '08/12/2025',
  toDate = '08/12/2025',
  onDateRangeChange,
  sx,
}) => {
  const theme = useTheme();
  const [isTableView, setIsTableView] = useState(true);

  const handleViewToggle = () => {
    const newMode = isTableView ? 'graph' : 'table';
    setIsTableView(!isTableView);
    onViewModeChange?.(newMode);
  };

  return (
    <Box sx={sx}>
      {/* Filter Controls - Positioned to the right */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 2,
          mb: 2,
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          justifyContent: 'flex-end',
        }}
      >
        {/* Vital Type Select */}
        <TextField
          select
          label="Type"
          value={vitalType}
          onChange={(e) => onVitalTypeChange?.(e.target.value as any)}
          size="small"
          helperText="Select vital"
          sx={{
            minWidth: 140,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
            },
          }}
        >
          {vitalTypeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        {/* From Date */}
        <TextField
          label="From"
          value={fromDate}
          onChange={(e) => onDateRangeChange?.(e.target.value, toDate)}
          size="small"
          helperText="MM/DD/YYYY"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <CalendarTodayIcon sx={{ fontSize: 20, color: 'action.active' }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            minWidth: 140,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
            },
          }}
        />

        {/* To Date */}
        <TextField
          label="To"
          value={toDate}
          onChange={(e) => onDateRangeChange?.(fromDate, e.target.value)}
          size="small"
          helperText="MM/DD/YYYY"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <CalendarTodayIcon sx={{ fontSize: 20, color: 'action.active' }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            minWidth: 140,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
            },
          }}
        />
      </Box>

      {/* Paper Card */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 7, // 28px
          bgcolor: theme.palette.background.paper,
          p: 3,
        }}
      >
        {/* Header with title and view toggle */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: theme.palette.primary.dark,
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            {title}
          </Typography>

          {/* View Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography
              variant="body2"
              sx={{
                color: !isTableView ? theme.palette.primary.main : theme.palette.text.secondary,
                fontWeight: 600,
                fontSize: 13,
                transition: 'all 0.3s ease',
              }}
            >
              Graph
            </Typography>
            <Switch
              checked={isTableView}
              onChange={handleViewToggle}
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
              variant="body2"
              sx={{
                color: isTableView ? theme.palette.primary.main : theme.palette.text.secondary,
                fontWeight: 600,
                fontSize: 13,
                transition: 'all 0.3s ease',
              }}
            >
              Table
            </Typography>
          </Box>
        </Box>

      {/* Filter Chips */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Chip
          label="Date"
          size="small"
          sx={{
            bgcolor: theme.customColors?.accent?.mint || '#9EF2E3',
            color: theme.palette.primary.dark,
            fontWeight: 500,
            fontSize: 14,
            px: 1,
            '& .MuiChip-label': {
              px: 1,
            },
          }}
        />
        <Chip
          label={vitalTypeOptions.find(opt => opt.value === vitalType)?.label || 'Heart Rate'}
          size="small"
          sx={{
            bgcolor: theme.customColors?.accent?.mint || '#9EF2E3',
            color: theme.palette.primary.dark,
            fontWeight: 500,
            fontSize: 14,
            px: 1,
            '& .MuiChip-label': {
              px: 1,
            },
          }}
        />
      </Box>

      {/* Data Table */}
      <TableContainer
        sx={{
          mb: 3,
          '& .MuiTable-root': {
            minWidth: 'auto',
          },
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  color: theme.palette.primary.dark,
                  fontWeight: 600,
                  fontSize: 16,
                  borderBottom: 'none',
                  py: 1.5,
                }}
              >
                Date
              </TableCell>
              <TableCell
                sx={{
                  color: theme.palette.primary.dark,
                  fontWeight: 600,
                  fontSize: 16,
                  borderBottom: 'none',
                  py: 1.5,
                }}
              >
                {vitalTypeOptions.find(opt => opt.value === vitalType)?.label || 'Heart Rate'}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={2}
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: 14,
                    borderBottom: 'none',
                    py: 4,
                    textAlign: 'center',
                  }}
                >
                  No vitals data found for the selected date range. Try adjusting the filters or add new vitals entries.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell
                    sx={{
                      color: theme.palette.primary.dark,
                      fontSize: 16,
                      borderBottom: 'none',
                      py: 1,
                    }}
                  >
                    {row.date}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: theme.palette.primary.dark,
                      fontSize: 16,
                      borderBottom: 'none',
                      py: 1,
                    }}
                  >
                    {row.value} {row.unit}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Export Button - at the bottom */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mt: 3,
        }}
      >
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={onExport}
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            px: 2,
            bgcolor: theme.palette.primary.main,
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
            },
          }}
        >
          Export History
        </Button>
      </Box>
      </Paper>
    </Box>
  );
};

export default VitalsHistoryTableView;
