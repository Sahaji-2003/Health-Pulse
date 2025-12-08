import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Switch,
  Divider,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import type { MyNetworkSectionProps, NetworkContact, StatusFilter } from './MyNetworkSection.types';

// Default sample contacts for demo
const defaultContacts: NetworkContact[] = [
  {
    id: '1',
    name: 'John',
    status: 'connected',
    message: 'Hey! Amazing Swimming record John. Keep going buddy1',
    isFollowing: true,
  },
  {
    id: '2',
    name: 'John',
    status: 'connected',
    message: 'Hey! Amazing Swimming record John. Keep going buddy1',
    isFollowing: true,
  },
  {
    id: '3',
    name: 'John',
    status: 'connection-error',
    message: '',
    isFollowing: true,
  },
  {
    id: '4',
    name: 'John',
    status: 'connected',
    message: 'Hey! Amazing Swimming record John. Keep going buddy1',
    isFollowing: true,
  }
];

/**
 * MyNetworkSection Organism Component
 *
 * Manages the user's social network with search, filter, and follow functionality.
 * Shows a list of connections with their status and ability to follow/unfollow.
 * Uses theme values for consistent styling.
 *
 * @example
 * <MyNetworkSection onFollowToggle={handleFollowToggle} />
 */
export const MyNetworkSection: React.FC<MyNetworkSectionProps> = ({
  contacts: controlledContacts,
  onFollowToggle,
  onSearchChange,
  onStatusFilterChange,
  children,
}) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('followed');
  const [contacts, setContacts] = useState<NetworkContact[]>(
    controlledContacts ?? defaultContacts
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (onSearchChange) {
      onSearchChange(query);
    }
  };

  const handleStatusFilterChange = (event: { target: { value: string } }) => {
    const filter = event.target.value as StatusFilter;
    setStatusFilter(filter);
    if (onStatusFilterChange) {
      onStatusFilterChange(filter);
    }
  };

  const handleFollowToggle = (contactId: string) => {
    if (onFollowToggle) {
      onFollowToggle(contactId);
    } else {
      setContacts((prev) =>
        prev.map((c) =>
          c.id === contactId ? { ...c, isFollowing: !c.isFollowing } : c
        )
      );
    }
  };

  // Filter contacts based on search and status
  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const matchesSearch =
        !searchQuery ||
        contact.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'followed' && contact.isFollowing) ||
        (statusFilter === 'connected' && contact.status === 'connected') ||
        (statusFilter === 'pending' && contact.status === 'pending');
      return matchesSearch && matchesStatus;
    });
  }, [contacts, searchQuery, statusFilter]);

  const getStatusLabel = (status: NetworkContact['status']) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'connection-error':
        return 'Connection Error';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  const getStatusColor = (status: NetworkContact['status']) => {
    switch (status) {
      case 'connected':
        return 'primary.main';
      case 'connection-error':
        return 'error.main';
      case 'pending':
        return 'warning.main';
      default:
        return 'text.secondary';
    }
  };

  return (
    <Box sx={{ transform: 'scale(0.95)', transformOrigin: 'top left', mt: 5 }}>
      {/* Search and Filter Row */}
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          mb: 2.5,
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          alignItems: 'center',
        }}
      >
        {/* Search Field */}
        <TextField
          placeholder="Search Friends"
          value={searchQuery}
          onChange={handleSearchChange}
          size="small"
          sx={{
            flex: 1,
            minWidth: { xs: '100%', md: 500 },
            maxWidth: 600,
            bgcolor: theme.palette.divider,
            borderRadius: theme.customSizes.borderRadius.xl + 4,
            '& .MuiOutlinedInput-root': {
              borderRadius: theme.customSizes.borderRadius.xl + 4,
              height: theme.customSizes.button.height.md + 4,
              '& fieldset': {
                border: 'none',
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

        {/* Status Filter */}
        <FormControl size="small" sx={{ minWidth: 140, ml: 'auto' }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            label="Status"
            sx={{
              borderRadius: theme.customSizes.borderRadius.xs,
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="followed">Followed</MenuItem>
            <MenuItem value="connected">Connected</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Contacts List */}
      {filteredContacts.length === 0 ? (
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontStyle: 'italic',
            py: 3,
          }}
        >
          No contacts found matching your criteria.
        </Typography>
      ) : (
        <List sx={{ py: 0 }}>
          {filteredContacts.map((contact, index) => (
            <React.Fragment key={contact.id}>
              <ListItem
                sx={{
                  py: 1.5,
                  px: 0,
                  alignItems: 'flex-start',
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: 'transparent',
                      border: 1,
                      borderColor: 'text.secondary',
                      color: 'text.secondary',
                      width: theme.customSizes.avatar.sm,
                      height: theme.customSizes.avatar.sm,
                    }}
                  >
                    <PersonOutlineIcon sx={{ fontSize: theme.customSizes.icon.sm }} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: getStatusColor(contact.status),
                          fontWeight: 400,
                          display: 'block',
                        }}
                      >
                        {getStatusLabel(contact.status)}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: 'text.primary',
                        }}
                      >
                        {contact.name}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    contact.message && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          mt: 0.25,
                        }}
                      >
                        {contact.message}
                      </Typography>
                    )
                  }
                />
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    ml: 2,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                    }}
                  >
                    Follow
                  </Typography>
                  <Switch
                    checked={contact.isFollowing}
                    onChange={() => handleFollowToggle(contact.id)}
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
                </Box>
              </ListItem>
              {index < filteredContacts.length - 1 && (
                <Divider component="li" />
              )}
            </React.Fragment>
          ))}
        </List>
      )}

      {/* Custom content if provided */}
      {children && <Box sx={{ mt: 3 }}>{children}</Box>}
    </Box>
  );
};

export default MyNetworkSection;
