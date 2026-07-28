import type { OwnerStats } from '../../types';
import { money } from '../../lib/format';
import { useI18n } from '../../i18n/LocaleContext';
import {
  BookIcon,
  CoinIcon,
  TicketIcon,
  UsersIcon,
} from '../../components/StatIcons';
import OverviewTile from './OverviewTile';

/** The four headline numbers across the top of the owner overview. */
export default function OverviewTiles({ stats }: { stats: OwnerStats | null }) {
  const { t } = useI18n();

  if (!stats) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-lg bg-slate-200/70 dark:bg-slate-800"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <OverviewTile
        icon={<CoinIcon />}
        label={t('overview.revenue')}
        value={money(stats.revenue.total)}
        deltaPct={stats.revenue.deltaPct}
      />
      <OverviewTile
        icon={<TicketIcon />}
        label={t('overview.bookings')}
        value={stats.bookings.total}
        deltaPct={stats.bookings.deltaPct}
      />
      <OverviewTile
        icon={<UsersIcon />}
        label={t('overview.students')}
        value={stats.students}
      />
      <OverviewTile
        icon={<BookIcon />}
        label={t('overview.courses')}
        value={stats.courses}
      />
    </div>
  );
}
