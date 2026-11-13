import { Image } from 'expo-image';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CalendarPlus, Check, Clock3, Flame, Heart, ShoppingBasket, UsersRound } from 'lucide-react-native';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { Animated, Easing, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';

import { PText } from '@/components/PText';
import { Button } from '@/components/kit/Button';
import { Checkbox } from '@/components/kit/Checkbox';
import { CategoryTabs } from '@/components/kit/CategoryTabs';
import { useShell } from '@/components/kit/layout';
import { Screen } from '@/components/kit/Screen';
import { Eyebrow, H1, H2, RoundLink, SectionHeading, typography } from '@/components/kit/Typography';
import { usePalengkita } from '@/context/PalengkitaContext';
import { useDishFlight } from '@/components/meals/DishFlight';
import { DetailSkeleton } from '@/components/meals/MealSkeletons';
import { useFirstLoad } from '@/data/loading';
import { prefetchMealImages } from '@/data/prefetch';
import { filterMeals, meals, type Meal } from '@/data/meals';
import { ds, fonts } from '@/theme';

const TABS = [
  { key: 'Ingredients', label: 'Ingredients' },
  { key: 'How to cook', label: 'How to cook' },
];

export default function RecipeRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <Screen>
      <MealDetail mealId={id} />
    </Screen>
  );
}

const PLATE = 240;
const SIDE_SCALE = 0.68;
const SIDE_OPACITY = 0.55;

/** Detail page: a looping carousel of dishes (neighbours peek in at the sides) above the recipe body. */
function MealDetail({ mealId }: { mealId?: string }) {
  const { budget, time, restriction, saved, toggleSaved } = usePalengkita();

  // Same order as the Home / Recipes lists, so swiping walks through what the user was browsing.
  const list = useMemo(() => {
    const filtered = filterMeals(budget, time, restriction);
    return filtered.some((m) => m.id === mealId) ? filtered : meals;
  }, [budget, time, restriction, mealId]);

  const { contentWidth } = useShell();
  const loading = useFirstLoad('recipe', 450);
  const step = Math.round(contentWidth * 0.6);
  // Drag position of the carousel; the text under it follows it, so both move in step.
  const [offset] = useState(() => new Animated.Value(0));
  const [dir, setDir] = useState<-1 | 1>(1);
  const [currentId, setCurrentId] = useState(mealId);
  const [seenParam, setSeenParam] = useState(mealId);
  // A link to a different recipe while this screen is mounted jumps the carousel to it.
  if (mealId !== seenParam) {
    setSeenParam(mealId);
    setCurrentId(mealId);
  }
  const index = Math.max(0, list.findIndex((m) => m.id === currentId));
  const meal = list[index] ?? list[0];

  const onChange = useCallback(
    (next: number, swipe: -1 | 1) => {
      const id = list[next]?.id;
      if (!id) return;
      setDir(swipe);
      setCurrentId(id);
      setSeenParam(id);
      // After the swipe has been drawn, so the route update can't steal a frame from it.
      setTimeout(() => router.setParams({ id }), 60);
    },
    [list],
  );

  if (!meal) {
    return (
      <View style={styles.notFound}>
        <H1>Recipe not found</H1>
        <Link href="/recipes" style={styles.notFoundLink}>
          Back to recipes
        </Link>
      </View>
    );
  }

  const isSaved = saved.includes(meal.id);

  return (
    <View>
      <View style={styles.actions}>
        <RoundLink href="/recipes" icon={ArrowLeft} iconSize={21} label="Back to recipes" />
        <Text style={styles.actionsLabel}>LUTONG BAHAY</Text>
        <Button
          variant="outline"
          size="icon"
          icon={Heart}
          iconFilled={isSaved}
          accessibilityLabel="Save recipe"
          onPress={() => toggleSaved(meal.id)}
        />
      </View>

      <DishCarousel list={list} index={index} onChange={onChange} offset={offset} step={step} />

      {loading ? <DetailSkeleton /> : <MealBody meal={meal} offset={offset} step={step} dir={dir} />}
    </View>
  );
}

/**
 * Swipeable, looping dish picker. Dishes roll like wheels (one full turn per step) while neighbours
 * scale down and fade; they animate to centre as you swipe.
 */
function DishCarousel({
  list,
  index,
  onChange,
  offset,
  step,
}: {
  list: Meal[];
  index: number;
  onChange: (i: number, dir: -1 | 1) => void;
  offset: Animated.Value;
  step: number;
}) {
  const { contentWidth } = useShell();
  const n = list.length;
  const { flight, land, end } = useDishFlight();
  const plateRef = useRef<ComponentRef<typeof View>>(null);
  // The tapped card's dish is flying to this plate: measure where it lands, and keep the real plate
  // hidden until the flying copy arrives.
  const claiming = !!flight && flight.id === list[index]?.id;

  useEffect(() => {
    if (!claiming) return;
    const timer = setTimeout(() => {
      plateRef.current?.measureInWindow((x, y, width, height) => (width > 0 ? land({ x, y, width, height }) : end()));
    }, 80);
    return () => clearTimeout(timer);
  }, [claiming, land, end]);

  // Warm the photos a few swipes away in both directions.
  useEffect(() => {
    const near: Meal[] = [];
    for (let d = 1; d <= 3; d++) {
      const next = list[(index + d) % n];
      const prev = list[(((index - d) % n) + n) % n];
      if (next) near.push(next);
      if (prev) near.push(prev);
    }
    prefetchMealImages(near);
  }, [index, list, n]);
  const busy = useRef(false);
  const live = useRef({ index, n, step, onChange });
  useEffect(() => {
    live.current = { index, n, step, onChange };
  });

  // Reset the drag offset in the same frame the new index is drawn. Resetting it earlier makes the
  // dishes snap back to their old positions for a frame before the new meal renders.
  useLayoutEffect(() => {
    offset.setValue(0);
    busy.current = false;
  }, [index, offset]);

  const settle = useCallback(
    (dir: -1 | 0 | 1) => {
      // dir 1 = go to next dish (content moves left), -1 = previous.
      const { index: i, n: count, step: s, onChange: change } = live.current;
      if (dir === 0 || count < 2) {
        Animated.spring(offset, { toValue: 0, useNativeDriver: true, bounciness: 6 }).start();
        return;
      }
      busy.current = true;
      Animated.timing(offset, {
        toValue: -dir * s,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        // The offset is reset in the layout effect below, once React has drawn the new meal.
        change((i + dir + count) % count, dir);
      });
    },
    [offset],
  );

  // Refs are only read inside the gesture callbacks, never during render.
  // eslint-disable-next-line react-hooks/refs
  const [pan] = useState(() =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) =>
          !busy.current && live.current.n > 1 && Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy) * 1.2,
        onPanResponderMove: (_, g) => {
          const s = live.current.step;
          offset.setValue(Math.max(-s, Math.min(s, g.dx)));
        },
        onPanResponderRelease: (_, g) => {
          const s = live.current.step;
          if (g.dx < -s * 0.25 || g.vx < -0.5) settle(1);
          else if (g.dx > s * 0.25 || g.vx > 0.5) settle(-1);
          else settle(0);
        },
        onPanResponderTerminate: () => settle(0),
      }),
  );

  // Two slides on each side, so the dish that scrolls into the peeking slot is already on its way in.
  const slots = n > 1 ? [-2, -1, 0, 1, 2] : [0];
  // Unique ids keep each slide mounted (no image reload); with fewer meals slots repeat, so key by slot.
  const stableKeys = n >= slots.length;
  // Look of a slide `d` steps from the centre.
  const scaleAt = (d: number) => (Math.abs(d) < 1 ? 1 - (1 - SIDE_SCALE) * Math.abs(d) : SIDE_SCALE);
  const opacityAt = (d: number) => {
    const a = Math.abs(d);
    return a < 1 ? 1 - (1 - SIDE_OPACITY) * a : Math.max(0, SIDE_OPACITY * (2 - a));
  };

  return (
    <View
      style={[styles.carousel, { width: contentWidth }, { touchAction: 'pan-y' } as object]}
      accessibilityRole="adjustable"
      accessibilityLabel="Swipe to browse other meals"
      {...pan.panHandlers}
    >
      {slots.map((k) => {
        const item = list[(index + k + n) % n]!;
        // Offsets -step / 0 / +step put this slide at k-1 / k / k+1 steps from the centre.
        const inputRange = [-step, 0, step];
        const scale = offset.interpolate({ inputRange, outputRange: [scaleAt(k - 1), scaleAt(k), scaleAt(k + 1)], extrapolate: 'clamp' });
        const opacity = offset.interpolate({ inputRange, outputRange: [opacityAt(k - 1), opacityAt(k), opacityAt(k + 1)], extrapolate: 'clamp' });
        // Rolling: one full turn per step travelled (at rest every slot is a whole number of turns).
        const rotate = offset.interpolate({
          inputRange,
          outputRange: [(k - 1) * 360, k * 360, (k + 1) * 360].map((deg) => `${deg}deg`),
        });
        return (
          <Animated.View
            key={stableKeys ? item.id : `slot${k}`}
            ref={k === 0 ? plateRef : undefined}
            pointerEvents={Math.abs(k) > 1 ? 'none' : 'auto'}
            style={[styles.slide, { opacity, transform: [{ translateX: Animated.add(offset, k * step) }, { scale }, { rotate }] }]}
          >
            <Pressable
              disabled={k === 0}
              onPress={() => settle(k as 1 | -1)}
              accessibilityRole={k === 0 ? 'image' : 'button'}
              accessibilityLabel={k === 0 ? item.name : `Show ${item.name}`}
              style={[styles.plated, k === 0 && claiming && { opacity: 0 }]}
            >
              <Image source={item.image} contentFit="contain" accessibilityLabel={item.name} style={styles.plateImage} />
            </Pressable>
          </Animated.View>
        );
      })}
    </View>
  );
}

/**
 * Everything under the carousel. It follows the swipe: while you drag it slides a short way in the
 * swipe direction and fades out; when the next meal lands it slides in from the opposite side.
 */
const TEXT_SHIFT = 36;

function MealBody({ meal, offset, step, dir }: { meal: Meal; offset: Animated.Value; step: number; dir: -1 | 1 }) {
  const [enter] = useState(() => new Animated.Value(1));
  const firstRender = useRef(true);

  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // New meal just landed (offset is back at 0): start hidden, off to the side it came from, then settle in.
    enter.setValue(0);
    Animated.timing(enter, { toValue: 1, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [meal.id, enter]);

  const inputRange = [-step, 0, step];
  const dragFade = offset.interpolate({ inputRange, outputRange: [0, 1, 0], extrapolate: 'clamp' });
  const dragShift = offset.interpolate({ inputRange, outputRange: [-TEXT_SHIFT, 0, TEXT_SHIFT], extrapolate: 'clamp' });
  const enterShift = enter.interpolate({ inputRange: [0, 1], outputRange: [dir * TEXT_SHIFT, 0] });

  return (
    <Animated.View
      style={{
        opacity: Animated.multiply(dragFade, enter),
        transform: [{ translateX: Animated.add(dragShift, enterShift) }],
      }}
    >
      <MealContent key={meal.id} meal={meal} />
    </Animated.View>
  );
}

/** Keyed by meal so tab, "added" and checked state reset per recipe. */
function MealContent({ meal }: { meal: Meal }) {
  const { addMeal } = usePalengkita();
  const { compact, contentWidth } = useShell();
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState('Ingredients');
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const columns = compact ? 2 : 3;
  const cardWidth = Math.floor((contentWidth - 8 * (columns - 1)) / columns);

  return (
    <View>
      <View style={{ alignItems: 'center' }}>
        <Eyebrow small center>
          {meal.tag}
        </Eyebrow>
        <H1 size={33} style={{ textAlign: 'center' }}>
          {meal.name}
        </H1>
        <Text style={styles.subtitle}>{meal.subtitle}</Text>
        <PText style={styles.price}>
          {`₱${meal.price} `}
          <Text style={styles.priceNote}>/ serving · estimated</Text>
        </PText>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Clock3 size={16} color={ds.foreground} />
          <Text style={styles.statText}>{`${meal.minutes} min`}</Text>
        </View>
        <View style={styles.stat}>
          <Flame size={16} color={ds.foreground} />
          <Text style={styles.statText}>{`${meal.calories} kcal`}</Text>
        </View>
        <View style={styles.stat}>
          <UsersRound size={16} color={ds.foreground} />
          <Text style={styles.statText}>2 servings</Text>
        </View>
      </View>

      {meal.allergens.length > 0 ? (
        <Text style={styles.allergens}>{`Contains: ${meal.allergens.join(', ').toLowerCase()}`}</Text>
      ) : null}

      <CategoryTabs tabs={TABS} selected={tab} onSelect={setTab} />

      {tab === 'Ingredients' ? (
        <>
          <SectionHeading trailing={<Text style={typography.muted}>For 2 people</Text>}>
            <H2>What you’ll need</H2>
          </SectionHeading>
          <View style={styles.grid}>
            {meal.ingredients.map((i) => {
              const on = !!checked[i.name];
              return (
                <Pressable
                  key={i.name}
                  onPress={() => setChecked((c) => ({ ...c, [i.name]: !on }))}
                  accessibilityRole="checkbox"
                  accessibilityLabel={`${i.name}, ${i.amount}`}
                  accessibilityState={{ checked: on }}
                  style={[styles.card, { width: cardWidth }, on && styles.cardOn]}
                >
                  <Checkbox checked={on} size={14} style={styles.cardCheck} />
                  <Text style={styles.emoji}>{i.emoji}</Text>
                  <Text style={styles.ingName}>{i.name}</Text>
                  <Text style={styles.ingAmount}>{i.amount}</Text>
                  <PText style={styles.ingPrice}>{`~₱${i.price}`}</PText>
                </Pressable>
              );
            })}
          </View>
        </>
      ) : (
        <View>
          {meal.steps.map((s, i) => (
            <View key={s} style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{s}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={typography.estimateNote}>Prices are sample estimates and may vary by market.</Text>

      <View style={{ gap: 10 }}>
        <Button
          size="lg"
          icon={added ? Check : ShoppingBasket}
          label={added ? 'Added to My List' : 'Add ingredients to My List'}
          style={{ height: 46 }}
          onPress={() => {
            addMeal(meal);
            setAdded(true);
          }}
        />
        <Button variant="outline" href="/schedule" icon={CalendarPlus} label="Add to schedule" style={{ height: 42 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  notFound: { alignItems: 'center', paddingVertical: 55, gap: 14 },
  notFoundLink: { fontFamily: fonts.sans, fontSize: 14, color: ds.foreground },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actionsLabel: { fontFamily: fonts.sans, fontSize: 10, color: ds.foreground },
  carousel: { height: PLATE, marginTop: 20, marginBottom: 26, overflow: 'hidden', alignItems: 'center' },
  slide: { position: 'absolute', top: 0, width: PLATE, height: PLATE },
  plated: {
    width: PLATE,
    height: PLATE,
    borderRadius: PLATE / 2,
    backgroundColor: ds.butter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plateImage: { width: PLATE - 10, height: PLATE - 10 },
  subtitle: { fontFamily: fonts.sans, fontSize: 12, color: ds.mutedForeground, marginTop: 8, textAlign: 'center' },
  price: { fontFamily: fonts.sansSemiBold, fontSize: 24, color: ds.foreground, marginTop: 14 },
  priceNote: { fontFamily: fonts.sans, fontSize: 11, color: ds.mutedForeground },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 20,
    marginTop: 20,
    marginBottom: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: ds.border,
  },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  statText: { fontFamily: fonts.sans, fontSize: 12, color: ds.foreground },
  allergens: { fontFamily: fonts.sans, fontSize: 11, color: ds.mutedForeground, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  card: {
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: ds.border,
    borderRadius: 8,
    backgroundColor: ds.card,
  },
  cardOn: { backgroundColor: ds.mint, borderColor: ds.green },
  cardCheck: { position: 'absolute', top: 6, right: 6 },
  emoji: { fontSize: 37, height: 55, lineHeight: 55 },
  ingName: { fontFamily: fonts.sansMedium, fontSize: 11, color: ds.foreground, textAlign: 'center' },
  ingAmount: { fontFamily: fonts.sans, fontSize: 10, color: ds.mutedForeground, marginTop: 4, textAlign: 'center' },
  ingPrice: { fontFamily: fonts.sans, fontSize: 10, color: ds.foreground, marginTop: 8 },
  step: { flexDirection: 'row', gap: 15, marginVertical: 20 },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: ds.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: { fontFamily: fonts.sans, fontSize: 14, color: ds.foreground },
  stepText: { flex: 1, fontFamily: fonts.sans, fontSize: 13, lineHeight: 22, color: ds.foreground },
});
