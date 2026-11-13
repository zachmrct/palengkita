import { useEffect, useState } from 'react';
import { Animated, Easing, type StyleProp, type ViewStyle } from 'react-native';

import { ds } from '@/theme';

/** Placeholder block that pulses softly while content loads. Size and shape come from `style`. */
export function Skeleton({ style }: { style?: StyleProp<ViewStyle> }) {
  const [pulse] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ backgroundColor: ds.border, borderRadius: 8 }, style, { opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0.9] }) }]}
    />
  );
}
