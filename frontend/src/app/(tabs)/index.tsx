import { MealBrowser } from '@/components/meals/MealBrowser';

export default function HomeScreen() {
  // Home builds its own scroll view (fixed header + pinned section header), so no <Screen> wrapper.
  return <MealBrowser home />;
}
