import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/kit/Skeleton';
import { useShell } from '@/components/kit/layout';
import { ds } from '@/theme';

import { ROW_CARD_HEIGHT } from './MealCard';

/** Placeholder for a Home card (`MealRowCard`). */
export function RowCardSkeleton() {
  return (
    <View style={styles.row}>
      <Skeleton style={styles.rowImage} />
      <View style={styles.rowCopy}>
        <Skeleton style={{ height: 18, width: '70%' }} />
        <Skeleton style={{ height: 11, width: '95%', marginTop: 4 }} />
        <Skeleton style={{ height: 11, width: '80%' }} />
        <Skeleton style={{ height: 11, width: '35%', marginTop: 14 }} />
      </View>
    </View>
  );
}

/** Placeholders for the 2-column Recipes grid (`MealCard`). */
export function GridSkeleton({ count = 4 }: { count?: number }) {
  const { contentWidth } = useShell();
  const width = Math.floor((contentWidth - 12) / 2);
  return (
    <View style={styles.grid}>
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={{ width }}>
          <Skeleton style={{ height: 176, borderRadius: 8 }} />
          <Skeleton style={{ height: 14, width: '75%', marginTop: 12 }} />
          <Skeleton style={{ height: 10, width: '55%', marginTop: 8 }} />
          <Skeleton style={{ height: 12, width: '90%', marginTop: 12 }} />
        </View>
      ))}
    </View>
  );
}

/** Placeholder for everything under the recipe carousel. */
export function DetailSkeleton() {
  const { contentWidth } = useShell();
  const tile = Math.floor((contentWidth - 16) / 3);
  return (
    <View style={{ alignItems: 'center' }}>
      <Skeleton style={{ height: 10, width: 90 }} />
      <Skeleton style={{ height: 30, width: '70%', marginTop: 14 }} />
      <Skeleton style={{ height: 12, width: '50%', marginTop: 12 }} />
      <Skeleton style={{ height: 22, width: 120, marginTop: 16 }} />
      <Skeleton style={{ height: 58, width: '100%', marginTop: 24, borderRadius: 4 }} />
      <Skeleton style={{ height: 22, width: '45%', alignSelf: 'flex-start', marginTop: 28 }} />
      <View style={[styles.grid, { marginTop: 16 }]}>
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} style={{ width: tile, height: 118 }} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: ROW_CARD_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 28,
    backgroundColor: ds.card,
    borderWidth: 1,
    borderColor: ds.border,
  },
  rowImage: { width: 118, height: 118, borderRadius: 59 },
  rowCopy: { flex: 1, gap: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 8, rowGap: 22 },
});
