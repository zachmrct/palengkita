import { Image } from 'expo-image';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  DifficultyIcon,
  HeartIcon,
} from '@/components/icons';
import { PText } from '@/components/PText';
import { Badge, Card, SectionHeader, StepperButton } from '@/components/ui';
import { useList, type ListItem } from '@/context/ListContext';
import { basket, markets, recipeById, scalePrice, scaleQty } from '@/data/mock';
import { fonts, MAX_CONTENT_WIDTH, palette, radii } from '@/theme';

const MIN_SERVINGS = 1;
const MAX_SERVINGS = 12;

export default function RecipeScreen() {
  const { id, servings: servingsParam } = useLocalSearchParams<{ id: string; servings?: string }>();
  const recipe = recipeById(id);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addItems } = useList();

  const initial = Number.parseInt(servingsParam ?? '', 10);
  const [servings, setServings] = useState(
    Number.isFinite(initial) ? Math.min(MAX_SERVINGS, Math.max(MIN_SERVINGS, initial)) : (recipe?.baseServings ?? 4),
  );
  const [have, setHave] = useState<Set<string>>(new Set());
  const [done, setDone] = useState<Set<string>>(new Set());
  const [liked, setLiked] = useState(false);
  // Remembers what was added; any change to servings or owned items makes it stale.
  const [addedSnapshot, setAddedSnapshot] = useState<string | null>(null);
  const snapshot = `${servings}|${[...have].sort().join(',')}`;
  const added = addedSnapshot === snapshot;

  if (!recipe) return <Redirect href="/" />;

  const toggle = (set: Set<string>, key: string) => {
    const next = new Set(set);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    return next;
  };

  const priced = recipe.ingredients.map((ing) => ({
    ing,
    price: scalePrice(ing.price, recipe.baseServings, servings),
    qty: `${scaleQty(ing.qty, recipe.baseServings, servings)} ${ing.unit}`,
  }));
  const total = priced.reduce((sum, p) => sum + p.price, 0);
  const toBuy = priced.filter((p) => !have.has(p.ing.id));
  const toBuyTotal = toBuy.reduce((sum, p) => sum + p.price, 0);
  const cheapest = markets.find((m) => m.name === basket.cheapestAt) ?? markets[0];

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const addToList = () => {
    if (toBuy.length === 0) return;
    const items: ListItem[] = toBuy.map((p) => ({
      key: `${recipe.id}:${p.ing.id}`,
      recipeTitle: recipe.title,
      name: p.ing.name,
      qtyLabel: p.qty,
      price: p.price,
    }));
    addItems(items);
    setAddedSnapshot(snapshot);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Dark header with hero photo */}
        <View style={styles.header}>
          <View style={[styles.headerInner, { paddingTop: insets.top + 10 }]}>
            <View style={styles.headerBar}>
              <RoundButton label="Go back" onPress={goBack}>
                <ChevronLeftIcon size={22} color="#fff" strokeWidth={2.4} />
              </RoundButton>
              <Text style={styles.headerLabel}>RECIPE</Text>
              <RoundButton
                label={liked ? 'Remove from favorites' : 'Save to favorites'}
                selected={liked}
                onPress={() => setLiked((v) => !v)}
              >
                <HeartIcon size={20} filled={liked} color={liked ? palette.gold : '#fff'} strokeWidth={2} />
              </RoundButton>
            </View>
            <View style={styles.hero}>
              <Image
                source={recipe.heroPhoto}
                contentFit="cover"
                transition={200}
                style={StyleSheet.absoluteFill}
                accessibilityLabel={recipe.title}
              />
              <Badge label="SAMPLE" tone="white" style={styles.sample} />
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.kicker}>{recipe.tags.join(' · ').toUpperCase()}</Text>
          <Text style={styles.title} accessibilityRole="header">
            {recipe.title}
          </Text>
          <Text style={styles.blurb}>{recipe.blurb}</Text>

          {/* Stats */}
          <View style={styles.stats}>
            <Stat label="Prep + cook" icon={<ClockIcon size={18} color={palette.ink} />}>
              {`${recipe.prepMinutes} + ${recipe.cookMinutes} min`}
            </Stat>
            <Stat label="Difficulty" icon={<DifficultyIcon size={17} />}>
              {recipe.difficulty}
            </Stat>
            <Stat label="Protein" icon={null}>
              {recipe.protein}
            </Stat>
          </View>

          {/* Servings */}
          <Card style={styles.servings}>
            <View>
              <Text style={styles.cardLabel}>Servings</Text>
              <Text style={styles.servingsValue} accessibilityLiveRegion="polite">
                {servings} {servings === 1 ? 'person' : 'people'}
              </Text>
            </View>
            <View style={styles.stepperRow}>
              <StepperButton
                kind="minus"
                label="Fewer servings"
                disabled={servings <= MIN_SERVINGS}
                onPress={() => setServings((s) => Math.max(MIN_SERVINGS, s - 1))}
              />
              <StepperButton
                kind="plus"
                label="More servings"
                disabled={servings >= MAX_SERVINGS}
                onPress={() => setServings((s) => Math.min(MAX_SERVINGS, s + 1))}
              />
            </View>
          </Card>

          {/* Cost */}
          <View style={styles.cost}>
            <Text style={styles.costKicker}>Est. cost to buy {'·'} {servings} servings</Text>
            <View style={styles.costRow}>
              <PText style={styles.costTotal}>{`₱${total}`}</PText>
              <PText style={styles.costPer}>{`₱${Math.round(total / servings)} / serving`}</PText>
            </View>
            <Text style={styles.costNote}>Sample prices from 3 stores near you {'·'} 8:40 AM</Text>
            <Pressable
              onPress={() => router.navigate('/markets')}
              accessibilityRole="button"
              accessibilityLabel={`Cheapest at ${cheapest.name}, ${cheapest.distanceKm} kilometers`}
              style={({ pressed }) => [styles.cheapest, pressed && { opacity: 0.85 }]}
            >
              <Text style={styles.cheapestText} numberOfLines={1}>
                Cheapest at {cheapest.name} {'·'} {cheapest.distanceKm} km
              </Text>
              <ChevronRightIcon size={16} color={palette.ink} strokeWidth={2.4} />
            </Pressable>
          </View>

          {/* Ingredients */}
          <View style={styles.section}>
            <SectionHeader title="Mga sangkap" right={<Text style={styles.hint}>Tap what you have</Text>} />
            <View style={styles.list}>
              {priced.map(({ ing, price, qty }) => {
                const owned = have.has(ing.id);
                return (
                  <Pressable
                    key={ing.id}
                    onPress={() => setHave((h) => toggle(h, ing.id))}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: owned }}
                    accessibilityLabel={`${ing.name}, ${qty}, ${price} pesos. I have this`}
                    style={({ pressed }) => [pressed && { opacity: 0.85 }]}
                  >
                    <Card style={[styles.ingredient, owned && styles.ingredientOwned]}>
                      <View style={[styles.checkbox, owned && styles.checkboxOn]}>
                        {owned ? <CheckIcon size={14} color="#fff" /> : null}
                      </View>
                      <View style={styles.thumb}>
                        {ing.photo ? (
                          <Image source={ing.photo} contentFit="cover" style={StyleSheet.absoluteFill} />
                        ) : null}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.ingName, owned && styles.struck]}>{ing.name}</Text>
                        <Text style={styles.ingQty}>{qty}</Text>
                      </View>
                      <PText style={[styles.ingPrice, owned && styles.struck]}>{`₱${price}`}</PText>
                    </Card>
                  </Pressable>
                );
              })}
            </View>
            <Text style={styles.pantry}>
              Pantry basics not counted: {recipe.pantry.join(', ')}
            </Text>
          </View>

          {/* Steps */}
          <View style={styles.section}>
            <SectionHeader
              title="Paano lutuin"
              right={
                <Text style={styles.hint} accessibilityLiveRegion="polite">
                  {done.size} of {recipe.steps.length} done
                </Text>
              }
            />
            <View style={styles.list}>
              {recipe.steps.map((step, i) => {
                const isDone = done.has(step.id);
                return (
                  <Pressable
                    key={step.id}
                    onPress={() => setDone((d) => toggle(d, step.id))}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isDone }}
                    accessibilityLabel={`Step ${i + 1}: ${step.title}. ${step.body}`}
                    style={({ pressed }) => [pressed && { opacity: 0.85 }]}
                  >
                    <Card style={[styles.step, isDone && styles.ingredientOwned]}>
                      <View style={[styles.stepNum, isDone && styles.stepNumDone]}>
                        {isDone ? (
                          <CheckIcon size={16} color="#fff" />
                        ) : (
                          <Text style={styles.stepNumText}>{i + 1}</Text>
                        )}
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={styles.stepHead}>
                          <Text style={[styles.stepTitle, isDone && styles.struck]} numberOfLines={2}>
                            {step.title}
                          </Text>
                          <View style={styles.timePill}>
                            <Text style={styles.timeText}>{step.minutes} min</Text>
                          </View>
                        </View>
                        <Text style={styles.stepBody}>{step.body}</Text>
                      </View>
                    </Card>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky footer */}
      <View style={styles.footerWrap}>
        <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
          <View>
            <Text style={styles.footerLabel}>
              To buy {'·'} {toBuy.length} {toBuy.length === 1 ? 'item' : 'items'}
            </Text>
            <PText style={styles.footerTotal}>{`₱${toBuyTotal}`}</PText>
          </View>
          <Pressable
            onPress={added ? () => router.navigate('/list') : addToList}
            disabled={toBuy.length === 0}
            accessibilityRole="button"
            accessibilityLabel={added ? 'View my list' : 'Add to my list'}
            style={({ pressed }) => [
              styles.addBtn,
              added && styles.addBtnDone,
              toBuy.length === 0 && { opacity: 0.45 },
              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            ]}
          >
            <Text style={[styles.addText, added && { color: palette.ink }]}>
              {added ? 'ADDED · VIEW LIST' : 'ADD TO MY LIST'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function RoundButton({
  children,
  onPress,
  label,
  selected,
}: {
  children: React.ReactNode;
  onPress: () => void;
  label: string;
  selected?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={selected === undefined ? undefined : { selected }}
      style={({ pressed }) => [styles.round, pressed && { opacity: 0.75 }]}
    >
      {children}
    </Pressable>
  );
}

function Stat({ label, icon, children }: { label: string; icon: React.ReactNode; children: string }) {
  return (
    <Card style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statValueRow}>
        {icon}
        <Text style={styles.statValue} numberOfLines={1}>
          {children}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg },

  header: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: palette.ink,
    borderBottomLeftRadius: radii.headerBottom,
    borderBottomRightRadius: radii.headerBottom,
  },
  headerInner: { width: '100%', maxWidth: MAX_CONTENT_WIDTH, paddingHorizontal: 16, paddingBottom: 18 },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerLabel: { fontFamily: fonts.bodyBold, fontSize: 13, letterSpacing: 2.4, color: palette.gold },
  round: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.headerButton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    height: 210,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: palette.basket,
  },
  sample: { position: 'absolute', top: 12, right: 12 },

  body: { width: '100%', maxWidth: MAX_CONTENT_WIDTH, paddingHorizontal: 20, paddingTop: 22 },
  kicker: { fontFamily: fonts.bodyBold, fontSize: 12.5, letterSpacing: 1.8, color: palette.green },
  title: {
    marginTop: 8,
    fontFamily: fonts.display,
    fontSize: 31,
    lineHeight: 35,
    letterSpacing: -0.6,
    color: palette.ink,
  },
  blurb: { marginTop: 10, fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: palette.muted },

  stats: { flexDirection: 'row', gap: 10, marginTop: 20 },
  stat: { flex: 1, padding: 12, borderRadius: 18 },
  statLabel: { fontFamily: fonts.body, fontSize: 12, color: palette.muted },
  statValueRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  statValue: { flexShrink: 1, fontFamily: fonts.bodyBold, fontSize: 14.5, color: palette.ink },

  servings: {
    marginTop: 12,
    padding: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLabel: { fontFamily: fonts.body, fontSize: 12.5, color: palette.muted },
  servingsValue: { marginTop: 2, fontFamily: fonts.bodyBold, fontSize: 18, color: palette.ink },
  stepperRow: { flexDirection: 'row', gap: 10 },

  cost: {
    marginTop: 12,
    padding: 18,
    borderRadius: 22,
    backgroundColor: palette.ink,
  },
  costKicker: { fontFamily: fonts.body, fontSize: 13, color: '#CFE0D4' },
  costRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, marginTop: 6 },
  costTotal: { fontFamily: fonts.display, fontSize: 40, lineHeight: 46, letterSpacing: -0.6, color: palette.gold },
  costPer: { fontFamily: fonts.body, fontSize: 14.5, color: '#FBF1D6', marginBottom: 8 },
  costNote: { marginTop: 2, fontFamily: fonts.body, fontSize: 12.5, color: '#B9CDBF' },
  cheapest: {
    marginTop: 14,
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 21,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cheapestText: { flexShrink: 1, fontFamily: fonts.bodyBold, fontSize: 14, color: palette.ink },

  section: { marginTop: 28 },
  hint: { fontFamily: fonts.body, fontSize: 13.5, color: palette.muted, marginBottom: 3 },
  list: { marginTop: 12, gap: 10 },

  ingredient: {
    padding: 10,
    paddingRight: 16,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ingredientOwned: { backgroundColor: palette.sageSoft, borderColor: '#D5E3CB' },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: palette.green, borderColor: palette.green },
  thumb: { width: 48, height: 48, borderRadius: 12, overflow: 'hidden', backgroundColor: palette.sage },
  ingName: { fontFamily: fonts.bodyBold, fontSize: 16, color: palette.ink },
  ingQty: { marginTop: 1, fontFamily: fonts.body, fontSize: 13.5, color: palette.muted },
  ingPrice: { fontFamily: fonts.bodyBold, fontSize: 16, color: palette.ink },
  struck: { textDecorationLine: 'line-through', opacity: 0.55 },
  pantry: { marginTop: 14, fontFamily: fonts.body, fontSize: 13.5, lineHeight: 19, color: palette.muted },

  step: { padding: 14, borderRadius: 18, flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  stepNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumDone: { backgroundColor: palette.green },
  stepNumText: { fontFamily: fonts.bodyBold, fontSize: 15, color: '#fff' },
  stepHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  stepTitle: { flexShrink: 1, fontFamily: fonts.bodyBold, fontSize: 16, color: palette.ink },
  timePill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: palette.goldSoft,
  },
  timeText: { fontFamily: fonts.bodySemiBold, fontSize: 12.5, color: palette.ink },
  stepBody: { marginTop: 5, fontFamily: fonts.body, fontSize: 14.5, lineHeight: 21, color: palette.muted },

  footerWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    backgroundColor: palette.tabBar,
    borderTopWidth: 1,
    borderTopColor: palette.line,
  },
  footer: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    paddingHorizontal: 20,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  footerLabel: { fontFamily: fonts.body, fontSize: 13, color: palette.muted },
  footerTotal: { fontFamily: fonts.display, fontSize: 26, lineHeight: 31, color: palette.ink },
  addBtn: {
    flex: 1,
    maxWidth: 230,
    height: 52,
    borderRadius: 16,
    backgroundColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDone: { backgroundColor: palette.gold },
  addText: { fontFamily: fonts.bodyBold, fontSize: 14.5, letterSpacing: 1, color: '#fff' },
});
