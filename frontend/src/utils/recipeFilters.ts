import type { Difficulty, Recipe } from '@/data/mock';

export type SortKey = 'default' | 'cheapest' | 'fastest';

export type RecipeFilters = {
  sort: SortKey;
  /** Highest card price in pesos, or null for no limit. */
  maxPrice: number | null;
  difficulty: Difficulty | 'all';
  /** Only recipes marked "May ka na". */
  haveOnly: boolean;
};

export const DEFAULT_FILTERS: RecipeFilters = {
  sort: 'default',
  maxPrice: null,
  difficulty: 'all',
  haveOnly: false,
};

/** How many filters differ from the defaults (shown as a dot on the filter button). */
export function activeFilterCount(f: RecipeFilters): number {
  return (
    (f.sort !== 'default' ? 1 : 0) +
    (f.maxPrice !== null ? 1 : 0) +
    (f.difficulty !== 'all' ? 1 : 0) +
    (f.haveOnly ? 1 : 0)
  );
}

export const totalMinutes = (r: Recipe) => r.prepMinutes + r.cookMinutes;

/** Category chips on the Recipes screen. Almusal matches by tag; the rest by category. */
export const CATEGORY_CHIPS = [
  { key: 'all', label: 'Lahat', match: () => true },
  { key: 'ulam', label: 'Ulam', match: (r: Recipe) => r.category === 'ulam' },
  { key: 'gulay', label: 'Gulay', match: (r: Recipe) => r.category === 'gulay' },
  { key: 'sabaw', label: 'Sabaw', match: (r: Recipe) => r.category === 'sabaw' },
  { key: 'almusal', label: 'Almusal', match: (r: Recipe) => r.tags.includes('Almusal') },
] as const;

export type CategoryKey = (typeof CATEGORY_CHIPS)[number]['key'];

export function filterRecipes(
  recipes: Recipe[],
  opts: { query: string; category: CategoryKey; filters: RecipeFilters },
): Recipe[] {
  const q = opts.query.trim().toLowerCase();
  const chip = CATEGORY_CHIPS.find((c) => c.key === opts.category) ?? CATEGORY_CHIPS[0];
  const { filters } = opts;

  const result = recipes.filter((r) => {
    if (!chip.match(r)) return false;
    if (filters.maxPrice !== null && r.cardPrice > filters.maxPrice) return false;
    if (filters.difficulty !== 'all' && r.difficulty !== filters.difficulty) return false;
    if (filters.haveOnly && !r.haveAtHome) return false;
    if (!q) return true;
    return [r.title, r.gridTitle ?? '', r.category, r.protein, ...r.tags, ...r.ingredients.map((i) => i.name)]
      .join(' ')
      .toLowerCase()
      .includes(q);
  });

  if (filters.sort === 'cheapest') return [...result].sort((a, b) => a.cardPrice - b.cardPrice);
  if (filters.sort === 'fastest') return [...result].sort((a, b) => totalMinutes(a) - totalMinutes(b));
  return result;
}
