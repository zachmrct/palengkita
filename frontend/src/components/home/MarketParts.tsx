import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PText } from '@/components/PText';
import { Badge, Card } from '@/components/ui';
import { marketKindLabel, type Market, type MarketKind } from '@/data/mock';
import { fonts, palette } from '@/theme';

/* Filter chips -------------------------------------------------------------- */

export type MarketFilter = 'all' | MarketKind;

export const MARKET_FILTERS: { key: MarketFilter; label: string }[] = [
  { key: 'all', label: 'Lahat' },
  { key: 'palengke', label: 'Palengke' },
  { key: 'grocery', label: 'Grocery' },
  { key: 'supermarket', label: 'Supermarket' },
];

export function FilterChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.filter,
        selected && styles.filterSelected,
        pressed && !selected && { opacity: 0.7 },
      ]}
    >
      <Text style={[styles.filterText, selected && { color: '#fff' }]}>{label}</Text>
    </Pressable>
  );
}

/* Market card --------------------------------------------------------------- */

const KIND_TONE = {
  palengke: 'green',
  grocery: 'gold',
  supermarket: 'outline',
} as const;

export function MarketCard({
  market,
  comparing,
  onViewPrices,
  onToggleCompare,
}: {
  market: Market;
  comparing: boolean;
  onViewPrices: () => void;
  onToggleCompare: () => void;
}) {
  const ratio = market.stockCovered / market.stockTotal;

  return (
    <Card style={styles.card}>
      <View style={styles.top}>
        <View style={styles.thumb}>
          <Image source={market.photo} contentFit="cover" transition={200} style={StyleSheet.absoluteFill} />
        </View>
        <View style={styles.topText}>
          <View style={styles.tagRow}>
            <Badge label={marketKindLabel[market.kind]} tone={KIND_TONE[market.kind]} />
            <Text style={styles.open}>Open {'·'} until {market.openUntil}</Text>
          </View>
          <Text style={styles.name} numberOfLines={1}>
            {market.name}
          </Text>
          <Text style={styles.address} numberOfLines={1}>
            {market.distanceKm} km {'·'} {market.address}
          </Text>
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.statLeft}>
          <Text style={styles.statLabel}>Stock coverage</Text>
          <View
            style={styles.track}
            accessible
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: market.stockTotal, now: market.stockCovered }}
          >
            <View style={[styles.fill, { width: `${Math.round(ratio * 100)}%` }]} />
          </View>
          <Text style={styles.statValue}>
            {market.stockCovered} of {market.stockTotal} items
          </Text>
        </View>
        <View style={styles.statRight}>
          <Text style={styles.statLabel}>Price range</Text>
          <View style={styles.pesos} accessibilityLabel={`${market.priceLevel} of 3`}>
            {[1, 2, 3].map((n) => (
              <PText key={n} style={[styles.peso, n > market.priceLevel && { opacity: 0.22 }]}>
                {'₱'}
              </PText>
            ))}
          </View>
          <Text style={styles.priceNote}>{market.priceNote}</Text>
        </View>
      </View>

      <View style={styles.buttons}>
        <Pressable
          onPress={onViewPrices}
          accessibilityRole="button"
          accessibilityLabel={`View prices at ${market.name}`}
          style={({ pressed }) => [styles.primary, pressed && { opacity: 0.85, transform: [{ scale: 0.985 }] }]}
        >
          <Text style={styles.primaryText}>VIEW PRICES</Text>
        </Pressable>
        <Pressable
          onPress={onToggleCompare}
          accessibilityRole="button"
          accessibilityState={{ selected: comparing }}
          accessibilityLabel={comparing ? `Remove ${market.name} from compare` : `Compare ${market.name}`}
          style={({ pressed }) => [
            styles.secondary,
            comparing && styles.secondaryOn,
            pressed && { opacity: 0.85 },
          ]}
        >
          <Text style={[styles.secondaryText, comparing && { color: '#fff' }]}>
            {comparing ? 'Comparing ✓' : 'Compare'}
          </Text>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  filter: {
    height: 34,
    paddingHorizontal: 17,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  filterSelected: { backgroundColor: palette.ink, borderColor: palette.ink },
  filterText: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: palette.ink },

  card: { marginTop: 14, padding: 15, borderRadius: 20 },
  top: { flexDirection: 'row', gap: 14 },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: palette.sage,
  },
  topText: { flex: 1, justifyContent: 'center' },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  open: { fontFamily: fonts.body, fontSize: 12.5, color: palette.muted },
  name: {
    marginTop: 6,
    fontFamily: fonts.bodyBold,
    fontSize: 17,
    lineHeight: 22,
    color: palette.ink,
  },
  address: { marginTop: 1, fontFamily: fonts.body, fontSize: 13, color: palette.muted },

  stats: { flexDirection: 'row', gap: 16, marginTop: 16 },
  statLeft: { flex: 1.15 },
  statRight: { flex: 1 },
  statLabel: { fontFamily: fonts.body, fontSize: 12.5, color: palette.muted },
  track: {
    height: 6,
    marginTop: 8,
    borderRadius: 3,
    backgroundColor: palette.track,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 3, backgroundColor: palette.green },
  statValue: { marginTop: 7, fontFamily: fonts.bodyBold, fontSize: 14, color: palette.ink },
  pesos: { flexDirection: 'row', gap: 6, marginTop: 5 },
  peso: { fontFamily: fonts.display, fontSize: 15, color: palette.ink },
  priceNote: { marginTop: 3, fontFamily: fonts.body, fontSize: 12.5, color: palette.muted },

  buttons: { flexDirection: 'row', gap: 10, marginTop: 14 },
  primary: {
    flex: 1,
    height: 36,
    borderRadius: 14,
    backgroundColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { fontFamily: fonts.bodyBold, fontSize: 13.5, letterSpacing: 0.9, color: '#fff' },
  secondary: {
    flex: 1,
    height: 36,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryOn: { backgroundColor: palette.ink },
  secondaryText: { fontFamily: fonts.bodyBold, fontSize: 14, color: palette.ink },
});
