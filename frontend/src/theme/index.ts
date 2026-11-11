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
