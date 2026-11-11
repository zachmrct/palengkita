import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fonts, MAX_CONTENT_WIDTH, palette, SCREEN_PADDING } from '@/theme';

/** Simple "coming soon" screen shell for tabs that are not designed yet. */
export function Placeholder({
  kicker,
  title,
  body,
  children,
}: {
  kicker: string;
  title: string;
  body: string;
  children?: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top + 32 }]}>
      <StatusBar style="dark" />
      <View style={styles.inner}>
        <Text style={styles.kicker}>{kicker}</Text>
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        <Text style={styles.body}>{body}</Text>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg, alignItems: 'center' },
  inner: { width: '100%', maxWidth: MAX_CONTENT_WIDTH, paddingHorizontal: SCREEN_PADDING },
  kicker: { fontFamily: fonts.bodyBold, fontSize: 12.5, letterSpacing: 2.2, color: palette.green },
  title: {
    marginTop: 10,
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.5,
    color: palette.ink,
  },
  body: { marginTop: 10, fontFamily: fonts.body, fontSize: 16, lineHeight: 22, color: palette.muted },
});
