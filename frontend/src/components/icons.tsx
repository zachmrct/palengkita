import type { ReactNode } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function EyeIcon({ size = 24, color = '#000', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}

export function EyeOffIcon({ size = 24, color = '#000', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={strokeWidth} />
      <Path d="M4 4l16 16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function ChevronLeftIcon({ size = 28, color = '#000', strokeWidth = 2.4 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 5l-7 7 7 7"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CheckIcon({ size = 16, color = '#fff', strokeWidth = 2.6 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 12.5l4.5 4.5L19 7.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Multi-color Google "G" (brand colors must not be altered). */
export function GoogleLogo({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <Path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
      <Path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <Path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* Icons for the signed-in app (home, recipe detail, tab bar)          */
/* ------------------------------------------------------------------ */

type LineProps = IconProps & { fill?: string };

function Line({
  size = 20,
  color = '#000',
  strokeWidth = 1.8,
  fill = 'none',
  children,
}: LineProps & { children: ReactNode }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </Svg>
  );
}

export const MapPinIcon = (p: LineProps) => (
  <Line {...p}>
    <Path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
    <Circle cx={12} cy={10} r={3} />
  </Line>
);

export const ChevronDownIcon = (p: LineProps) => (
  <Line {...p}>
    <Path d="M6 9l6 6 6-6" />
  </Line>
);

export const ChevronRightIcon = (p: LineProps) => (
  <Line {...p}>
    <Path d="M9 5l7 7-7 7" />
  </Line>
);

export const SearchIcon = (p: LineProps) => (
  <Line {...p}>
    <Circle cx={11} cy={11} r={7} />
    <Path d="M21 21l-4.3-4.3" />
  </Line>
);

export const SlidersIcon = (p: LineProps) => (
  <Line {...p}>
    <Path d="M6 8h12M6 12h12M6 16h12" />
  </Line>
);

export const ClockIcon = (p: LineProps) => (
  <Line {...p}>
    <Circle cx={12} cy={12} r={9} />
    <Path d="M12 7v5l3 2" />
  </Line>
);

export const ServingsIcon = (p: LineProps) => (
  <Line {...p}>
    <Circle cx={9} cy={7.5} r={3.5} />
    <Path d="M3 20v-1.5A4.5 4.5 0 0 1 7.5 14h3A4.5 4.5 0 0 1 15 18.5V20" />
    <Circle cx={17} cy={11} r={2.5} />
    <Path d="M18 15.2a3.5 3.5 0 0 1 3 3.3V20" />
  </Line>
);

/** Small three-bar difficulty glyph. `colorful` matches the compact recipe cards. */
export function DifficultyIcon({ size = 16, colorful = false }: { size?: number; colorful?: boolean }) {
  const [a, b, c] = colorful ? ['#2C7B4D', '#F4C04E', '#D9534F'] : ['#2C7B4D', '#2C7B4D', '#2C7B4D'];
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Rect x={1.5} y={9} width={3.2} height={5.5} rx={0.8} fill={a} />
      <Rect x={6.4} y={5.5} width={3.2} height={9} rx={0.8} fill={b} />
      <Rect x={11.3} y={1.5} width={3.2} height={13} rx={0.8} fill={c} />
    </Svg>
  );
}

export const HeartIcon = ({ filled = false, ...p }: LineProps & { filled?: boolean }) => (
  <Line {...p} fill={filled ? (p.color ?? '#000') : 'none'}>
    <Path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z" />
  </Line>
);

export const MinusIcon = (p: LineProps) => (
  <Line {...p}>
    <Path d="M5 12h14" />
  </Line>
);

export const PlusIcon = (p: LineProps) => (
  <Line {...p}>
    <Path d="M12 5v14M5 12h14" />
  </Line>
);

export const CloseIcon = (p: LineProps) => (
  <Line {...p}>
    <Path d="M6 6l12 12M18 6L6 18" />
  </Line>
);

export const HomeTabIcon = ({ filled = false, ...p }: LineProps & { filled?: boolean }) => (
  <Line {...p} fill={filled ? (p.color ?? '#000') : 'none'}>
    <Path d="M3 11l9-8 9 8" />
    <Path d="M5 9.5V20h5v-6h4v6h5V9.5" />
  </Line>
);

export const BookIcon = (p: LineProps) => (
  <Line {...p}>
    <Path d="M2 5h6.5A3.5 3.5 0 0 1 12 8.5V21a3 3 0 0 0-3-3H2z" />
    <Path d="M22 5h-6.5A3.5 3.5 0 0 0 12 8.5V21a3 3 0 0 1 3-3h7z" />
  </Line>
);

export const StoreIcon = (p: LineProps) => (
  <Line {...p}>
    <Path d="M4 9l1.5-5h13L20 9" />
    <Path d="M4 9h16v0a2.67 2.67 0 0 1-5.33 0 2.67 2.67 0 0 1-5.34 0A2.67 2.67 0 0 1 4 9z" />
    <Path d="M5 11.5V20h14v-8.5" />
    <Path d="M10 20v-5h4v5" />
  </Line>
);

export const BagIcon = (p: LineProps) => (
  <Line {...p}>
    <Path d="M6 7h12l1 14H5z" />
    <Path d="M9 10V6a3 3 0 0 1 6 0v4" />
  </Line>
);

export const UserIcon = (p: LineProps) => (
  <Line {...p}>
    <Circle cx={12} cy={8} r={4} />
    <Path d="M4 21v-1.5A5.5 5.5 0 0 1 9.5 14h5a5.5 5.5 0 0 1 5.5 5.5V21" />
  </Line>
);

/** Shallow basket with a handle, used for the Recipes tab. */
export const BasketIcon = (p: LineProps) => (
  <Line {...p}>
    <Path d="M3 10h18l-1.6 8.4A2 2 0 0 1 17.4 20H6.6a2 2 0 0 1-2-1.6z" />
    <Path d="M8 10l3-6M16 10l-3-6" />
    <Path d="M9.5 13.5v3M12 13.5v3M14.5 13.5v3" />
  </Line>
);

/** Market building, used for the Markets tab. */
export const BuildingIcon = (p: LineProps) => (
  <Line {...p}>
    <Rect x={5} y={3} width={14} height={18} rx={1.5} />
    <Path d="M9 7.5h.01M12 7.5h.01M15 7.5h.01M9 11h.01M12 11h.01M15 11h.01" />
    <Path d="M10 21v-4h4v4" />
  </Line>
);
