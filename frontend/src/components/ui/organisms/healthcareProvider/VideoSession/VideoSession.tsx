import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Avatar,
  useTheme,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import type { VideoSessionProps } from './VideoSession.types';

// Import provider avatar image
const providerAvatarImage = '/src/assets/a7e8150b48421155ec56805f777056f57141df11.png';

/**
 * VideoSession Component
 *
 * Displays a video session view with camera access, microphone controls,
 * and confirmation dialog for ending the session.
 */
export const VideoSession: React.FC<VideoSessionProps> = ({
  provider,
  onBack,
  onEndSession,
  onAttachment,
  onMenuClick,
  isConnecting = false,
  sx,
}) => {
  const theme = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [showEndCallDialog, setShowEndCallDialog] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Initialize camera and microphone
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
        setCameraError('Unable to access camera or microphone');
      }
    };

    if (!isConnecting) {
      initializeMedia();
    }

    return () => {
      stopMediaStream();
    };
  }, [isConnecting]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMediaStream();
    };
  }, []);

  // Drag handlers for mouse and touch
  const handleDragStart = (clientX: number, clientY: number) => {
    if (!dragRef.current) return;
    const rect = dragRef.current.getBoundingClientRect();
    setIsDragging(true);
    setDragStart({ 
      x: clientX - rect.left, 
      y: clientY - rect.top 
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || !dragRef.current) return;
    const parent = dragRef.current.parentElement;
    if (!parent) return;
    
    const rect = parent.getBoundingClientRect();
    const newX = clientX - rect.left - dragStart.x;
    const newY = clientY - rect.top - dragStart.y;
    const maxX = parent.clientWidth - 240;
    const maxY = parent.clientHeight - 180;
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleEnd);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isDragging, dragStart, position]);

  // Toggle microphone
  const toggleMicrophone = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !isMicOn;
      });
      setIsMicOn(!isMicOn);
    }
  };

  // Toggle camera
  const toggleCamera = () => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isCameraOn;
      });
      setIsCameraOn(!isCameraOn);
    }
  };

  const stopMediaStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleBack = () => {
    stopMediaStream();
    onBack?.();
  };

  const handleEndSessionClick = () => {
    setShowEndCallDialog(true);
  };

  const handleConfirmEndSession = () => {
    stopMediaStream();
    setShowEndCallDialog(false);
    onEndSession?.();
  };

  const handleCancelEndSession = () => {
    setShowEndCallDialog(false);
  };

  const handleAttachment = () => {
    onAttachment?.();
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onMenuClick?.(event.currentTarget);
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        bgcolor: '#ffffff',
        maxWidth: 900,
        width: '100%',
        mx: 'auto',
        overflow: 'hidden',
        ...sx,
      }}
      elevation={0}
    >
      {/* Header with back button and actions */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 1, sm: 1.5 },
          py: 1,
        }}
      >
        {/* Back button */}
        <IconButton onClick={handleBack} sx={{ color: 'text.primary' }}>
          <ArrowBackIcon />
        </IconButton>

        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 400,
            color: theme.palette.text.primary,
            flex: 1,
            ml: { xs: 1, sm: 2 },
            fontSize: { xs: '0.9rem', sm: '1.25rem' },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {provider.name} | {provider.type === 'healthcare' ? 'Healthcare Provider' : 'Insurance Company'}
        </Typography>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleAttachment} sx={{ color: 'text.primary' }}>
            <AttachFileIcon />
          </IconButton>
          <IconButton onClick={handleMenuClick} sx={{ color: 'text.primary' }}>
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Video Content Area */}
      <CardContent
        sx={{
          position: 'relative',
          p: 0,
          height: { xs: 280, sm: 360 },
          bgcolor: '#1a1a1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:last-child': { pb: 0 },
        }}
      >
        {isConnecting ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={60} sx={{ color: 'white' }} />
            <Typography variant="body1" sx={{ color: 'white' }}>
              Connecting...
            </Typography>
          </Box>
        ) : cameraError ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={provider.avatarUrl || providerAvatarImage}
              alt={provider.name}
              sx={{
                width: 120,
                height: 120,
                bgcolor: theme.customColors.background.mint,
              }}
            />
            <Typography variant="body2" sx={{ color: 'white', textAlign: 'center' }}>
              {cameraError}
            </Typography>
          </Box>
        ) : (
          <>
            {/* Provider's video - Main screen */}
            <Box
              sx={{
                width: '100%',
                height: '100%',
                position: 'relative',
                bgcolor: '#2a2a2a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Avatar
                src={provider.avatarUrl || providerAvatarImage}
                alt={provider.name}
                sx={{
                  width: { xs: 100, sm: 140 },
                  height: { xs: 100, sm: 140 },
                }}
              />
            </Box>

            {/* User's camera video - Draggable */}
            <Box
              ref={dragRef}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              sx={{
                position: 'absolute',
                left: position.x || 'auto',
                top: position.y || 'auto',
                bottom: position.y ? 'auto' : { xs: 8, sm: 12 },
                right: position.x ? 'auto' : { xs: 8, sm: 12 },
                width: { xs: 140, sm: 240 },
                height: { xs: 105, sm: 180 },
                borderRadius: 2,
                overflow: 'hidden',
                border: '2px solid white',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                touchAction: 'none',
                zIndex: 10,
              }}
            >
              {isCameraOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#1a1a1a',
                    pointerEvents: 'none',
                  }}
                >
                  <VideocamOffIcon sx={{ color: 'white', fontSize: 48 }} />
                </Box>
              )}
            </Box>

            {/* Call status indicator */}
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                px: 2,
                py: 0.75,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  bgcolor: '#4CAF50',
                  borderRadius: '50%',
                }}
              />
              <Typography variant="caption" sx={{ fontWeight: 500 }}>Connected</Typography>
            </Box>
          </>
        )}
      </CardContent>

      {/* Video Call Controls */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: { xs: 1.5, sm: 2 },
          px: { xs: 2, sm: 3 },
          py: 2,
          bgcolor: '#1a1a1a',
        }}
      >
        {/* Microphone Toggle */}
        <Fab
          size="small"
          onClick={toggleMicrophone}
          sx={{
            width: { xs: 44, sm: 48 },
            height: { xs: 44, sm: 48 },
            bgcolor: isMicOn ? 'background.paper' : 'error.main',
            color: isMicOn ? 'text.primary' : 'white',
            '&:hover': {
              bgcolor: isMicOn ? 'action.hover' : 'error.dark',
            },
          }}
        >
          {isMicOn ? <MicIcon sx={{ fontSize: { xs: 20, sm: 24 } }} /> : <MicOffIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />}
        </Fab>

        {/* Camera Toggle */}
        <Fab
          size="small"
          onClick={toggleCamera}
          sx={{
            width: { xs: 44, sm: 48 },
            height: { xs: 44, sm: 48 },
            bgcolor: isCameraOn ? 'background.paper' : 'error.main',
            color: isCameraOn ? 'text.primary' : 'white',
            '&:hover': {
              bgcolor: isCameraOn ? 'action.hover' : 'error.dark',
            },
          }}
        >
          {isCameraOn ? <VideocamIcon sx={{ fontSize: { xs: 20, sm: 24 } }} /> : <VideocamOffIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />}
        </Fab>

        {/* End Call Button */}
        <Fab
          size="small"
          onClick={handleEndSessionClick}
          sx={{
            width: { xs: 44, sm: 48 },
            height: { xs: 44, sm: 48 },
            bgcolor: 'error.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'error.dark',
            },
          }}
        >
          <CallEndIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
        </Fab>
      </Box>

      {/* End Call Confirmation Dialog */}
      <Dialog
        open={showEndCallDialog}
        onClose={handleCancelEndSession}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 320,
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontWeight: 500,
            color: 'text.primary',
          }}
        >
          End Video Call?
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              mb: 1,
            }}
          >
            Are you sure you want to end the call with {provider.name}?
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            gap: 2,
            pb: 3,
          }}
        >
          <Button
            onClick={handleCancelEndSession}
            variant="outlined"
            sx={{
              borderRadius: 3,
              px: 3,
              textTransform: 'none',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmEndSession}
            variant="contained"
            color="error"
            sx={{
              borderRadius: 3,
              px: 3,
              textTransform: 'none',
            }}
          >
            End Call
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default VideoSession;
