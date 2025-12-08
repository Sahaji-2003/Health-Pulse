import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Checkbox,
  Chip,
  useTheme,
  Snackbar,
  Alert,
  Divider,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckIcon from '@mui/icons-material/Check';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import DashboardIcon from '@mui/icons-material/Dashboard';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RecommendIcon from '@mui/icons-material/Recommend';
import BarChartIcon from '@mui/icons-material/BarChart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { useDashboardLayout, WIDGET_METADATA } from '../../hooks/useDashboardLayout';
import type { WidgetConfig } from '../../services/api/user.api';

// 3D Avatar image
const AVATAR_3D_URL = '/assets/9bf85657768890adce0bc6ec7465d29b46d08d7d.png';

// Filter categories
type FilterCategory = 'all' | 'vitals' | 'fitness' | 'recommendations' | 'social';

// Widget type icons mapping
const WIDGET_ICONS: Record<string, React.ReactNode> = {
  profile: <PersonIcon />,
  vitals: <FavoriteIcon />,
  fitness: <FitnessCenterIcon />,
  recommendations: <RecommendIcon />,
  'weekly-chart': <BarChartIcon />,
  awards: <EmojiEventsIcon />,
  resources: <LibraryBooksIcon />,
};

// Widget colors for identification
const WIDGET_COLORS: Record<string, string> = {
  profile: '#4CAF50',
  vitals: '#E91E63',
  fitness: '#FF9800',
  recommendations: '#2196F3',
  'weekly-chart': '#9C27B0',
  awards: '#FFC107',
  resources: '#00BCD4',
};

interface CustomizeDashboardViewProps {
  onBack: () => void;
}

// Widget placeholder component for the grid
const WidgetPlaceholder: React.FC<{
  widget: WidgetConfig;
  isDragging?: boolean;
  isDropTarget?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}> = ({ widget, isDragging, isDropTarget, onDragStart, onDragEnd, onDragOver, onDrop }) => {
  const theme = useTheme();
  const metadata = WIDGET_METADATA[widget.type];
  const widgetColor = WIDGET_COLORS[widget.type] || theme.palette.primary.main;
  const widgetIcon = WIDGET_ICONS[widget.type];

  // Define which widgets span 2 columns (vitals and resources are elongated)
  const isWideWidget = widget.type === 'vitals' || widget.type === 'resources';

  return (
    <Box
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      sx={{
        backgroundColor: theme.palette.background.paper,
        border: isDropTarget 
          ? `2px dashed ${theme.palette.primary.main}` 
          : `1px solid rgba(111, 121, 118, 0.16)`,
        borderRadius: 3,
        p: { xs: 1.5, md: 2 },
        cursor: 'grab',
        opacity: isDragging ? 0.4 : 1,
        transform: isDragging ? 'scale(0.98)' : isDropTarget ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.2s ease',
        // Wide widgets span 2 columns on md+
        gridColumn: { xs: 'span 1', md: isWideWidget ? 'span 2' : 'span 1' },
        position: 'relative',
        minWidth: 0, // Critical: prevents grid blowout
        overflow: 'hidden',
        width: '100%',
        boxSizing: 'border-box',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderColor: widgetColor,
        },
        '&:active': {
          cursor: 'grabbing',
        },
      }}
    >
      {/* Drag handle and widget identifier */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          mb: 1.5,
          pb: 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <DragIndicatorIcon 
          sx={{ 
            color: theme.palette.text.secondary, 
            fontSize: 20,
            cursor: 'grab',
          }} 
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            borderRadius: 1.5,
            backgroundColor: `${widgetColor}15`,
            color: widgetColor,
            '& svg': { fontSize: 18 },
          }}
        >
          {widgetIcon}
        </Box>
        <Typography
          sx={{
            fontSize: { xs: 12, md: 14 },
            fontWeight: 600,
            color: theme.palette.text.primary,
            flex: 1,
          }}
        >
          {metadata?.name || widget.type}
        </Typography>
        <Chip
          label={isWideWidget ? '2x' : '1x'}
          size="small"
          sx={{
            height: 20,
            fontSize: 10,
            fontWeight: 600,
            backgroundColor: `${widgetColor}20`,
            color: widgetColor,
          }}
        />
      </Box>

      {/* Widget skeleton content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* Body skeleton - different for wide vs regular widgets */}
        {widget.type === 'profile' ? (
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Box
              component="img"
              src={AVATAR_3D_URL}
              sx={{ width: { xs: 36, md: 44 }, height: { xs: 36, md: 44 }, borderRadius: '50%' }}
            />
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Box sx={{ height: 12, borderRadius: 20, backgroundColor: '#e3eae7', width: '80%' }} />
              <Box sx={{ height: 10, borderRadius: 20, backgroundColor: '#e3eae7', width: '60%' }} />
            </Box>
          </Box>
        ) : isWideWidget ? (
          // Wide widget skeleton (vitals, resources) - horizontal layout
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box sx={{ flex: 1, borderRadius: 2, backgroundColor: '#e3eae7', minHeight: { xs: 40, md: 50 } }} />
            <Box sx={{ flex: 1, borderRadius: 2, backgroundColor: '#e3eae7', minHeight: { xs: 40, md: 50 } }} />
            <Box sx={{ flex: 1, borderRadius: 2, backgroundColor: '#e3eae7', minHeight: { xs: 40, md: 50 }, display: { xs: 'none', sm: 'block' } }} />
          </Box>
        ) : (
          // Regular widget skeleton - vertical layout
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            <Box sx={{ height: { xs: 32, md: 40 }, borderRadius: 2, backgroundColor: '#e3eae7' }} />
            <Box sx={{ display: 'flex', gap: 0.75 }}>
              <Box sx={{ flex: 1, height: 10, borderRadius: 20, backgroundColor: '#e3eae7' }} />
              <Box sx={{ flex: 0.5, height: 10, borderRadius: 20, backgroundColor: '#e3eae7' }} />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

// Grid placeholder cell
const GridCell: React.FC = () => {
  return (
    <Box
      sx={{
        height: 40,
        borderRadius: 3,
        backgroundColor: '#e9efec',
      }}
    />
  );
};

export const CustomizeDashboardView: React.FC<CustomizeDashboardViewProps> = ({ onBack }) => {
  const theme = useTheme();
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('all');
  const [autoRearrange, setAutoRearrange] = useState(false);
  const [draggingWidgetId, setDraggingWidgetId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const {
    widgets,
    hasUnsavedChanges,
    isSaving,
    isResetting,
    lastSavedText,
    toggleWidgetVisibility,
    reorderWidgets,
    saveLayout,
    resetLayout,
  } = useDashboardLayout();

  // Filter widgets by category
  const filteredWidgets = useMemo(() => {
    if (selectedFilter === 'all') return widgets;
    return widgets.filter((w) => w.category === selectedFilter);
  }, [widgets, selectedFilter]);

  // Visible widgets for the grid
  const visibleWidgets = useMemo(() => {
    return widgets.filter((w) => w.visible);
  }, [widgets]);

  // Drag and drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, widgetId: string) => {
    setDraggingWidgetId(widgetId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', widgetId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingWidgetId(null);
    setDropTargetId(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, widgetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (widgetId !== draggingWidgetId) {
      setDropTargetId(widgetId);
    }
  }, [draggingWidgetId]);

  const handleDrop = useCallback((e: React.DragEvent, targetWidgetId: string) => {
    e.preventDefault();
    const sourceWidgetId = e.dataTransfer.getData('text/plain');
    
    if (sourceWidgetId && sourceWidgetId !== targetWidgetId) {
      const sourceIndex = visibleWidgets.findIndex(w => w.id === sourceWidgetId);
      const targetIndex = visibleWidgets.findIndex(w => w.id === targetWidgetId);
      
      if (sourceIndex !== -1 && targetIndex !== -1) {
        reorderWidgets(sourceIndex, targetIndex);
        setSnackbar({
          open: true,
          message: 'Widget position updated!',
          severity: 'success',
        });
      }
    }
    
    setDraggingWidgetId(null);
    setDropTargetId(null);
  }, [visibleWidgets, reorderWidgets]);

  const handleSave = useCallback(async () => {
    try {
      await saveLayout();
      setSnackbar({
        open: true,
        message: 'Dashboard layout saved successfully!',
        severity: 'success',
      });
    } catch {
      setSnackbar({
        open: true,
        message: 'Failed to save layout. Please try again.',
        severity: 'error',
      });
    }
  }, [saveLayout]);

  const handleReset = useCallback(async () => {
    try {
      await resetLayout();
      setSnackbar({
        open: true,
        message: 'Dashboard layout reset to defaults.',
        severity: 'success',
      });
    } catch {
      setSnackbar({
        open: true,
        message: 'Failed to reset layout. Please try again.',
        severity: 'error',
      });
    }
  }, [resetLayout]);

  const filterChips: { key: FilterCategory; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'vitals', label: 'Vitals' },
    { key: 'fitness', label: 'Fitness' },
    { key: 'recommendations', label: 'Recommended' },
    { key: 'social', label: 'Social' },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        gap: { xs: 1, md: 1.5 },
        mt: { xs: 1, md: 2 },
        pb: 0,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          gap: { xs: 1, sm: 0 },
          pb: 0.5,
        }}
      >
        {/* Left: Back + Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
          <IconButton
            onClick={onBack}
            sx={{
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              borderRadius: '50%',
            }}
          >
            <ArrowBackIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </IconButton>
          <Typography
            sx={{
              fontSize: { xs: 18, sm: 20, md: 22 },
              fontWeight: 400,
              color: theme.palette.primary.main,
              lineHeight: '28px',
            }}
          >
            Customize Dashboard
          </Typography>
        </Box>

        {/* Right: Saved status + Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, ml: { xs: 'auto', sm: 0 } }}>
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.secondary.main,
              fontSize: { xs: 10, sm: 11 },
              fontWeight: 500,
              px: { xs: 1, sm: 2 },
              display: { xs: 'none', sm: 'block' },
            }}
          >
            {lastSavedText || 'Not saved yet'}
          </Typography>
          <Button
            variant="outlined"
            startIcon={isResetting ? <CircularProgress size={16} /> : <RestartAltIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
            onClick={handleReset}
            disabled={isSaving || isResetting}
            sx={{
              borderColor: theme.palette.divider,
              color: theme.palette.text.secondary,
              borderRadius: 100,
              textTransform: 'none',
              px: { xs: 1.5, sm: 2 },
              py: { xs: 0.75, sm: 1 },
              fontSize: { xs: 12, sm: 14 },
              minWidth: { xs: 'auto', sm: 80 },
            }}
          >
            Reset
          </Button>
          <Button
            variant="outlined"
            startIcon={isSaving ? <CircularProgress size={18} /> : <CheckIcon />}
            onClick={handleSave}
            disabled={isSaving || isResetting || !hasUnsavedChanges}
            sx={{
              borderColor: theme.palette.divider,
              color: theme.palette.text.secondary,
              borderRadius: 100,
              textTransform: 'none',
              px: 2,
              py: 1.25,
            }}
          >
            Save
          </Button>
        </Box>
      </Box>

      {/* Content: Left Sidebar + Right Grid Area */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 1.5, md: 2 },
          flex: 1,
          pb: 0,
          overflow: { xs: 'auto', md: 'hidden' },
          minHeight: 0,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {/* Left Sidebar - Widget Selector */}
        <Box
          sx={{
            width: { xs: '100%', md: 260, lg: 286 },
            maxWidth: { md: 320, lg: 389 },
            flexShrink: 0,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid rgba(111, 121, 118, 0.16)`,
            borderRadius: { xs: 4, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            maxHeight: { xs: 280, md: 'none' },
          }}
        >
          {/* Sidebar Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pt: { xs: 2, md: 2.5 },
              px: { xs: 2, md: 3 },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AddIcon sx={{ fontSize: { xs: 20, md: 24 }, color: theme.palette.text.primary }} />
              <Typography
                sx={{
                  fontSize: { xs: 14, md: 16 },
                  fontWeight: 500,
                  color: '#2e4c47',
                }}
              >
                Select Widgets
              </Typography>
            </Box>
            <IconButton size="small">
              <MoreVertIcon sx={{ fontSize: { xs: 18, md: 20 } }} />
            </IconButton>
          </Box>

          {/* Filter Chips */}
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 0.5, md: 1 },
              px: { xs: 1, md: 1.5 },
              py: { xs: 1.5, md: 2 },
              flexWrap: 'nowrap',
              overflowX: 'auto',
              overflowY: 'hidden',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            {filterChips.map((chip) => (
              <Chip
                key={chip.key}
                label={chip.label}
                icon={selectedFilter === chip.key ? <CheckIcon sx={{ fontSize: 18 }} /> : undefined}
                onClick={() => setSelectedFilter(chip.key)}
                sx={{
                  height: { xs: 28, md: 32 },
                  borderRadius: 2,
                  flexShrink: 0,
                  fontSize: { xs: 12, md: 14 },
                  backgroundColor:
                    selectedFilter === chip.key ? '#cae6df' : 'transparent',
                  border:
                    selectedFilter === chip.key
                      ? 'none'
                      : `1px solid ${theme.palette.divider}`,
                  color:
                    selectedFilter === chip.key
                      ? '#334b47'
                      : theme.palette.text.secondary,
                  '& .MuiChip-label': {
                    fontSize: 14,
                    fontWeight: 500,
                    px: selectedFilter === chip.key ? 1 : 2,
                  },
                  '& .MuiChip-icon': {
                    ml: 1,
                    color: '#334b47',
                  },
                }}
              />
            ))}
          </Box>

          {/* Widget List */}
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              px: 0.125,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            {filteredWidgets.map((widget, index) => {
              const metadata = WIDGET_METADATA[widget.type];
              return (
                <React.Fragment key={widget.id}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                      px: 2,
                      py: 1.5,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.04)',
                      },
                    }}
                    onClick={() => toggleWidgetVisibility(widget.id)}
                  >
                    <Checkbox
                      checked={widget.visible}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => toggleWidgetVisibility(widget.id)}
                      sx={{
                        p: 0,
                        mt: 0.25,
                        color: theme.palette.primary.main,
                        '&.Mui-checked': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontSize: 16,
                          fontWeight: 400,
                          color: theme.palette.text.primary,
                          lineHeight: '24px',
                        }}
                      >
                        {metadata?.name || widget.type}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 400,
                          color: theme.palette.text.secondary,
                          lineHeight: '20px',
                        }}
                      >
                        {metadata?.description || 'Supporting line text lorem ipsum...'}
                      </Typography>
                    </Box>
                  </Box>
                  {index < filteredWidgets.length - 1 && (
                    <Divider sx={{ mx: 2 }} />
                  )}
                </React.Fragment>
              );
            })}
          </Box>
        </Box>

        {/* Right: Grid Area */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid rgba(111, 121, 118, 0.16)`,
            borderRadius: { xs: 4, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minHeight: { xs: 400, md: 0 },
          }}
        >
          {/* Grid Toolbar */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pt: { xs: 2, md: 2.5 },
              px: { xs: 2, md: 3 },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1 }, py: 0.5 }}>
              <IconButton size="small" disabled sx={{ opacity: 0.38, display: { xs: 'none', sm: 'flex' } }}>
                <UndoIcon sx={{ fontSize: { xs: 18, md: 20 } }} />
              </IconButton>
              <IconButton size="small" disabled sx={{ opacity: 0.38, display: { xs: 'none', sm: 'flex' } }}>
                <RedoIcon sx={{ fontSize: { xs: 18, md: 20 } }} />
              </IconButton>
              <Button
                variant="text"
                startIcon={<DashboardIcon sx={{ fontSize: { xs: 18, md: 20 } }} />}
                onClick={() => setAutoRearrange(!autoRearrange)}
                sx={{
                  color: theme.palette.primary.main,
                  textTransform: 'none',
                  fontSize: { xs: 12, md: 14 },
                  fontWeight: 500,
                  ml: { xs: 0, sm: 1 },
                }}
              >
                Auto-Rearrange
              </Button>
              <Divider orientation="vertical" flexItem sx={{ mx: { xs: 0.5, md: 1 }, display: { xs: 'none', sm: 'flex' } }} />
              <IconButton size="small" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                <OpenInFullIcon sx={{ fontSize: { xs: 18, md: 20 } }} />
              </IconButton>
              <IconButton size="small">
                <MoreVertIcon sx={{ fontSize: { xs: 18, md: 20 } }} />
              </IconButton>
            </Box>
          </Box>

          {/* Grid with placeholders and widgets */}
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: { xs: 1.5, md: 2.5 },
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            {/* Grid container */}
            <Box
              sx={{
                backgroundColor: '#eff5f2',
                border: `1px solid rgba(111, 121, 118, 0.16)`,
                borderRadius: { xs: 3, md: 4 },
                p: { xs: 1.5, md: 2.5 },
                position: 'relative',
                minHeight: '100%',
                height: 'fit-content',
              }}
            >
              {/* Background grid - responsive */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(6, 1fr)', sm: 'repeat(9, 1fr)', md: 'repeat(12, 1fr)' },
                  gridTemplateRows: { xs: 'repeat(10, 32px)', md: 'repeat(10, 36px)' },
                  gap: { xs: 1, md: 1.5 },
                }}
              >
                {Array(120)
                  .fill(0)
                  .map((_, i) => (
                    <GridCell key={i} />
                  ))}
              </Box>

              {/* Positioned widget placeholders */}
              <Box
                sx={{
                  position: 'absolute',
                  top: { xs: 12, md: 20 },
                  left: { xs: 12, md: 20 },
                  right: { xs: 12, md: 20 },
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                  gridAutoRows: 'minmax(120px, auto)',
                  gap: { xs: 1.5, md: 2 },
                  width: 'auto',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                }}
              >
                {visibleWidgets.map((widget) => (
                  <WidgetPlaceholder
                    key={widget.id}
                    widget={widget}
                    isDragging={draggingWidgetId === widget.id}
                    isDropTarget={dropTargetId === widget.id}
                    onDragStart={(e) => handleDragStart(e, widget.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, widget.id)}
                    onDrop={(e) => handleDrop(e, widget.id)}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CustomizeDashboardView;
