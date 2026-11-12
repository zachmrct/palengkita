import { Check } from 'lucide-react-native';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ds } from '@/theme';

/** Native checkbox look from the design (`accent-color: var(--green)`). */
export function Checkbox({
  checked,
  onChange,
  size = 18,
  label,
  style,
}: {
  checked: boolean;
  onChange?: (next: boolean) => void;
  size?: number;
  label?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const box = (
    <View
      style={[
        styles.box,
        { width: size, height: size },
        checked && styles.checked,
        !onChange && style,
      ]}
    >
      {checked ? <Check size={size - 4} color="#fff" strokeWidth={3.5} /> : null}
    </View>
  );
  if (!onChange) return box;
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      hitSlop={8}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked }}
      style={style}
    >
      {box}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#767676',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: { backgroundColor: ds.green, borderColor: ds.green },
});
