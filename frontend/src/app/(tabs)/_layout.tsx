import { Tabs } from 'expo-router/js-tabs';

import { TabBar } from '@/components/TabBar';
import { ds } from '@/theme';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: ds.canvas },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="recipes" options={{ title: 'Recipes' }} />
      <Tabs.Screen name="markets" options={{ title: 'Markets' }} />
      <Tabs.Screen name="list" options={{ title: 'My List' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      {/* Reachable by link only; they live here so the bottom nav stays visible, as in the design. */}
      <Tabs.Screen name="schedule" options={{ title: 'Schedule', href: null }} />
      <Tabs.Screen name="recipe/[id]" options={{ title: 'Recipe', href: null }} />
    </Tabs>
  );
}
