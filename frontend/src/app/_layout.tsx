import {
  BricolageGrotesque_500Medium,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from '@expo-google-fonts/bricolage-grotesque';
import {
  Figtree_400Regular,
  Figtree_500Medium,
  Figtree_600SemiBold,
  Figtree_700Bold,
} from '@expo-google-fonts/figtree';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { PalengkitaProvider } from '@/context/PalengkitaContext';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync();

function RootStack() {
  const { user } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.cream },
        animation: 'slide_from_right',
      }}
    >
      {/* Signed out */}
      <Stack.Protected guard={!user}>
        <Stack.Screen name="login" options={{ animation: 'fade' }} />
        <Stack.Screen name="signup" />
      </Stack.Protected>

      {/* Signed in */}
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    BricolageGrotesque_500Medium,
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
    Figtree_400Regular,
    Figtree_500Medium,
    Figtree_600SemiBold,
    Figtree_700Bold,
  });

  const ready = fontsLoaded || !!fontError;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PalengkitaProvider>
          <RootStack />
        </PalengkitaProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
