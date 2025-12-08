import React, { useRef, useState, useCallback } from 'react';
import { Box, IconButton, useTheme } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import type { WidgetConfig } from '@/services/api/user.api';

export interface DraggableWidgetProps {
  widget: WidgetConfig;
  isCustomizeMode: boolean;
  isDragging?: boolean;
  onToggleVisibility?: (widgetId: string) => void;
  onDragStart?: (widgetId: string) => void;
  onDragEnd?: () => void;
  onDragOver?: (widgetId: string) => void;
  children: React.ReactNode;
}

export const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  widget,
  isCustomizeMode,
  isDragging = false,
  onToggleVisibility,
  onDragStart,
  onDragEnd,
  onDragOver,
  children,
}) => {
  const theme = useTheme();
  const [isHovering, setIsHovering] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', widget.id);
      onDragStart?.(widget.id);
    },
    [widget.id, onDragStart]
  );

  const handleDragEnd = useCallback(() => {
    onDragEnd?.();
  }, [onDragEnd]);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      onDragOver?.(widget.id);
    },
    [widget.id, onDragOver]
  );

  if (!isCustomizeMode) {
    return <>{children}</>;
  }

  return (
    <Box
      ref={dragRef}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      sx={{
        position: 'relative',
        cursor: 'grab',
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
        transition: theme.transitions.create(['opacity', 'transform', 'box-shadow'], {
          duration: theme.transitions.duration.short,
        }),
        '&:active': {
          cursor: 'grabbing',
        },
        // Outline when hovering in customize mode
        outline: isHovering
          ? `2px dashed ${theme.palette.primary.main}`
          : `2px dashed transparent`,
        outlineOffset: 4,
        borderRadius: 2,
      }}
    >
      {/* Drag Handle Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 0.5,
          backgroundColor: isHovering
            ? 'rgba(0, 106, 106, 0.1)'
            : 'transparent',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          zIndex: 10,
          pointerEvents: isHovering ? 'auto' : 'none',
          opacity: isHovering ? 1 : 0,
          transition: theme.transitions.create(['opacity', 'background-color'], {
            duration: theme.transitions.duration.shortest,
          }),
        }}
      >
        {/* Drag Handle */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1,
            py: 0.5,
            backgroundColor: theme.palette.primary.main,
            borderRadius: 1,
            cursor: 'grab',
            '&:active': {
              cursor: 'grabbing',
            },
          }}
        >
          <DragIndicatorIcon
            sx={{
              fontSize: 16,
              color: theme.palette.primary.contrastText,
            }}
          />
        </Box>

        {/* Hide Button */}
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility?.(widget.id);
          }}
          sx={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            width: 28,
            height: 28,
            '&:hover': {
              backgroundColor: theme.palette.error.light,
            },
          }}
        >
          <VisibilityOffIcon
            sx={{
              fontSize: 16,
              color: theme.palette.text.secondary,
            }}
          />
        </IconButton>
      </Box>

      {/* Widget Content */}
      <Box
        sx={{
          pointerEvents: isCustomizeMode ? 'none' : 'auto',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DraggableWidget;
