import { Link, type Href } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { PText } from '@/components/PText';
import { ds, fonts } from '@/theme';

type Variant = 'default' | 'outline' | 'ghost';
type Size = 'default' | 'lg' | 'icon';

type Props = {
  variant?: Variant;
  size?: Size;
  label?: string;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  /** Lucide size in px. The design's `[&_svg]:size-4` makes every button icon 16px unless a rule overrides it. */
  iconSize?: number;
  /** Fill for the leading icon (e.g. a saved heart). `true` fills with the text color. */
  iconFilled?: boolean | string;
  /** Overrides the variant's text/icon color. */
  color?: string;
  onPress?: () => void;
  /** Renders as a link (the design's `<Button asChild><Link/></Button>`). */
  href?: Href;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'tab';
  accessibilityState?: { selected?: boolean };
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

const TEXT_COLOR: Record<Variant, string> = {
  default: ds.primaryForeground,
  outline: ds.foreground,
  ghost: ds.foreground,
};

/**
 * shadcn/ui Button from the design, in React Native. Note the design's global CSS
 * (`button { font: inherit }`) wins over Tailwind's `text-sm font-medium`, so labels
 * are the inherited 14px regular weight, not medium.
 */
export function Button({
  variant = 'default',
  size = 'default',
  label,
  icon: Icon,
  iconRight: IconRight,
  iconSize = 16,
  iconFilled,
  color,
  onPress,
  href,
  disabled,
  accessibilityLabel,
  accessibilityRole = 'button',
  accessibilityState,
  style,
  labelStyle,
}: Props) {
  const textColor = color ?? TEXT_COLOR[variant];
  const fill = iconFilled === true ? textColor : iconFilled || 'none';

  const pressable = (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole={href ? 'link' : accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled, ...accessibilityState }}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {Icon ? <Icon size={iconSize} color={textColor} fill={fill} strokeWidth={2} /> : null}
      {label ? <PText style={[styles.label, { color: textColor }, labelStyle]}>{label}</PText> : null}
      {IconRight ? <IconRight size={iconSize} color={textColor} strokeWidth={2} /> : null}
    </Pressable>
  );

  if (href) {
    return (
      <Link href={href} asChild>
        {pressable}
      </Link>
    );
  }
  return pressable;
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 8,
  },
  default: {
    backgroundColor: ds.foreground,
    boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
  },
  outline: {
    backgroundColor: ds.background,
    borderWidth: 1,
    borderColor: ds.border,
    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
  },
  ghost: { backgroundColor: 'transparent' },
  size_default: { height: 36, paddingHorizontal: 16 },
  size_lg: { height: 40, paddingHorizontal: 32 },
  size_icon: { height: 36, width: 36, paddingHorizontal: 0 },
  label: { fontFamily: fonts.sans, fontSize: 14 },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.75 },
});
