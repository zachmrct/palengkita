import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { PText } from '@/components/PText';
import { BottomSheet } from '@/components/ui';
import type { Difficulty } from '@/data/mock';
import { fonts, palette } from '@/theme';
import { DEFAULT_FILTERS, type RecipeFilters, type SortKey } from '@/utils/recipeFilters';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'default', label: 'Default' },
  { key: 'cheapest', label: 'Pinakamura' },
  { key: 'fastest', label: 'Pinakamabilis' },
];
const PRICES: { value: number | null; label: string }[] = [
  { value: null, label: 'Kahit magkano' },
  { value: 100, label: '₱100' },
  { value: 150, label: '₱150' },
  { value: 250, label: '₱250' },
];
const LEVELS: { value: Difficulty | 'all'; label: string }[] = [
  { value: 'all', label: 'Lahat' },
  { value: 'Madali', label: 'Madali' },
  { value: 'Katamtaman', label: 'Katamtaman' },
];

type Props = {
  visible: boolean;
  filters: RecipeFilters;
  onClose: () => void;
  onApply: (filters: RecipeFilters) => void;
};

/** Sort and filter editor. Edits a draft and only applies on APPLY. */
export function RecipeFilterSheet({ visible, filters, onClose, onApply }: Props) {
  const [draft, setDraft] = useState(filters);
  const set = <K extends keyof RecipeFilters>(key: K, value: RecipeFilters[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  return (
    <BottomSheet visible={visible} title="Mga filter" onClose={onClose}>
      <Text style={styles.label}>Ayusin ayon sa</Text>
      <View style={styles.chips}>
        {SORTS.map((o) => (
          <Option key={o.key} label={o.label} selected={draft.sort === o.key} onPress={() => set('sort', o.key)} />
        ))}
      </View>

      <Text style={[styles.label, styles.gap]}>Max na presyo</Text>
      <View style={styles.chips}>
        {PRICES.map((o) => (
          <Option
            key={o.label}
            label={o.label}
            peso={o.value !== null}
            selected={draft.maxPrice === o.value}
            onPress={() => set('maxPrice', o.value)}
          />
        ))}
      </View>

      <Text style={[styles.label, styles.gap]}>Hirap</Text>
      <View style={styles.chips}>
        {LEVELS.map((o) => (
          <Option
            key={o.label}
            label={o.label}
            selected={draft.difficulty === o.value}
            onPress={() => set('difficulty', o.value)}
          />
        ))}
      </View>

      <View style={[styles.switchRow, styles.gap]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>May ka na lang</Text>
          <Text style={styles.help}>Show only recipes with ingredients you have.</Text>
        </View>
        <Switch
          value={draft.haveOnly}
          onValueChange={(v) => set('haveOnly', v)}
          trackColor={{ false: palette.track, true: palette.green }}
          thumbColor="#fff"
          accessibilityLabel="Only recipes I can make now"
        />
      </View>

      <View style={styles.buttons}>
        <Pressable
          onPress={() => setDraft(DEFAULT_FILTERS)}
          accessibilityRole="button"
          accessibilityLabel="Reset filters"
          style={({ pressed }) => [styles.reset, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.resetText}>RESET</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            onApply(draft);
            onClose();
          }}
          accessibilityRole="button"
          accessibilityLabel="Apply filters"
          style={({ pressed }) => [styles.apply, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.applyText}>APPLY</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

function Option({
  label,
  selected,
  onPress,
  peso,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  peso?: boolean;
}) {
  const Label = peso ? PText : Text;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={({ pressed }) => [styles.chip, selected && styles.chipOn, pressed && { opacity: 0.7 }]}
    >
      <Label style={[styles.chipText, selected && { color: '#fff' }]}>{label}</Label>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: fonts.bodyBold, fontSize: 14, color: palette.ink },
  help: { marginTop: 2, fontFamily: fonts.body, fontSize: 13, color: palette.muted },
  gap: { marginTop: 18 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  chip: {
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  chipOn: { backgroundColor: palette.ink, borderColor: palette.ink },
  chipText: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: palette.ink },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  buttons: { flexDirection: 'row', gap: 10, marginTop: 24 },
  reset: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetText: { fontFamily: fonts.bodyBold, fontSize: 14.5, letterSpacing: 1.1, color: palette.ink },
  apply: {
    flex: 1.4,
    height: 52,
    borderRadius: 14,
    backgroundColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: { fontFamily: fonts.bodyBold, fontSize: 14.5, letterSpacing: 1.1, color: '#fff' },
});
