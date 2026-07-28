import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { savedApi } from '../api/saved';
import { useAuth } from './AuthContext';

interface SavedContextValue {
  isSaved: (businessId: string) => boolean;
  toggle: (businessId: string) => Promise<void>;
  count: number;
}

const SavedContext = createContext<SavedContextValue>(null!);

// eslint-disable-next-line react-refresh/only-export-components
export const useSaved = () => useContext(SavedContext);

/**
 * Holds the signed-in user's bookmarked centre ids once, so every card and the
 * detail page can show the right heart without each refetching. Updates
 * optimistically and rolls back if the request fails.
 */
export function SavedProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [ids, setIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      setIds(new Set());
      return;
    }
    savedApi
      .listIds()
      .then((list) => setIds(new Set(list)))
      .catch(() => setIds(new Set()));
  }, [user]);

  const isSaved = useCallback((id: string) => ids.has(id), [ids]);

  const toggle = useCallback(
    async (id: string) => {
      const wasSaved = ids.has(id);
      const next = new Set(ids);
      if (wasSaved) next.delete(id);
      else next.add(id);
      setIds(next);
      try {
        await (wasSaved ? savedApi.remove(id) : savedApi.save(id));
      } catch {
        setIds(ids); // request failed — put the heart back how it was
      }
    },
    [ids],
  );

  return (
    <SavedContext.Provider value={{ isSaved, toggle, count: ids.size }}>
      {children}
    </SavedContext.Provider>
  );
}
