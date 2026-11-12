import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { BookOpen, House, ShoppingBasket, Store, UserRound, type LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePalengkita } from '@/context/PalengkitaContext';
import { ds, fonts, SHELL_MAX_WIDTH } from '@/theme';

const TABS: Record<string, { label: string; icon: LucideIcon }> = {
  index: { label: 'Home', icon: House },
  recipes: { label: 'Recipes', icon: BookOpen },
  markets: { label: 'Markets', icon: Store },
  list: { label: 'My List', icon: ShoppingBasket },
  profile: { label: 'Profile', icon: UserRound },
};

/**
 * The design's bottom nav (`.bottom-nav`): active tab gets a mint pill behind its
 * icon. Routes that are not in `TABS` (recipe detail, schedule) stay reachable but
 * leave every item inactive, matching the design's exact-match active state.
 */
export function TabBar({ state, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { list } = usePalengkita();

  return (
    <View style={styles.outer}>
      <View style={[styles.bar, { height: 78 + insets.bottom, paddingBottom: 13 + insets.bottom }]} accessibilityRole="tablist">
        {state.routes.map((route, index) => {
          const tab = TABS[route.name];
          if (!tab) return null;
          const active = state.index === index;
          const badge = route.name === 'list' ? list.length : 0;
          const Icon = tab.icon;
          const color = active ? ds.foreground : ds.mutedForeground;

          return (
            <Pressable
              key={route.key}
              onPress={() => navigateToTab(route.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={badge ? `${tab.label}, ${badge} items` : tab.label}
              style={styles.item}
            >
              <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
                <Icon size={22} color={color} />
                {badge > 0 ? (
                  <Text style={styles.count}>{badge}</Text>
                ) : null}
              </View>
              <Text style={[styles.label, { color }, active && styles.labelActive]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { alignItems: 'center', backgroundColor: ds.canvas },
  bar: {
    width: '100%',
    maxWidth: SHELL_MAX_WIDTH,
    paddingTop: 7,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: ds.card,
    borderTopWidth: 1,
    borderTopColor: ds.border,
  },
  item: { minWidth: 48, alignItems: 'center', justifyContent: 'center', gap: 5 },
  iconWrap: { width: 43, height: 29, alignItems: 'center', justifyContent: 'center' },
  iconWrapActive: { backgroundColor: ds.mint, borderRadius: 20 },
  label: { fontFamily: fonts.sans, fontSize: 9 },
  labelActive: { fontFamily: fonts.sansBold },
  count: {
    position: 'absolute',
    top: -4,
    right: 1,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    overflow: 'hidden',
    textAlign: 'center',
    lineHeight: 16,
    fontFamily: fonts.sansBold,
    fontSize: 9,
    color: ds.foreground,
    backgroundColor: ds.orange,
  },
});
