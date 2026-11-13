/**
 * Sample meals and the pure recommendation filter.
 * Ported 1:1 from the Lovable design (`src/lib/meals.ts`).
 * TODO(backend): replace with API calls. Shapes here are what the UI expects.
 */
import type { ImageSource } from 'expo-image';

export type Ingredient = { name: string; amount: string; price: number; emoji: string };

export type Meal = {
  id: string;
  name: string;
  subtitle: string;
  /** Short taste + contents line used on Home cards. */
  blurb: string;
  image: ImageSource;
  price: number;
  minutes: number;
  calories: number;
  tag: string;
  category: string[];
  allergens: string[];
  ingredients: Ingredient[];
  steps: string[];
};

const dish = {
  sinigang: require('../../assets/images/dish-sinigang.png'),
  adobo: require('../../assets/images/dish-adobo.png'),
  pinakbet: require('../../assets/images/dish-pinakbet.png'),
  tinola: require('../../assets/images/dish-tinola.png'),
  monggo: require('../../assets/images/dish-monggo.png'),
  torta: require('../../assets/images/dish-torta.png'),
  ginataan: require('../../assets/images/dish-ginataan.png'),
};

const veg: Ingredient[] = [
  { name: 'Talong', amount: '2 pieces', price: 20, emoji: '🍆' },
  { name: 'Kamatis', amount: '2 pieces', price: 15, emoji: '🍅' },
  { name: 'Sibuyas', amount: '1 piece', price: 10, emoji: '🧅' },
];

export const meals: Meal[] = [
  {
    id: 'sinigang',
    name: 'Sinigang na Baboy',
    subtitle: 'Asim-kilig, just like home.',
    blurb: 'Tangy and savory. Tender pork in a tamarind broth with kangkong, labanos and sitaw.',
    image: dish.sinigang,
    price: 85,
    minutes: 45,
    calories: 320,
    tag: 'Comfort food',
    category: ['Lunch', 'Dinner'],
    allergens: ['Pork'],
    ingredients: [
      { name: 'Baboy', amount: '250 g', price: 95, emoji: '🥩' },
      { name: 'Kangkong', amount: '1 bunch', price: 15, emoji: '🥬' },
      { name: 'Labanos', amount: '1 piece', price: 20, emoji: '🥕' },
      { name: 'Kamatis', amount: '2 pieces', price: 15, emoji: '🍅' },
      { name: 'Sitaw', amount: '1 bundle', price: 15, emoji: '🫛' },
      { name: 'Sampalok mix', amount: '1 sachet', price: 10, emoji: '🌿' },
    ],
    steps: [
      'Simmer pork with tomatoes and onion in water until tender.',
      'Stir in tamarind mix, radish and string beans. Simmer until just cooked.',
      'Add kangkong and green chili. Season to taste and serve hot.',
    ],
  },
  {
    id: 'adobo',
    name: 'Chicken Adobo',
    subtitle: 'A classic that never gets old.',
    blurb: 'Salty, tangy and a little sweet. Chicken braised in toyo, suka, garlic and bay leaf.',
    image: dish.adobo,
    price: 65,
    minutes: 35,
    calories: 380,
    tag: 'Pinoy favorite',
    category: ['Lunch', 'Dinner'],
    allergens: ['Soy'],
    ingredients: [
      { name: 'Manok', amount: '300 g', price: 85, emoji: '🍗' },
      { name: 'Bawang', amount: '1 head', price: 10, emoji: '🧄' },
      { name: 'Toyo', amount: '3 tbsp', price: 10, emoji: '🍶' },
      { name: 'Suka', amount: '3 tbsp', price: 5, emoji: '🍶' },
      { name: 'Laurel', amount: '2 leaves', price: 5, emoji: '🌿' },
      { name: 'Paminta', amount: '1 tsp', price: 5, emoji: '🧂' },
    ],
    steps: [
      'Marinate chicken in soy sauce and garlic for 10 minutes.',
      'Sear chicken, then add vinegar, bay leaves, pepper and a little water.',
      'Cover and simmer until cooked. Reduce the sauce and serve.',
    ],
  },
  {
    id: 'pinakbet',
    name: 'Pinakbet',
    subtitle: 'A little harvest in every bite.',
    blurb: 'Savory with a hint of bitter. Kalabasa, sitaw and talong in bagoong.',
    image: dish.pinakbet,
    price: 45,
    minutes: 25,
    calories: 210,
    tag: 'Veggie goodness',
    category: ['Lunch', 'Dinner'],
    allergens: ['Pork', 'Shellfish'],
    ingredients: [
      ...veg,
      { name: 'Kalabasa', amount: '200 g', price: 20, emoji: '🎃' },
      { name: 'Sitaw', amount: '1 bundle', price: 15, emoji: '🫛' },
      { name: 'Bagoong', amount: '1 tbsp', price: 10, emoji: '🦐' },
    ],
    steps: [
      'Sauté garlic, onion and tomato. Add a small amount of shrimp paste.',
      'Add squash and a little water, cover and simmer.',
      'Add remaining vegetables and pork, if using. Cook until tender.',
    ],
  },
  {
    id: 'tinola',
    name: 'Tinolang Manok',
    subtitle: 'Warm, nourishing, and familiar.',
    blurb: 'Light, gingery and comforting. Chicken, green papaya and malunggay in clear broth.',
    image: dish.tinola,
    price: 60,
    minutes: 30,
    calories: 260,
    tag: 'Light & nourishing',
    category: ['Lunch', 'Dinner'],
    allergens: [],
    ingredients: [
      { name: 'Manok', amount: '300 g', price: 80, emoji: '🍗' },
      { name: 'Papayang hilaw', amount: '½ piece', price: 20, emoji: '🥒' },
      { name: 'Malunggay', amount: '1 bunch', price: 10, emoji: '🌿' },
      { name: 'Luya', amount: '1 thumb', price: 10, emoji: '🫚' },
    ],
    steps: [
      'Sauté garlic, onion and ginger. Add chicken and lightly brown.',
      'Pour in water and simmer until chicken is fully cooked.',
      'Add green papaya. When tender, add malunggay and season to taste.',
    ],
  },
  {
    id: 'monggo',
    name: 'Ginisang Monggo',
    subtitle: 'Friday favorite, any day.',
    blurb: 'Earthy, savory and hearty. Sautéed monggo with garlic, tomato and malunggay.',
    image: dish.monggo,
    price: 35,
    minutes: 40,
    calories: 250,
    tag: 'Budget-friendly',
    category: ['Lunch', 'Dinner'],
    allergens: ['Pork'],
    ingredients: [
      { name: 'Monggo', amount: '1 cup', price: 35, emoji: '🫘' },
      ...veg.slice(1),
      { name: 'Malunggay', amount: '1 bunch', price: 10, emoji: '🌿' },
    ],
    steps: [
      'Boil mung beans until tender.',
      'Sauté garlic, onion and tomatoes. Add beans and their cooking liquid.',
      'Add greens and chicharon, if using, then simmer and season.',
    ],
  },
  {
    id: 'torta',
    name: 'Tortang Talong',
    subtitle: 'Simple ingredients, big sarap.',
    blurb: 'Smoky and savory. Grilled talong dipped in egg and pan-fried until golden.',
    image: dish.torta,
    price: 30,
    minutes: 20,
    calories: 220,
    tag: 'Quick & easy',
    category: ['Breakfast', 'Lunch', 'Dinner'],
    allergens: ['Egg'],
    ingredients: [
      { name: 'Talong', amount: '2 pieces', price: 25, emoji: '🍆' },
      { name: 'Itlog', amount: '2 pieces', price: 20, emoji: '🥚' },
      { name: 'Mantika', amount: '2 tbsp', price: 5, emoji: '🫙' },
      { name: 'Asin', amount: 'a pinch', price: 2, emoji: '🧂' },
    ],
    steps: [
      'Grill eggplants until soft. Peel, keeping the stems intact.',
      'Flatten and dip each eggplant in beaten, seasoned eggs.',
      'Pan-fry on both sides until golden and fully cooked.',
    ],
  },
  {
    id: 'ginataan',
    name: 'Ginataang Kalabasa',
    subtitle: 'Creamy, cozy, coconut goodness.',
    blurb: 'Creamy, mildly sweet and rich. Kalabasa and sitaw simmered in gata with hipon.',
    image: dish.ginataan,
    price: 50,
    minutes: 25,
    calories: 290,
    tag: 'Lutong bahay',
    category: ['Lunch', 'Dinner'],
    allergens: ['Shellfish'],
    ingredients: [
      { name: 'Kalabasa', amount: '300 g', price: 25, emoji: '🎃' },
      { name: 'Sitaw', amount: '1 bundle', price: 15, emoji: '🫛' },
      { name: 'Gata', amount: '1 cup', price: 35, emoji: '🥥' },
      { name: 'Hipon', amount: '100 g', price: 25, emoji: '🦐' },
    ],
    steps: [
      'Sauté garlic and onion, then add shrimp.',
      'Add coconut milk and squash. Simmer gently.',
      'Add string beans and cook until tender. Season and serve.',
    ],
  },
];

export function filterMeals(
  budget: number,
  time: number,
  restriction: string,
  query = '',
  category = 'All',
) {
  return meals.filter(
    (m) =>
      m.price <= budget &&
      m.minutes <= time &&
      (!restriction || !m.allergens.includes(restriction)) &&
      m.name.toLowerCase().includes(query.toLowerCase()) &&
      (category === 'All' || m.category.includes(category)),
  );
}
