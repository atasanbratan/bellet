import { useState } from 'react';
import type { Address, Offering, Teacher } from '../../types';
import { useI18n } from '../../i18n/LocaleContext';
import OfferingAddForm from './OfferingAddForm';
import OfferingRow from './OfferingRow';

/**
 * Courses of the center as an accordion: one course open at a time,
 * add form hidden behind the "+ Add course" button.
 */
export default function OfferingsSection({
  businessId,
  offerings,
  teachers,
  addresses,
  onChange,
}: {
  businessId: string;
  offerings: Offering[];
  teachers: Teacher[];
  addresses: Address[];
  onChange: () => void;
}) {
  const { t } = useI18n();
  const [openId, setOpenId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          {t('detail.courses')}
        </h3>
        <button
          onClick={() => setAdding(!adding)}
          className="rounded bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700"
        >
          {adding ? t('common.cancel') : `+ ${t('dash.add_course')}`}
        </button>
      </div>

      {adding && (
        <OfferingAddForm
          businessId={businessId}
          onAdded={() => {
            setAdding(false);
            onChange();
          }}
          onCancel={() => setAdding(false)}
        />
      )}

      <div className="space-y-2">
        {offerings.map((o) => (
          <OfferingRow
            key={o.id}
            offering={o}
            teachers={teachers}
            addresses={addresses}
            open={openId === o.id}
            onToggle={() => setOpenId(openId === o.id ? null : o.id)}
            onChange={onChange}
          />
        ))}
        {offerings.length === 0 && !adding && (
          <p className="rounded border border-dashed border-slate-300 dark:border-slate-600 py-6 text-center text-sm text-slate-400">
            {t('detail.no_courses')}
          </p>
        )}
      </div>
    </section>
  );
}
