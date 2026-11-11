import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PText } from '@/components/PText';
import { Card } from '@/components/ui';
import { useList } from '@/context/ListContext';
import { fonts, MAX_CONTENT_WIDTH, palette, SCREEN_PADDING } from '@/theme';

export default function ListScreen() {
  const insets = useSafeAreaInsets();
  const { items, total, removeItem, clear } = useList();

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={{ alignItems: 'center', paddingTop: insets.top + 32, paddingBottom: 28 }}
      >
        <View style={styles.inner}>
          <Text style={styles.kicker}>MY LIST</Text>
          <Text style={styles.title} accessibilityRole="header">
            Listahan ng bibilhin
          </Text>

          {items.length === 0 ? (
            <Text style={styles.body}>
              Nothing here yet. Open a recipe and tap ADD TO MY LIST to collect what you need to buy.
            </Text>
          ) : (
            <>
              <Card style={styles.card}>
                {items.map((item, i) => (
                  <View key={item.key} style={[styles.row, i > 0 && styles.rowBorder]}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.name}>{item.name}</Text>
                      <Text style={styles.meta}>
                        {item.qtyLabel} {'·'} {item.recipeTitle}
                      </Text>
                    </View>
                    <PText style={styles.price}>{`₱${item.price}`}</PText>
                    <Pressable
                      onPress={() => removeItem(item.key)}
                      hitSlop={10}
                      accessibilityRole="button"
                      accessibilityLabel={`Remove ${item.name}`}
                    >
                      <Text style={styles.remove}>{'✕'}</Text>
                    </Pressable>
                  </View>
                ))}
              </Card>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  Total {'·'} {items.length} {items.length === 1 ? 'item' : 'items'}
                </Text>
                <PText style={styles.total}>{`₱${total}`}</PText>
              </View>
              <Pressable onPress={clear} accessibilityRole="button" accessibilityLabel="Clear list">
                <Text style={styles.clear}>Clear list</Text>
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg },
  inner: { width: '100%', maxWidth: MAX_CONTENT_WIDTH, paddingHorizontal: SCREEN_PADDING },
  kicker: { fontFamily: fonts.bodyBold, fontSize: 12.5, letterSpacing: 2.2, color: palette.green },
  title: {
    marginTop: 10,
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.5,
    color: palette.ink,
  },
  body: { marginTop: 10, fontFamily: fonts.body, fontSize: 16, lineHeight: 22, color: palette.muted },
  card: { marginTop: 20, paddingHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  rowBorder: { borderTopWidth: 1, borderTopColor: palette.line },
  name: { fontFamily: fonts.bodyBold, fontSize: 16, color: palette.ink },
  meta: { marginTop: 2, fontFamily: fonts.body, fontSize: 13, color: palette.muted },
  price: { fontFamily: fonts.bodyBold, fontSize: 16, color: palette.ink },
  remove: { fontFamily: fonts.bodyBold, fontSize: 14, color: palette.muted, paddingLeft: 4 },
  totalRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: palette.muted },
  total: { fontFamily: fonts.display, fontSize: 28, color: palette.ink },
  clear: {
    marginTop: 16,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: palette.ink,
    textDecorationLine: 'underline',
  },
});
