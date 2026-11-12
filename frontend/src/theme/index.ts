/**
 * Palengkita design tokens.
 * Colors are sampled directly from the Figma screenshots.
 * Fonts are centralized here so swapping typefaces is a one-line change.
 */

export const colors = {
  forest: '#1C3A2D', // header, primary button, headings, body ink
  cream: '#F9F1D9', // screen background
  gold: '#ECC262', // "EST. 2026" + tagline
  sage: '#E0EADA', // photo card background
  link: '#457B53', // "Forgot password?"
  white: '#FFFFFF',
  inputBorder: '#6C727F',
  placeholder: '#707E76',
  divider: '#DFD7BB',
  muted: '#5E6D64',
  error: '#B3412F',
  success: '#2F7A4B',
} as const;

/** Keys must match the names registered in `useFonts` (see app/_layout.tsx). */
export const fonts = {
  display: 'BricolageGrotesque_700Bold',
  displayHeavy: 'BricolageGrotesque_800ExtraBold',
  body: 'Figtree_400Regular',
  bodyMedium: 'Figtree_500Medium',
  bodySemiBold: 'Figtree_600SemiBold',
  bodyBold: 'Figtree_700Bold',
  /**
   * Figtree has no peso sign (₱), so each platform would substitute a different
   * system font. <PText> renders ₱ in Bricolage at the matching weight instead.
   */
  peso500: 'BricolageGrotesque_500Medium',
  peso600: 'BricolageGrotesque_600SemiBold',
  peso700: 'BricolageGrotesque_700Bold',
  /** Redesign: Figtree for text, Bricolage Grotesque SemiBold for headings (typeface spec). */
  sans: 'Figtree_400Regular',
  sansMedium: 'Figtree_500Medium',
  sansSemiBold: 'Figtree_600SemiBold',
  sansBold: 'Figtree_700Bold',
  serif: 'BricolageGrotesque_600SemiBold',
  /** Bricolage has no italic, so the accent word is distinguished by color only. */
  serifItalic: 'BricolageGrotesque_600SemiBold',
} as const;

export const radii = {
  input: 2,
  button: 14,
  card: 24,
  checkbox: 4,
  headerBottom: 32,
} as const;

/** Screen content never stretches wider than this (tablets, web preview). */
export const MAX_CONTENT_WIDTH = 480;
export const SCREEN_PADDING = 20;

/**
 * Design tokens for the redesigned app, converted from the oklch values in the
 * Lovable project's `styles.css` to sRGB hex.
 */
export const ds = {
  background: '#FEF9EC',
  canvas: '#ECEDDE',
  card: '#FFFEF9',
  foreground: '#0C3726', // also `primary`
  primaryForeground: '#FFF6DA',
  mint: '#DEEBD9', // also `secondary`
  mintButter: '#EAEFD7', // color-mix(mint 55%, butter)
  butter: '#FCF2D6',
  softOrange: '#FFE9CD',
  orange: '#F3872F',
  green: '#3A7C4D',
  mutedForeground: '#5D6A5E',
  border: '#DBDDCA',
  destructive: '#C13E2E',
  /** `primary` at 40% / 20% / 13% alpha, used for scrims and hairlines. */
  scrim: 'rgba(12, 55, 38, 0.4)',
  primary20: 'rgba(12, 55, 38, 0.2)',
  primary13: 'rgba(12, 55, 38, 0.13)',
} as const;

/** The design's mobile breakpoint: screens never grow wider than this. */
export const SHELL_MAX_WIDTH = 600;
/** Phones at or below this width use the design's tighter `max-width: 370px` rules. */
export const COMPACT_WIDTH = 370;
