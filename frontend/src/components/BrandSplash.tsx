import { ShoppingBasket, Sprout } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme';

import { Plate } from './Plate';

/** App-start screen: the wordmark settles in, holds a beat, then fades away over the app. */
export function BrandSplash({ onDone }: { onDone: () => void }) {
  const [intro] = useState(() => new Animated.Value(0));
  const [exit] = useState(() => new Animated.Value(1));

  useEffect(() => {
    Animated.sequence([
      Animated.timing(intro, { toValue: 1, duration: 520, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.delay(650),
      Animated.timing(exit, { toValue: 0, duration: 380, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) onDone();
    });
  }, [intro, exit, onDone]);

  return (
    <Animated.View pointerEvents="none" accessibilityElementsHidden style={[styles.root, { opacity: exit }]}>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: intro, transform: [{ scale: intro.interpolate({ inputRange: [0, 1], outputRange: [1.12, 1] }) }] }]}>
        <Plate name="salad" size={230} style={{ top: -80, left: -80 }} />
        <Plate name="adobo" size={230} style={{ top: -70, right: -90 }} />
        <Plate name="rice" size={240} style={{ bottom: -90, left: -90 }} />
        <Plate name="chicken" size={260} style={{ bottom: -100, right: -100 }} />
      </Animated.View>
      <Animated.View
        style={{
          alignItems: 'center',
          opacity: intro,
          transform: [{ scale: intro.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }],
        }}
      >
        <View style={styles.icon}>
          <ShoppingBasket size={46} color={colors.cream} />
          <View style={styles.sprout}>
            <Sprout size={30} color={colors.gold} />
          </View>
        </View>
        <Text style={styles.word}>
          Palengkita<Text style={{ color: colors.gold }}>.</Text>
        </Text>
        <Text style={styles.tagline}>MAS MURA. MAS SARIWA. MAS MALAPIT.</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.forest,
  },
  icon: { width: 46, height: 46, marginBottom: 26 },
  sprout: { position: 'absolute', top: -22, left: 12 },
  word: { fontFamily: fonts.displayHeavy, fontSize: 44, color: colors.cream },
  tagline: { fontFamily: fonts.bodySemiBold, fontSize: 10, letterSpacing: 1.6, color: colors.gold, marginTop: 10 },
});
