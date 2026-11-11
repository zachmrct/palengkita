import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Heading } from '@/components/Heading';
import { SearchIcon, SlidersIcon } from '@/components/icons';
import { RecipeFilterSheet } from '@/components/recipes/RecipeFilterSheet';
import { RecipeGridCard } from '@/components/recipes/RecipeGridCard';
import { recipes, type Recipe } from '@/data/mock';
import { fonts, MAX_CONTENT_WIDTH, palette, SCREEN_PADDING } from '@/theme';
import {
  activeFilterCount,
  CATEGORY_CHIPS,
  DEFAULT_FILTERS,
  filterRecipes,
  type CategoryKey,
} from '@/utils/recipeFilters';

const COLUMNS = 2;
const SERVINGS = 4;

export default function RecipesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryKey>('all');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sheetOpen, setSheetOpen] = useState(false);
  // Remounts the sheet each time it opens so its draft starts from the applied filters.
  const [sheetKey, setSheetKey] = useState(0);

  const visible = useMemo(
    () => filterRecipes(recipes, { query, category, filters }),
    [query, category, filters],
  );
  const activeFilters = activeFilterCount(filters);
  const isFiltered = !!query.trim() || category !== 'all' || activeFilters > 0;

  const openRecipe = (recipe: Recipe) =>
    router.push({ pathname: '/recipe/[id]', params: { id: recipe.id, servings: String(SERVINGS) } });

  const openSheet = () => {
    setSheetKey((k) => k + 1);
    setSheetOpen(true);
  };

  const clearAll = () => {
    setQuery('');
    setCategory('all');
    setFilters(DEFAULT_FILTERS);
  };

  // Rows of two so cards in a row stretch to the same height.
  const rows: Recipe[][] = [];
  for (let i = 0; i < visible.length; i += COLUMNS) rows.push(visible.slice(i, i + COLUMNS));

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>
          <Text style={styles.kicker}>RECIPES</Text>
          <View style={styles.heading}>
            <Heading lead="Lutong bahay," accent="abot-kaya." size={31} />
          </View>

          {/* Search + filter */}
          <View style={styles.searchRow}>
            <View style={styles.search}>
              <SearchIcon size={21} color={palette.muted} strokeWidth={2} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search a dish or sangkap"
                placeholderTextColor={palette.placeholder}
                returnKeyType="search"
                autoCorrect={false}
                accessibilityLabel="Search a dish or sangkap"
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
              onPress={openSheet}
              accessibilityRole="button"
              accessibilityLabel={
                activeFilters ? `Filters, ${activeFilters} active` : 'Filters'
              }
              style={({ pressed }) => [styles.filterBtn, pressed && { opacity: 0.85 }]}
            >
              <SlidersIcon size={22} color="#fff" strokeWidth={2} />
              {activeFilters ? <View style={styles.filterDot} /> : null}
            </Pressable>
          </View>
        </View>

        {/* Category chips bleed to the screen edge */}
        <View style={styles.chipsWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            {CATEGORY_CHIPS.map((c) => {
              const selected = category === c.key;
              return (
                <Pressable
                  key={c.key}
                  onPress={() => setCategory(c.key)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={c.label}
                  style={({ pressed }) => [
                    styles.chip,
                    selected && styles.chipOn,
                    pressed && !selected && { opacity: 0.7 },
                  ]}
                >
                  <Text style={[styles.chipText, selected && { color: '#fff' }]}>{c.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.inner}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle} accessibilityRole="header">
              Para sa araw-araw
            </Text>
            <Text style={styles.count} accessibilityLiveRegion="polite">
              {visible.length} {visible.length === 1 ? 'recipe' : 'recipes'}
            </Text>
          </View>

          {visible.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Walang nahanap</Text>
              <Text style={styles.emptyText}>
                No recipes match your search or filters. Try a different dish, like monggo or sinigang.
              </Text>
              {isFiltered ? (
                <Pressable
                  onPress={clearAll}
                  accessibilityRole="button"
                  accessibilityLabel="Clear search and filters"
                  style={({ pressed }) => [styles.emptyBtn, pressed && { opacity: 0.85 }]}
                >
                  <Text style={styles.emptyBtnText}>CLEAR FILTERS</Text>
                </Pressable>
              ) : null}
            </View>
          ) : (
            <View style={styles.grid}>
              {rows.map((row) => (
                <View key={row[0].id} style={styles.row}>
                  {row.map((recipe) => (
                    <RecipeGridCard key={recipe.id} recipe={recipe} onOpen={() => openRecipe(recipe)} />
                  ))}
                  {row.length < COLUMNS ? <View style={styles.rowFiller} /> : null}
                </View>
              ))}
            </View>
          )}

          <Text style={styles.note}>
            Costs are sample estimates for {SERVINGS} servings at the cheapest nearby market.
          </Text>
        </View>
      </ScrollView>

      <RecipeFilterSheet
        key={sheetKey}
        visible={sheetOpen}
        filters={filters}
        onClose={() => setSheetOpen(false)}
        onApply={setFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg },
  content: { alignItems: 'center' },
  inner: { width: '100%', maxWidth: MAX_CONTENT_WIDTH, paddingHorizontal: SCREEN_PADDING },

  kicker: { fontFamily: fonts.bodyBold, fontSize: 12.5, letterSpacing: 2.2, color: palette.green },
  heading: { marginTop: 6 },

  searchRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  search: {
    flex: 1,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 17,
    borderRadius: 26,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: fonts.body,
    fontSize: 16,
    color: palette.ink,
    outlineStyle: 'none' as never,
  },
  clear: { fontFamily: fonts.bodyBold, fontSize: 14, color: palette.muted },
  filterBtn: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterDot: {
    position: 'absolute',
    top: 11,
    right: 11,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: palette.gold,
    borderWidth: 1.5,
    borderColor: palette.ink,
  },

  chipsWrap: { width: '100%', maxWidth: MAX_CONTENT_WIDTH, marginTop: 18 },
  chips: { paddingHorizontal: SCREEN_PADDING, gap: 10 },
  chip: {
    height: 38,
    paddingHorizontal: 22,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  chipOn: { backgroundColor: palette.ink, borderColor: palette.ink },
  chipText: { fontFamily: fonts.bodySemiBold, fontSize: 15.5, color: palette.ink },

  sectionRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 26,
  },
  sectionTitle: {
    flexShrink: 1,
    fontFamily: fonts.display,
    fontSize: 23,
    lineHeight: 28,
    letterSpacing: -0.4,
    color: palette.ink,
  },
  count: { fontFamily: fonts.body, fontSize: 14.5, color: palette.muted, marginBottom: 3 },

  grid: { marginTop: 16, gap: 14 },
  row: { flexDirection: 'row', gap: 14 },
  rowFiller: { flex: 1 },

  note: {
    marginTop: 26,
    paddingHorizontal: 4,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: palette.muted,
  },

  empty: { marginTop: 36, alignItems: 'center', paddingHorizontal: 12 },
  emptyTitle: { fontFamily: fonts.display, fontSize: 22, color: palette.ink },
  emptyText: {
    marginTop: 6,
    textAlign: 'center',
    fontFamily: fonts.body,
    fontSize: 14.5,
    lineHeight: 20,
    color: palette.muted,
  },
  emptyBtn: {
    marginTop: 18,
    height: 44,
    paddingHorizontal: 22,
    borderRadius: 14,
    backgroundColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBtnText: { fontFamily: fonts.bodyBold, fontSize: 13.5, letterSpacing: 1, color: '#fff' },
});
