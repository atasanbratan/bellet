import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/LocaleContext';
import { money } from '../../lib/format';
import type { Group, Offering } from '../../types';
import type { BookingStep } from './useBookingFlow';

/** Sticky side panel: picked group summary, prices, book/pay actions. */
export default function BookingPanel({
  course,
  selected,
  step,
  busy,
  error,
  onConfirm,
  onPay,
}: {
  course: Offering;
  selected: Group | null;
  step: BookingStep;
  busy: boolean;
  error: string;
  onConfirm: () => void;
  onPay: () => void;
}) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const dayList = (days: number[]) =>
    days.map((d) => t(`day_${d}`).slice(0, 3)).join(' · ');

  return (
    <div className="sticky top-24 rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      {step === 'done' ? (
        <div className="py-2 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/50 text-2xl text-teal-600 dark:text-teal-400">
            ✓
          </div>
          <p className="mt-3 font-semibold text-slate-800 dark:text-slate-200">{t('book.confirmed')}</p>
          <button
            onClick={() => navigate('/bookings')}
            className="mt-4 w-full rounded bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
          >
            {t('book.view_bookings')}
          </button>
        </div>
      ) : !selected ? (
        <p className="py-6 text-center text-sm text-slate-400">
          {t('group.choose')}
        </p>
      ) : (
        <>
          {selected && (
            <div className="rounded bg-teal-50 dark:bg-teal-950/50 p-3 text-sm">
              <div className="flex flex-wrap items-center gap-2 font-medium text-teal-800 dark:text-teal-200">
                <span>{dayList(selected.days)}</span>
                <span>·</span>
                <span>
                  {t(`time.${selected.timeOfDay}`)} {selected.startTime}–
                  {selected.endTime}
                </span>
              </div>
              {selected.teacher && (
                <div className="mt-1 text-teal-700/80 dark:text-teal-300/80">
                  {t('common.teacher')}: {selected.teacher.name}
                </div>
              )}
            </div>
          )}

          <div className="mt-4 rounded bg-slate-50 dark:bg-slate-800/60 p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">
                {t('book.course_price')}
              </span>
              <span className="font-medium">{money(course.price)}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">{t('book.advance_now')}</span>
              <span className="font-bold text-teal-600 dark:text-teal-400">
                {money(course.prepaymentAmount)}
              </span>
            </div>
          </div>

          {step === 'pay' && (
            <p className="mt-3 text-xs text-slate-400">{t('book.mock_note')}</p>
          )}
          {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}

          <div className="mt-4">
            {step !== 'pay' ? (
              <button
                disabled={busy}
                onClick={onConfirm}
                className="w-full rounded bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {busy ? t('book.booking') : t('common.continue')}
              </button>
            ) : (
              <button
                disabled={busy}
                onClick={onPay}
                className="w-full rounded bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {busy ? t('book.paying') : t('book.pay_advance')}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
