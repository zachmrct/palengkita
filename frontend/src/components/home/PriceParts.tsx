import { StyleSheet, Text, View } from 'react-native';

import { ClockIcon } from '@/components/icons';
import { PText } from '@/components/PText';
import { Card } from '@/components/ui';
import { basket, priceSnapshot } from '@/data/mock';
import { fonts, palette } from '@/theme';

/** "Presyo ngayon" header accessory: sample timestamp. */
export function SampleStamp() {
  return (
    <View style={styles.stamp}>
      <ClockIcon size={16} color={palette.ink} />
      <Text style={styles.stampText}>Sample {'·'} {basket.asOf}</Text>
    </View>
  );
}

/** Dark "cheapest full basket" card with the three market-type totals. */
export function BasketCard() {
  return (
    <View style={styles.basket}>
      <Text style={styles.basketKicker}>
        Cheapest full basket {'·'} {basket.recipeTitle}, {basket.items} items
      </Text>

      <View style={styles.totalRow}>
        <PText style={styles.total}>{`₱${basket.cheapestTotal}`}</PText>
        <Text style={styles.at}>at {basket.cheapestAt}</Text>
      </View>

      <PText style={styles.save}>
        Save <PText style={styles.saveStrong}>{`₱${basket.saveAmount}`}</PText> vs {basket.saveVs}{' '}
        {'·'} all {basket.items} in stock
      </PText>

      <View style={styles.cells}>
        {basket.byKind.map((cell) => (
          <View
            key={cell.kind}
            style={[styles.cell, cell.best ? styles.cellBest : styles.cellOther]}
            accessible
            accessibilityLabel={`${cell.label}, ₱${cell.total}, ${cell.covered} of ${basket.items} items`}
          >
            <Text style={[styles.cellLabel, cell.best ? { color: palette.ink } : { color: '#B9CDBF' }]}>
              {cell.label}
            </Text>
            <PText style={[styles.cellTotal, { color: cell.best ? palette.ink : '#fff' }]}>
              {`₱${cell.total}`}
            </PText>
            <Text style={[styles.cellItems, cell.best ? { color: palette.ink } : { color: '#B9CDBF' }]}>
              {cell.covered} of {basket.items} items
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/** One-line price check for a single sangkap. */
export function PriceSnapshotCard() {
  return (
    <Card style={styles.snapshot}>
      <View style={{ flex: 1 }}>
        <Text style={styles.snapshotName}>
          {priceSnapshot.item} <Text style={styles.snapshotUnit}>{priceSnapshot.unit}</Text>
        </Text>
        <PText style={styles.snapshotRange}>
          {`₱${priceSnapshot.low} – ₱${priceSnapshot.high} across ${priceSnapshot.stores} stores`}
        </PText>
      </View>
      <View style={styles.snapshotRight}>
        <View style={styles.lowPill}>
          <PText style={styles.lowPillText}>{`₱${priceSnapshot.low}.00`}</PText>
        </View>
        <Text style={styles.lowestAt}>Lowest {'·'} {priceSnapshot.lowestAt}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  stamp: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  stampText: { fontFamily: fonts.body, fontSize: 13, color: palette.ink },

  basket: {
    marginTop: 14,
    padding: 16,
    borderRadius: 20,
    backgroundColor: palette.ink,
    shadowColor: palette.ink,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 3,
  },
  basketKicker: { fontFamily: fonts.body, fontSize: 13, color: '#CFE0D4' },
  totalRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginTop: 6 },
  total: { fontFamily: fonts.display, fontSize: 36, lineHeight: 42, letterSpacing: -0.5, color: palette.gold },
  at: { fontFamily: fonts.body, fontSize: 14, color: '#FBF1D6', marginBottom: 7, flexShrink: 1 },
  save: { marginTop: 2, fontFamily: fonts.body, fontSize: 13.5, lineHeight: 19, color: '#CFE0D4' },
  saveStrong: { fontFamily: fonts.bodyBold, color: '#fff' },
  cells: { flexDirection: 'row', gap: 8, marginTop: 14 },
  cell: {
    flex: 1,
    minHeight: 70,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellBest: { backgroundColor: palette.gold },
  cellOther: {
    backgroundColor: palette.basket,
    borderWidth: 1,
    borderColor: palette.basketLine,
  },
  cellLabel: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 0.9 },
  cellTotal: { marginTop: 3, fontFamily: fonts.bodyBold, fontSize: 19 },
  cellItems: { marginTop: 2, fontFamily: fonts.body, fontSize: 10.5 },

  snapshot: {
    marginTop: 12,
    padding: 14,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  snapshotName: { fontFamily: fonts.bodyBold, fontSize: 17, color: palette.ink },
  snapshotUnit: { fontFamily: fonts.body, fontSize: 14, color: palette.muted },
  snapshotRange: { marginTop: 3, fontFamily: fonts.body, fontSize: 14, color: palette.muted },
  snapshotRight: { alignItems: 'flex-end' },
  lowPill: {
    paddingHorizontal: 13,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: palette.gold,
  },
  lowPillText: { fontFamily: fonts.bodyBold, fontSize: 17, color: palette.ink },
  lowestAt: { marginTop: 6, fontFamily: fonts.bodyBold, fontSize: 12.5, color: palette.green },
});
