import type { ImageSource } from 'expo-image';
import { Image } from 'expo-image';
import { createContext, useCallback, type ComponentRef, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import type { Meal } from '@/data/meals';
import { prefetchMealImages } from '@/data/prefetch';
import { ds } from '@/theme';

type Rect = { x: number; y: number; width: number; height: number };
type Flight = { id: string; source: ImageSource; from: Rect };

type FlightContext = {
  flight: Flight | null;
  /** Where the dish lands (the recipe page's plate), once measured. */
  target: Rect | null;
  begin: (flight: Flight) => void;
  land: (target: Rect) => void;
  end: () => void;
};

const Ctx = createContext<FlightContext | null>(null);

export function useDishFlight(): FlightContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useDishFlight must be used inside <DishFlightProvider>');
  return ctx;
}

/** A tapped card's photo flies to the recipe page's plate (the signature card → recipe transition). */
export function DishFlightProvider({ children }: { children: ReactNode }) {
  const [flight, setFlight] = useState<Flight | null>(null);
  const [target, setTarget] = useState<Rect | null>(null);

  const begin = useCallback((next: Flight) => {
    setTarget(null);
    setFlight(next);
  }, []);
  const land = useCallback((rect: Rect) => setTarget(rect), []);
  const end = useCallback(() => {
    setFlight(null);
    setTarget(null);
  }, []);

  // A flight nobody claims (the page never opened) must not leave the next recipe hidden.
  useEffect(() => {
    if (!flight) return;
    const timer = setTimeout(end, 2500);
    return () => clearTimeout(timer);
  }, [flight, end]);

  const value = useMemo(() => ({ flight, target, begin, land, end }), [flight, target, begin, land, end]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <FlightLayer />
    </Ctx.Provider>
  );
}

/** Props for a card's photo wrapper: measures it when the card is pressed and starts the flight. */
export function useFlightSource(meal: Meal) {
  const { begin } = useDishFlight();
  const ref = useRef<ComponentRef<typeof View>>(null);
  const onPressIn = useCallback(() => {
    prefetchMealImages([meal]);
    ref.current?.measureInWindow((x, y, width, height) => {
      if (width > 0 && height > 0) begin({ id: meal.id, source: meal.image, from: { x, y, width, height } });
    });
  }, [begin, meal]);
  return [ref, onPressIn] as const;
}

const DURATION = 460;

function FlightLayer() {
  const { flight, target } = useDishFlight();
  if (!flight || !target) return null;
  return <FlyingDish key={flight.id} flight={flight} target={target} />;
}

function FlyingDish({ flight, target }: { flight: Flight; target: Rect }) {
  const { end } = useDishFlight();
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: DURATION,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) end();
    });
  }, [progress, end]);

  const { from } = flight;
  const dx = from.x + from.width / 2 - (target.x + target.width / 2);
  const dy = from.y + from.height / 2 - (target.y + target.height / 2);
  const startScale = from.width / target.width;
  const range = [0, 1];

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View
        style={{
          position: 'absolute',
          left: target.x,
          top: target.y,
          width: target.width,
          height: target.height,
          transform: [
            { translateX: progress.interpolate({ inputRange: range, outputRange: [dx, 0] }) },
            { translateY: progress.interpolate({ inputRange: range, outputRange: [dy, 0] }) },
            { scale: progress.interpolate({ inputRange: range, outputRange: [startScale, 1] }) },
            { rotate: progress.interpolate({ inputRange: range, outputRange: ['-120deg', '0deg'] }) },
          ],
        }}
      >
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: ds.butter, borderRadius: target.width / 2, opacity: progress }]}
        />
        <Image source={flight.source} contentFit="contain" style={{ width: target.width - 10, height: target.height - 10, margin: 5 }} />
      </Animated.View>
    </View>
  );
}
