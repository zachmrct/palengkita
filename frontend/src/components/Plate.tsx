import { Image } from 'expo-image';
import type { ImageStyle, StyleProp } from 'react-native';

const PLATES = {
  chicken: require('../../assets/images/auth-plate-chicken.webp'),
  rice: require('../../assets/images/auth-plate-rice.webp'),
  salad: require('../../assets/images/auth-plate-salad.webp'),
  adobo: require('../../assets/images/auth-plate-adobo.webp'),
};

export type PlateName = keyof typeof PLATES;

/**
 * A plated dish cut-out (with its own soft shadow). Positioned by the caller, usually partly off
 * the edge of the screen so it looks like a plate on the table peeking in.
 */
export function Plate({ name, size, style }: { name: PlateName; size: number; style?: StyleProp<ImageStyle> }) {
  return (
    <Image
      source={PLATES[name]}
      contentFit="contain"
      accessibilityElementsHidden
      importantForAccessibility="no"
      pointerEvents="none"
      style={[{ position: 'absolute', width: size, height: size }, style]}
    />
  );
}
