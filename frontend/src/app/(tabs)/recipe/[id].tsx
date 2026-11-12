import { Image } from 'expo-image';
import { Link, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CalendarPlus, Check, Clock3, Flame, Heart, ShoppingBasket, UsersRound } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PText } from '@/components/PText';
import { Button } from '@/components/kit/Button';
import { Checkbox } from '@/components/kit/Checkbox';
import { CategoryTabs } from '@/components/kit/CategoryTabs';
import { useShell } from '@/components/kit/layout';
import { Screen } from '@/components/kit/Screen';
import { Eyebrow, H1, H2, RoundLink, SectionHeading, typography } from '@/components/kit/Typography';
import { usePalengkita } from '@/context/PalengkitaContext';
import { meals } from '@/data/meals';
import { ds, fonts } from '@/theme';

const TABS = [
  { key: 'Ingredients', label: 'Ingredients' },
  { key: 'How to cook', label: 'How to cook' },
];

export default function RecipeRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // Keyed so the tab, "added" state and checked ingredients reset when the recipe changes.
  return (
    <Screen>
      <MealDetail key={id} mealId={id} />
    </Screen>
  );
}

function MealDetail({ mealId }: { mealId?: string }) {
  const meal = meals.find((m) => m.id === mealId);
  const { addMeal, saved, toggleSaved } = usePalengkita();
  const { compact, contentWidth } = useShell();
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState('Ingredients');
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  if (!meal) {
    return (
      <View style={styles.notFound}>
        <H1>Recipe not found</H1>
        <Link href="/recipes" style={styles.notFoundLink}>
          Back to recipes
        </Link>
      </View>
    );
  }

  const isSaved = saved.includes(meal.id);
  const columns = compact ? 2 : 3;
  const cardWidth = Math.floor((contentWidth - 8 * (columns - 1)) / columns);
  const plated = 280;

  return (
    <View>
      <View style={styles.actions}>
        <RoundLink href="/recipes" icon={ArrowLeft} iconSize={21} label="Back to recipes" />
        <Text style={styles.actionsLabel}>LUTONG BAHAY</Text>
        <Button
          variant="outline"
          size="icon"
          icon={Heart}
          iconFilled={isSaved}
          accessibilityLabel="Save recipe"
          onPress={() => toggleSaved(meal.id)}
        />
      </View>

      <View style={[styles.plated, { width: plated, height: plated, borderRadius: plated / 2 }]}>
        <Image source={meal.image} contentFit="contain" accessibilityLabel={meal.name} style={{ width: 270, height: 270 }} />
      </View>

      <View style={{ alignItems: 'center' }}>
        <Eyebrow small center>
          {meal.tag}
        </Eyebrow>
        <H1 size={33} style={{ textAlign: 'center' }}>
          {meal.name}
        </H1>
        <Text style={styles.subtitle}>{meal.subtitle}</Text>
        <PText style={styles.price}>
          {`₱${meal.price} `}
          <Text style={styles.priceNote}>/ serving · estimated</Text>
        </PText>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Clock3 size={16} color={ds.foreground} />
          <Text style={styles.statText}>{`${meal.minutes} min`}</Text>
        </View>
        <View style={styles.stat}>
          <Flame size={16} color={ds.foreground} />
          <Text style={styles.statText}>{`${meal.calories} kcal`}</Text>
        </View>
        <View style={styles.stat}>
          <UsersRound size={16} color={ds.foreground} />
          <Text style={styles.statText}>2 servings</Text>
        </View>
      </View>

      {meal.allergens.length > 0 ? (
        <Text style={styles.allergens}>{`Contains: ${meal.allergens.join(', ').toLowerCase()}`}</Text>
      ) : null}

      <CategoryTabs tabs={TABS} selected={tab} onSelect={setTab} />

      {tab === 'Ingredients' ? (
        <>
          <SectionHeading trailing={<Text style={typography.muted}>For 2 people</Text>}>
            <H2>What you’ll need</H2>
          </SectionHeading>
          <View style={styles.grid}>
            {meal.ingredients.map((i) => {
              const on = !!checked[i.name];
              return (
                <Pressable
                  key={i.name}
                  onPress={() => setChecked((c) => ({ ...c, [i.name]: !on }))}
                  accessibilityRole="checkbox"
                  accessibilityLabel={`${i.name}, ${i.amount}`}
                  accessibilityState={{ checked: on }}
                  style={[styles.card, { width: cardWidth }, on && styles.cardOn]}
                >
                  <Checkbox checked={on} size={14} style={styles.cardCheck} />
                  <Text style={styles.emoji}>{i.emoji}</Text>
                  <Text style={styles.ingName}>{i.name}</Text>
                  <Text style={styles.ingAmount}>{i.amount}</Text>
                  <PText style={styles.ingPrice}>{`~₱${i.price}`}</PText>
                </Pressable>
              );
            })}
          </View>
        </>
      ) : (
        <View>
          {meal.steps.map((s, i) => (
            <View key={s} style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{s}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={typography.estimateNote}>Prices are sample estimates and may vary by market.</Text>

      <View style={{ gap: 10 }}>
        <Button
          size="lg"
          icon={added ? Check : ShoppingBasket}
          label={added ? 'Added to My List' : 'Add ingredients to My List'}
          style={{ height: 46 }}
          onPress={() => {
            addMeal(meal);
            setAdded(true);
          }}
        />
        <Button variant="outline" href="/schedule" icon={CalendarPlus} label="Add to schedule" style={{ height: 42 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  notFound: { alignItems: 'center', paddingVertical: 55, gap: 14 },
  notFoundLink: { fontFamily: fonts.sans, fontSize: 14, color: ds.foreground },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actionsLabel: { fontFamily: fonts.sans, fontSize: 10, color: ds.foreground },
  plated: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 26,
    backgroundColor: ds.butter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: { fontFamily: fonts.sans, fontSize: 12, color: ds.mutedForeground, marginTop: 8, textAlign: 'center' },
  price: { fontFamily: fonts.sansSemiBold, fontSize: 24, color: ds.foreground, marginTop: 14 },
  priceNote: { fontFamily: fonts.sans, fontSize: 11, color: ds.mutedForeground },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 20,
    marginTop: 20,
    marginBottom: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: ds.border,
  },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  statText: { fontFamily: fonts.sans, fontSize: 12, color: ds.foreground },
  allergens: { fontFamily: fonts.sans, fontSize: 11, color: ds.mutedForeground, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  card: {
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: ds.border,
    borderRadius: 8,
    backgroundColor: ds.card,
  },
  cardOn: { backgroundColor: ds.mint, borderColor: ds.green },
  cardCheck: { position: 'absolute', top: 6, right: 6 },
  emoji: { fontSize: 37, height: 55, lineHeight: 55 },
  ingName: { fontFamily: fonts.sansMedium, fontSize: 11, color: ds.foreground, textAlign: 'center' },
  ingAmount: { fontFamily: fonts.sans, fontSize: 10, color: ds.mutedForeground, marginTop: 4, textAlign: 'center' },
  ingPrice: { fontFamily: fonts.sans, fontSize: 10, color: ds.foreground, marginTop: 8 },
  step: { flexDirection: 'row', gap: 15, marginVertical: 20 },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: ds.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: { fontFamily: fonts.sans, fontSize: 14, color: ds.foreground },
  stepText: { flex: 1, fontFamily: fonts.sans, fontSize: 13, lineHeight: 22, color: ds.foreground },
});
