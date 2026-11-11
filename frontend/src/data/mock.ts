/**
 * Sample data for the Home and Recipe screens.
 * TODO(backend): replace with API calls. Shapes here are what the UI expects.
 */
import type { ImageSource } from 'expo-image';

export type Difficulty = 'Madali' | 'Katamtaman' | 'Mahirap';

export type Ingredient = {
  id: string;
  name: string;
  /** Quantity for `Recipe.baseServings`, e.g. "500 g". Scaled by servings in the UI. */
  qty: number;
  unit: string;
  /** Price in pesos for the base quantity. */
  price: number;
  /** Optional. Ingredients without a photo show a plain sage tile. */
  photo?: ImageSource;
};

export type Step = {
  id: string;
  title: string;
  body: string;
  minutes: number;
};

export type Recipe = {
  id: string;
  title: string;
  blurb: string;
  /** Short line for the carousel card. */
  cardBlurb: string;
  tags: string[];
  prepMinutes: number;
  cookMinutes: number;
  baseServings: number;
  difficulty: Difficulty;
  protein: string;
  /** Rough weekday cost shown on the carousel price tag. */
  cardPrice: number;
  photo: ImageSource;
  heroPhoto: ImageSource;
  ingredients: Ingredient[];
  steps: Step[];
  pantry: string[];
};

/* Photos -------------------------------------------------------------- */

const photo = {
  todaysPick: require('../../assets/images/home/todays-pick.jpg'),
  recipeHero: require('../../assets/images/home/recipe-hero.jpg'),
  tortang: require('../../assets/images/home/recipe-tortang-talong.jpg'),
  kangkong: require('../../assets/images/home/recipe-adobong-kangkong.jpg'),
  palengke: require('../../assets/images/home/market-palengke.jpg'),
  grocery: require('../../assets/images/home/market-grocery.jpg'),
  supermarket: require('../../assets/images/home/market-supermarket.jpg'),
  monggo: require('../../assets/images/home/ing-monggo.jpg'),
  malunggay: require('../../assets/images/home/ing-malunggay.jpg'),
  kamatis: require('../../assets/images/home/ing-kamatis.jpg'),
  sibuyas: require('../../assets/images/home/ing-sibuyas.jpg'),
  bawang: require('../../assets/images/home/ing-bawang.jpg'),
} as const;

/* Recipes ------------------------------------------------------------- */

export const recipes: Recipe[] = [
  {
    id: 'ginisang-monggo',
    title: 'Ginisang Monggo with Malunggay',
    blurb:
      'Hearty, high in protein and kind to the budget. Feeds four, with enough left for tomorrow’s baon.',
    cardBlurb: 'Mung beans sauteed with garlic, tomato and malunggay.',
    tags: ['Gulay', 'Ulam', 'Lutong bahay'],
    prepMinutes: 10,
    cookMinutes: 35,
    baseServings: 4,
    difficulty: 'Madali',
    protein: 'Monggo',
    cardPrice: 138,
    photo: photo.todaysPick,
    heroPhoto: photo.recipeHero,
    ingredients: [
      { id: 'monggo', name: 'Monggo', qty: 500, unit: 'g', price: 49, photo: photo.monggo },
      { id: 'malunggay', name: 'Malunggay', qty: 2, unit: 'bundles', price: 30, photo: photo.malunggay },
      { id: 'kamatis', name: 'Kamatis', qty: 250, unit: 'g', price: 15, photo: photo.kamatis },
      { id: 'sibuyas', name: 'Sibuyas', qty: 250, unit: 'g', price: 30, photo: photo.sibuyas },
      { id: 'bawang', name: 'Bawang', qty: 100, unit: 'g', price: 14, photo: photo.bawang },
    ],
    steps: [
      {
        id: 's1',
        title: 'Lutuin ang monggo',
        minutes: 30,
        body: 'Rinse the monggo, then boil in 6 cups of water for 25–30 minutes until soft and starting to split.',
      },
      {
        id: 's2',
        title: 'Igisa',
        minutes: 5,
        body: 'In another pot, sauté 4 cloves bawang, 1 sibuyas and 2 kamatis in 2 tbsp oil until soft and fragrant.',
      },
      {
        id: 's3',
        title: 'Pagsamahin',
        minutes: 5,
        body: 'Pour in the monggo with its liquid. Simmer 5 minutes, then season with patis and paminta to taste.',
      },
      {
        id: 's4',
        title: 'Ilagay ang malunggay',
        minutes: 2,
        body: 'Turn off the heat, stir in the malunggay leaves and cover for 2 minutes. Serve hot with rice.',
      },
    ],
    pantry: ['mantika', 'patis', 'asin', 'paminta'],
  },
  {
    id: 'tortang-talong',
    title: 'Tortang Talong',
    blurb: 'Smoky eggplant omelette, uses your itlog. Best with rice and banana ketchup.',
    cardBlurb: 'Smoky eggplant omelette, uses your itlog.',
    tags: ['Gulay', 'Almusal', 'Lutong bahay'],
    prepMinutes: 10,
    cookMinutes: 15,
    baseServings: 4,
    difficulty: 'Madali',
    protein: 'Itlog',
    cardPrice: 95,
    photo: photo.tortang,
    heroPhoto: photo.tortang,
    ingredients: [
      { id: 'talong', name: 'Talong', qty: 4, unit: 'pcs', price: 40 },
      { id: 'itlog', name: 'Itlog', qty: 4, unit: 'pcs', price: 32 },
      { id: 'sibuyas', name: 'Sibuyas', qty: 100, unit: 'g', price: 12, photo: photo.sibuyas },
      { id: 'bawang', name: 'Bawang', qty: 50, unit: 'g', price: 11, photo: photo.bawang },
    ],
    steps: [
      { id: 's1', title: 'Ihawin ang talong', minutes: 10, body: 'Char the talong over an open flame until the skin blackens and the flesh is soft.' },
      { id: 's2', title: 'Balatan at pitpitin', minutes: 3, body: 'Peel off the skin, keep the stem on, and flatten the flesh gently with a fork.' },
      { id: 's3', title: 'Ibalot sa itlog', minutes: 2, body: 'Beat the eggs with salt and minced onion, then dip each talong to coat well.' },
      { id: 's4', title: 'Iprito', minutes: 6, body: 'Pan-fry in a little oil until golden on both sides. Serve hot with rice.' },
    ],
    pantry: ['mantika', 'asin', 'paminta'],
  },
  {
    id: 'adobong-kangkong',
    title: 'Adobong Kangkong',
    blurb: 'Garlicky greens in savory soy and vinegar. Ready before the rice is.',
    cardBlurb: 'Garlicky greens in savory soy and suka.',
    tags: ['Gulay', 'Ulam', 'Mabilis'],
    prepMinutes: 5,
    cookMinutes: 10,
    baseServings: 4,
    difficulty: 'Madali',
    protein: 'Gulay',
    cardPrice: 60,
    photo: photo.kangkong,
    heroPhoto: photo.kangkong,
    ingredients: [
      { id: 'kangkong', name: 'Kangkong', qty: 2, unit: 'bundles', price: 30 },
      { id: 'bawang', name: 'Bawang', qty: 50, unit: 'g', price: 18, photo: photo.bawang },
      { id: 'sibuyas', name: 'Sibuyas', qty: 100, unit: 'g', price: 12, photo: photo.sibuyas },
    ],
    steps: [
      { id: 's1', title: 'Hugasan at hatiin', minutes: 3, body: 'Wash the kangkong well and cut stems and leaves into 2-inch pieces, keeping them separate.' },
      { id: 's2', title: 'Igisa', minutes: 4, body: 'Sauté plenty of bawang and sibuyas in oil until golden and fragrant.' },
      { id: 's3', title: 'Timplahan', minutes: 5, body: 'Add the stems, then toyo and suka. Simmer without stirring, then add the leaves and cook until wilted.' },
    ],
    pantry: ['mantika', 'toyo', 'suka', 'asin'],
  },
];

export const recipeById = (id: string | undefined): Recipe | undefined =>
  recipes.find((r) => r.id === id);

export const todaysPick = recipes[0];

/* Markets ------------------------------------------------------------- */

export type MarketKind = 'palengke' | 'grocery' | 'supermarket';

export type Market = {
  id: string;
  kind: MarketKind;
  name: string;
  distanceKm: number;
  address: string;
  openUntil: string;
  stockCovered: number;
  stockTotal: number;
  /** 1–3 filled peso signs. */
  priceLevel: 1 | 2 | 3;
  priceNote: string;
  photo: ImageSource;
};

export const markets: Market[] = [
  {
    id: 'pamilihang-bayan',
    kind: 'palengke',
    name: 'Pamilihang Bayan',
    distanceKm: 0.6,
    address: 'Rizal St., Brgy. San Roque',
    openUntil: '7 PM',
    stockCovered: 46,
    stockTotal: 52,
    priceLevel: 2,
    priceNote: 'Lowest nearby',
    photo: photo.palengke,
  },
  {
    id: 'aling-rosa',
    kind: 'grocery',
    name: 'Tindahan ni Aling Rosa',
    distanceKm: 0.3,
    address: 'Mabini St., Brgy. Sta. Elena',
    openUntil: '9 PM',
    stockCovered: 18,
    stockTotal: 52,
    priceLevel: 2,
    priceNote: 'Basics only',
    photo: photo.grocery,
  },
  {
    id: 'suki-supermarket',
    kind: 'supermarket',
    name: 'Suki Supermarket',
    distanceKm: 1.2,
    address: 'National Rd., Brgy. Malanday',
    openUntil: '10 PM',
    stockCovered: 50,
    stockTotal: 52,
    priceLevel: 3,
    priceNote: 'Widest selection',
    photo: photo.supermarket,
  },
];

export const marketKindLabel: Record<MarketKind, string> = {
  palengke: 'PALENGKE',
  grocery: 'GROCERY',
  supermarket: 'SUPERMARKET',
};

/* "Presyo ngayon" ------------------------------------------------------ */

export const basket = {
  recipeTitle: 'Ginisang Monggo',
  items: 5,
  cheapestTotal: 138,
  cheapestAt: 'Pamilihang Bayan',
  saveAmount: 38,
  saveVs: 'Suki Supermarket',
  asOf: '8:40 AM',
  byKind: [
    { kind: 'palengke' as const, label: 'PALENGKE', total: 138, covered: 5, best: true },
    { kind: 'grocery' as const, label: 'GROCERY', total: 118, covered: 4, best: false },
    { kind: 'supermarket' as const, label: 'SUPERMARKET', total: 176, covered: 5, best: false },
  ],
};

export const priceSnapshot = {
  item: 'Kamatis',
  unit: 'per kg',
  low: 60,
  high: 78,
  stores: 3,
  lowestAt: 'Palengke',
};

/* Helpers ------------------------------------------------------------- */

/** Scales a base-serving quantity to `servings`, rounded to a friendly number. */
export function scaleQty(qty: number, baseServings: number, servings: number): number {
  const scaled = (qty * servings) / baseServings;
  return Number.isInteger(scaled) ? scaled : Math.round(scaled * 10) / 10;
}

/** Scales a base-serving price to `servings`, rounded to whole pesos. */
export function scalePrice(price: number, baseServings: number, servings: number): number {
  return Math.round((price * servings) / baseServings);
}

export function recipeCost(recipe: Recipe, servings: number): number {
  return recipe.ingredients.reduce(
    (sum, i) => sum + scalePrice(i.price, recipe.baseServings, servings),
    0,
  );
}
