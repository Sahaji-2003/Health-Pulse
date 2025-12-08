import { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Alert,
  Snackbar,
  useTheme,
} from '@mui/material';
import { DashboardLayout } from '../../components/layout';
import {
  AccountSection,
  DataImportSection,
  PrivacySection,
  MyNetworkSection,
} from '../../components/ui/organisms';
import type { ProfileFormData } from '../../components/ui/organisms';
import { useProfile } from '../../hooks/useProfile';

// Menu items for the sidebar
const menuItems = [
  { id: 'account', label: 'Account' },
  { id: 'data-import', label: 'Data Import' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'my-network', label: 'My Network' },
];

export const Profile = () => {
  const theme = useTheme();
  const [selectedMenu, setSelectedMenu] = useState('account');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const {
    profile,
    isLoading,
    isError,
    profileToFormData,
    formDataToApiData,
    updateProfile,
    isUpdating,
    uploadAvatar,
    isUploadingAvatar,
  } = useProfile();

  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    bloodGroup: '',
    height: '',
    weight: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    medicalConditions: '',
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData(profileToFormData(profile));
    }
  }, [profile]);

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev: ProfileFormData) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    const apiData = formDataToApiData(formData);
    
    // Only upload avatar if a new file was selected
    if (selectedAvatarFile) {
      uploadAvatar(selectedAvatarFile, {
        onSuccess: () => {
          // Clear the selected file after successful upload
          setSelectedAvatarFile(null);
        },
        onError: () => {
          setSnackbar({
            open: true,
            message: 'Failed to upload profile picture. Please try again.',
            severity: 'error',
          });
        },
      });
    }
    
    // Update profile data (always called, avatar upload is separate)
    updateProfile(apiData, {
      onSuccess: () => {
        setIsEditing(false);
        // Reset password fields after successful save
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
        setSnackbar({
          open: true,
          message: 'Profile updated successfully!',
          severity: 'success',
        });
      },
      onError: (error: Error) => {
        setSnackbar({
          open: true,
          message: error.message || 'Failed to update profile. Please try again.',
          severity: 'error',
        });
      },
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleAvatarSelect = (file: File | null) => {
    setSelectedAvatarFile(file);
  };

  // Render section content based on selected menu
  const renderSectionContent = () => {
    switch (selectedMenu) {
      case 'account':
        return (
          <AccountSection
            formData={formData}
            onInputChange={handleInputChange}
            isEditing={isEditing}
            isUpdating={isUpdating || isUploadingAvatar}
            onSave={handleSave}
            onEdit={handleEdit}
            avatarUrl={profile?.avatarUrl}
            selectedAvatarFile={selectedAvatarFile}
            onAvatarSelect={handleAvatarSelect}
            isUploadingAvatar={isUploadingAvatar}
          />
        );
      case 'data-import':
        return <DataImportSection />;
      case 'privacy':
        return <PrivacySection />;
      case 'my-network':
        return <MyNetworkSection />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Account Settings">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout title="Account Settings">
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to load profile data. Please try again later.
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Account Settings">
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, md: 0 },
          minHeight: { md: 'calc(100vh - 120px)' },
        }}
      >
        {/* Left Sidebar Menu - Fixed/Sticky */}
        <Box
          sx={{
            width: { xs: '100%', md: 190 },
            flexShrink: 0,
            pr: { md: 2.5 },
            borderRight: { md: `1px solid ${theme.palette.primary.main}` },
            position: { md: 'sticky' },
            top: { md: 0 },
            alignSelf: { md: 'stretch' },
            pt: { md: 0.5 },
          }}
        >
          <List
            sx={{
              marginTop: { md: 5 },
              display: 'flex',
              flexDirection: { xs: 'row', md: 'column' },
              flexWrap: { xs: 'wrap', md: 'nowrap' },
              gap: 1,
              p: 0,
            }}
          >
            {menuItems.map((item) => (
              <ListItemButton
                key={item.id}
                selected={selectedMenu === item.id}
                onClick={() => setSelectedMenu(item.id)}
                sx={{
                  borderRadius: theme.customSizes.borderRadius.lg,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: selectedMenu === item.id 
                    ? 'rgba(0, 0, 0, 0.08)' 
                    : 'background.paper',
                  py: 1.5,
                  px: 2,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(0, 0, 0, 0.08)',
                    borderColor: 'divider',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.12)',
                    },
                  },
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                  },
                  flex: { xs: '1 1 auto', md: '0 0 auto' },
                  minWidth: { xs: 'fit-content', md: 'auto' },
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: selectedMenu === item.id ? 500 : 400,
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>

        {/* Right Content Area */}
        <Box sx={{ flex: 1, pl: { md: 3 } }}>
          {renderSectionContent()}
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default Profile;
