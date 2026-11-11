import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ClockIcon } from '@/components/icons';
import { PText } from '@/components/PText';
import { categoryLabel, type Recipe } from '@/data/mock';
import { totalMinutes } from '@/utils/recipeFilters';
import { fonts, palette } from '@/theme';

/** One tile in the two-column Recipes grid. Fills its row so paired cards share a height. */
export function RecipeGridCard({ recipe, onOpen }: { recipe: Recipe; onOpen: () => void }) {
  const name = recipe.gridTitle ?? recipe.title;
  return (
    <Pressable
      onPress={onOpen}
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${recipe.cardPrice} pesos, ${totalMinutes(recipe)} minutes, ${recipe.difficulty}${
        recipe.haveAtHome ? ', you have the ingredients' : ''
      }`}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] }]}
    >
      <View style={styles.photo}>
        <Image source={recipe.photo} contentFit="cover" transition={200} style={StyleSheet.absoluteFill} />
        <View style={styles.price}>
          <PText style={styles.priceText}>{`₱${recipe.cardPrice}`}</PText>
        </View>
        {recipe.haveAtHome ? (
          <View style={styles.have}>
            <Text style={styles.haveText}>MAY KA NA</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.category}>{categoryLabel[recipe.category]}</Text>
      <Text style={styles.title} numberOfLines={2}>
        {name}
      </Text>

      <View style={styles.spacer} />
      <View style={styles.meta}>
        <View style={styles.time}>
          <ClockIcon size={15} color={palette.muted} />
          <Text style={styles.metaText}>{totalMinutes(recipe)} min</Text>
        </View>
        <Text style={[styles.metaText, styles.difficulty]} numberOfLines={1}>
          {recipe.difficulty}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 11,
    borderRadius: 20,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: palette.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 1,
  },
  photo: {
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: palette.sage,
  },
  price: {
    position: 'absolute',
    top: 8,
    left: 8,
    height: 24,
    paddingHorizontal: 9,
    borderRadius: 12,
    backgroundColor: palette.gold,
    justifyContent: 'center',
  },
  priceText: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: palette.ink },
  have: {
    position: 'absolute',
    top: 8,
    right: 8,
    height: 22,
    paddingHorizontal: 8,
    borderRadius: 7,
    backgroundColor: palette.ink,
    justifyContent: 'center',
  },
  haveText: { fontFamily: fonts.bodyBold, fontSize: 9.5, letterSpacing: 0.9, color: '#fff' },
  category: {
    marginTop: 12,
    paddingHorizontal: 3,
    fontFamily: fonts.bodyBold,
    fontSize: 10.5,
    letterSpacing: 1.2,
    color: palette.green,
  },
  title: {
    marginTop: 3,
    paddingHorizontal: 3,
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: -0.2,
    color: palette.ink,
  },
  spacer: { flex: 1, minHeight: 10 },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    paddingHorizontal: 3,
  },
  time: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontFamily: fonts.body, fontSize: 12.5, color: palette.muted },
  difficulty: { flexShrink: 1, textAlign: 'right' },
});
