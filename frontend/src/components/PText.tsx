import { Children, Fragment, type ReactNode } from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';

import { fonts } from '@/theme';

const PESO = '₱';

/** Picks a Bricolage weight that visually matches the surrounding Figtree text. */
function pesoFontFor(fontFamily?: string): string | null {
  switch (fontFamily) {
    case fonts.display:
    case fonts.displayHeavy:
      return null; // already Bricolage, which has the glyph
    case fonts.bodyBold:
      return fonts.peso700;
    case fonts.bodySemiBold:
      return fonts.peso600;
    default:
      return fonts.peso500;
  }
}

function withPeso(node: ReactNode, pesoFont: string | null): ReactNode {
  if (!pesoFont || typeof node !== 'string' || !node.includes(PESO)) return node;
  const parts = node.split(PESO);
  return parts.map((part, i) => (
    <Fragment key={i}>
      {i > 0 ? <Text style={{ fontFamily: pesoFont }}>{PESO}</Text> : null}
      {part}
    </Fragment>
  ));
}

/**
 * Drop-in <Text> that renders the peso sign (₱) in a font that actually has it,
 * so prices look the same on iOS, Android and web.
 */
export function PText({ children, style, ...props }: TextProps) {
  const pesoFont = pesoFontFor(StyleSheet.flatten(style)?.fontFamily);
  return (
    <Text style={style} {...props}>
      {Children.map(children, (child) => withPeso(child, pesoFont))}
    </Text>
  );
}
