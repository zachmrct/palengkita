import type { BottomTabBarProps } from 'expo-router/js-tabs';
import type { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BagIcon, BasketIcon, BuildingIcon, HomeTabIcon, UserIcon } from '@/components/icons';
import { useList } from '@/context/ListContext';
import { fonts, MAX_CONTENT_WIDTH, palette } from '@/theme';

type IconRenderer = (color: string, active: boolean) => ReactElement;

const TABS: Record<string, { label: string; icon: IconRenderer }> = {
  index: { label: 'Home', icon: (c, a) => <HomeTabIcon size={22} color={c} filled={a} strokeWidth={1.9} /> },
  recipes: { label: 'Recipes', icon: (c) => <BasketIcon size={22} color={c} strokeWidth={1.9} /> },
  markets: { label: 'Markets', icon: (c) => <BuildingIcon size={22} color={c} strokeWidth={1.9} /> },
  list: { label: 'My List', icon: (c) => <BagIcon size={22} color={c} strokeWidth={1.9} /> },
  profile: { label: 'Profile', icon: (c) => <UserIcon size={22} color={c} strokeWidth={1.9} /> },
};

/** Bottom bar: active tab gets a dark pill behind its icon. */
export function TabBar({ state, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { items } = useList();

  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom }]}>
      <View style={styles.bar} accessibilityRole="tablist">
        {state.routes.map((route, index) => {
          const tab = TABS[route.name];
          if (!tab) return null;
          const active = state.index === index;
          const badge = route.name === 'list' ? items.length : 0;

          const onPress = () => {
            if (!active) navigateToTab(route.key);
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={badge ? `${tab.label}, ${badge} ${badge === 1 ? 'item' : 'items'}` : tab.label}
              style={styles.tab}
            >
              <View style={[styles.iconPill, active && styles.iconPillActive]}>
                {tab.icon(active ? '#fff' : palette.muted, active)}
                {badge ? <View style={styles.dot} /> : null}
              </View>
              <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    backgroundColor: palette.tabBar,
    borderTopWidth: 1,
    borderTopColor: palette.line,
  },
  bar: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  iconPill: {
    width: 56,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPillActive: { backgroundColor: palette.ink },
  label: { fontFamily: fonts.bodySemiBold, fontSize: 11.5, color: palette.muted },
  labelActive: { fontFamily: fonts.bodyBold, color: palette.ink },
  dot: {
    position: 'absolute',
    top: 3,
    right: 14,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: palette.alert,
    borderWidth: 1.5,
    borderColor: palette.tabBar,
  },
});
