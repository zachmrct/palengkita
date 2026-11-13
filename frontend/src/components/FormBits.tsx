import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ds, fonts } from '@/theme';

import { CheckIcon } from './icons';

/** Underlined, tappable inline text ("Gumawa ng account", "Terms of Use", ...). */
export function InlineLink({
  children,
  onPress,
  color = ds.green,
  size = 14,
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
        fontFamily: fonts.sansBold,
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
        {met ? <CheckIcon size={12} color={ds.card} strokeWidth={3} /> : null}
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
          {checked ? <CheckIcon size={14} color={ds.card} strokeWidth={3} /> : null}
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
    height: 24,
  },
  reqCircle: {
    width: 19,
    height: 19,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: ds.mutedForeground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reqCircleMet: {
    backgroundColor: ds.green,
    borderColor: ds.green,
  },
  reqText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: ds.foreground,
  },
  reqTextMet: {
    color: ds.green,
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
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: ds.foreground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    backgroundColor: ds.green,
  },
  boxError: {
    borderColor: ds.destructive,
  },
  checkText: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 18,
    color: ds.foreground,
  },
  error: {
    marginTop: 6,
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: ds.destructive,
  },
});
