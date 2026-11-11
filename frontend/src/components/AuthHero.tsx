import { Image, type ImageSource } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, MAX_CONTENT_WIDTH, radii, SCREEN_PADDING } from '@/theme';

import { ChevronLeftIcon } from './icons';

type Props = {
  variant: 'login' | 'signup';
  photo: ImageSource;
  /** Describes the photo for screen readers. */
  photoDescription: string;
  /** Vertical focal point of the photo crop, 0 = top, 100 = bottom. */
  photoFocusY?: number;
  onBack?: () => void;
};

// How far the photo card reaches up into the dark header, per variant (pt).
const OVERLAP = { login: 77, signup: 55 } as const;
const GAP_BELOW_CONTENT = { login: 33, signup: 5 } as const;
const CARD_ASPECT = { login: 350 / 170, signup: 350 / 120 } as const;

/**
 * Dark rounded header + photo card that straddles the header's bottom edge.
 * Rendered inside the screen's ScrollView so it scrolls with the form.
 */
export function AuthHero({ variant, photo, photoDescription, photoFocusY = 50, onBack }: Props) {
  const insets = useSafeAreaInsets();
  const overlap = OVERLAP[variant];

  return (
    <View>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + (variant === 'login' ? 16 : 11),
            paddingBottom: GAP_BELOW_CONTENT[variant] + overlap,
          },
        ]}
      >
        {/* Fills the area revealed by iOS rubber-band overscroll at the top. */}
        <View style={styles.overscroll} pointerEvents="none" />

        <View style={styles.headerInner}>
          {variant === 'login' ? <LoginBrand /> : <SignupBrand onBack={onBack} />}
        </View>
      </View>

      <View style={[styles.cardLayer, { marginTop: -overlap }]}>
        <View style={styles.cardInner}>
          <View style={[styles.cardShadow, { aspectRatio: CARD_ASPECT[variant] }]}>
            <View style={styles.cardClip}>
              <Image
                source={photo}
                contentFit="cover"
                contentPosition={{ top: `${photoFocusY}%` }}
                transition={200}
                accessible
                accessibilityRole="image"
                accessibilityLabel={photoDescription}
                style={StyleSheet.absoluteFill}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function LoginBrand() {
  return (
    <View>
      <View style={styles.loginTitleRow}>
        <Text style={styles.loginLogo} accessibilityRole="header">
          Palengkita
        </Text>
        <Text style={styles.est}>EST. 2026</Text>
      </View>
      <Text style={styles.tagline}>MAS MURA. MAS SARIWA. MAS MALAPIT.</Text>
    </View>
  );
}

function SignupBrand({ onBack }: { onBack?: () => void }) {
  return (
    <View style={styles.signupRow}>
      <Pressable
        onPress={onBack}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={({ pressed }) => [styles.back, pressed && { opacity: 0.6 }]}
      >
        <ChevronLeftIcon size={30} color={colors.cream} />
      </Pressable>
      <Text style={styles.signupLogo} accessibilityRole="header">
        Palengkita
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.forest,
    borderBottomLeftRadius: radii.headerBottom,
    borderBottomRightRadius: radii.headerBottom,
    alignItems: 'center',
  },
  overscroll: {
    position: 'absolute',
    top: -1200,
    left: 0,
    right: 0,
    height: 1200,
    backgroundColor: colors.forest,
  },
  headerInner: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    paddingHorizontal: SCREEN_PADDING,
  },

  loginTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  loginLogo: {
    fontFamily: fonts.displayHeavy,
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: -0.8,
    color: colors.cream,
    includeFontPadding: false,
  },
  est: {
    fontFamily: fonts.bodyBold,
    fontSize: 12.5,
    letterSpacing: 2.2,
    color: colors.gold,
    paddingBottom: 9,
  },
  tagline: {
    marginTop: 7,
    fontFamily: fonts.bodyBold,
    fontSize: 12.5,
    letterSpacing: 1.7,
    color: colors.gold,
  },

  signupRow: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {
    position: 'absolute',
    left: -6,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupLogo: {
    fontFamily: fonts.displayHeavy,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.5,
    color: colors.cream,
    includeFontPadding: false,
  },

  cardLayer: {
    alignItems: 'center',
  },
  cardInner: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    paddingHorizontal: SCREEN_PADDING,
  },
  cardShadow: {
    width: '100%',
    borderRadius: radii.card,
    backgroundColor: colors.sage,
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 5,
  },
  cardClip: {
    flex: 1,
    borderRadius: radii.card,
    overflow: 'hidden',
    backgroundColor: colors.sage,
  },
});
