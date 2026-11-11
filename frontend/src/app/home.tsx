import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/Buttons';
import { useAuth } from '@/context/AuthContext';
import { colors, fonts, MAX_CONTENT_WIDTH, SCREEN_PADDING } from '@/theme';

/** Placeholder landing screen after auth. Real home content comes next. */
export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 32 }]}>
      <StatusBar style="dark" />
      <View style={styles.inner}>
        <Text style={styles.kicker}>PALENGKITA</Text>
        <Text style={styles.title} accessibilityRole="header">
          Maligayang pagdating, {user?.name ?? 'kaibigan'}!
        </Text>
        <Text style={styles.body}>
          You're signed in. Meal recommendations and nearby palengke prices will show up here.
        </Text>
        <PrimaryButton title="MAG-LOG OUT" onPress={signOut} style={styles.button} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.cream,
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    paddingHorizontal: SCREEN_PADDING,
  },
  kicker: {
    fontFamily: fonts.bodyBold,
    fontSize: 12.5,
    letterSpacing: 2.2,
    color: colors.link,
  },
  title: {
    marginTop: 10,
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.5,
    color: colors.forest,
  },
  body: {
    marginTop: 12,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
    color: colors.forest,
  },
  button: {
    marginTop: 32,
  },
});
