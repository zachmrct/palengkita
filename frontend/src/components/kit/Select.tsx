import { Check, ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { ds, fonts } from '@/theme';

export type SelectOption<T extends string | number> = { label: string; value: T };

/**
 * Stand-in for the design's native `<select>`: a bordered field that opens a
 * picker. `fontSize`/`padding` follow the per-screen overrides in the CSS.
 */
export function Select<T extends string | number>({
  value,
  options,
  onChange,
  fontSize = 14,
  padding = 10,
  label,
  style,
}: {
  value: T;
  options: SelectOption<T>[];
  onChange: (v: T) => void;
  fontSize?: number;
  padding?: number;
  label: string;
  style?: StyleProp<ViewStyle>;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${current?.label ?? ''}`}
        style={[styles.field, { padding }, style]}
      >
        <Text style={[styles.value, { fontSize }]} numberOfLines={1}>
          {current?.label}
        </Text>
        <ChevronDown size={14} color={ds.foreground} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} accessibilityLabel="Close">
          <View style={styles.sheet}>
            <Text style={styles.title}>{label}</Text>
            {options.map((o) => {
              const selected = o.value === value;
              return (
                <Pressable
                  key={String(o.value)}
                  onPress={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  style={({ pressed }) => [styles.option, pressed && { opacity: 0.7 }]}
                >
                  <Text style={[styles.optionText, selected && styles.optionSelected]}>{o.label}</Text>
                  {selected ? <Check size={16} color={ds.green} /> : null}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    borderWidth: 1,
    borderColor: ds.border,
    borderRadius: 8,
    backgroundColor: ds.card,
  },
  value: { flexShrink: 1, fontFamily: fonts.sans, color: ds.foreground },
  backdrop: {
    flex: 1,
    backgroundColor: ds.scrim,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  sheet: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: ds.background,
    borderRadius: 8,
    padding: 24,
  },
  title: { fontFamily: fonts.serif, fontSize: 25, lineHeight: 31, color: ds.foreground, marginBottom: 8 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: ds.border,
  },
  optionText: { fontFamily: fonts.sans, fontSize: 14, color: ds.foreground },
  optionSelected: { fontFamily: fonts.sansBold },
});
