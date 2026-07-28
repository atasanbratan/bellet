import { useI18n } from '../../i18n/LocaleContext';
import { money } from '../../lib/format';
import { useStats } from './useStats';
import StatTile from './StatTile';
import {
  BookIcon,
  BuildingIcon,
  CoinIcon,
  TicketIcon,
  UsersIcon,
} from '../../components/StatIcons';
import Meter from './Meter';

export default function StatsOverview() {
  const { t } = useI18n();
  const { data, loading } = useStats();

  if (loading || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-slate-200/70 dark:bg-slate-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatTile
          icon={<UsersIcon />}
          value={data.users.total}
          label={t('stat.users')}
        />
        <StatTile
          icon={<BuildingIcon />}
          value={data.businesses.total}
          label={t('stat.businesses')}
          sub={t('stat.pending_approvals', { n: data.businesses.pending })}
        />
        <StatTile
          icon={<BookIcon />}
          value={data.courses}
          label={t('stat.courses')}
        />
        <StatTile
          icon={<TicketIcon />}
          value={data.bookings.total}
          label={t('stat.bookings')}
          sub={t('stat.confirmed', { n: data.bookings.confirmed })}
        />
        <StatTile
          icon={<CoinIcon />}
          value={money(data.revenue)}
          label={t('stat.revenue')}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Meter
          title={t('overview.business_status')}
          segments={[
            /* Functional colours: amber waits, teal is settled, red is refused. */
            { label: t('bstatus.PENDING'), value: data.businesses.pending, color: '#f59e0b' },
            { label: t('bstatus.APPROVED'), value: data.businesses.approved, color: '#0d9488' },
            { label: t('bstatus.REJECTED'), value: data.businesses.rejected, color: '#ef4444' },
          ]}
        />
        <Meter
          title={t('overview.users_by_role')}
          segments={[
            /* Roles aren't statuses — a neutral ramp, with teal marking owners. */
            { label: t('role.ADMIN'), value: data.users.admins, color: '#334155' },
            { label: t('role.OWNER'), value: data.users.owners, color: '#0d9488' },
            { label: t('role.CLIENT'), value: data.users.clients, color: '#94a3b8' },
          ]}
        />
      </div>
    </div>
  );
}
