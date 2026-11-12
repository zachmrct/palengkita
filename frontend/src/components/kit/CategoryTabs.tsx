import type { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ds, fonts } from '@/theme';

export type TabDef = { key: string; label: string; icon?: LucideIcon };

/** Underlined tab strip (`.category-tabs`): tabs spread across the width, selected one gets a green bar. */
export function CategoryTabs({
  tabs,
  selected,
  onSelect,
}: {
  tabs: TabDef[];
  selected: string;
  onSelect: (key: string) => void;
}) {
  return (
    <View style={styles.row} accessibilityRole="tablist">
      {tabs.map(({ key, label, icon: Icon }) => {
        const active = key === selected;
        const color = active ? ds.foreground : ds.mutedForeground;
        return (
          <Pressable
            key={key}
            onPress={() => onSelect(key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={styles.tab}
          >
            {Icon ? <Icon size={14} color={color} /> : null}
            <Text style={[styles.label, { color }]}>{label}</Text>
            {active ? <View style={styles.bar} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: ds.border,
    marginBottom: 20,
  },
  tab: { height: 40, paddingHorizontal: 2, flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontFamily: fonts.sans, fontSize: 11 },
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -1,
    height: 3,
    borderRadius: 3,
    backgroundColor: ds.green,
  },
});
