import type { LucideIcon } from 'lucide-react-native';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { ds, fonts } from '@/theme';

import { GoogleLogo } from './icons';

type Variant = 'soft' | 'solid' | 'outline';

type PillProps = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
  /** Replaces `icon` with any element (e.g. the Google logo). */
  leading?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Rounded pill button. `soft` (mint) is the default; `solid` is the strong action; `outline` is quiet. */
export function PillButton({ title, onPress, variant = 'soft', loading = false, disabled = false, icon: Icon, leading, style }: PillProps) {
  const inactive = disabled || loading;
  const solid = variant === 'solid';
  const ink = solid ? ds.primaryForeground : ds.foreground;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={({ pressed }) => [
        styles.pill,
        variant === 'soft' && styles.soft,
        variant === 'solid' && styles.solid,
        variant === 'outline' && styles.outline,
        pressed && styles.pressed,
        disabled && !loading && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={ink} />
      ) : (
        <View style={styles.content}>
          {leading ?? (Icon ? <Icon size={20} color={ink} /> : null)}
          <Text style={[styles.text, { color: ink }]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

/** Main submit button on the forms. */
export function PrimaryButton({ title, onPress, loading = false, disabled = false, style }: Omit<PillProps, 'variant' | 'icon' | 'leading'>) {
  return <PillButton title={title} onPress={onPress} loading={loading} disabled={disabled} style={style} />;
}

export function GoogleButton({ onPress, disabled = false, style }: { onPress: () => void; disabled?: boolean; style?: StyleProp<ViewStyle> }) {
  return (
    <PillButton
      title="Continue with Google"
      variant="outline"
      onPress={onPress}
      disabled={disabled}
      leading={<GoogleLogo size={22} />}
      style={style}
    />
  );
}

const styles = StyleSheet.create({
  pill: {
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  soft: {
    backgroundColor: ds.mint,
    boxShadow: `0px 6px 14px ${ds.primary13}`,
  },
  solid: {
    backgroundColor: ds.green,
    boxShadow: `0px 8px 16px ${ds.primary20}`,
  },
  outline: {
    backgroundColor: ds.card,
    borderWidth: 1,
    borderColor: ds.border,
  },
  pressed: { opacity: 0.88, transform: [{ scale: 0.985 }] },
  disabled: { opacity: 0.55 },
  content: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  text: { fontFamily: fonts.sansSemiBold, fontSize: 15 },
});
