import { ShoppingBasket, Store, Trash2 } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PText } from '@/components/PText';
import { Button } from '@/components/kit/Button';
import { Checkbox } from '@/components/kit/Checkbox';
import { Screen } from '@/components/kit/Screen';
import { Em, Greeting, H2, typography } from '@/components/kit/Typography';
import { usePalengkita } from '@/context/PalengkitaContext';
import { ds, fonts } from '@/theme';

export default function ListScreen() {
  const { list, toggleItem, removeItem } = usePalengkita();
  const checkedCount = list.filter((i) => i.checked).length;
  const remaining = list.filter((i) => !i.checked).reduce((sum, i) => sum + i.price, 0);

  return (
    <Screen>
      <Greeting
        icon={ShoppingBasket}
        eyebrow="READY, SET, PALENGKE"
        title={
          <>
            My <Em>list.</Em>
          </>
        }
        subtitle="Fresh ingredients for your next lutong bahay."
      />

      {list.length > 0 ? (
        <>
          <View style={styles.summary}>
            <Text style={styles.summaryText}>{`${checkedCount} of ${list.length} ingredients checked`}</Text>
            <PText style={styles.summaryTotal}>{`~₱${remaining}`}</PText>
          </View>

          <View>
            {list.map((i) => (
              <View key={i.name} style={styles.item}>
                <Pressable
                  onPress={() => toggleItem(i.name)}
                  accessibilityRole="checkbox"
                  accessibilityLabel={`${i.name}, ${i.amount}`}
                  accessibilityState={{ checked: i.checked }}
                  style={[styles.itemLabel, i.checked && { opacity: 0.5 }]}
                >
                  <Checkbox checked={i.checked} />
                  <Text style={styles.emoji}>{i.emoji}</Text>
                  <View style={{ gap: 5 }}>
                    <Text style={[styles.name, i.checked && styles.struck]}>{i.name}</Text>
                    <Text style={[styles.amount, i.checked && styles.struck]}>{i.amount}</Text>
                  </View>
                </Pressable>
                <PText style={styles.price}>{`₱${i.price}`}</PText>
                <Button
                  variant="ghost"
                  size="icon"
                  icon={Trash2}
                  accessibilityLabel={`Remove ${i.name}`}
                  onPress={() => removeItem(i.name)}
                />
              </View>
            ))}
          </View>

          <Text style={typography.estimateNote}>Sample estimates. Check prices with your local vendors.</Text>
          <Button size="lg" href="/markets" icon={Store} label="Find a nearby market" />
        </>
      ) : (
        <View style={styles.empty}>
          <ShoppingBasket size={45} color={ds.foreground} />
          <H2>A fresh start for your basket.</H2>
          <Text style={typography.muted}>Pick a recipe and bring its ingredients here.</Text>
          <Button href="/recipes" label="Find something to cook" />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: {
    padding: 18,
    backgroundColor: ds.mint,
    borderRadius: 8,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryText: { fontFamily: fonts.sans, fontSize: 11, color: ds.foreground },
  summaryTotal: { fontFamily: fonts.sansBold, fontSize: 24, color: ds.foreground },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: ds.border,
  },
  itemLabel: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  emoji: { fontSize: 27 },
  name: { fontFamily: fonts.sansBold, fontSize: 13, color: ds.foreground },
  amount: { fontFamily: fonts.sans, fontSize: 10, color: ds.mutedForeground },
  struck: { textDecorationLine: 'line-through' },
  price: { fontFamily: fonts.sans, fontSize: 14, color: ds.foreground },
  empty: { alignItems: 'center', paddingVertical: 55, paddingHorizontal: 15, gap: 14 },
});
