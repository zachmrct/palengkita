import { useEffect, useState } from 'react';

/**
 * Stand-in for network latency until the backend exists (AuthContext does the same for sign-in).
 * Set to 0 to disable every skeleton screen; when real fetches land, replace `useFirstLoad` with the
 * request's own loading flag.
 */
export const MOCK_LATENCY_MS = 650;

const seen = new Set<string>();

/**
 * True the first time a screen (identified by `key`) opens this session, then false. Returning to a
 * screen shows its content immediately, like a cached response would.
 */
export function useFirstLoad(key: string, ms = MOCK_LATENCY_MS): boolean {
  const [loading, setLoading] = useState(() => ms > 0 && !seen.has(key));

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => {
      seen.add(key);
      setLoading(false);
    }, ms);
    return () => clearTimeout(timer);
  }, [key, loading, ms]);

  return loading;
}
