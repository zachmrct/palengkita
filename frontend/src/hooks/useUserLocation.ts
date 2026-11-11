import * as Location from 'expo-location';
import { useCallback, useState } from 'react';

export type LocationStatus =
  | 'idle' // never asked
  | 'requesting'
  | 'granted' // device location in use
  | 'denied' // user said no (or services are off)
  | 'manual'; // user typed an area

export type UserLocation = {
  status: LocationStatus;
  /** Human-readable area, e.g. "Marikina". Null until known. */
  label: string | null;
};

/**
 * Device location with a typed-area fallback. Uses the OS permission prompt and
 * on-device geocoding only, so no backend is involved.
 */
export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation>({ status: 'idle', label: null });

  const requestDeviceLocation = useCallback(async () => {
    setLocation((l) => ({ ...l, status: 'requesting' }));
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation({ status: 'denied', label: null });
        return;
      }

      let label = 'Near you';
      try {
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const [place] = await Location.reverseGeocodeAsync(pos.coords);
        label = place?.district || place?.city || place?.subregion || label;
      } catch {
        // Permission is granted, but we couldn't resolve a name (e.g. on web). Keep the generic label.
      }
      setLocation({ status: 'granted', label });
    } catch {
      setLocation({ status: 'denied', label: null });
    }
  }, []);

  const setManualLocation = useCallback((label: string) => {
    const trimmed = label.trim();
    if (trimmed) setLocation({ status: 'manual', label: trimmed });
  }, []);

  return { location, requestDeviceLocation, setManualLocation };
}
