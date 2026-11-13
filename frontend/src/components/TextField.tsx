import { useState, type ComponentRef, type ReactNode, type Ref } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { ds, fonts } from '@/theme';

import { EyeIcon, EyeOffIcon } from './icons';

/** Ref handle for focusing the field imperatively (e.g. jump to the next input). */
export type TextInputHandle = ComponentRef<typeof TextInput>;

type Props = Omit<TextInputProps, 'style' | 'secureTextEntry'> & {
  label: string;
  error?: string | null;
  /** Renders a show/hide eye toggle and hides the text by default. */
  password?: boolean;
  /** Input height in points. */
  height?: number;
  /** Content aligned to the right of the label row (e.g. "Forgot password?"). */
  labelAccessory?: ReactNode;
  inputRef?: Ref<TextInputHandle>;
};

export function TextField({
  label,
  error,
  password = false,
  height = 44,
  labelAccessory,
  inputRef,
  onFocus,
  onBlur,
  ...inputProps
}: Props) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  const borderColor = error ? ds.destructive : focused ? ds.green : ds.border;

  return (
    <View>
      <View style={styles.labelRow}>
        <Text style={styles.label} accessibilityRole="text">
          {label}
        </Text>
        {labelAccessory}
      </View>

      <View
        style={[
          styles.inputWrap,
          { height, borderColor },
          (focused || !!error) && styles.inputWrapActive,
        ]}
      >
        <TextInput
          ref={inputRef}
          accessibilityLabel={label}
          placeholderTextColor={ds.mutedForeground}
          selectionColor={ds.green}
          cursorColor={ds.green}
          style={styles.input}
          secureTextEntry={password && hidden}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...inputProps}
        />
        {password ? (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            style={styles.eye}
          >
            {hidden ? (
              <EyeIcon size={22} color={ds.mutedForeground} />
            ) : (
              <EyeOffIcon size={22} color={ds.mutedForeground} />
            )}
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  label: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: ds.green,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  inputWrapActive: {
    borderBottomWidth: 2,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: fonts.sans,
    fontSize: 16,
    color: ds.foreground,
    paddingVertical: 0,
    paddingHorizontal: 0,
    // Keeps the web preview from drawing the browser focus ring over our underline.
    outlineStyle: 'none' as never,
  },
  eye: {
    paddingLeft: 10,
    height: '100%',
    justifyContent: 'center',
  },
  error: {
    marginTop: 6,
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: ds.destructive,
  },
});
