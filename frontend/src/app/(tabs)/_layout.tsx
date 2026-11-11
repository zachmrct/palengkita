import { Tabs } from 'expo-router/js-tabs';

import { TabBar } from '@/components/TabBar';
import { palette } from '@/theme';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: palette.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="recipes" options={{ title: 'Recipes' }} />
      <Tabs.Screen name="markets" options={{ title: 'Markets' }} />
      <Tabs.Screen name="list" options={{ title: 'My List' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
