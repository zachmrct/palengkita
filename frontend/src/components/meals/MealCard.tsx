import { Link } from 'expo-router';
import { Image } from 'expo-image';
import { ArrowUpRight, Clock3, Heart } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PText } from '@/components/PText';
import { Button } from '@/components/kit/Button';
import { useShell } from '@/components/kit/layout';
import { usePalengkita } from '@/context/PalengkitaContext';
import type { Meal } from '@/data/meals';
import { ds, fonts } from '@/theme';

const PHOTO_BG = [ds.butter, ds.mint, ds.softOrange, ds.mintButter];

/** Recipe tile used on Home, Recipes and Profile (`MealCard`). Width comes from the grid. */
export function MealCard({ meal, index = 0, width }: { meal: Meal; index?: number; width: number }) {
  const { saved, toggleSaved } = usePalengkita();
  const { compact } = useShell();
  const isSaved = saved.includes(meal.id);
  const photoSize = compact ? 139 : 157;

  return (
    <View style={{ width }}>
      <Link href={{ pathname: '/recipe/[id]', params: { id: meal.id } }} asChild>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={`View ${meal.name}`}
          style={StyleSheet.flatten([styles.photoLink, { height: compact ? 157 : 176, backgroundColor: PHOTO_BG[index % 4] }])}
        >
          <Text style={styles.label}>{meal.tag}</Text>
          <Image
            source={meal.image}
            contentFit="contain"
            accessibilityLabel={meal.name}
            style={{ width: photoSize, height: photoSize, marginTop: 15 }}
          />
          <View style={styles.open}>
            <ArrowUpRight size={14} color={ds.foreground} />
          </View>
        </Pressable>
      </Link>

      <Button
        variant="ghost"
        size="icon"
        icon={Heart}
        iconSize={14}
        iconFilled={isSaved}
        color={isSaved ? ds.destructive : ds.foreground}
        accessibilityLabel={`Save ${meal.name}`}
        onPress={() => toggleSaved(meal.id)}
        style={styles.favorite}
      />

      <View style={styles.copy}>
        <Link href={{ pathname: '/recipe/[id]', params: { id: meal.id } }} asChild>
          <Pressable accessibilityRole="link">
            <Text style={styles.title}>{meal.name}</Text>
          </Pressable>
        </Link>
        <Text style={styles.subtitle}>{meal.subtitle}</Text>
        <View style={styles.meta}>
          <PText style={styles.metaText}>
            <PText style={styles.price}>{`₱${meal.price}`}</PText>
            {' / serving'}
          </PText>
          <View style={styles.time}>
            <Clock3 size={11} color={ds.mutedForeground} />
            <Text style={styles.metaText}>{`${meal.minutes} min`}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  photoLink: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  label: {
    position: 'absolute',
    top: 10,
    left: 8,
    zIndex: 1,
    overflow: 'hidden',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 20,
    backgroundColor: ds.card,
    fontFamily: fonts.sans,
    fontSize: 7,
    color: ds.foreground,
  },
  open: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: ds.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favorite: {
    position: 'absolute',
    top: 6,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ds.card,
  },
  copy: { paddingTop: 11, paddingHorizontal: 1 },
  title: { fontFamily: fonts.sansSemiBold, fontSize: 13, lineHeight: 17, color: ds.foreground },
  subtitle: { fontFamily: fonts.sans, fontSize: 8, color: ds.mutedForeground, marginTop: 5 },
  meta: {
    marginTop: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 3,
  },
  metaText: { fontFamily: fonts.sans, fontSize: 8, color: ds.mutedForeground },
  price: { fontFamily: fonts.sansSemiBold, fontSize: 14, color: ds.foreground },
  time: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
