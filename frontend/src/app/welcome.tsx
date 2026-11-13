import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GoogleLogo } from '@/components/icons';
import { Plate } from '@/components/Plate';
import { PillButton } from '@/components/Buttons';
import { InlineLink } from '@/components/FormBits';
import { ds, fonts } from '@/theme';

const PLATE = 340;

/** First screen when signed out: big plate on top, Google as the main action, email as the quiet one. */
export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.frame}>
          <Plate name="chicken" size={PLATE} style={{ top: -60 + insets.top * 0, left: '50%', marginLeft: -PLATE / 2 }} />
          <Plate name="salad" size={170} style={{ left: -70, top: 250 }} />
          <Plate name="adobo" size={250} style={{ right: -90, bottom: -80 }} />

          <View style={{ paddingTop: PLATE - 60 + 20 }}>
            <View style={styles.brand}>
              <Text style={styles.wordmark}>
                Palengkita<Text style={{ color: ds.orange }}>.</Text>
              </Text>
              <Text style={styles.tagline}>MAS MURA. MAS SARIWA. MAS MALAPIT.</Text>
            </View>

            <View style={styles.body}>
              <Text style={styles.title}>Maligayang pagdating</Text>
              <Text style={styles.subtitle}>Hanapin ang pinakasariwa at pinakamurang sangkap malapit sa iyo.</Text>

              <PillButton
                title="Continue with Google"
                variant="solid"
                leading={<GoogleLogo size={20} />}
                onPress={() =>
                  // TODO(backend): Google sign-in (expo-auth-session + OAuth client IDs).
                  Alert.alert('Continue with Google', 'Google sign-in will be connected once the backend is ready.')
                }
                style={styles.primary}
              />
              <PillButton title="Log in with email" variant="outline" onPress={() => router.push('/login')} style={styles.secondary} />

              <View style={styles.footer}>
                <Text style={styles.footerText}>Bago ka rito? </Text>
                <InlineLink onPress={() => router.push('/signup')}>Gumawa ng account</InlineLink>
              </View>
            </View>
          </View>
          <View style={{ height: 40 + insets.bottom }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ds.background },
  scroll: { flexGrow: 1, alignItems: 'center' },
  frame: { width: '100%', maxWidth: 480, flexGrow: 1, overflow: 'hidden' },
  brand: { alignItems: 'center', marginBottom: 28 },
  wordmark: { fontFamily: fonts.displayHeavy, fontSize: 32, color: ds.foreground },
  tagline: { fontFamily: fonts.sansSemiBold, fontSize: 9, letterSpacing: 1.4, color: ds.mutedForeground, marginTop: 6 },
  body: { paddingHorizontal: 32 },
  title: { fontFamily: fonts.serif, fontSize: 24, textAlign: 'center', color: ds.foreground },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: ds.mutedForeground,
    marginTop: 8,
    marginBottom: 28,
  },
  primary: {},
  secondary: { marginTop: 12 },
  footer: { marginTop: 26, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontFamily: fonts.sans, fontSize: 14, color: ds.mutedForeground },
});
