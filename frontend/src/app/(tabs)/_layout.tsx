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
        // Tab switches cross-fade; screens opened from inside a tab slide in (see the two below).
        animation: 'fade',
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="recipes" options={{ title: 'Recipes' }} />
      <Tabs.Screen name="markets" options={{ title: 'Markets' }} />
      <Tabs.Screen name="list" options={{ title: 'My List' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      {/*
        Reachable by link only; they live here so the bottom nav stays visible, as in the design.
        Not `href: null`: that marks the tab hidden, and navigating to a hidden tab is redirected
        away, so card links never opened. <TabBar> already omits routes that aren't in its TABS map.
      */}
      <Tabs.Screen name="schedule" options={{ title: 'Schedule', animation: 'shift' }} />
      {/* Recipe fades in because the tapped card's dish flies onto its plate (DishFlight). */}
      <Tabs.Screen name="recipe/[id]" options={{ title: 'Recipe', animation: 'fade' }} />
    </Tabs>
  );
}
