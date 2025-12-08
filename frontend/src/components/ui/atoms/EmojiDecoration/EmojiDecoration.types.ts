export interface EmojiDecorationProps {
  /** The emoji character to display */
  emoji: string;
  /** Size of the emoji */
  size?: 'small' | 'medium' | 'large';
  /** Position from top (CSS value) */
  top?: string;
  /** Position from left (CSS value) */
  left?: string;
  /** Position from right (CSS value) */
  right?: string;
  /** Position from bottom (CSS value) */
  bottom?: string;
}
