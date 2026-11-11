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

export type RecipeCategory = 'ulam' | 'gulay' | 'sabaw';

export const categoryLabel: Record<RecipeCategory, string> = {
  ulam: 'ULAM',
  gulay: 'GULAY',
  sabaw: 'SABAW',
};

export type Recipe = {
  id: string;
  title: string;
  /** Shorter name for the Recipes grid, when the full title is long. */
  gridTitle?: string;
  category: RecipeCategory;
  /** "May ka na": the user already has the main ingredients. TODO(backend): derive from pantry. */
  haveAtHome: boolean;
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
  sardinas: require('../../assets/images/home/recipe-sardinas-misua.jpg'),
  kalabasa: require('../../assets/images/home/recipe-ginataang-kalabasa.jpg'),
  arrozCaldo: require('../../assets/images/home/recipe-arroz-caldo.jpg'),
  pinakbet: require('../../assets/images/home/recipe-pinakbet.jpg'),
  sinigang: require('../../assets/images/home/recipe-sinigang-bangus.jpg'),
  tinola: require('../../assets/images/home/recipe-tinolang-manok.jpg'),
  adobo: require('../../assets/images/home/recipe-chicken-adobo.jpg'),
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
    gridTitle: 'Ginisang Monggo',
    category: 'gulay',
    haveAtHome: true,
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
    category: 'ulam',
    haveAtHome: true,
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
    category: 'gulay',
    haveAtHome: false,
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
  {
    id: 'sardinas-misua',
    title: 'Sardinas with Misua',
    category: 'sabaw',
    haveAtHome: true,
    blurb: 'Canned sardines and misua in a quick, comforting broth. Ready in a quarter of an hour.',
    cardBlurb: 'Canned sardines and misua in a quick garlicky broth.',
    tags: ['Sabaw', 'Mabilis', 'Lutong bahay'],
    prepMinutes: 5,
    cookMinutes: 10,
    baseServings: 4,
    difficulty: 'Madali',
    protein: 'Sardinas',
    cardPrice: 75,
    photo: photo.sardinas,
    heroPhoto: photo.sardinas,
    ingredients: [
      { id: 'sardinas', name: 'Sardinas (canned)', qty: 2, unit: 'cans', price: 36 },
      { id: 'misua', name: 'Misua', qty: 200, unit: 'g', price: 18 },
      { id: 'sibuyas', name: 'Sibuyas', qty: 100, unit: 'g', price: 12, photo: photo.sibuyas },
      { id: 'bawang', name: 'Bawang', qty: 50, unit: 'g', price: 9, photo: photo.bawang },
    ],
    steps: [
      { id: 's1', title: 'Igisa', minutes: 3, body: 'Sauté bawang and sibuyas in a little oil until soft and fragrant.' },
      { id: 's2', title: 'Ilagay ang sardinas', minutes: 3, body: 'Add the sardines with their sauce and break them up gently. Pour in 4 cups of water and bring to a boil.' },
      { id: 's3', title: 'Idagdag ang misua', minutes: 4, body: 'Add the misua and simmer until just tender. Season with patis and paminta, then serve hot.' },
    ],
    pantry: ['mantika', 'patis', 'asin', 'paminta'],
  },
  {
    id: 'ginataang-kalabasa',
    title: 'Ginataang Kalabasa at Sitaw',
    category: 'gulay',
    haveAtHome: false,
    blurb: 'Sweet squash and string beans simmered in creamy coconut milk. Perfect over hot rice.',
    cardBlurb: 'Squash and sitaw simmered in creamy gata.',
    tags: ['Gulay', 'Ulam', 'Lutong bahay'],
    prepMinutes: 10,
    cookMinutes: 20,
    baseServings: 4,
    difficulty: 'Madali',
    protein: 'Gulay',
    cardPrice: 130,
    photo: photo.kalabasa,
    heroPhoto: photo.kalabasa,
    ingredients: [
      { id: 'kalabasa', name: 'Kalabasa', qty: 500, unit: 'g', price: 40 },
      { id: 'sitaw', name: 'Sitaw', qty: 1, unit: 'bundle', price: 25 },
      { id: 'gata', name: 'Gata (coconut milk)', qty: 400, unit: 'ml', price: 35 },
      { id: 'sibuyas', name: 'Sibuyas', qty: 100, unit: 'g', price: 12, photo: photo.sibuyas },
      { id: 'bawang', name: 'Bawang', qty: 50, unit: 'g', price: 18, photo: photo.bawang },
    ],
    steps: [
      { id: 's1', title: 'Igisa', minutes: 4, body: 'Sauté bawang and sibuyas in oil until soft.' },
      { id: 's2', title: 'Lutuin ang kalabasa', minutes: 8, body: 'Add the kalabasa and gata. Simmer gently until the squash is almost tender.' },
      { id: 's3', title: 'Ilagay ang sitaw', minutes: 8, body: 'Add the sitaw cut into 2-inch pieces and cook until just tender. Season with patis and serve.' },
    ],
    pantry: ['mantika', 'patis', 'asin', 'paminta'],
  },
  {
    id: 'arroz-caldo',
    title: 'Arroz Caldo',
    category: 'sabaw',
    haveAtHome: true,
    blurb: 'Ginger-scented chicken rice porridge, a rainy-day classic for breakfast or merienda.',
    cardBlurb: 'Ginger-scented chicken rice porridge.',
    tags: ['Sabaw', 'Almusal', 'Lutong bahay'],
    prepMinutes: 10,
    cookMinutes: 30,
    baseServings: 4,
    difficulty: 'Madali',
    protein: 'Manok',
    cardPrice: 150,
    photo: photo.arrozCaldo,
    heroPhoto: photo.arrozCaldo,
    ingredients: [
      { id: 'bigas', name: 'Bigas', qty: 300, unit: 'g', price: 22 },
      { id: 'manok', name: 'Manok', qty: 500, unit: 'g', price: 85 },
      { id: 'luya', name: 'Luya', qty: 50, unit: 'g', price: 10 },
      { id: 'bawang', name: 'Bawang', qty: 50, unit: 'g', price: 18, photo: photo.bawang },
      { id: 'sibuyas', name: 'Sibuyas', qty: 100, unit: 'g', price: 15, photo: photo.sibuyas },
    ],
    steps: [
      { id: 's1', title: 'Igisa', minutes: 6, body: 'Sauté luya, bawang and sibuyas in oil, then add the manok and cook until lightly browned.' },
      { id: 's2', title: 'Ilagay ang bigas', minutes: 4, body: 'Stir in the rinsed rice and toast for a minute. Pour in 8 cups of water.' },
      { id: 's3', title: 'Pakuluan', minutes: 20, body: 'Simmer, stirring often, until the rice breaks down into a thick porridge. Season with patis and top with toasted bawang and kalamansi.' },
    ],
    pantry: ['mantika', 'patis', 'asin', 'paminta'],
  },
  {
    id: 'pinakbet',
    title: 'Pinakbet',
    category: 'gulay',
    haveAtHome: false,
    blurb: 'A Northern classic of mixed vegetables simmered in bagoong. Savory, earthy and full of flavor.',
    cardBlurb: 'Mixed vegetables simmered in savory bagoong.',
    tags: ['Gulay', 'Ulam', 'Lutong bahay'],
    prepMinutes: 10,
    cookMinutes: 25,
    baseServings: 4,
    difficulty: 'Katamtaman',
    protein: 'Gulay',
    cardPrice: 168,
    photo: photo.pinakbet,
    heroPhoto: photo.pinakbet,
    ingredients: [
      { id: 'kalabasa', name: 'Kalabasa', qty: 300, unit: 'g', price: 28 },
      { id: 'sitaw', name: 'Sitaw', qty: 1, unit: 'bundle', price: 25 },
      { id: 'talong', name: 'Talong', qty: 2, unit: 'pcs', price: 20 },
      { id: 'okra', name: 'Okra', qty: 200, unit: 'g', price: 20 },
      { id: 'ampalaya', name: 'Ampalaya', qty: 1, unit: 'pc', price: 20 },
      { id: 'kamatis', name: 'Kamatis', qty: 150, unit: 'g', price: 10, photo: photo.kamatis },
      { id: 'bagoong', name: 'Bagoong', qty: 3, unit: 'tbsp', price: 35 },
      { id: 'bawang', name: 'Bawang', qty: 30, unit: 'g', price: 10, photo: photo.bawang },
    ],
    steps: [
      { id: 's1', title: 'Igisa', minutes: 5, body: 'Sauté bawang and kamatis in oil, then stir in the bagoong.' },
      { id: 's2', title: 'Ilagay ang matigas na gulay', minutes: 10, body: 'Add the kalabasa and ampalaya with half a cup of water. Cover and cook until slightly tender.' },
      { id: 's3', title: 'Idagdag ang iba pa', minutes: 10, body: 'Add the sitaw, talong and okra. Cover and steam without stirring too much until all the vegetables are tender.' },
    ],
    pantry: ['mantika', 'paminta'],
  },
  {
    id: 'sinigang-bangus',
    title: 'Sinigang na Bangus',
    category: 'sabaw',
    haveAtHome: false,
    blurb: 'Tangy sampalok broth with tender milkfish and fresh vegetables. A sour, soothing bowl.',
    cardBlurb: 'Milkfish in tangy sampalok broth.',
    tags: ['Sabaw', 'Ulam', 'Lutong bahay'],
    prepMinutes: 10,
    cookMinutes: 30,
    baseServings: 4,
    difficulty: 'Katamtaman',
    protein: 'Bangus',
    cardPrice: 220,
    photo: photo.sinigang,
    heroPhoto: photo.sinigang,
    ingredients: [
      { id: 'bangus', name: 'Bangus', qty: 1, unit: 'pc', price: 140 },
      { id: 'sampalok', name: 'Sampalok mix', qty: 1, unit: 'pack', price: 15 },
      { id: 'kangkong', name: 'Kangkong', qty: 1, unit: 'bundle', price: 20 },
      { id: 'labanos', name: 'Labanos', qty: 1, unit: 'pc', price: 15 },
      { id: 'kamatis', name: 'Kamatis', qty: 150, unit: 'g', price: 10, photo: photo.kamatis },
      { id: 'sibuyas', name: 'Sibuyas', qty: 100, unit: 'g', price: 15, photo: photo.sibuyas },
      { id: 'siling', name: 'Siling haba', qty: 2, unit: 'pcs', price: 5 },
    ],
    steps: [
      { id: 's1', title: 'Pakuluan ang sabaw', minutes: 12, body: 'Boil the kamatis and sibuyas in 6 cups of water, then stir in the sampalok mix.' },
      { id: 's2', title: 'Ilagay ang isda', minutes: 12, body: 'Add the labanos, then the bangus. Simmer gently without stirring so the fish stays whole.' },
      { id: 's3', title: 'Gulay at timpla', minutes: 6, body: 'Add the siling and kangkong and cook for 2 minutes. Season with patis and serve hot.' },
    ],
    pantry: ['patis', 'asin', 'paminta'],
  },
  {
    id: 'tinolang-manok',
    title: 'Tinolang Manok',
    category: 'sabaw',
    haveAtHome: false,
    blurb: 'Chicken simmered with ginger, green papaya and dahon ng sili. Light, clear and warming.',
    cardBlurb: 'Chicken in ginger broth with green papaya.',
    tags: ['Sabaw', 'Ulam', 'Lutong bahay'],
    prepMinutes: 10,
    cookMinutes: 40,
    baseServings: 4,
    difficulty: 'Madali',
    protein: 'Manok',
    cardPrice: 235,
    photo: photo.tinola,
    heroPhoto: photo.tinola,
    ingredients: [
      { id: 'manok', name: 'Manok', qty: 700, unit: 'g', price: 130 },
      { id: 'papaya', name: 'Papaya (hilaw)', qty: 1, unit: 'pc', price: 35 },
      { id: 'luya', name: 'Luya', qty: 50, unit: 'g', price: 10 },
      { id: 'sibuyas', name: 'Sibuyas', qty: 100, unit: 'g', price: 15, photo: photo.sibuyas },
      { id: 'bawang', name: 'Bawang', qty: 50, unit: 'g', price: 20, photo: photo.bawang },
      { id: 'sili', name: 'Dahon ng sili', qty: 1, unit: 'bundle', price: 25 },
    ],
    steps: [
      { id: 's1', title: 'Igisa', minutes: 8, body: 'Sauté luya, bawang and sibuyas in oil until fragrant, then add the manok and cook until the pieces turn opaque.' },
      { id: 's2', title: 'Pakuluan', minutes: 20, body: 'Pour in 6 cups of water and simmer until the chicken is tender. Season with patis.' },
      { id: 's3', title: 'Gulay', minutes: 12, body: 'Add the papaya and cook until soft. Turn off the heat, stir in the dahon ng sili and serve.' },
    ],
    pantry: ['mantika', 'patis', 'asin', 'paminta'],
  },
  {
    id: 'chicken-adobo',
    title: 'Chicken Adobo',
    category: 'ulam',
    haveAtHome: false,
    blurb: 'The national dish: chicken braised in soy sauce, vinegar and garlic until glossy and tender.',
    cardBlurb: 'Chicken braised in toyo, suka and garlic.',
    tags: ['Ulam', 'Lutong bahay', 'Pamilya'],
    prepMinutes: 10,
    cookMinutes: 45,
    baseServings: 4,
    difficulty: 'Madali',
    protein: 'Manok',
    cardPrice: 260,
    photo: photo.adobo,
    heroPhoto: photo.adobo,
    ingredients: [
      { id: 'manok', name: 'Manok', qty: 1, unit: 'kg', price: 190 },
      { id: 'patatas', name: 'Patatas', qty: 300, unit: 'g', price: 30 },
      { id: 'toyo', name: 'Toyo', qty: 100, unit: 'ml', price: 15 },
      { id: 'suka', name: 'Suka', qty: 60, unit: 'ml', price: 12 },
      { id: 'bawang', name: 'Bawang', qty: 40, unit: 'g', price: 13, photo: photo.bawang },
    ],
    steps: [
      { id: 's1', title: 'Pagsamahin', minutes: 5, body: 'Combine the manok, toyo, suka, crushed bawang, a bay leaf and a pinch of paminta. Marinate while you prep.' },
      { id: 's2', title: 'Pakuluan', minutes: 20, body: 'Bring to a boil without stirring, then lower the heat and simmer covered until the chicken is tender.' },
      { id: 's3', title: 'Patatas at sarsa', minutes: 20, body: 'Add the patatas and cook until soft. Uncover and reduce the sauce until glossy, then serve with rice.' },
    ],
    pantry: ['mantika', 'dahon ng laurel', 'asin', 'paminta'],
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
