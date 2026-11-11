import { useState, type ComponentRef, type ReactNode, type Ref } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { colors, fonts, radii } from '@/theme';

import { EyeIcon, EyeOffIcon } from './icons';

/** Ref handle for focusing the field imperatively (e.g. jump to the next input). */
export type TextInputHandle = ComponentRef<typeof TextInput>;

type Props = Omit<TextInputProps, 'style' | 'secureTextEntry'> & {
  label: string;
  error?: string | null;
  /** Renders a show/hide eye toggle and hides the text by default. */
  password?: boolean;
  /** Input height in points. Login uses 54, sign up uses 48. */
  height?: number;
  /** Content aligned to the right of the label row (e.g. "Forgot password?"). */
  labelAccessory?: ReactNode;
  inputRef?: Ref<TextInputHandle>;
};

export function TextField({
  label,
  error,
  password = false,
  height = 54,
  labelAccessory,
  inputRef,
  onFocus,
  onBlur,
  ...inputProps
}: Props) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  const borderColor = error ? colors.error : focused ? colors.forest : colors.inputBorder;

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
          placeholderTextColor={colors.placeholder}
          selectionColor={colors.forest}
          cursorColor={colors.forest}
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
              <EyeIcon size={24} color={colors.forest} />
            ) : (
              <EyeOffIcon size={24} color={colors.forest} />
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
    marginBottom: 9,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    color: colors.forest,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: radii.input,
    paddingLeft: 17,
    paddingRight: 14,
  },
  inputWrapActive: {
    borderWidth: 1.5,
    paddingLeft: 16.5,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.forest,
    paddingVertical: 0,
    // Keeps the web preview from drawing the browser focus ring over our border.
    outlineStyle: 'none' as never,
  },
  eye: {
    paddingLeft: 10,
    height: '100%',
    justifyContent: 'center',
  },
  error: {
    marginTop: 6,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.error,
  },
});
