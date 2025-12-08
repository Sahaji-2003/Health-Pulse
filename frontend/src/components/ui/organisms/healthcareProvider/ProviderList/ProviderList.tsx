import React from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Button,
  Grid,
  Skeleton,
  Card,
  CardContent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ProviderCard } from '../ProviderCard';
import type { ProviderListProps } from './ProviderList.types';

/**
 * ProviderList Component
 *
 * Displays a grid of healthcare providers with search functionality
 * and action buttons for scheduling/listing appointments.
 */
export const ProviderList: React.FC<ProviderListProps> = ({
  providers,
  searchQuery = '',
  onSearchChange,
  onConnectClick,
  onMenuClick,
  onScheduleClick,
  onListAppointmentsClick,
  isLoading = false,
  sx,
}) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(event.target.value);
  };

  // Loading skeleton
  const renderSkeleton = () => (
    <Grid container spacing={2}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={item}>
          <Card sx={{ borderRadius: 4, height: 420 }} elevation={0}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, gap: 1.5 }}>
              <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', mb: 1 }}>
                <Skeleton variant="rectangular" width={160} height={22} />
                <Skeleton variant="circular" width={20} height={20} />
              </Box>
              <Skeleton variant="circular" width={90} height={90} />
              <Skeleton variant="rectangular" width={100} height={20} />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="100%" height={48} />
              <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 3 }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ width: '100%', ...sx }}>
      {/* Search and Action Buttons Row */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          mb: 3,
          alignItems: { xs: 'stretch', md: 'center' },
        }}
      >
        {/* Search Field */}
        <TextField
          placeholder="Search Healthcare Providers & Insurance Companies"
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
          size="medium"
          sx={{
            flex: 1,
            bgcolor: '#EEEEEE',
            borderRadius: 6,
            '& .MuiOutlinedInput-root': {
              borderRadius: 6,
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                borderColor: 'divider',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1.5, flexShrink: 0 }}>
          <Button
            variant="contained"
            onClick={onScheduleClick}
            sx={{
              borderRadius: 4,
              px: 3,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
          >
            Schedule Appointment
          </Button>
          <Button
            variant="contained"
            onClick={onListAppointmentsClick}
            sx={{
              borderRadius: 4,
              px: 3,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
          >
            List Appointments
          </Button>
        </Box>
      </Box>

      {/* Provider Cards Grid */}
      {isLoading ? (
        renderSkeleton()
      ) : (
        <Grid container spacing={2}>
          {providers.map((provider) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={provider.id}>
              <ProviderCard
                provider={provider}
                onConnectClick={onConnectClick}
                onMenuClick={onMenuClick}
                sx={{ height: 420 }}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ProviderList;
