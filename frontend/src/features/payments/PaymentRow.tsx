import { useI18n } from '../../i18n/LocaleContext';
import { Avatar } from '../../components/visuals';
import { money } from '../../lib/format';
import { locText } from '../../lib/i18nContent';
import type { AdminPayment, Payment } from '../../types';

const statusBadge: Record<Payment['status'], string> = {
  PAID: 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300',
  PENDING: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
  FAILED: 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300',
  REFUNDED: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
};

export default function PaymentRow({
  payment: p,
  showBusiness,
}: {
  payment: AdminPayment;
  showBusiness: boolean;
}) {
  const { t, locale } = useI18n();

  return (
    <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Avatar name={p.booking.client.name ?? p.booking.client.phone} />
          <div className="min-w-0">
            <div className="truncate font-medium">
              {p.booking.client.name ?? '—'}
            </div>
            <div className="text-xs text-slate-400">
              {p.booking.client.phone}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
        {locText(p.booking.offering, 'title', locale)}
      </td>
      {showBusiness && (
        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
          {p.booking.offering.business.name}
        </td>
      )}
      <td className="px-4 py-3 font-semibold tracking-tight">
        {money(p.amount)}
      </td>
      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[p.status]}`}
        >
          {t(`pstatus.${p.status}`)}
        </span>
      </td>
      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
        {new Date(p.createdAt).toLocaleDateString(locale)}
      </td>
    </tr>
  );
}
