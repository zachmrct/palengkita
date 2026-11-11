import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type User = {
  name: string;
  email: string;
};

type AuthContextValue = {
  user: User | null;
  /** Mock sign-in. Replace the body with a real API call once the backend exists. */
  signIn: (identifier: string, password: string) => Promise<void>;
  /** Mock sign-up. Replace the body with a real API call once the backend exists. */
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const FAKE_LATENCY_MS = 900;
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function nameFromIdentifier(identifier: string): string {
  const base = identifier.trim().split('@')[0] ?? '';
  return base ? base.charAt(0).toUpperCase() + base.slice(1) : 'Kaibigan';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const signIn = useCallback(async (identifier: string, _password: string) => {
    // TODO(backend): POST /auth/login
    await wait(FAKE_LATENCY_MS);
    setUser({
      name: nameFromIdentifier(identifier),
      email: identifier.trim(),
    });
  }, []);

  const signUp = useCallback(async (name: string, email: string, _password: string) => {
    // TODO(backend): POST /auth/register
    await wait(FAKE_LATENCY_MS);
    setUser({ name: name.trim(), email: email.trim() });
  }, []);

  const signOut = useCallback(() => setUser(null), []);

  const value = useMemo(
    () => ({ user, signIn, signUp, signOut }),
    [user, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
