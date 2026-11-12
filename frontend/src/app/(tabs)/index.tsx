import { MealBrowser } from '@/components/meals/MealBrowser';
import { Screen } from '@/components/kit/Screen';

export default function HomeScreen() {
  return (
    <Screen>
      <MealBrowser home />
    </Screen>
  );
}
