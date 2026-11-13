import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { BookOpen, House, ShoppingBasket, Store, UserRound, type LucideIcon } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';

import { usePalengkita } from '@/context/PalengkitaContext';
import { ds, fonts, SHELL_MAX_WIDTH } from '@/theme';

const TABS: Record<string, { label: string; icon: LucideIcon }> = {
  index: { label: 'Home', icon: House },
  recipes: { label: 'Recipes', icon: BookOpen },
  markets: { label: 'Markets', icon: Store },
  list: { label: 'My List', icon: ShoppingBasket },
  profile: { label: 'Profile', icon: UserRound },
};

const BAR_HEIGHT = 58;
/** How far the puck rises above the bar. That strip is transparent and overlaps the page (see `outer`). */
const TOP_PAD = 10;
const PUCK = 46;
const DIP_DEPTH = 40;
const DIP_HALF_WIDTH = 52;
/** How much the dip widens and the puck lifts while it travels between tabs. */
const STRETCH = 14;
const HOP = 6;

/** Bar outline with a smooth valley of `depth` centred on `cx`; the valley shows the page behind it. */
function barPath(width: number, height: number, cx: number, half: number, depth: number) {
  const x0 = Math.min(0, cx - half);
  const x1 = Math.max(width, cx + half);
  const shoulder = half * 0.55;
  return [
    `M${x0} 0`,
    `H${cx - half}`,
    `C${cx - half + shoulder} 0 ${cx - half * 0.55} ${depth} ${cx} ${depth}`,
    `C${cx + half * 0.55} ${depth} ${cx + half - shoulder} 0 ${cx + half} 0`,
    `H${x1}`,
    `V${height}`,
    `H${x0}`,
    'Z',
  ].join(' ');
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Bottom nav: a forest-green bar with a dip under the active tab. A cream puck holding the active icon
 * floats in the dip; when the tab changes, the puck slides over and the dip stretches and follows it.
 * Routes that aren't tabs (recipe detail, schedule) have no active tab, so the dip flattens and the
 * puck tucks away.
 */
export function TabBar({ state, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { list } = usePalengkita();
  const [width, setWidth] = useState(0);

  const items = state.routes.filter((route) => TABS[route.name]);
  const focusedName = state.routes[state.index]?.name;
  const activeIndex = items.findIndex((route) => route.name === focusedName);
  const count = items.length;
  const slot = width / count;
  const barHeight = BAR_HEIGHT + insets.bottom;

  // `pos` is the (fractional) tab index the puck is at; `presence` is 1 while a tab is active.
  const [pos] = useState(() => new Animated.Value(Math.max(activeIndex, 0)));
  const [presence] = useState(() => new Animated.Value(activeIndex >= 0 ? 1 : 0));
  const [frame, setFrame] = useState({ pos: Math.max(activeIndex, 0), presence: activeIndex >= 0 ? 1 : 0 });

  useEffect(() => {
    const onPos = pos.addListener(({ value }) => setFrame((f) => ({ ...f, pos: value })));
    const onPresence = presence.addListener(({ value }) => setFrame((f) => ({ ...f, presence: value })));
    return () => {
      pos.removeListener(onPos);
      presence.removeListener(onPresence);
    };
  }, [pos, presence]);

  useEffect(() => {
    if (activeIndex >= 0) {
      Animated.parallel([
        Animated.spring(pos, { toValue: activeIndex, stiffness: 190, damping: 19, mass: 1, useNativeDriver: false }),
        Animated.timing(presence, { toValue: 1, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      ]).start();
    } else {
      Animated.timing(presence, { toValue: 0, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
    }
  }, [activeIndex, pos, presence]);

  // Travel progress between two tabs: 0 at rest, 1 halfway.
  const travel = Math.sin(Math.PI * (frame.pos - Math.floor(frame.pos)));
  const cx = frame.pos * slot + slot / 2;
  const nearest = Math.min(count - 1, Math.max(0, Math.round(frame.pos)));
  const PuckIcon = TABS[items[nearest]?.name ?? 'index']!.icon;
  const badgeOnPuck = items[nearest]?.name === 'list' && list.length > 0;

  return (
    <View style={styles.outer} pointerEvents="box-none">
      <View
        style={[styles.bar, { height: barHeight + TOP_PAD }]}
        pointerEvents="box-none"
        accessibilityRole="tablist"
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      >
        {width > 0 ? (
          <>
            <Svg width={width} height={barHeight} style={styles.shape}>
              {/* Page colour behind the bar, so the dip matches the page instead of the app backdrop. */}
              <Rect width={width} height={barHeight} fill={ds.background} />
              <Path
                d={barPath(width, barHeight, cx, DIP_HALF_WIDTH + STRETCH * travel, DIP_DEPTH * frame.presence)}
                fill={ds.foreground}
              />
            </Svg>

            <View
              pointerEvents="none"
              style={[
                styles.puck,
                {
                  left: cx - PUCK / 2,
                  opacity: frame.presence,
                  transform: [{ translateY: -HOP * travel + (1 - frame.presence) * 14 }, { scale: (0.88 + 0.12 * frame.presence) * (1 - 0.06 * travel) }],
                },
              ]}
            >
              <View>
                <PuckIcon size={24} color={ds.green} />
                {badgeOnPuck ? <Text style={styles.count}>{list.length}</Text> : null}
              </View>
            </View>
          </>
        ) : null}

        <View style={styles.items}>
          {items.map((route, i) => {
            const { label, icon: Icon } = TABS[route.name]!;
            const active = i === activeIndex;
            const badge = route.name === 'list' ? list.length : 0;
            // The icon under the puck hides, and comes back as the puck moves away.
            const shown = 1 - frame.presence * (1 - clamp01(Math.abs(frame.pos - i) / 0.6));

            return (
              <Pressable
                key={route.key}
                onPress={() => navigateToTab(route.key)}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                accessibilityLabel={badge ? `${label}, ${badge} items` : label}
                style={styles.item}
              >
                <View style={{ opacity: shown, alignItems: 'center', gap: 4 }}>
                  <View>
                    <Icon size={22} color={ds.mint} />
                    {badge > 0 ? <Text style={styles.count}>{badge}</Text> : null}
                  </View>
                  <Text style={styles.label}>{label}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Pulled up over the page by the puck's rise, with no background and touch-through, so content scrolls
  // behind the puck instead of stopping at a cream band.
  outer: { alignItems: 'center', marginTop: -TOP_PAD },
  bar: { width: '100%', maxWidth: SHELL_MAX_WIDTH, paddingTop: TOP_PAD },
  shape: { position: 'absolute', left: 0, bottom: 0 },
  items: { flex: 1, flexDirection: 'row' },
  item: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 12 },
  label: { fontFamily: fonts.sans, fontSize: 9, color: ds.mint },
  puck: {
    position: 'absolute',
    top: TOP_PAD + 13 - PUCK / 2,
    width: PUCK,
    height: PUCK,
    borderRadius: PUCK / 2,
    backgroundColor: ds.card,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 6px 14px ${ds.primary20}`,
  },
  count: {
    position: 'absolute',
    top: -6,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    overflow: 'hidden',
    textAlign: 'center',
    lineHeight: 16,
    fontFamily: fonts.sansBold,
    fontSize: 9,
    color: ds.card,
    backgroundColor: ds.orange,
  },
});
