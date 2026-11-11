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

/**
 * Palette for the signed-in app (home, recipe detail). Sampled from the home and
 * recipe Figma screens, which use a slightly deeper green than the auth screens.
 */
export const palette = {
  ink: '#0E3B2C',
  bg: '#FBF1D6',
  surface: '#FFFDF5',
  sage: '#DDEBD9',
  sageSoft: '#E3ECD8',
  chip: '#E7F0E1',
  gold: '#F4C04E',
  goldSoft: '#FDF1D4',
  green: '#2C7B4D',
  basket: '#174F3C',
  basketLine: '#2A6350',
  muted: '#5E6D64',
  placeholder: '#7C8A82',
  line: '#F0E7CD',
  border: '#F0E6C8',
  track: '#EAE2C6',
  tabBar: '#FFFCF3',
  headerButton: '#264F41',
  error: '#B3412F',
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
