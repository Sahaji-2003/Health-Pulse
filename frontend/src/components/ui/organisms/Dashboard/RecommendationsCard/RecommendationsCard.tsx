import React from 'react';
import { Box, Typography, IconButton, Button, Avatar, useTheme } from '@mui/material';
import RecommendIcon from '@mui/icons-material/Recommend';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { DashboardCard } from '../../../molecules/DashboardCard';
import type { RecommendationsCardProps } from './RecommendationsCard.types';

// 3D Avatar illustration from Figma
const ILLUSTRATION_3D_URL = '/assets/a7e8150b48421155ec56805f777056f57141df11.png';

/**
 * RecommendationsCard Organism
 *
 * Displays personalized recommendations consent card
 * with illustration and CTA button.
 */
export const RecommendationsCard: React.FC<RecommendationsCardProps> = ({
  illustrationUrl,
  onReceiveRecommendations,
  onMoreClick,
  sx,
}) => {
  const theme = useTheme();

  // Use 3D illustration if no custom illustration provided
  const displayIllustrationUrl = illustrationUrl || ILLUSTRATION_3D_URL;

  const headerActions = (
    <IconButton size="small" onClick={onMoreClick}>
      <MoreVertIcon sx={{ fontSize: 18 }} />
    </IconButton>
  );

  return (
    <DashboardCard
      title="Personalised Recommendations"
      icon={<RecommendIcon />}
      headerActions={headerActions}
      fullWidth
      compact
      sx={{ ...sx, height: '100%' }}
      contentSx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: { xs: 2, sm: 2.5 },
        pt: 0,
        px: { xs: 1, sm: 2 },
      }}
    >
      {/* Illustration */}
      <Avatar
        src={displayIllustrationUrl}
        alt="Recommendations"
        sx={{
          width: { xs: 80, sm: 100 },
          height: { xs: 80, sm: 100 },
          bgcolor: theme.palette.grey[200],
        }}
      />

      {/* Consent Text */}
      <Box
        sx={{
          color: 'text.secondary',
          fontSize: { xs: 10, sm: 11 },
          lineHeight: { xs: '14px', sm: '15px' },
          '& ul': {
            pl: { xs: 1.5, sm: 2 },
            m: 0,
          },
          '& li': {
            mb: 0.25,
          },
        }}
      >
        <Typography variant="body2" sx={{ fontSize: { xs: 10, sm: 11 }, lineHeight: { xs: '14px', sm: '15px' }, mb: 0.5 }}>
          By continuing, you confirm that:
        </Typography>
        <Box component="ul">
          <Box component="li">
            <Typography variant="body2" sx={{ fontSize: { xs: 10, sm: 11 }, lineHeight: { xs: '14px', sm: '15px' } }}>
              You consent to receive general health and wellness suggestions.
            </Typography>
          </Box>
          <Box component="li">
            <Typography variant="body2" sx={{ fontSize: { xs: 10, sm: 11 }, lineHeight: { xs: '14px', sm: '15px' } }}>
              You understand that this is not medical advice, diagnosis, or treatment.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* CTA Button */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={onReceiveRecommendations}
        sx={{
          borderRadius: 100,
          py: { xs: 0.75, sm: 1 },
          textTransform: 'none',
          fontWeight: 500,
          fontSize: { xs: 12, sm: 13 },
        }}
      >
        Receive Recommendations
      </Button>
    </DashboardCard>
  );
};

export default RecommendationsCard;
