import { useWindowDimensions } from 'react-native';

import { COMPACT_WIDTH, SHELL_MAX_WIDTH } from '@/theme';

/**
 * Responsive metrics from the design's CSS: the app shell is capped at the mobile
 * breakpoint, page padding tightens at <= 370px, and a few components swap sizes.
 */
export function useShell() {
  const { width } = useWindowDimensions();
  const compact = width <= COMPACT_WIDTH;
  const shellWidth = Math.min(width, SHELL_MAX_WIDTH);
  const padX = compact ? 17 : 23;
  return { compact, shellWidth, padX, contentWidth: shellWidth - padX * 2 };
}
