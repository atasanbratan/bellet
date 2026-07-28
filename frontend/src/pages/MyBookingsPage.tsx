import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { money } from '../lib/format';
import { type Booking } from '../types';
import { Cover, ClockIcon } from '../components/visuals';
import { useI18n } from '../i18n/LocaleContext';
import { locText } from '../lib/i18nContent';

const statusColor: Record<string, string> = {
  CONFIRMED: 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300',
  PENDING: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
  CANCELLED: 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
  COMPLETED: 'bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300',
};

export default function MyBookingsPage() {
  const { t, locale } = useI18n();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get('/bookings/mine')
      .then((r) => setBookings(r.data))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const pay = async (paymentId: string) => {
    await api.post('/payments/dev/simulate', { paymentId, outcome: 'PAID' });
    load();
  };
  const cancel = async (id: string) => {
    await api.patch(`/bookings/${id}/cancel`);
    load();
  };

  if (loading)
    return <div className="h-40 animate-pulse rounded-lg bg-slate-200/70 dark:bg-slate-800" />;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold tracking-tight">
        {t('bookings.title')}
      </h1>
      {bookings.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 py-16 text-center text-slate-400">
          {t('bookings.empty')}{' '}
          <Link to="/" className="font-medium text-teal-600 dark:text-teal-400">
            {t('bookings.browse')}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="flex items-center gap-4 rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
            >
              <Cover
                name={b.offering?.business?.name ?? 'B'}
                coverKey={b.offering?.business?.id ?? b.id}
                src={b.offering?.business?.photos?.[0]}
                className="hidden h-16 w-16 flex-shrink-0 rounded sm:flex"
                monogramClass="text-lg"
              />
              <div className="min-w-0 flex-1">
                <div className="font-bold">{b.offering ? locText(b.offering, 'title', locale) : ''}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {b.offering?.business?.name}
                </div>
                {b.group && (
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <ClockIcon className="h-3.5 w-3.5" />
                      {b.group.days.map((d) => t(`day_${d}`).slice(0, 3)).join('·')}{' '}
                      {t(`time.${b.group.timeOfDay}`)} {b.group.startTime}–
                      {b.group.endTime}
                    </span>
                    {b.group.teacher && (
                      <span>· {b.group.teacher.name}</span>
                    )}
                  </div>
                )}
              </div>
              <div className="text-right">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    statusColor[b.status] ?? 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  {t(`status.${b.status}`)}
                </span>
                {b.payment && (
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {t('common.advance_word')} {money(b.payment.amount)} ·{' '}
                    {t(`pstatus.${b.payment.status}`)}
                  </div>
                )}
                <div className="mt-2 flex justify-end gap-2">
                  {b.payment?.status === 'PENDING' &&
                    b.status !== 'CANCELLED' && (
                      <button
                        onClick={() => pay(b.payment!.id)}
                        className="rounded bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        {t('book.pay_advance')}
                      </button>
                    )}
                  {b.status === 'PENDING' && (
                    <button
                      onClick={() => cancel(b.id)}
                      className="rounded border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300"
                    >
                      {t('common.cancel')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
