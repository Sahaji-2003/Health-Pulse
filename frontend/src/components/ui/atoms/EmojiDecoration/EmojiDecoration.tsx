import React from 'react';
import { Box, useTheme } from '@mui/material';
import type { EmojiDecorationProps } from './EmojiDecoration.types';

/**
 * EmojiDecoration Atom Component
 * 
 * A decorative emoji component for visual enhancement.
 * Supports absolute positioning for page layouts.
 * 
 * @example
 * <EmojiDecoration emoji="🩺" size="large" top="20%" left="12%" />
 */
export const EmojiDecoration: React.FC<EmojiDecorationProps> = ({
  emoji,
  size = 'large',
  top,
  left,
  right,
  bottom,
}) => {
  const theme = useTheme();
  const sizeStyles = theme.customSizes.emoji[size];

  return (
    <Box
      sx={{
        position: 'absolute',
        fontSize: sizeStyles.fontSize,
        lineHeight: `${sizeStyles.lineHeight}px`,
        userSelect: 'none',
        ...(top && { top }),
        ...(left && { left }),
        ...(right && { right }),
        ...(bottom && { bottom }),
      }}
      aria-hidden="true"
    >
      {emoji}
    </Box>
  );
};

export default EmojiDecoration;
