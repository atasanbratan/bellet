import { useEffect, useState } from 'react';

export interface TableRequest<F> {
  page: number;
  pageSize: number;
  filters: F;
}

/**
 * Paging + column-filter state shared by the data tables (payments,
 * bookings…). Fetches are debounced so typing in a filter doesn't fire a
 * request per keystroke; changing a filter resets to page 1.
 */
export function usePagedTable<F, P>(
  fetchPage: (req: TableRequest<F>) => Promise<P>,
  emptyFilters: F,
  emptyPage: P,
  pageSize = 10,
) {
  const [page, setPage] = useState(1);
  const [filters, setFiltersState] = useState<F>(emptyFilters);
  const [data, setData] = useState<P>(emptyPage);
  const [loading, setLoading] = useState(true);

  const setFilters = (next: F) => {
    setFiltersState(next);
    setPage(1);
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    const timer = setTimeout(() => {
      fetchPage({ page, pageSize, filters })
        .then((d) => active && setData(d))
        .finally(() => active && setLoading(false));
    }, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, filters]);

  return { data, loading, page, setPage, filters, setFilters };
}

/** Query params for table endpoints — empty filters are dropped. */
export function tableParams<F extends object>({
  page,
  pageSize,
  filters,
}: TableRequest<F>) {
  const params: Record<string, string | number> = { page, pageSize };
  for (const [key, value] of Object.entries(filters)) {
    if (value) params[key] = value as string;
  }
  return params;
}

/** Style of the small filter inputs under table column headers. */
export const filterInputCls =
  'w-full rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs font-normal normal-case tracking-normal outline-none focus:border-teal-400';
