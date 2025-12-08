import { useState, useMemo } from 'react';
import { Box } from '@mui/material';
import type {
  VitalsHistorySectionProps,
  VitalsHistoryViewMode,
  VitalType,
  WeeklyDataPoint,
  VitalsHistoryData,
} from './VitalsHistorySection.types';
import { VitalsHistoryGraphView } from './VitalsHistoryGraphView';
import { VitalsHistoryTableView } from './VitalsHistoryTableView';
import { useVitalsHistory } from '../../../../../hooks/useVitals';

// Default weekly data for graph view
const defaultGraphData: WeeklyDataPoint[] = [
  { day: 'Mon', value: 72, percentage: 57 },
  { day: 'Tue', value: 65, percentage: 36 },
  { day: 'Wed', value: 68, percentage: 44 },
  { day: 'Thu', value: 72, percentage: 57 },
  { day: 'Fri', value: 85, percentage: 100, isHighlighted: true },
  { day: 'Sat', value: 78, percentage: 71 },
  { day: 'Sun', value: 75, percentage: 61 },
];

// Default table data for table view
const defaultTableData: VitalsHistoryData[] = [
  { id: '1', date: '20 Aug, 2025', value: 60, unit: 'bpm' },
  { id: '2', date: '20 Aug, 2025', value: 60, unit: 'bpm' },
  { id: '3', date: '20 Aug, 2025', value: 60, unit: 'bpm' },
  { id: '4', date: '20 Aug, 2025', value: 60, unit: 'bpm' },
];

const formatVitalTypeName = (vitalType: string): string => {
  return vitalType.replace('_', ' ').split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

/**
 * VitalsHistorySection Organism
 *
 * Displays vitals history with switchable Graph and Table views.
 * Includes filters for vital type and date range, plus export functionality.
 * Based on Figma designs for nodes 2124-3515 (Graph) and 2124-3559 (Table).
 */
export const VitalsHistorySection: React.FC<VitalsHistorySectionProps> = ({
  viewMode: controlledViewMode,
  onViewModeChange,
  graphData,
  tableData,
  vitalType: controlledVitalType,
  onVitalTypeChange,
  fromDate: controlledFromDate,
  toDate: controlledToDate,
  onDateRangeChange,
  onExport,
  sx,
}) => {
  // Calculate default date range (last 30 days)
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const defaultFromDate = `${String(thirtyDaysAgo.getMonth() + 1).padStart(2, '0')}/${String(thirtyDaysAgo.getDate()).padStart(2, '0')}/${thirtyDaysAgo.getFullYear()}`;
  const defaultToDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;

  // Internal state for uncontrolled usage
  const [internalViewMode, setInternalViewMode] = useState<VitalsHistoryViewMode>('graph');
  const [internalVitalType, setInternalVitalType] = useState<VitalType>('heart_rate');
  const [internalFromDate, setInternalFromDate] = useState(defaultFromDate);
  const [internalToDate, setInternalToDate] = useState(defaultToDate);

  // Use controlled values if provided, otherwise use internal state
  const viewMode = controlledViewMode ?? internalViewMode;
  const vitalType = controlledVitalType ?? internalVitalType;
  const fromDate = controlledFromDate ?? internalFromDate;
  const toDate = controlledToDate ?? internalToDate;

  // Parse dates properly for API (handle MM/DD/YYYY format)
  const parseDate = (dateStr: string, isEndDate: boolean = false): string | undefined => {
    if (!dateStr) return undefined;
    try {
      // Handle MM/DD/YYYY format
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const [month, day, year] = parts;
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        if (!isNaN(date.getTime())) {
          // For end date, set to end of day (23:59:59.999)
          if (isEndDate) {
            date.setHours(23, 59, 59, 999);
          }
          return date.toISOString();
        }
      }
      // Fallback to direct parsing
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        if (isEndDate) {
          date.setHours(23, 59, 59, 999);
        }
        return date.toISOString();
      }
      return undefined;
    } catch (error) {
      console.error('Date parsing error:', error, dateStr);
      return undefined;
    }
  };

  // Fetch vitals history from backend
  const { data: vitalsHistoryData, isLoading, error } = useVitalsHistory({
    vitalType,
    startDate: parseDate(fromDate, false),
    endDate: parseDate(toDate, true),
    limit: 50,
  });

  // Debug logging
  console.log('VitalsHistorySection Debug:', {
    vitalType,
    fromDate,
    toDate,
    parsedStartDate: parseDate(fromDate),
    parsedEndDate: parseDate(toDate),
    vitalsHistoryData,
    isLoading,
    error,
    token: localStorage.getItem('accessToken') ? 'Token exists' : 'No token'
  });

  // Transform backend data for table view
  const transformedTableData = useMemo(() => {
    if (!vitalsHistoryData?.data || vitalsHistoryData.data.length === 0) {
      // Return empty array to show "no data" state instead of dummy data
      return [];
    }
    return vitalsHistoryData.data.map(item => ({
      id: item.id,
      date: item.date,
      value: typeof item.value === 'string' ? parseFloat(item.value) || 0 : item.value,
      unit: item.unit,
    }));
  }, [vitalsHistoryData]);

  // Transform backend data for graph view
  const transformedGraphData = useMemo(() => {
    if (!vitalsHistoryData?.data || vitalsHistoryData.data.length === 0) {
      // Return empty array to show "no data" state instead of dummy data
      return [];
    }
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekData: WeeklyDataPoint[] = [];
    
    const last7Days = vitalsHistoryData.data.slice(0, 7).reverse();
    
    for (let i = 0; i < 7; i++) {
      const dayData = last7Days[i];
      if (dayData) {
        const date = new Date(dayData.date);
        const dayName = dayNames[date.getDay()];
        const value = typeof dayData.value === 'string' ? parseFloat(dayData.value) || 0 : dayData.value;
        
        let percentage = 50;
        if (vitalType === 'heart_rate' && typeof value === 'number') {
          percentage = Math.min(100, Math.max(0, ((value - 40) / 80) * 100));
        }
        
        weekData.push({
          day: dayName,
          value,
          percentage,
          isHighlighted: dayData.isAbnormal,
        });
      } else {
        weekData.push({
          day: dayNames[i],
          value: 0,
          percentage: 0,
        });
      }
    }
    
    return weekData;
  }, [vitalsHistoryData, vitalType]);

  const finalGraphData = graphData || transformedGraphData;
  const finalTableData = tableData || transformedTableData;

  const handleViewModeChange = (mode: VitalsHistoryViewMode) => {
    setInternalViewMode(mode);
    onViewModeChange?.(mode);
  };

  const handleVitalTypeChange = (type: VitalType) => {
    setInternalVitalType(type);
    onVitalTypeChange?.(type);
  };

  const handleDateRangeChange = (from: string, to: string) => {
    setInternalFromDate(from);
    setInternalToDate(to);
    onDateRangeChange?.(from, to);
  };

  const handleExport = () => {
    onExport?.();
    console.log('Exporting vitals history...');
  };

  const vitalTypeName = formatVitalTypeName(vitalType);

  return (
    <Box sx={sx}>
      {viewMode === 'graph' ? (
        <VitalsHistoryGraphView
          title={`${vitalTypeName} Trend`}
          data={finalGraphData}
          onViewModeChange={handleViewModeChange}
          onExport={handleExport}
          vitalType={vitalType}
          onVitalTypeChange={handleVitalTypeChange}
          fromDate={fromDate}
          toDate={toDate}
          onDateRangeChange={handleDateRangeChange}
        />
      ) : (
        <VitalsHistoryTableView
          title={`${vitalTypeName} History`}
          data={finalTableData}
          onViewModeChange={handleViewModeChange}
          onExport={handleExport}
          vitalType={vitalType}
          onVitalTypeChange={handleVitalTypeChange}
          fromDate={fromDate}
          toDate={toDate}
          onDateRangeChange={handleDateRangeChange}
        />
      )}
    </Box>
  );
};

export default VitalsHistorySection;