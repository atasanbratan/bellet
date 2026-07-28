import { useI18n } from '../../i18n/LocaleContext';
import { Avatar } from '../../components/visuals';
import { money } from '../../lib/format';
import { locText } from '../../lib/i18nContent';
import type { Booking } from '../../types';

const statusBadge: Record<Booking['status'], string> = {
  CONFIRMED:
    'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300',
  PENDING: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
  CANCELLED: 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300',
  COMPLETED: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
};

export default function BookingRow({ booking: b }: { booking: Booking }) {
  const { t, locale } = useI18n();

  return (
    <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Avatar name={b.client?.name ?? b.client?.phone ?? '—'} />
          <div className="min-w-0">
            <div className="truncate font-medium">{b.client?.name ?? '—'}</div>
            <div className="text-xs text-slate-400">{b.client?.phone}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
        {b.offering ? locText(b.offering, 'title', locale) : '—'}
      </td>
      <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
        {b.group ? (
          <>
            {b.group.days.map((d) => t(`day_${d}`).slice(0, 2)).join('·')}{' '}
            {b.group.startTime}–{b.group.endTime}
          </>
        ) : (
          '—'
        )}
      </td>
      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[b.status]}`}
        >
          {t(`status.${b.status}`)}
        </span>
      </td>
      <td className="px-4 py-3 text-xs">
        {b.payment ? (
          <>
            <span className="font-semibold tracking-tight">
              {money(b.payment.amount)}
            </span>{' '}
            <span className="text-slate-500 dark:text-slate-400">
              {t(`pstatus.${b.payment.status}`)}
            </span>
          </>
        ) : (
          '—'
        )}
      </td>
      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
        {new Date(b.createdAt).toLocaleDateString(locale)}
      </td>
    </tr>
  );
}
