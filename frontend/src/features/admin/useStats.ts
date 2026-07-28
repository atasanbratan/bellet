import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import type { AdminStats } from '../../types';

// Fetches the admin overview stats once.
export function useStats() {
  const [data, setData] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    adminApi
      .getStats()
      .then((d) => active && setData(d))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return { data, loading };
}
