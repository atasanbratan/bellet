import { useCallback, useEffect, useState } from 'react';
import { useClickOutside } from '../../lib/useClickOutside';
import api from '../../api/client';
import type { I18nText } from '../../types';

export interface SearchResults {
  businesses: {
    id: string;
    name: string;
    photos: string[];
    category?: { slug: string; name: string };
  }[];
  courses: (I18nText & {
    id: string;
    title: string;
    price: string;
    business: { id: string; name: string };
  })[];
  teachers: {
    id: string;
    name: string;
    photo?: string | null;
    business: { id: string; name: string };
  }[];
}

const EMPTY: SearchResults = { businesses: [], courses: [], teachers: [] };

/** Debounced global-search state + fetch + close-on-outside-click. */
export function useGlobalSearch() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<SearchResults>(EMPTY);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const boxRef = useClickOutside<HTMLDivElement>(open, close);

  useEffect(() => {
    const query = q.trim();
    if (query.length < 2) {
      setResults(EMPTY);
      setLoading(false);
      return;
    }
    setLoading(true);
    const id = setTimeout(() => {
      api
        .get('/search', { params: { q: query } })
        .then((r) => setResults(r.data))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(id);
  }, [q]);

  const hasResults =
    results.businesses.length > 0 ||
    results.courses.length > 0 ||
    results.teachers.length > 0;

  return { q, setQ, results, open, setOpen, loading, boxRef, hasResults };
}
