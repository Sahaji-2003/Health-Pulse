import React from 'react';
import { Box, Typography, IconButton, Button, useTheme } from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { DashboardCard } from '../../../molecules/DashboardCard';
import type { AwardsCardProps } from './AwardsCard.types';

/**
 * AwardsCard Organism
 *
 * Displays user achievements including badges, streaks,
 * and rewards with action buttons.
 */
export const AwardsCard: React.FC<AwardsCardProps> = ({
  badgeName,
  earnedDate,
  streakDays,
  newRewards,
  badgeImageUrl,
  onReviewActivities,
  onRewardShop,
  onMoreClick,
  sx,
}) => {
  const theme = useTheme();

  const headerActions = (
    <IconButton size="small" onClick={onMoreClick}>
      <MoreVertIcon sx={{ fontSize: 18 }} />
    </IconButton>
  );

  const StatBox: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: number;
    unit: string;
  }> = ({ icon, label, value, unit }) => (
    <Box
      sx={{
        flex: 1,
        bgcolor: theme.customColors?.background?.mintLight || '#EFF5F2',
        borderRadius: 2.5,
        p: { xs: 1, sm: 1.25 },
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 1, sm: 1.5 },
      }}
    >
      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
        {icon}
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.primary.dark,
            fontWeight: 500,
            fontSize: { xs: 9, sm: 10 },
          }}
        >
          {label}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.5 }}>
        <Typography
          sx={{
            fontSize: { xs: 24, sm: 30 },
            fontWeight: 400,
            color: 'text.secondary',
            lineHeight: { xs: '28px', sm: '36px' },
          }}
        >
          {value.toString().padStart(2, '0')}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: 12, sm: 14 },
            fontWeight: 500,
            color: 'text.secondary',
            pb: 0.25,
          }}
        >
          {unit}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <DashboardCard
      title="Awards"
      icon={<FlagIcon />}
      headerActions={headerActions}
      fullWidth
      compact
      sx={{ ...sx, height: '100%' }}
      contentSx={{
        display: 'flex',
        flexDirection: 'column',
        pt: 0,
      }}
    >
      {/* Main Awards Section */}
      <Box
        sx={{
          bgcolor: theme.palette.grey[100],
          borderRadius: { xs: 3, sm: 4 },
          p: { xs: 1.5, sm: 2 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        {/* Badge Header */}
        <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2 }, alignItems: 'center' }}>
          {/* Badge Icon */}
          <Box
            sx={{
              width: { xs: 48, sm: 56 },
              height: { xs: 56, sm: 64 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {badgeImageUrl ? (
              <Box
                component="img"
                src={badgeImageUrl}
                alt="Badge"
                sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: theme.palette.warning.light,
                  borderRadius: 2,
                }}
              >
                <EmojiEventsIcon sx={{ fontSize: { xs: 28, sm: 32 }, color: theme.palette.warning.dark }} />
              </Box>
            )}
          </Box>

          {/* Badge Details */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.primary.dark,
                fontWeight: 500,
                fontSize: { xs: 9, sm: 10 },
              }}
            >
              You Earned
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 20, sm: 26 },
                fontWeight: 400,
                color: theme.palette.primary.main,
                lineHeight: { xs: '26px', sm: '32px' },
              }}
            >
              {badgeName}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.primary.dark,
                fontWeight: 500,
                fontSize: { xs: 9, sm: 10 },
              }}
            >
              On {earnedDate}
            </Typography>
          </Box>
        </Box>

        {/* Stats Row */}
        <Box sx={{ display: 'flex', gap: { xs: 1, sm: 1.5 }, mt: { xs: 1.5, sm: 2 } }}>
          <StatBox
            icon={<LocalFireDepartmentIcon sx={{ fontSize: { xs: 12, sm: 14 }, color: theme.palette.warning.main }} />}
            label="Streak"
            value={streakDays}
            unit="days"
          />
          <StatBox
            icon={<AutoAwesomeIcon sx={{ fontSize: { xs: 12, sm: 14 }, color: theme.palette.primary.main }} />}
            label="Rewards"
            value={newRewards}
            unit="new"
          />
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 1.5 }, mt: { xs: 1.5, sm: 2 } }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={onReviewActivities}
            sx={{
              borderRadius: 100,
              borderColor: theme.palette.divider,
              color: 'text.secondary',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: { xs: 11, sm: 12 },
              py: { xs: 0.75, sm: 1 },
            }}
          >
            Review Activities
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={onRewardShop}
            sx={{
              borderRadius: 100,
              borderColor: theme.palette.divider,
              color: 'text.secondary',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: { xs: 11, sm: 12 },
              py: { xs: 0.75, sm: 1 },
            }}
          >
            Reward Shop
          </Button>
        </Box>
      </Box>
    </DashboardCard>
  );
};

export default AwardsCard;
