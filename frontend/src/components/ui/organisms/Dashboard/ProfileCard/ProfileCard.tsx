import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Button,
  useTheme,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import DownloadIcon from '@mui/icons-material/Download';
import { DashboardCard } from '../../../molecules/DashboardCard';
import type { ProfileCardProps } from './ProfileCard.types';

// 3D Avatar image from Figma (fallback)
const AVATAR_3D_URL = '/assets/9bf85657768890adce0bc6ec7465d29b46d08d7d.png';

/**
 * ProfileCard Organism
 *
 * Displays user profile information with avatar, personal details,
 * and action buttons.
 */
export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  avatarUrl,
  age,
  dateOfBirth,
  gender,
  bloodGroup,
  weight,
  isDownloading = false,
  onScheduleClick,
  onDownloadClick,
  onMoreDetailsClick,
  sx,
}) => {
  const theme = useTheme();
  const [imageError, setImageError] = useState(false);

  // Use 3D avatar if no custom avatar provided or if image fails to load
  const displayAvatarUrl = (!avatarUrl || imageError) ? AVATAR_3D_URL : avatarUrl;

  // Handle image load error - fallback to 3D avatar
  const handleImageError = () => {
    setImageError(true);
  };

  const DetailRow = ({ label, value }: { label: string; value?: string }) => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: { xs: 0.5, sm: 0.75 },
      }}
    >
      <Typography variant="body2" color="text.primary" sx={{ fontSize: { xs: 13, sm: 15 }, fontWeight: 500 }}>
        {label}:
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: 13, sm: 15 } }}>
        {value || '-'}
      </Typography>
    </Box>
  );

  return (
    <DashboardCard
      fullWidth
      compact
      sx={{ ...sx, height: '100%' }}
      contentSx={{ pt: 3, pb: 3, px: 2.5, display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {/* Profile Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'flex-start' },
          gap: { xs: 1.5, sm: 2.5 },
          pb: { xs: 2, sm: 3 },
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Avatar
          src={displayAvatarUrl}
          alt={name}
          onError={handleImageError}
          imgProps={{ crossOrigin: 'anonymous' }}
          sx={{
            width: { xs: 70, sm: 90 },
            height: { xs: 70, sm: 90 },
            bgcolor: theme.palette.primary.light,
          }}
        />
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: { xs: 1, sm: 1.5 }, justifyContent: 'center', alignItems: { xs: 'center', sm: 'flex-start' }, textAlign: { xs: 'center', sm: 'left' } }}>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.primary.dark,
              fontWeight: 500,
              fontSize: { xs: 18, sm: 22 },
              lineHeight: '28px',
            }}
          >
            {name}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
            <IconButton
              size="small"
              onClick={onScheduleClick}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2.5,
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
              }}
            >
              <ScheduleIcon sx={{ fontSize: { xs: 18, sm: 20 } }} color="action" />
            </IconButton>
            <Tooltip title={isDownloading ? "Gathering information..." : "Download Profile PDF"}>
              <span>
                <IconButton
                  size="small"
                  onClick={onDownloadClick}
                  disabled={isDownloading}
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2.5,
                    width: { xs: 36, sm: 40 },
                    height: { xs: 36, sm: 40 },
                    position: 'relative',
                  }}
                >
                  {isDownloading ? (
                    <CircularProgress size={18} color="primary" />
                  ) : (
                    <DownloadIcon sx={{ fontSize: { xs: 18, sm: 20 } }} color="action" />
                  )}
                </IconButton>
              </span>
            </Tooltip>
            <Button
              variant="text"
              color="primary"
              onClick={onMoreDetailsClick}
              sx={{
                fontSize: { xs: 12, sm: 14 },
                fontWeight: 500,
                textTransform: 'none',
                py: 0.75,
                px: { xs: 1.5, sm: 2 },
                minWidth: 'auto',
              }}
            >
              More Details
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Profile Details */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 'auto', pt: 2 }}>
        <DetailRow label="Age" value={age && dateOfBirth ? `${age} [${dateOfBirth}]` : age} />
        <DetailRow label="Gender" value={gender} />
        <DetailRow label="Blood Group" value={bloodGroup} />
        <DetailRow label="Weight" value={weight} />
      </Box>
    </DashboardCard>
  );
};

export default ProfileCard;
