import React, { useState, useCallback, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
} from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import type { CreatePostFormProps, CreatePostFormData } from './CreatePostForm.types';

/**
 * Placeholder image component matching Figma design
 */
const PlaceholderImage: React.FC<{ height?: number }> = ({ height = 120 }) => (
  <Box
    sx={{
      width: '100%',
      height,
      borderRadius: 2,
      bgcolor: '#E3EAE7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}
  >
    {/* Placeholder shapes like in Figma */}
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
      <Box
        sx={{
          width: 0,
          height: 0,
          borderLeft: '20px solid transparent',
          borderRight: '20px solid transparent',
          borderBottom: '32px solid rgba(0, 0, 0, 0.12)',
        }}
      />
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            bgcolor: 'rgba(0, 0, 0, 0.12)',
            clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
          }}
        />
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: 0.5,
            bgcolor: 'rgba(0, 0, 0, 0.12)',
          }}
        />
      </Box>
    </Box>
  </Box>
);

/**
 * CreatePostForm Component
 * 
 * Inline form for creating new forum posts with title, image upload, and description.
 * Based on Figma design node 2284-9893.
 */
export const CreatePostForm: React.FC<CreatePostFormProps> = ({
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
  initialValues,
}) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [imagePreview, setImagePreview] = useState<string | null>(initialValues?.imageUrl || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSelectImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleSubmit = useCallback(() => {
    const formData: CreatePostFormData = {
      title,
      description,
      imageUrl: imagePreview || undefined,
      imageFile: imageFile || undefined,
    };
    onSubmit(formData);
  }, [title, description, imagePreview, imageFile, onSubmit]);

  const handleCancel = useCallback(() => {
    // Reset form state
    setTitle(initialValues?.title || '');
    setDescription(initialValues?.description || '');
    setImagePreview(initialValues?.imageUrl || null);
    setImageFile(null);
    onClose();
  }, [initialValues, onClose]);

  // If not open, don't render
  if (!open) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        pt: 2,
      }}
    >
      <Box
        sx={{
          bgcolor: '#FFFFFF',
          borderRadius: 2,
          p: 2.5,
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Title Input */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Title"
            placeholder=""
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                '& fieldset': {
                  borderColor: 'rgba(111, 121, 118, 0.4)',
                },
                '&:hover fieldset': {
                  borderColor: '#006B60',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#006B60',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#3F4946',
                '&.Mui-focused': {
                  color: '#006B60',
                },
              },
            }}
          />
        </Box>

        {/* Image Upload Area - Based on Figma design */}
        <Box sx={{ mb: 2 }}>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          
          <Box
            sx={{
              position: 'relative',
              width: '100%',
            }}
          >
            {imagePreview ? (
              <Box
                sx={{
                  width: '100%',
                  height: 120,
                  borderRadius: 2,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Upload preview"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                {/* Select Image button overlaid on image */}
                <Button
                  onClick={handleSelectImage}
                  variant="contained"
                  startIcon={<ImageOutlinedIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: '#006B60',
                    color: 'white',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 2,
                    py: 0.75,
                    fontSize: 13,
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: '#005A50',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Change Image
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  position: 'relative',
                }}
              >
                <PlaceholderImage height={120} />
                {/* Select Image button centered on placeholder */}
                <Button
                  onClick={handleSelectImage}
                  variant="contained"
                  startIcon={<ImageOutlinedIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: '#006B60',
                    color: 'white',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 2,
                    py: 0.75,
                    fontSize: 13,
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: '#005A50',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Select Image
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        {/* Description Input */}
        <Box sx={{ mb: 2.5 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            placeholder=""
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                '& fieldset': {
                  borderColor: 'rgba(111, 121, 118, 0.4)',
                },
                '&:hover fieldset': {
                  borderColor: '#006B60',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#006B60',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#3F4946',
                '&.Mui-focused': {
                  color: '#006B60',
                },
              },
            }}
          />
        </Box>

        {/* Action Buttons - Full width based on Figma */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isSubmitting}
            fullWidth
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              py: 1.25,
              fontSize: 14,
              bgcolor: '#006B60',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#005A50',
                boxShadow: 'none',
              },
              '&.Mui-disabled': {
                bgcolor: 'rgba(0, 107, 96, 0.3)',
                color: 'white',
              },
            }}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
          <Button
            onClick={handleCancel}
            variant="contained"
            fullWidth
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              py: 1.25,
              fontSize: 14,
              bgcolor: '#E3EAE7',
              color: '#6F7976',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#D5DCDA',
                boxShadow: 'none',
              },
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreatePostForm;
