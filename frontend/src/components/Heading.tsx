import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme';

type Props = {
  /** Upright part, e.g. "Maligayang" */
  lead: string;
  /** Slanted accent part, e.g. "pagbabalik." */
  accent: string;
  /** Put the accent on its own line (login) instead of flowing inline (sign up). */
  stacked?: boolean;
  /** Font size in points. Defaults to 35 (auth screens). */
  size?: number;
};

/**
 * Two-tone screen heading. Bricolage Grotesque ships without an italic, so the
 * accent is slanted with a skew transform. That renders the same on iOS and
 * Android instead of depending on each platform's faux-italic behavior.
 */
export function Heading({ lead, accent, stacked = false, size = 35 }: Props) {
  const sizeStyle = { fontSize: size, lineHeight: Math.round(size * 1.12) };
  return (
    <View
      accessible
      accessibilityRole="header"
      accessibilityLabel={`${lead} ${accent}`}
      style={[styles.row, stacked && styles.stacked]}
    >
      <Text style={[styles.text, sizeStyle, !stacked && styles.leadInline]}>{lead}</Text>
      <Text style={[styles.text, sizeStyle, styles.accent]}>{accent}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
  },
  stacked: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  text: {
    fontFamily: fonts.display,
    fontSize: 35,
    lineHeight: 39,
    letterSpacing: -0.6,
    color: colors.forest,
    includeFontPadding: false,
  },
  leadInline: {
    marginRight: 9,
  },
  accent: {
    paddingRight: 6,
    transform: [{ skewX: '-11deg' }],
    transformOrigin: 'left bottom',
  },
});
