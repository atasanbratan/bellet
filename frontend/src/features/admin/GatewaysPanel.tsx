import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import { useI18n } from '../../i18n/LocaleContext';
import { relativeTime } from '../../lib/relativeTime';
import StatTiles from '../../components/StatTiles';
import type { Gateway } from '../../types';

/**
 * Online SMS gateways: the phone numbers clients should send an empty SMS
 * to. Polled every 15s so the online/offline badge stays current without a
 * manual refresh.
 */
export default function GatewaysPanel() {
  const { t, locale } = useI18n();
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = () =>
      adminApi
        .listGateways()
        .then((d) => active && setGateways(d))
        .finally(() => active && setLoading(false));
    load();
    const timer = setInterval(load, 15_000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  const online = gateways.filter((g) => g.online).length;

  return (
    <div>
      <StatTiles
        tiles={[
          { label: t('gateway.total'), value: String(gateways.length) },
          {
            label: t('gateway.online_count'),
            value: String(online),
            accent: online > 0 ? 'positive' : undefined,
          },
        ]}
      />
      <div className="overflow-hidden rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">{t('gateway.phone')}</th>
                <th className="px-4 py-3 font-medium">{t('table.status')}</th>
                <th className="px-4 py-3 font-medium">{t('gateway.last_seen')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {gateways.map((g) => (
                <tr key={g.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-medium tracking-tight">
                    {g.phoneNumber}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                        g.online
                          ? 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          g.online ? 'bg-teal-500' : 'bg-slate-400'
                        }`}
                      />
                      {t(g.online ? 'gateway.online' : 'gateway.offline')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {relativeTime(g.lastSeenAt, locale)}
                  </td>
                </tr>
              ))}
              {!loading && gateways.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-slate-400">
                    {t('gateway.empty')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
