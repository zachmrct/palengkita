import { Image } from 'expo-image';

import type { Meal } from './meals';

const warm = new Set<string>();

/**
 * Decode / download meal photos ahead of time so the recipe carousel never waits on an image.
 * Bundled assets are loaded into memory; remote URLs (once the API serves them) are prefetched to
 * the disk + memory cache. Each meal is only warmed once.
 */
export function prefetchMealImages(items: Meal[]) {
  for (const meal of items) {
    if (warm.has(meal.id)) continue;
    warm.add(meal.id);
    const source: unknown = meal.image;
    try {
      if (typeof source === 'number') {
        Image.loadAsync(source).catch(() => warm.delete(meal.id));
      } else if (typeof source === 'string') {
        Image.prefetch(source).catch(() => warm.delete(meal.id));
      } else if (source && typeof source === 'object' && 'uri' in source && typeof source.uri === 'string') {
        Image.prefetch(source.uri).catch(() => warm.delete(meal.id));
      }
    } catch {
      warm.delete(meal.id);
    }
  }
}
