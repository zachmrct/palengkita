import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronDown, MapPin, ShoppingBasket, Sprout } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ds, fonts, SHELL_MAX_WIDTH } from '@/theme';

import { useShell } from './layout';

/** Wordmark on the left, location link on the right (`.app-header`). */
export function AppHeader() {
  return (
    <View style={styles.header}>
      <Link href="/" asChild>
        <Pressable accessibilityRole="link" accessibilityLabel="palengkita home" style={styles.wordmark}>
          <View style={styles.brandIcon}>
            <ShoppingBasket size={23} color={ds.foreground} />
            <View style={styles.sprout}>
              <Sprout size={15} color={ds.foreground} />
            </View>
          </View>
          <Text style={styles.wordmarkText}>palengkita</Text>
          <Text style={[styles.wordmarkText, styles.brandDot]}>.</Text>
        </Pressable>
      </Link>
      <Link href="/markets" asChild>
        <Pressable accessibilityRole="link" accessibilityLabel="Location: Quezon City" style={styles.location}>
          <MapPin size={16} color={ds.foreground} />
          <Text style={styles.locationText}>Quezon City</Text>
          <ChevronDown size={13} color={ds.foreground} />
        </Pressable>
      </Link>
    </View>
  );
}

/**
 * Page chrome shared by every tab screen (`AppShell` in the design): centered column
 * capped at the mobile breakpoint, scrolling header + padded content. The bottom nav
 * is the tab bar, so no extra bottom clearance is needed beyond the content padding.
 */
export function Screen({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const { padX } = useShell();

  return (
    <View style={styles.canvas}>
      <StatusBar style="dark" />
      <View style={styles.shell}>
        <ScrollView
          contentContainerStyle={{ paddingTop: insets.top }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AppHeader />
          <View style={{ paddingHorizontal: padX, paddingTop: 26, paddingBottom: 28 }}>{children}</View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: { flex: 1, alignItems: 'center', backgroundColor: ds.canvas },
  shell: { flex: 1, width: '100%', maxWidth: SHELL_MAX_WIDTH, backgroundColor: ds.background },
  header: {
    height: 76,
    paddingHorizontal: 23,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: ds.border,
  },
  wordmark: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  brandIcon: { marginRight: 5, width: 23, height: 23 },
  sprout: { position: 'absolute', top: -10, left: 6 },
  wordmarkText: { fontFamily: fonts.displayHeavy, fontSize: 28, color: ds.foreground },
  brandDot: { color: ds.orange, marginLeft: -6 },
  location: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  locationText: { fontFamily: fonts.sansMedium, fontSize: 10, color: ds.foreground },
});
