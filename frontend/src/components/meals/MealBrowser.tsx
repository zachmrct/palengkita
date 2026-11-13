import { Image } from 'expo-image';
import { Link } from 'expo-router';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Leaf,
  Moon,
  Search,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Sunrise,
  UsersRound,
  Wallet,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Slider from '@react-native-community/slider';

import { PText } from '@/components/PText';
import { Button } from '@/components/kit/Button';
import { CategoryTabs } from '@/components/kit/CategoryTabs';
import { useShell } from '@/components/kit/layout';
import { PinnedScreen } from '@/components/kit/Screen';
import { Select } from '@/components/kit/Select';
import { Em, Eyebrow, Greeting, H2, RoundLink, SectionHeading, TextLink } from '@/components/kit/Typography';
import { useAuth } from '@/context/AuthContext';
import { usePalengkita } from '@/context/PalengkitaContext';
import { filterMeals, meals } from '@/data/meals';
import { useFirstLoad } from '@/data/loading';
import { prefetchMealImages } from '@/data/prefetch';
import { ds, fonts } from '@/theme';

import { MealCard, MealRowCard, ROW_CARD_HEIGHT } from './MealCard';
import { GridSkeleton, RowCardSkeleton } from './MealSkeletons';

const TIME_OPTIONS = [
  { label: '20 minutes', value: 20 },
  { label: '30 minutes', value: 30 },
  { label: 'Up to 1 hour', value: 60 },
];

export const RESTRICTION_OPTIONS = [
  { label: 'No restrictions', value: '' },
  ...['Pork', 'Shellfish', 'Egg', 'Soy'].map((x) => ({ label: `No ${x.toLowerCase()}`, value: x })),
];

const TABS = [
  { key: 'All', label: 'For you' },
  { key: 'Breakfast', label: 'Breakfast', icon: Sunrise },
  { key: 'Lunch', label: 'Lunch', icon: Sun },
  { key: 'Dinner', label: 'Dinner', icon: Moon },
];

/** 2-column recipe grid (`.meal-grid`): 12px columns, 22px rows. */
export function MealGrid({ items }: { items: typeof meals }) {
  const { contentWidth } = useShell();
  const cardWidth = Math.floor((contentWidth - 12) / 2);
  return (
    <View style={styles.grid}>
      {items.map((meal, i) => (
        <MealCard key={meal.id} meal={meal} index={i} width={cardWidth} />
      ))}
    </View>
  );
}

const ROW_GAP = 16;
const STRIDE = ROW_CARD_HEIGHT + ROW_GAP;
/** Space kept between the pinned header and the pile of cards. */
const PIN_GAP = 12;
/** How far a buried card peeks out above the one covering it. */
const PEEK = 10;

/**
 * One card of the Home stack. Once it reaches the pinned header (`pinAt` = scroll offset where that
 * happens) it stops scrolling and the next cards slide over it; as it gets buried it shrinks and fades.
 */
function StackedCard({ meal, index, scrollY, pinAt }: { meal: (typeof meals)[number]; index: number; scrollY: Animated.Value; pinAt: number }) {
  const at = [0, 1, 2, 3].map((d) => pinAt + d * STRIDE);
  const translateY = scrollY.interpolate({
    inputRange: at,
    outputRange: [0, STRIDE - PEEK, 2 * STRIDE - 2 * PEEK, 3 * STRIDE - 2 * PEEK],
    extrapolateLeft: 'clamp',
    extrapolateRight: 'extend',
  });
  const scale = scrollY.interpolate({ inputRange: at, outputRange: [1, 0.95, 0.9, 0.9], extrapolate: 'clamp' });
  const opacity = scrollY.interpolate({ inputRange: at, outputRange: [1, 1, 0.55, 0], extrapolate: 'clamp' });

  return (
    <Animated.View style={{ zIndex: index, height: ROW_CARD_HEIGHT, opacity, transform: [{ translateY }, { scale }] }}>
      <MealRowCard meal={meal} index={index} />
    </Animated.View>
  );
}

/** Home (`home`) and Recipes share this: greeting, search, filters, recommendations. */
export function MealBrowser({ home = false }: { home?: boolean }) {
  const { budget, setBudget, time, setTime, restriction, setRestriction } = usePalengkita();
  const { user } = useAuth();
  const { compact, padX } = useShell();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [filters, setFilters] = useState(false);
  const [scrollY] = useState(() => new Animated.Value(0));
  const [stackY, setStackY] = useState<number | null>(null);
  const [pinnedH, setPinnedH] = useState<number | null>(null);
  const loading = useFirstLoad(home ? 'home' : 'recipes');

  // Warm every meal photo once, so opening a recipe and swiping its carousel never waits on an image.
  useEffect(() => prefetchMealImages(meals), []);

  const results = filterMeals(budget, time, restriction, query, category);
  const firstName = (user?.name ?? 'Kaibigan').split(' ')[0] ?? 'Kaibigan';
  const nextMeal = meals.find((m) => m.id === 'torta');

  const greeting = (
    <Greeting
      icon={Sunrise}
      iconSize={17}
      eyebrow={`MAGANDANG UMAGA, ${firstName.toUpperCase()}`}
      title={
        home ? (
          <>
            Anong luto <Em>natin?</Em>
          </>
        ) : (
          <>
            A little inspiration.{'\n'}
            <Em>A lot of sarap.</Em>
          </>
        )
      }
      subtitle={home ? 'Masarap na ulam. Swak sa budget. Para sa’yo.' : 'Your next lutong-bahay favorite is right here.'}
    />
  );

  const banner = (
    <View style={styles.banner}>
      <View style={styles.bannerTitle}>
        <View style={styles.wallet}>
          <Wallet size={22} color={ds.foreground} />
        </View>
        <View>
          <Text style={styles.bannerLabel}>Your daily food budget</Text>
          <PText style={styles.bannerAmount}>
            {`₱${budget * 3}`}
            <Text style={styles.bannerPer}>{' / day'}</Text>
          </PText>
        </View>
      </View>
      <Link href="/profile" asChild>
        <Pressable accessibilityRole="link" accessibilityLabel="Edit budget" style={styles.bannerEdit}>
          <ArrowUpRight size={22} color={ds.foreground} />
        </Pressable>
      </Link>
      <View style={styles.bannerBottom}>
        <View style={styles.bannerItem}>
          <UsersRound size={12} color={ds.foreground} />
          <Text style={styles.bannerText}>2 people</Text>
        </View>
        <View style={styles.bannerItem}>
          <Leaf size={12} color={ds.foreground} />
          <Text style={styles.bannerText}>{restriction ? `No ${restriction.toLowerCase()}` : 'Balanced meals'}</Text>
        </View>
        {compact ? null : (
          <View style={styles.bannerItem}>
            <Check size={12} color={ds.green} />
            <Text style={[styles.bannerText, { color: ds.green, fontSize: 8 }]}>Let’s make it sulit</Text>
          </View>
        )}
      </View>
    </View>
  );

  const searchAndFilters = (
    <>
      <View style={styles.searchRow}>
        <View style={styles.searchField}>
          <Search size={19} color={ds.mutedForeground} />
          <TextInput
            accessibilityLabel="Search recipes"
            placeholder="Anong craving mo today?"
            placeholderTextColor={ds.mutedForeground}
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
          />
        </View>
        <Button
          variant="outline"
          size="icon"
          icon={SlidersHorizontal}
          accessibilityLabel="Meal filters"
          onPress={() => setFilters(!filters)}
          style={styles.filterButton}
        />
      </View>

      {filters ? (
        <View style={styles.filterPanel}>
          <View style={styles.filterField}>
            <PText style={styles.filterLabel}>
              {'Budget per serving '}
              <PText style={styles.filterValue}>{`₱${budget}`}</PText>
            </PText>
            <Slider
              accessibilityLabel="Budget per serving"
              minimumValue={30}
              maximumValue={200}
              step={5}
              value={budget}
              onValueChange={setBudget}
              minimumTrackTintColor={ds.green}
              maximumTrackTintColor={ds.border}
              thumbTintColor={ds.green}
              style={styles.slider}
            />
          </View>
          <View style={styles.filterField}>
            <Text style={styles.filterLabel}>Cooking time</Text>
            <Select label="Cooking time" value={time} options={TIME_OPTIONS} onChange={setTime} />
          </View>
          <View style={styles.filterField}>
            <Text style={styles.filterLabel}>Dietary restriction</Text>
            <Select label="Dietary restriction" value={restriction} options={RESTRICTION_OPTIONS} onChange={setRestriction} />
          </View>
        </View>
      ) : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.quickScroll}
        contentContainerStyle={styles.quickRow}
        keyboardShouldPersistTaps="handled"
      >
        <Button
          variant="outline"
          icon={Wallet}
          iconRight={ChevronDown}
          iconSize={13}
          label={`Under ₱${budget}`}
          onPress={() => setFilters(!filters)}
          style={styles.quickChip}
          labelStyle={styles.quickLabel}
        />
        <Button
          variant="outline"
          icon={Clock3}
          iconSize={13}
          label={time === 30 ? '30 min or less' : 'Quick & easy'}
          onPress={() => setTime(time === 30 ? 60 : 30)}
          style={styles.quickChip}
          labelStyle={styles.quickLabel}
        />
        <Button
          variant="outline"
          icon={Leaf}
          iconRight={ChevronDown}
          iconSize={13}
          label="Dietary"
          onPress={() => setFilters(!filters)}
          style={styles.quickChip}
          labelStyle={styles.quickLabel}
        />
      </ScrollView>
    </>
  );

  const heading = (
    <SectionHeading trailing={home ? <TextLink href="/recipes" label="View all" /> : undefined}>
      <Eyebrow icon={Sparkles} iconSize={13} small>
        A LITTLE PERSONALIZED, A LOT OF SARAP
      </Eyebrow>
      <H2>{home ? 'Lutong bagay sa’yo' : 'Find your next ulam'}</H2>
    </SectionHeading>
  );

  const empty =
    !loading && results.length === 0 ? (
      <View style={styles.empty}>
        <Leaf size={24} color={ds.foreground} />
        <Text style={styles.emptyTitle}>No matching meals just yet</Text>
        <Text style={styles.emptyBody}>Try a larger budget or more cooking time.</Text>
        <Button
          label="Reset filters"
          onPress={() => {
            setBudget(100);
            setTime(60);
            setRestriction('');
            setQuery('');
            setCategory('All');
          }}
        />
      </View>
    ) : null;

  if (!home) {
    return (
      <>
        {greeting}
        {searchAndFilters}
        <View style={{ marginTop: 28 }}>
          {heading}
          <CategoryTabs tabs={TABS} selected={category} onSelect={setCategory} />
          {loading ? <GridSkeleton /> : <MealGrid items={results.slice(0, 20)} />}
          {empty}
        </View>
      </>
    );
  }

  const schedule = (
    <View style={styles.schedule}>
      <SectionHeading trailing={<RoundLink href="/schedule" icon={ArrowUpRight} label="Open meal schedule" />}>
        <Eyebrow icon={CalendarDays} iconSize={14} small>
          PLAN A LITTLE, EAT BETTER
        </Eyebrow>
        <H2>Good food, on your time.</H2>
      </SectionHeading>

      <View style={styles.days}>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
          <Link key={i} href="/schedule" asChild>
            <Pressable accessibilityRole="link" style={StyleSheet.flatten([styles.day, i === 3 && styles.dayActive])}>
              <Text style={[styles.dayName, i === 3 && styles.dayActiveText]}>{day}</Text>
              <Text style={[styles.dayNumber, i === 3 && styles.dayActiveText]}>{i + 9}</Text>
              {i === 3 ? <View style={styles.dayDot} /> : null}
            </Pressable>
          </Link>
        ))}
      </View>

      <View style={styles.nextMeal}>
        {nextMeal ? (
          <Image source={nextMeal.image} contentFit="contain" accessibilityLabel="Tortang Talong" style={styles.nextImage} />
        ) : null}
        <View style={{ flex: 1 }}>
          <Text style={styles.nextEyebrow}>TONIGHT’S DINNER · 6:30 PM</Text>
          <Text style={styles.nextTitle}>Tortang Talong</Text>
          <PText style={styles.nextMeta}>20 min · ₱30 / serving</PText>
        </View>
        <Link href="/schedule" asChild>
          <Pressable accessibilityRole="link" accessibilityLabel="View dinner schedule">
            <ArrowRight size={20} color={ds.foreground} />
          </Pressable>
        </Link>
      </View>
    </View>
  );

  const stack = results.slice(0, 6);
  const ready = stackY !== null && pinnedH !== null;
  const pad = { paddingHorizontal: padX };

  // Direct children of the scroll view: index 1 (heading + tabs) is the one that pins.
  return (
    <PinnedScreen scrollY={scrollY} stickyHeaderIndices={[1]}>
      <View key="top" style={[pad, { paddingTop: 26, paddingBottom: 28 }]}>
        {greeting}
        {schedule}
        {banner}
        {searchAndFilters}
      </View>

      <View key="pinned" style={[pad, styles.pinned]} onLayout={(e) => setPinnedH(e.nativeEvent.layout.height)}>
        {heading}
        <CategoryTabs tabs={TABS} selected={category} onSelect={setCategory} style={{ marginBottom: 12 }} />
      </View>

      <View key="stack" style={pad} onLayout={(e) => setStackY(e.nativeEvent.layout.y)}>
        <View style={styles.stack}>
          {loading
            ? [0, 1, 2].map((i) => <RowCardSkeleton key={i} />)
            : stack.map((meal, i) => (
            <StackedCard
              key={meal.id}
              meal={meal}
              index={i}
              scrollY={scrollY}
              pinAt={ready ? stackY + i * STRIDE - pinnedH - PIN_GAP : 1e7 + i * STRIDE}
            />
              ))}
        </View>
        {empty}
      </View>

      <View key="rest" style={[pad, { paddingTop: 23, paddingBottom: 28 }]}>
        <Link href="/markets" asChild>
          <Pressable accessibilityRole="link" style={styles.strip}>
            <Text style={styles.stripEmoji}>🥬</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.stripTitle}>Fresh finds, closer to home.</Text>
              <Text style={styles.stripBody}>Explore your neighborhood palengke</Text>
            </View>
            <ArrowUpRight size={21} color={ds.foreground} />
          </Pressable>
        </Link>

        <Text style={styles.footer}>Gawang may malasakit. Lutong may pagmamahal.</Text>
        <Text style={styles.footerMark}>✳</Text>
      </View>
    </PinnedScreen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 12, rowGap: 22 },
  stack: { gap: ROW_GAP, overflow: 'hidden' },
  pinned: { paddingTop: 10, backgroundColor: ds.background },

  banner: {
    backgroundColor: ds.mint,
    paddingTop: 17,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 23,
  },
  bannerTitle: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  wallet: { width: 37, height: 37, borderRadius: 19, backgroundColor: ds.card, alignItems: 'center', justifyContent: 'center' },
  bannerLabel: { fontFamily: fonts.sans, fontSize: 10, color: ds.mutedForeground },
  bannerAmount: { fontFamily: fonts.serif, fontSize: 28, lineHeight: 36, color: ds.foreground },
  bannerPer: { fontFamily: fonts.sans, fontSize: 12, color: ds.mutedForeground },
  bannerEdit: {
    position: 'absolute',
    right: 15,
    top: 22,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: ds.primary20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
    borderTopWidth: 1,
    borderTopColor: ds.primary13,
    marginTop: 13,
    paddingVertical: 12,
  },
  bannerItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  bannerText: { fontFamily: fonts.sans, fontSize: 9, color: ds.foreground },

  searchRow: { flexDirection: 'row', gap: 10 },
  searchField: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ds.border,
    backgroundColor: ds.card,
  },
  searchInput: { flex: 1, fontFamily: fonts.sans, fontSize: 12, color: ds.foreground, padding: 0 },
  filterButton: { width: 48, height: 48, backgroundColor: ds.butter },

  filterPanel: { paddingVertical: 20, gap: 16 },
  filterField: { gap: 7 },
  filterLabel: { fontFamily: fonts.sans, fontSize: 12, color: ds.foreground },
  filterValue: { fontFamily: fonts.sansBold },
  slider: { width: '100%', height: 24 },

  quickScroll: { flexGrow: 0, marginTop: 12 },
  quickRow: { gap: 6 },
  quickChip: { height: 31, borderRadius: 20, paddingHorizontal: 10, gap: 5, backgroundColor: 'transparent', boxShadow: 'none' },
  quickLabel: { fontSize: 9 },

  empty: { alignItems: 'center', paddingVertical: 55, paddingHorizontal: 15, gap: 14 },
  emptyTitle: { fontFamily: fonts.sansSemiBold, fontSize: 16, color: ds.foreground },
  emptyBody: { fontFamily: fonts.sans, fontSize: 12, color: ds.mutedForeground },

  schedule: {
    marginBottom: 23,
    paddingBottom: 26,
    borderBottomWidth: 1,
    borderColor: ds.border,
  },
  days: { flexDirection: 'row', justifyContent: 'space-between', gap: 6, marginVertical: 20 },
  day: {
    width: 44,
    minWidth: 32,
    flexShrink: 1,
    height: 66,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dayActive: { backgroundColor: ds.foreground },
  dayName: { fontFamily: fonts.sans, fontSize: 10, color: ds.mutedForeground },
  dayNumber: { fontFamily: fonts.sansMedium, fontSize: 15, color: ds.foreground },
  dayActiveText: { color: ds.primaryForeground },
  dayDot: { position: 'absolute', bottom: 6, width: 3, height: 3, borderRadius: 2, backgroundColor: ds.orange },
  nextMeal: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  nextImage: { width: 70, height: 70, borderRadius: 35, backgroundColor: ds.butter },
  nextEyebrow: { fontFamily: fonts.sans, fontSize: 8, color: ds.green },
  nextTitle: { fontFamily: fonts.sansSemiBold, fontSize: 15, color: ds.foreground, marginTop: 5 },
  nextMeta: { fontFamily: fonts.sans, fontSize: 10, color: ds.mutedForeground, marginTop: 4 },

  strip: {
    marginTop: 23,
    paddingVertical: 15,
    paddingHorizontal: 12,
    backgroundColor: ds.butter,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 8,
  },
  stripEmoji: { fontSize: 27 },
  stripTitle: { fontFamily: fonts.serif, fontSize: 18, color: ds.foreground },
  stripBody: { fontFamily: fonts.sans, fontSize: 9, color: ds.mutedForeground, marginTop: 4 },

  footer: { fontFamily: fonts.sans, fontSize: 9, color: ds.mutedForeground, textAlign: 'center', marginTop: 28 },
  footerMark: { fontSize: 22, color: ds.orange, textAlign: 'center', marginTop: 13 },
});
