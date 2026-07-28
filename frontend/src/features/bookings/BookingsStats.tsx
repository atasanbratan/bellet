import { useI18n } from '../../i18n/LocaleContext';
import StatTiles from '../../components/StatTiles';
import type { BookingStats } from '../../types';

/** Aggregates of the currently filtered bookings: total, confirmed, pending. */
export default function BookingsStats({ stats }: { stats: BookingStats }) {
  const { t } = useI18n();
  return (
    <StatTiles
      tiles={[
        {
          label: t('bstat.total'),
          value: String(stats.count),
          sub: t('bstat.cancelled', { n: stats.cancelled }),
        },
        {
          label: t('bstat.confirmed'),
          value: String(stats.confirmed),
          accent: 'positive',
        },
        {
          label: t('bstat.pending'),
          value: String(stats.pending),
          accent: 'pending',
        },
      ]}
    />
  );
}
