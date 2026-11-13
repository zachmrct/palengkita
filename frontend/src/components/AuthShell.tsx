import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ds, fonts } from '@/theme';

import { Plate, type PlateName } from './Plate';

const FRAME_WIDTH = 480;
const TOP_PLATE = 300;
/** How much of the top plate shows below the screen edge. */
const TOP_VISIBLE = 128;

type Props = {
  topPlate?: PlateName;
  bottomPlate?: PlateName;
  /** Shows a back arrow top-left. */
  onBack?: () => void;
  /** Wordmark + tagline under the top plate. */
  brand?: boolean;
  children: ReactNode;
};

/**
 * Shared shell for the login and sign-up forms: cream page, a plate peeking in at the top and another
 * at the bottom-right corner, keyboard-aware scrolling, and a width cap so it stays readable on tablets.
 */
export function AuthShell({ topPlate = 'chicken', bottomPlate = 'adobo', onBack, brand = true, children }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.frame}>
          <Plate
            name={topPlate}
            size={TOP_PLATE}
            style={{ top: -(TOP_PLATE - TOP_VISIBLE) - insets.top * 0, left: '50%', marginLeft: -TOP_PLATE / 2 }}
          />
          <Plate name={bottomPlate} size={230} style={{ right: -84, bottom: -78 }} />

          {onBack ? (
            <Pressable
              onPress={onBack ?? (() => router.back())}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              style={[styles.back, { top: insets.top + 12 }]}
            >
              <ArrowLeft size={24} color={ds.foreground} />
            </Pressable>
          ) : null}

          <View style={{ paddingTop: TOP_VISIBLE + 18 + insets.top * 0 }}>
            {brand ? (
              <View style={styles.brand}>
                <Text style={styles.wordmark}>
                  Palengkita<Text style={{ color: ds.orange }}>.</Text>
                </Text>
                <Text style={styles.tagline}>MAS MURA. MAS SARIWA. MAS MALAPIT.</Text>
              </View>
            ) : null}
            <View style={styles.body}>{children}</View>
          </View>
          <View style={{ height: 120 + insets.bottom }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ds.background },
  scroll: { flexGrow: 1, alignItems: 'center' },
  frame: { width: '100%', maxWidth: FRAME_WIDTH, flexGrow: 1, overflow: 'hidden' },
  back: { position: 'absolute', left: 20, zIndex: 2 },
  brand: { alignItems: 'center', marginBottom: 26 },
  wordmark: { fontFamily: fonts.displayHeavy, fontSize: 30, color: ds.foreground },
  tagline: { fontFamily: fonts.sansSemiBold, fontSize: 9, letterSpacing: 1.4, color: ds.mutedForeground, marginTop: 6 },
  body: { paddingHorizontal: 32 },
});
