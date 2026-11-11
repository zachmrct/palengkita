import type { ReactNode } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fonts, MAX_CONTENT_WIDTH, palette } from '@/theme';

import { CloseIcon } from './icons';
import { PText } from './PText';

/** Cream card with a hairline border, used across the signed-in screens. */
export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

/** Serif section title with an optional right-hand link and subtitle. */
export function SectionHeader({
  title,
  subtitle,
  action,
  onAction,
  right,
}: {
  title: string;
  subtitle?: string;
  action?: string;
  onAction?: () => void;
  right?: ReactNode;
}) {
  return (
    <View>
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          {title}
        </Text>
        {action ? (
          <Pressable onPress={onAction} hitSlop={10} accessibilityRole="link" accessibilityLabel={action}>
            <Text style={styles.sectionAction}>{action}</Text>
          </Pressable>
        ) : (
          right
        )}
      </View>
      {subtitle ? <PText style={styles.sectionSubtitle}>{subtitle}</PText> : null}
    </View>
  );
}

/** Small rounded label such as "SAMPLE" or "TODAY'S PICK". */
export function Badge({
  label,
  tone = 'white',
  style,
}: {
  label: string;
  tone?: 'white' | 'gold' | 'green' | 'outline' | 'dark';
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.badge, badgeTones[tone].box, style]}>
      <Text style={[styles.badgeText, badgeTones[tone].text]}>{label}</Text>
    </View>
  );
}

const badgeTones = {
  white: { box: { backgroundColor: 'rgba(255,253,245,0.92)' }, text: { color: palette.ink } },
  gold: { box: { backgroundColor: palette.gold }, text: { color: palette.ink } },
  green: { box: { backgroundColor: palette.green }, text: { color: '#fff' } },
  outline: {
    box: { borderWidth: 1.5, borderColor: palette.ink, backgroundColor: 'transparent' },
    text: { color: palette.ink },
  },
  dark: { box: { backgroundColor: palette.headerButton }, text: { color: '#D9E6DD' } },
} as const;

/** Round-cornered square button with a minus or plus (servings, people). */
export function StepperButton({
  kind,
  onPress,
  disabled,
  label,
}: {
  kind: 'minus' | 'plus';
  onPress: () => void;
  disabled?: boolean;
  label: string;
}) {
  const filled = kind === 'plus';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.stepper,
        filled ? styles.stepperFilled : styles.stepperOutline,
        disabled && { opacity: 0.35 },
        pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
      ]}
    >
      <Text style={[styles.stepperGlyph, { color: filled ? '#fff' : palette.ink }]}>
        {kind === 'plus' ? '+' : '−'}
      </Text>
    </Pressable>
  );
}

/** Bottom sheet used for the budget and location editors. */
export function BottomSheet({
  visible,
  title,
  onClose,
  children,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.sheetRoot}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Close"
          accessibilityRole="button"
        />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle} accessibilityRole="header">
              {title}
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <CloseIcon size={22} color={palette.ink} />
            </Pressable>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: palette.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 1,
  },

  sectionRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    flexShrink: 1,
    fontFamily: fonts.display,
    fontSize: 23,
    lineHeight: 28,
    letterSpacing: -0.4,
    color: palette.ink,
  },
  sectionAction: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: palette.ink,
    textDecorationLine: 'underline',
    marginBottom: 3,
  },
  sectionSubtitle: {
    marginTop: 3,
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 18,
    color: palette.muted,
  },

  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 7,
  },
  badgeText: {
    fontFamily: fonts.bodyBold,
    fontSize: 10.5,
    letterSpacing: 1.1,
  },

  stepper: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperFilled: { backgroundColor: palette.ink },
  stepperOutline: { borderWidth: 2, borderColor: palette.ink },
  stepperGlyph: {
    fontFamily: fonts.bodyMedium,
    fontSize: 22,
    lineHeight: 24,
    marginTop: -1,
  },

  sheetRoot: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(14,59,44,0.45)',
  },
  sheet: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    backgroundColor: palette.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: palette.track,
    marginBottom: 14,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sheetTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    letterSpacing: -0.3,
    color: palette.ink,
  },
});
