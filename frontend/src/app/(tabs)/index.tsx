import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Heading } from '@/components/Heading';
import { SearchIcon, SlidersIcon } from '@/components/icons';
import { PText } from '@/components/PText';
import { SectionHeader } from '@/components/ui';
import {
  BudgetSheet,
  LocationBanner,
  LocationPill,
  LocationSheet,
} from '@/components/home/LocationParts';
import {
  FilterChip,
  MARKET_FILTERS,
  MarketCard,
  type MarketFilter,
} from '@/components/home/MarketParts';
import { BasketCard, PriceSnapshotCard, SampleStamp } from '@/components/home/PriceParts';
import { MINI_CARD_WIDTH, MiniRecipeCard, TodaysPickCard } from '@/components/home/RecipeCards';
import { markets, recipes, todaysPick, type Recipe } from '@/data/mock';
import { useUserLocation } from '@/hooks/useUserLocation';
import { fonts, MAX_CONTENT_WIDTH, palette, SCREEN_PADDING } from '@/theme';

const matches = (query: string, ...fields: string[]) =>
  fields.some((f) => f.toLowerCase().includes(query));

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { location, requestDeviceLocation, setManualLocation } = useUserLocation();

  const [budget, setBudget] = useState(300);
  const [people, setPeople] = useState(4);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<MarketFilter>('all');
  const [comparing, setComparing] = useState<string[]>([]);
  const [locationOpen, setLocationOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);

  const q = query.trim().toLowerCase();

  const openRecipe = (recipe: Recipe) =>
    router.push({ pathname: '/recipe/[id]', params: { id: recipe.id, servings: String(people) } });

  const goMarkets = () => router.navigate('/markets');

  const recipeMatches = (r: Recipe) =>
    !q || matches(q, r.title, r.protein, ...r.tags, ...r.ingredients.map((i) => i.name));

  const showPick = recipeMatches(todaysPick);
  const carousel = useMemo(
    () => recipes.filter((r) => r.id !== todaysPick.id && recipeMatches(r)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [q],
  );
  const visibleMarkets = markets.filter(
    (m) => (filter === 'all' || m.kind === filter) && (!q || matches(q, m.name, m.address, m.kind)),
  );
  const nothingFound = !!q && !showPick && carousel.length === 0 && visibleMarkets.length === 0;

  const toggleCompare = (id: string) =>
    setComparing((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  const showBanner = location.status === 'idle' || location.status === 'requesting' || location.status === 'denied';

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 12, paddingBottom: 28 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>
          <LocationPill location={location} onPress={() => setLocationOpen(true)} />

          {showBanner ? (
            <LocationBanner
              location={location}
              onAllow={requestDeviceLocation}
              onManual={() => setLocationOpen(true)}
            />
          ) : null}

          {/* Search */}
          <View style={styles.searchRow}>
            <View style={styles.search}>
              <SearchIcon size={19} color={palette.muted} strokeWidth={2} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search recipes, sangkap, markets"
                placeholderTextColor={palette.placeholder}
                returnKeyType="search"
                autoCorrect={false}
                accessibilityLabel="Search recipes, sangkap, markets"
                style={styles.searchInput}
              />
              {query ? (
                <Pressable
                  onPress={() => setQuery('')}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel="Clear search"
                >
                  <Text style={styles.clear}>{'✕'}</Text>
                </Pressable>
              ) : null}
            </View>
            <Pressable
              onPress={() => setBudgetOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="Budget and people filters"
              style={({ pressed }) => [styles.filterBtn, pressed && { opacity: 0.85 }]}
            >
              <SlidersIcon size={19} color="#fff" strokeWidth={2} />
            </Pressable>
          </View>

          {/* Heading + budget */}
          <View style={styles.headingWrap}>
            <Heading lead="Ano'ng lulutuin" accent="ngayon?" stacked size={31} />
          </View>
          <View style={styles.budgetRow}>
            <PText style={styles.budgetText}>
              Budget today <PText style={styles.budgetStrong}>{`₱${budget}`}</PText>
              {` · ${people} ${people === 1 ? 'person' : 'people'}`}
            </PText>
            <Pressable
              onPress={() => setBudgetOpen(true)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Edit budget and people"
            >
              <Text style={styles.edit}>Edit</Text>
            </Pressable>
          </View>

          {showPick ? (
            <TodaysPickCard
              recipe={todaysPick}
              budget={budget}
              people={people}
              onOpen={() => openRecipe(todaysPick)}
            />
          ) : null}

          {nothingFound ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Walang nahanap</Text>
              <Text style={styles.emptyText}>
                Nothing matches &ldquo;{query.trim()}&rdquo;. Try monggo, talong or palengke.
              </Text>
            </View>
          ) : null}
        </View>

        {/* What can I cook today? (carousel bleeds to the edges) */}
        {carousel.length > 0 ? (
          <View style={[styles.section, styles.carouselSection]}>
            <View style={styles.inner}>
              <SectionHeader
                title="What can I cook today?"
                action="See all"
                onAction={() => router.navigate('/recipes')}
                subtitle={`Under ₱250 · using monggo, itlog, bigas you have`}
              />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carousel}
              snapToInterval={MINI_CARD_WIDTH + 14}
              decelerationRate="fast"
            >
              {carousel.map((recipe) => (
                <MiniRecipeCard key={recipe.id} recipe={recipe} onOpen={() => openRecipe(recipe)} />
              ))}
            </ScrollView>
          </View>
        ) : null}

        <View style={styles.inner}>
          {/* Malapit sa 'yo */}
          {visibleMarkets.length > 0 || filter !== 'all' ? (
            <View style={styles.section}>
              <SectionHeader title="Malapit sa 'yo" action="See map" onAction={goMarkets} />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRow}
                style={styles.chipScroll}
              >
                {MARKET_FILTERS.map((f) => (
                  <FilterChip
                    key={f.key}
                    label={f.label}
                    selected={filter === f.key}
                    onPress={() => setFilter(f.key)}
                  />
                ))}
              </ScrollView>

              {visibleMarkets.length === 0 ? (
                <Text style={styles.noMarkets}>No {filter} matches nearby.</Text>
              ) : (
                visibleMarkets.map((m) => (
                  <MarketCard
                    key={m.id}
                    market={m}
                    comparing={comparing.includes(m.id)}
                    onViewPrices={goMarkets}
                    onToggleCompare={() => toggleCompare(m.id)}
                  />
                ))
              )}

              {comparing.length > 0 ? (
                <View style={styles.compareBar}>
                  <Text style={styles.compareText}>
                    {comparing.length === 1
                      ? 'Pick one more market to compare'
                      : `Comparing ${comparing.length} markets`}
                  </Text>
                  <Pressable
                    onPress={() => setComparing([])}
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel="Clear comparison"
                  >
                    <Text style={styles.compareClear}>Clear</Text>
                  </Pressable>
                </View>
              ) : null}
            </View>
          ) : null}

          {/* Presyo ngayon */}
          {!q ? (
            <View style={styles.section}>
              <SectionHeader title="Presyo ngayon" right={<SampleStamp />} />
              <BasketCard />
              <PriceSnapshotCard />
            </View>
          ) : null}
        </View>
      </ScrollView>

      <LocationSheet
        visible={locationOpen}
        onClose={() => setLocationOpen(false)}
        onSave={setManualLocation}
      />
      <BudgetSheet
        key={`${budget}-${people}-${budgetOpen}`}
        visible={budgetOpen}
        budget={budget}
        people={people}
        onClose={() => setBudgetOpen(false)}
        onSave={(b, p) => {
          setBudget(b);
          setPeople(p);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg },
  content: { alignItems: 'center' },
  inner: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    paddingHorizontal: SCREEN_PADDING,
  },

  searchRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  search: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 15,
    borderRadius: 24,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: fonts.body,
    fontSize: 15,
    color: palette.ink,
    outlineStyle: 'none' as never,
  },
  clear: { fontFamily: fonts.bodyBold, fontSize: 14, color: palette.muted },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headingWrap: { marginTop: 22 },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 8,
  },
  budgetText: { fontFamily: fonts.body, fontSize: 14.5, color: palette.muted },
  budgetStrong: { fontFamily: fonts.bodyBold, color: palette.ink },
  edit: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: palette.ink,
    textDecorationLine: 'underline',
  },

  section: { marginTop: 28 },
  carouselSection: { width: '100%', maxWidth: MAX_CONTENT_WIDTH },
  carousel: { paddingHorizontal: SCREEN_PADDING, paddingTop: 14, paddingBottom: 4, gap: 14 },
  chipScroll: { marginHorizontal: -SCREEN_PADDING, marginTop: 12 },
  chipRow: { paddingHorizontal: SCREEN_PADDING, gap: 9 },
  noMarkets: {
    marginTop: 16,
    fontFamily: fonts.body,
    fontSize: 14.5,
    color: palette.muted,
  },

  compareBar: {
    marginTop: 14,
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 14,
    backgroundColor: palette.goldSoft,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compareText: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: palette.ink },
  compareClear: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: palette.ink,
    textDecorationLine: 'underline',
  },

  empty: { marginTop: 40, alignItems: 'center' },
  emptyTitle: { fontFamily: fonts.display, fontSize: 22, color: palette.ink },
  emptyText: {
    marginTop: 6,
    textAlign: 'center',
    fontFamily: fonts.body,
    fontSize: 14.5,
    lineHeight: 20,
    color: palette.muted,
  },
});
