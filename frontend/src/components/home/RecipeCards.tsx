import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ClockIcon, DifficultyIcon, ServingsIcon } from '@/components/icons';
import { PText } from '@/components/PText';
import { Badge, Card } from '@/components/ui';
import { recipeCost, scalePrice, type Recipe } from '@/data/mock';
import { fonts, palette } from '@/theme';

/* Big "Today's pick" card ------------------------------------------------ */

export function TodaysPickCard({
  recipe,
  budget,
  people,
  onOpen,
}: {
  recipe: Recipe;
  budget: number;
  people: number;
  onOpen: () => void;
}) {
  const cost = recipeCost(recipe, people);
  const perServing = Math.round(cost / people);
  const fits = cost <= budget;
  const nearby = scalePrice(15, recipe.baseServings, people);

  return (
    <Card style={styles.pick}>
      <Pressable
        onPress={onOpen}
        accessibilityRole="button"
        accessibilityLabel={`Open recipe: ${recipe.title}`}
      >
        <View style={styles.pickPhoto}>
          <Image
            source={recipe.photo}
            contentFit="cover"
            transition={200}
            style={StyleSheet.absoluteFill}
            accessibilityLabel="Ginisang monggo with malunggay"
          />
          <Badge label="TODAY'S PICK" tone="gold" style={styles.pickBadge} />
          <Badge label="SAMPLE" tone="white" style={styles.sampleBadge} />
        </View>

        <Text style={styles.pickTitle}>{recipe.title}</Text>
        <Text style={styles.pickBlurb}>{recipe.blurb}</Text>
      </Pressable>

      <View style={styles.metaBar}>
        <MetaItem icon={<ClockIcon size={17} color={palette.ink} />}>
          {`${recipe.prepMinutes} + ${recipe.cookMinutes} min`}
        </MetaItem>
        <MetaItem icon={<ServingsIcon size={17} color={palette.ink} />}>
          {`${people} ${people === 1 ? 'serving' : 'servings'}`}
        </MetaItem>
        <MetaItem icon={<DifficultyIcon size={16} />}>{recipe.difficulty}</MetaItem>
      </View>

      <View style={styles.chips}>
        <Chip tone={fits ? 'ok' : 'warn'}>
          {fits ? `Fits your ₱${budget} budget` : `Over your ₱${budget} budget`}
        </Chip>
        <Chip>Uses your monggo</Chip>
        <Chip>{`Malunggay ₱${nearby} nearby`}</Chip>
      </View>

      <View style={styles.costRow}>
        <View>
          <Text style={styles.costLabel}>Est. ingredient cost</Text>
          <View style={styles.costLine}>
            <View style={styles.costBox}>
              <PText style={styles.costValue}>{`₱${cost}`}</PText>
            </View>
            <PText style={styles.perServing}>{`₱${perServing} / serving`}</PText>
          </View>
        </View>
        <Pressable
          onPress={onOpen}
          accessibilityRole="button"
          accessibilityLabel="Magluto na"
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
        >
          <Text style={styles.ctaText}>MAGLUTO NA</Text>
          <Text style={styles.ctaArrow}>{'→'}</Text>
        </Pressable>
      </View>
    </Card>
  );
}

function MetaItem({ icon, children }: { icon: React.ReactNode; children: string }) {
  return (
    <View style={styles.metaItem}>
      {icon}
      <Text style={styles.metaText}>{children}</Text>
    </View>
  );
}

function Chip({ children, tone = 'ok' }: { children: string; tone?: 'ok' | 'warn' }) {
  return (
    <View style={[styles.chip, tone === 'warn' && { backgroundColor: '#F7E1D8' }]}>
      <PText style={[styles.chipText, tone === 'warn' && { color: palette.error }]}>{children}</PText>
    </View>
  );
}

/* Small carousel card ------------------------------------------------------ */

export const MINI_CARD_WIDTH = 229;

export function MiniRecipeCard({ recipe, onOpen }: { recipe: Recipe; onOpen: () => void }) {
  return (
    <Pressable
      onPress={onOpen}
      accessibilityRole="button"
      accessibilityLabel={`${recipe.title}, ₱${recipe.cardPrice}`}
      style={({ pressed }) => [{ width: MINI_CARD_WIDTH }, pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] }]}
    >
      <Card style={styles.mini}>
        <View style={styles.miniPhoto}>
          <Image source={recipe.photo} contentFit="cover" transition={200} style={StyleSheet.absoluteFill} />
          <View style={styles.pricePill}>
            <PText style={styles.pricePillText}>{`₱${recipe.cardPrice}`}</PText>
          </View>
        </View>
        <Text style={styles.miniTitle} numberOfLines={1}>
          {recipe.title}
        </Text>
        <Text style={styles.miniBlurb} numberOfLines={2}>
          {recipe.cardBlurb}
        </Text>
        <View style={styles.miniMeta}>
          <View style={styles.miniMetaItem}>
            <ClockIcon size={14} color={palette.ink} />
            <Text style={styles.miniMetaText}>{recipe.prepMinutes + recipe.cookMinutes} min</Text>
          </View>
          <View style={styles.miniMetaItem}>
            <DifficultyIcon size={13} colorful />
            <Text style={styles.miniMetaText}>{recipe.difficulty}</Text>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pick: { marginTop: 14, padding: 16 },
  pickPhoto: {
    height: 177,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: palette.sage,
  },
  pickBadge: { position: 'absolute', top: 14, left: 14 },
  sampleBadge: { position: 'absolute', top: 14, right: 14 },
  pickTitle: {
    marginTop: 16,
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 27,
    letterSpacing: -0.3,
    color: palette.ink,
  },
  pickBlurb: {
    marginTop: 8,
    fontFamily: fonts.body,
    fontSize: 14.5,
    lineHeight: 20,
    color: palette.muted,
  },
  metaBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 18,
    rowGap: 6,
    marginTop: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: palette.line,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  metaText: { fontFamily: fonts.bodyMedium, fontSize: 13.5, color: palette.ink },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 12 },
  chip: {
    height: 24,
    paddingHorizontal: 11,
    borderRadius: 8,
    backgroundColor: palette.chip,
    justifyContent: 'center',
  },
  chipText: { fontFamily: fonts.bodySemiBold, fontSize: 12.5, color: palette.green },
  costRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  costLabel: { fontFamily: fonts.body, fontSize: 12.5, color: palette.muted },
  costLine: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 5 },
  costBox: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: palette.goldSoft,
  },
  costValue: { fontFamily: fonts.display, fontSize: 24, lineHeight: 30, color: palette.ink },
  perServing: { fontFamily: fonts.body, fontSize: 13.5, color: palette.muted },
  cta: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: palette.ink,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  ctaText: { fontFamily: fonts.bodyBold, fontSize: 13.5, letterSpacing: 1, color: '#fff' },
  ctaArrow: { fontFamily: fonts.bodyMedium, fontSize: 15, color: '#fff' },

  mini: { padding: 12, borderRadius: 20 },
  miniPhoto: { height: 115, borderRadius: 14, overflow: 'hidden', backgroundColor: palette.sage },
  pricePill: {
    position: 'absolute',
    top: 9,
    left: 9,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: palette.gold,
  },
  pricePillText: { fontFamily: fonts.bodyBold, fontSize: 12, color: palette.ink },
  miniTitle: {
    marginTop: 12,
    fontFamily: fonts.display,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.2,
    color: palette.ink,
  },
  miniBlurb: {
    marginTop: 3,
    minHeight: 36,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: palette.muted,
  },
  miniMeta: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: palette.line,
  },
  miniMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  miniMetaText: { fontFamily: fonts.bodyMedium, fontSize: 12.5, color: palette.ink },
});
