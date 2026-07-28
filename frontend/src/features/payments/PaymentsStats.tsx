import { useI18n } from '../../i18n/LocaleContext';
import { money } from '../../lib/format';
import StatTiles from '../../components/StatTiles';
import type { PaymentStats } from '../../types';

/** Aggregates of the currently filtered payments: count, total, paid. */
export default function PaymentsStats({ stats }: { stats: PaymentStats }) {
  const { t } = useI18n();
  return (
    <StatTiles
      tiles={[
        { label: t('pay.stat_count'), value: String(stats.count) },
        { label: t('pay.stat_total'), value: money(stats.totalAmount) },
        {
          label: t('pay.stat_paid'),
          value: money(stats.paidAmount),
          sub: t('pay.stat_paid_count', { n: stats.paidCount }),
          accent: 'positive',
        },
      ]}
    />
  );
}
