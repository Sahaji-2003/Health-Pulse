import React from 'react';
import { Box, Typography, IconButton, Chip, useTheme } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import BarChartIcon from '@mui/icons-material/BarChart';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MonitorWeightOutlinedIcon from '@mui/icons-material/MonitorWeightOutlined';
import CheckIcon from '@mui/icons-material/Check';
import { DashboardCard } from '../../../molecules/DashboardCard';
import type { WeeklyChartCardProps } from './WeeklyChartCard.types';

// Figma design colors
const COLORS = {
  secondaryContainer: '#E8DEF8', // Selected chip background
  onSecondaryContainer: '#4A4459', // Selected chip text
  barLight: '#B2DFDB', // Light teal bar color (normal days)
  barDark: '#37474F', // Dark teal/blue bar color (highlighted days)
  outlineVariant: '#CAC4D0', // Grid lines & chip border
  secondary: '#625B71', // Labels
  referenceLine: '#CAC4D0', // Dashed reference line (gray)
  onSurfaceVariant: '#49454F', // Unselected chip text
};

/**
 * WeeklyChartCard Organism
 *
 * Displays weekly activity chart with filter chips
 * and insight text using MUI X-Charts BarChart.
 */
export const WeeklyChartCard: React.FC<WeeklyChartCardProps> = ({
  data,
  selectedFilter,
  targetValue = 15,
  insightText,
  onFilterChange,
  onMoreClick,
  sx,
}) => {
  const theme = useTheme();

  // Transform data for MUI BarChart
  const chartData = data.map((d) => d.value);
  const xLabels = data.map((d) => d.day);
  
  // Create ordinal colorMap for individual bar colors based on isHighlighted
  const colorMapValues = data.map((d) => d.day);
  const colorMapColors = data.map((d) => 
    d.isHighlighted ? COLORS.barDark : COLORS.barLight
  );

  // Get unit label based on selected filter
  const getUnitLabel = () => {
    if (selectedFilter === 'Walking') return 'km';
    if (selectedFilter === 'Heart Rate') return 'BPM';
    return 'kg';
  };

  const headerActions = (
    <IconButton size="small" onClick={onMoreClick}>
      <MoreVertIcon sx={{ fontSize: 18 }} />
    </IconButton>
  );

  const FilterChip: React.FC<{
    label: string;
    selected: boolean;
    icon?: React.ReactElement;
    onClick: () => void;
  }> = ({ label, selected, icon, onClick }) => (
    <Chip
      label={label}
      icon={selected ? <CheckIcon sx={{ fontSize: { xs: 16, sm: 18 } }} /> : icon}
      variant={selected ? 'filled' : 'outlined'}
      size="small"
      onClick={onClick}
      sx={{
        borderRadius: 2,
        height: { xs: 28, sm: 32 },
        fontSize: { xs: 12, sm: 14 },
        fontWeight: 500,
        flexShrink: 0,
        bgcolor: selected ? COLORS.secondaryContainer : 'transparent',
        borderColor: selected ? 'transparent' : COLORS.outlineVariant,
        color: selected ? COLORS.onSecondaryContainer : COLORS.onSurfaceVariant,
        '& .MuiChip-icon': {
          color: 'inherit',
          ml: 0.5,
          fontSize: { xs: 16, sm: 18 },
        },
        '&:hover': {
          bgcolor: selected ? COLORS.secondaryContainer : theme.palette.action.hover,
        },
      }}
    />
  );

  return (
    <DashboardCard
      title="This Week"
      icon={<BarChartIcon />}
      headerActions={headerActions}
      fullWidth
      compact
      sx={{ ...sx, height: '100%' }}
      contentSx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        pt: 1.5,
        pb: 1,
        overflow: 'visible',
      }}
    >
      {/* Filter Chips */}
      <Box 
        sx={{ 
          display: 'flex', 
          gap: { xs: 0.5, sm: 1 }, 
          px: 0,
          mb: 1,
          flexShrink: 0,
          overflowX: 'auto',
          flexWrap: { xs: 'nowrap', sm: 'wrap' },
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <FilterChip
          label="Walking"
          selected={selectedFilter === 'Walking'}
          onClick={() => onFilterChange?.('Walking')}
        />
        <FilterChip
          label="Heart Rate"
          selected={selectedFilter === 'Heart Rate'}
          icon={<FavoriteBorderIcon sx={{ fontSize: 18 }} />}
          onClick={() => onFilterChange?.('Heart Rate')}
        />
        <FilterChip
          label="Weight"
          selected={selectedFilter === 'Weight'}
          icon={<MonitorWeightOutlinedIcon sx={{ fontSize: 18 }} />}
          onClick={() => onFilterChange?.('Weight')}
        />
      </Box>

      {/* MUI X-Charts Bar Chart */}
      <Box sx={{ width: '100%', flex: 1, minHeight: { xs: 140, sm: 160 }, position: 'relative' }}>
        {/* Y-axis label */}
        <Typography
          sx={{
            position: 'absolute',
            left: 0,
            top: { xs: 24, sm: 30 },
            fontSize: { xs: 10, sm: 11 },
            fontWeight: 600,
            color: COLORS.secondary,
            zIndex: 1,
          }}
        >
          {targetValue}{getUnitLabel()}
        </Typography>

        <BarChart
          xAxis={[
            {
              data: xLabels,
              scaleType: 'band',
              tickLabelStyle: {
                fontSize: 11,
                fontWeight: 600,
                fill: COLORS.secondary,
              },
              disableLine: true,
              disableTicks: true,
              colorMap: {
                type: 'ordinal',
                values: colorMapValues,
                colors: colorMapColors,
              },
            },
          ]}
          yAxis={[
            {
              max: Math.max(...chartData, targetValue) + 5,
              disableLine: true,
              disableTicks: true,
              tickLabelStyle: {
                display: 'none',
              },
            },
          ]}
          series={[
            {
              data: chartData,
            },
          ]}
          slotProps={{
            bar: {
              rx: 12,
              ry: 12,
            },
          }}
          sx={{
            '& .MuiBarElement-root': {
              rx: 12,
              width: '16px !important',
            },
            // Hide default axis lines
            '& .MuiChartsAxis-line': {
              display: 'none',
            },
            '& .MuiChartsAxis-tick': {
              display: 'none',
            },
            // Style horizontal grid lines as dashed
            '& .MuiChartsGrid-line': {
              stroke: COLORS.outlineVariant,
              strokeDasharray: '4 4',
            },
          }}
          height={160}
          margin={{ top: 20, bottom: 20, left: 40, right: 10 }}
          grid={{ horizontal: true }}
          barLabel={() => null}
        >
          {/* Target reference line */}
          <ChartsReferenceLine
            y={targetValue}
            lineStyle={{
              stroke: COLORS.referenceLine,
              strokeWidth: 1,
              strokeDasharray: '6 4',
            }}
          />
        </BarChart>
      </Box>

      {/* Insight Text */}
      {insightText && (
        <Box
          sx={{
            borderTop: `1px solid ${COLORS.outlineVariant}`,
            pt: { xs: 1, sm: 1.5 },
            pb: { xs: 0.5, sm: 1 },
            flexShrink: 0,
            mt: 'auto',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: COLORS.onSurfaceVariant,
              fontSize: { xs: 12, sm: 14 },
              lineHeight: { xs: '18px', sm: '20px' },
            }}
          >
            {insightText}
          </Typography>
        </Box>
      )}
    </DashboardCard>
  );
};

export default WeeklyChartCard;
