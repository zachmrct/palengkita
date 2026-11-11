import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type ListItem = {
  /** `${recipeId}:${ingredientId}` so adding the same recipe twice merges. */
  key: string;
  recipeTitle: string;
  name: string;
  qtyLabel: string;
  price: number;
};

type ListContextValue = {
  items: ListItem[];
  total: number;
  addItems: (items: ListItem[]) => void;
  removeItem: (key: string) => void;
  clear: () => void;
};

const ListContext = createContext<ListContextValue | null>(null);

/** In-memory "My List". TODO(backend): persist per user. */
export function ListProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ListItem[]>([]);

  const addItems = useCallback((incoming: ListItem[]) => {
    setItems((prev) => {
      const byKey = new Map(prev.map((i) => [i.key, i]));
      incoming.forEach((i) => byKey.set(i.key, i));
      return [...byKey.values()];
    });
  }, []);

  const removeItem = useCallback(
    (key: string) => setItems((prev) => prev.filter((i) => i.key !== key)),
    [],
  );
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      total: items.reduce((sum, i) => sum + i.price, 0),
      addItems,
      removeItem,
      clear,
    }),
    [items, addItems, removeItem, clear],
  );

  return <ListContext.Provider value={value}>{children}</ListContext.Provider>;
}

export function useList(): ListContextValue {
  const ctx = useContext(ListContext);
  if (!ctx) throw new Error('useList must be used inside <ListProvider>');
  return ctx;
}
