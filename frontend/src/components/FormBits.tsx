import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radii } from '@/theme';

import { CheckIcon } from './icons';

/** Underlined, tappable inline text ("Gumawa ng account", "Terms of Use", ...). */
export function InlineLink({
  children,
  onPress,
  color = colors.forest,
  size = 16,
  accessibilityLabel,
}: {
  children: string;
  onPress: () => void;
  color?: string;
  size?: number;
  accessibilityLabel?: string;
}) {
  return (
    <Text
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel ?? children}
      suppressHighlighting
      style={{
        fontFamily: fonts.bodyBold,
        fontSize: size,
        color,
        textDecorationLine: 'underline',
        textDecorationColor: color,
      }}
    >
      {children}
    </Text>
  );
}

/** One live password rule: circle fills with a check once the rule is satisfied. */
export function RequirementRow({ met, children }: { met: boolean; children: string }) {
  return (
    <View
      style={styles.reqRow}
      accessible
      accessibilityLabel={`${children}, ${met ? 'met' : 'not met yet'}`}
    >
      <View style={[styles.reqCircle, met && styles.reqCircleMet]}>
        {met ? <CheckIcon size={12} color={colors.white} strokeWidth={3} /> : null}
      </View>
      <Text style={[styles.reqText, met && styles.reqTextMet]}>{children}</Text>
    </View>
  );
}

export function Checkbox({
  checked,
  onToggle,
  error,
  children,
}: {
  checked: boolean;
  onToggle: () => void;
  error?: string | null;
  children: ReactNode;
}) {
  return (
    <View>
      <View style={styles.checkRow}>
        <Pressable
          onPress={onToggle}
          hitSlop={10}
          accessibilityRole="checkbox"
          accessibilityState={{ checked }}
          accessibilityLabel="I agree to the Terms of Use and Privacy Policy"
          style={[
            styles.box,
            checked && styles.boxChecked,
            !!error && !checked && styles.boxError,
          ]}
        >
          {checked ? <CheckIcon size={14} color={colors.white} strokeWidth={3} /> : null}
        </Pressable>
        <Text style={styles.checkText}>{children}</Text>
      </View>
      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  reqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 27,
  },
  reqCircle: {
    width: 19,
    height: 19,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reqCircleMet: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  reqText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14.5,
    color: colors.forest,
  },
  reqTextMet: {
    color: colors.success,
  },

  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  box: {
    width: 20,
    height: 20,
    marginTop: 1,
    borderRadius: radii.checkbox,
    borderWidth: 1.5,
    borderColor: colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    backgroundColor: colors.forest,
  },
  boxError: {
    borderColor: colors.error,
  },
  checkText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14.5,
    lineHeight: 19,
    color: colors.forest,
  },
  error: {
    marginTop: 6,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.error,
  },
});
