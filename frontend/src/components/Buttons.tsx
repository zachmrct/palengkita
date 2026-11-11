import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, fonts, radii } from '@/theme';

import { GoogleLogo } from './icons';

type PrimaryProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({ title, onPress, loading = false, disabled = false, style }: PrimaryProps) {
  const inactive = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={({ pressed }) => [
        styles.primary,
        pressed && styles.primaryPressed,
        disabled && !loading && styles.primaryDisabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.primaryText}>{title}</Text>
      )}
    </Pressable>
  );
}

type GoogleProps = {
  onPress: () => void;
  disabled?: boolean;
};

export function GoogleButton({ onPress, disabled = false }: GoogleProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel="Continue with Google"
      style={({ pressed }) => [styles.google, pressed && styles.googlePressed]}
    >
      <View style={styles.googleContent}>
        <GoogleLogo size={24} />
        <Text style={styles.googleText}>Continue with Google</Text>
      </View>
    </Pressable>
  );
}

export function OrDivider({ label = 'o' }: { label?: string }) {
  return (
    <View style={styles.divider} accessibilityElementsHidden importantForAccessibility="no">
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>{label}</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  primary: {
    height: 54,
    borderRadius: radii.button,
    backgroundColor: colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  primaryDisabled: {
    opacity: 0.55,
  },
  primaryText: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    letterSpacing: 1.1,
    color: colors.white,
  },

  google: {
    height: 52,
    borderRadius: radii.button - 2,
    borderWidth: 1,
    borderColor: colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  googlePressed: {
    backgroundColor: 'rgba(28,58,45,0.07)',
  },
  googleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  googleText: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.forest,
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.divider,
  },
  dividerText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.muted,
  },
});
