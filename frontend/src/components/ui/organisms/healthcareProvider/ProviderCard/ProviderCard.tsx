import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Avatar,
  Rating,
  useTheme,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import type { ProviderCardProps } from './ProviderCard.types';

// Import provider avatar image
const providerAvatarImage = '/src/assets/a7e8150b48421155ec56805f777056f57141df11.png';

/**
 * ProviderCard Component
 *
 * Displays a healthcare provider or insurance company card with
 * avatar, rating, description, and connect button.
 */
export const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  onConnectClick,
  onMenuClick,
  sx,
}) => {
  const theme = useTheme();

  const handleConnectClick = () => {
    onConnectClick?.(provider);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onMenuClick?.(provider, event.currentTarget);
  };

  return (
    <Card
      sx={{
        borderRadius: 4,
        bgcolor: '#ffffff',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.04)',
        ...sx,
      }}
      elevation={0}
    >
      {/* Header with provider type and menu */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pt: 2,
          px: 2,
          pb: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          <HealthAndSafetyIcon
            sx={{
              color: provider.type === 'healthcare' ? 'primary.main' : 'secondary.main',
              fontSize: 24,
            }}
          />
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 500,
              color: theme.palette.text.primary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {provider.type === 'healthcare' ? 'Healthcare Provider' : 'Insurance Company'}
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleMenuClick}>
          <MoreVertIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      {/* Card Content */}
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          gap: 1.5,
          p: 2,
        }}
      >
        {/* Provider Avatar */}
        <Avatar
          src={provider.avatarUrl || providerAvatarImage}
          alt={provider.name}
          sx={{
            width: 90,
            height: 90,
            bgcolor: '#E8F5F0',
          }}
        />

        {/* Rating */}
        <Rating
          value={provider.rating}
          readOnly
          precision={0.5}
          sx={{
            '& .MuiRating-iconFilled': {
              color: '#FFB400',
            },
          }}
        />

        {/* Provider Name */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: theme.palette.secondary.main,
            textAlign: 'center',
          }}
        >
          {provider.name}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.secondary.main,
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          {provider.description}
        </Typography>

        {/* Connect Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleConnectClick}
          sx={{
            borderRadius: 3,
            py: 1,
            mt: 'auto',
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Connect Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProviderCard;
