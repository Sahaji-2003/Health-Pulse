import React from 'react';
import { Box, Chip, useTheme } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import type { VitalsTabsFilterProps, VitalsTab } from './VitalsTabsFilter.types';

const tabs: VitalsTab[] = ['Dashboard', 'Vitals History', 'Vitals Entry', 'Reminders and Alerts'];

/**
 * VitalsTabsFilter Organism
 *
 * Filter chips carousel for navigating between vitals sections.
 * Uses MUI FilterChip pattern with selected/unselected states.
 */
export const VitalsTabsFilter: React.FC<VitalsTabsFilterProps> = ({
  selectedTab,
  onTabChange,
  sx,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 0.5,
        alignItems: 'center',
        overflowX: 'auto',
        py: 2,
        px: 3,
        '&::-webkit-scrollbar': { height: 0 },
        ...sx,
      }}
    >
      {tabs.map((tab) => {
        const isSelected = selectedTab === tab;
        return (
          <Chip
            key={tab}
            label={tab}
            onClick={() => onTabChange(tab)}
            icon={isSelected ? <DoneIcon sx={{ fontSize: 18 }} /> : undefined}
            variant={isSelected ? 'filled' : 'outlined'}
            sx={{
              borderRadius: '8px',
              height: 32,
              fontSize: 14,
              fontWeight: 500,
              px: 0.5,
              bgcolor: isSelected ? theme.palette.secondary.light : 'transparent',
              color: isSelected ? theme.palette.secondary.dark : theme.palette.text.secondary,
              borderColor: isSelected ? 'transparent' : theme.palette.divider,
              '&:hover': {
                bgcolor: isSelected
                  ? theme.palette.secondary.light
                  : theme.palette.action.hover,
              },
              '& .MuiChip-icon': {
                color: theme.palette.secondary.dark,
                ml: 0.5,
              },
            }}
          />
        );
      })}
    </Box>
  );
};

export default VitalsTabsFilter;
