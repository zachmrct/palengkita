import { Link, type Href } from 'expo-router';
import { ArrowUpRight, type LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle } from 'react-native';

import { PText } from '@/components/PText';
import { ds, fonts } from '@/theme';

import { useShell } from './layout';

/** `h1` in the design: DM Serif Display 36px (33px on small phones), line-height 1.15. */
export function H1({ children, size, style }: { children: ReactNode; size?: number; style?: StyleProp<TextStyle> }) {
  const { compact } = useShell();
  const fontSize = size ?? (compact ? 33 : 36);
  return (
    <Text accessibilityRole="header" style={[styles.h1, { fontSize, lineHeight: fontSize * 1.15 }, style]}>
      {children}
    </Text>
  );
}

/** `h1 em`: green accent word (Bricolage has no italic). */
export function Em({ children }: { children: ReactNode }) {
  return <Text style={styles.em}>{children}</Text>;
}

/** `h2`: DM Serif Display 25px, line-height 1.25. */
export function H2({ children, size = 25, style }: { children: ReactNode; size?: number; style?: StyleProp<TextStyle> }) {
  return (
    <PText accessibilityRole="header" style={[styles.h2, { fontSize: size, lineHeight: size * 1.25 }, style]}>
      {children}
    </PText>
  );
}

/** Small uppercase green label with an optional icon (`.eyebrow`). */
export function Eyebrow({
  icon: Icon,
  iconSize = 16,
  small = false,
  center = false,
  children,
}: {
  icon?: LucideIcon;
  iconSize?: number;
  small?: boolean;
  center?: boolean;
  children: string;
}) {
  return (
    <View style={[styles.eyebrow, { marginBottom: small ? 7 : 10 }, center && { justifyContent: 'center' }]}>
      {Icon ? <Icon size={iconSize} color={ds.green} /> : null}
      <Text style={[styles.eyebrowText, { fontSize: small ? 8 : 10 }]}>{children}</Text>
    </View>
  );
}

/** Page opener: eyebrow, serif title, muted subtitle (`.greeting`). */
export function Greeting({
  icon,
  iconSize,
  eyebrow,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  iconSize?: number;
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
}) {
  return (
    <View style={{ marginBottom: 23 }}>
      <Eyebrow icon={icon} iconSize={iconSize}>
        {eyebrow}
      </Eyebrow>
      <H1>{title}</H1>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

/** Title (with optional eyebrow) on the left, trailing action on the right (`.section-heading`). */
export function SectionHeading({ children, trailing }: { children: ReactNode; trailing?: ReactNode }) {
  return (
    <View style={styles.sectionHeading}>
      <View style={{ flexShrink: 1 }}>{children}</View>
      {trailing}
    </View>
  );
}

/** `.text-link`: small medium-weight link with a trailing or leading icon. */
export function TextLink({
  href,
  label,
  icon: Icon = ArrowUpRight,
  iconSize = 15,
  leading = false,
}: {
  href: Href;
  label: string;
  icon?: LucideIcon;
  iconSize?: number;
  leading?: boolean;
}) {
  return (
    <Link href={href} asChild>
      <Pressable accessibilityRole="link" style={styles.textLink}>
        {leading ? <Icon size={iconSize} color={ds.foreground} /> : null}
        <Text style={styles.textLinkText}>{label}</Text>
        {leading ? null : <Icon size={iconSize} color={ds.foreground} />}
      </Pressable>
    </Link>
  );
}

/** Circular outlined link button (`.round-link`). */
export function RoundLink({
  href,
  icon: Icon,
  iconSize = 20,
  label,
}: {
  href: Href;
  icon: LucideIcon;
  iconSize?: number;
  label: string;
}) {
  return (
    <Link href={href} asChild>
      <Pressable accessibilityRole="link" accessibilityLabel={label} style={styles.roundLink}>
        <Icon size={iconSize} color={ds.foreground} />
      </Pressable>
    </Link>
  );
}

export const typography = StyleSheet.create({
  muted: { fontFamily: fonts.sans, fontSize: 12, color: ds.mutedForeground },
  estimateNote: {
    fontFamily: fonts.sans,
    fontSize: 10,
    lineHeight: 16,
    color: ds.mutedForeground,
    marginVertical: 22,
  },
});

const styles = StyleSheet.create({
  h1: { fontFamily: fonts.serif, color: ds.foreground },
  em: { fontFamily: fonts.serifItalic, color: ds.green },
  h2: { fontFamily: fonts.serif, color: ds.foreground },
  eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  eyebrowText: { fontFamily: fonts.sansSemiBold, color: ds.green },
  subtitle: { fontFamily: fonts.sans, fontSize: 11, color: ds.mutedForeground, marginTop: 11 },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 16,
  },
  textLink: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  textLinkText: { fontFamily: fonts.sansMedium, fontSize: 11, color: ds.foreground },
  roundLink: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: ds.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
