import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import type { Ingredient, Meal } from '@/data/meals';

export type ListEntry = Ingredient & { checked: boolean };

type PalengkitaState = {
  budget: number;
  setBudget: (v: number) => void;
  time: number;
  setTime: (v: number) => void;
  restriction: string;
  setRestriction: (v: string) => void;
  list: ListEntry[];
  addMeal: (m: Meal) => void;
  toggleItem: (name: string) => void;
  removeItem: (name: string) => void;
  saved: string[];
  toggleSaved: (id: string) => void;
  /** Keyed by `${dayOfMonth}-${Breakfast|Lunch|Dinner}`, value is a meal id. */
  plan: Record<string, string>;
  schedule: (slot: string, id: string) => void;
};

const Context = createContext<PalengkitaState | null>(null);

/**
 * Visit-only meal-planning state shared by every screen (preferences, My List,
 * saved meals, weekly plan). Mirrors the Lovable design's provider.
 * TODO(backend): persist per user.
 */
export function PalengkitaProvider({ children }: { children: ReactNode }) {
  const [budget, setBudget] = useState(100);
  const [time, setTime] = useState(60);
  const [restriction, setRestriction] = useState('');
  const [list, setList] = useState<ListEntry[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [plan, setPlan] = useState<Record<string, string>>({
    '12-Lunch': 'sinigang',
    '12-Dinner': 'torta',
  });

  const value = useMemo<PalengkitaState>(
    () => ({
      budget,
      setBudget,
      time,
      setTime,
      restriction,
      setRestriction,
      list,
      addMeal: (m) =>
        setList((prev) => [
          ...prev,
          ...m.ingredients
            .filter((i) => !prev.some((p) => p.name === i.name))
            .map((i) => ({ ...i, checked: false })),
        ]),
      toggleItem: (name) =>
        setList((prev) => prev.map((i) => (i.name === name ? { ...i, checked: !i.checked } : i))),
      removeItem: (name) => setList((prev) => prev.filter((i) => i.name !== name)),
      saved,
      toggleSaved: (id) =>
        setSaved((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id])),
      plan,
      schedule: (slot, id) => setPlan((prev) => ({ ...prev, [slot]: id })),
    }),
    [budget, time, restriction, list, saved, plan],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function usePalengkita(): PalengkitaState {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('usePalengkita must be used inside <PalengkitaProvider>');
  return ctx;
}
