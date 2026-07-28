import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import type { AdminUser, Paginated } from '../../types';

const EMPTY: Paginated<AdminUser> = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,
};

// Owns paging state + fetching for the admin users table.
export function useUsers(pageSize = 10) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Paginated<AdminUser>>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    adminApi
      .listUsers(page, pageSize)
      .then((d) => active && setData(d))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [page, pageSize]);

  return { data, loading, page, setPage };
}
