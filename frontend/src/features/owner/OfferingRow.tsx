import { useState } from 'react';
import api from '../../api/client';
import type { Address, Offering, Teacher } from '../../types';
import { money } from '../../lib/format';
import { useI18n } from '../../i18n/LocaleContext';
import { locText } from '../../lib/i18nContent';
import { cn } from '../../lib/cn';
import OfferingEditForm from './OfferingEditForm';
import GroupEditor from './GroupEditor';
import { isConflict } from './utils';

/** One course as a collapsed row; expands to edit details and manage groups. */
export default function OfferingRow({
  offering: o,
  teachers,
  addresses,
  open,
  onToggle,
  onChange,
}: {
  offering: Offering;
  teachers: Teacher[];
  addresses: Address[];
  open: boolean;
  onToggle: () => void;
  onChange: () => void;
}) {
  const { t, locale } = useI18n();
  const [editing, setEditing] = useState(false);

  const remove = async () => {
    const name = locText(o, 'title', locale);
    if (!confirm(t('dash.delete_course_confirm', { name }))) return;
    try {
      await api.delete(`/offerings/${o.id}`);
      onChange();
    } catch (e) {
      alert(isConflict(e) ? t('dash.has_bookings') : String(e));
    }
  };

  return (
    <div
      className={cn(
        'rounded border transition',
        open
          ? 'border-teal-300 dark:border-teal-700'
          : 'border-slate-200 dark:border-slate-700',
      )}
    >
      {/* Collapsed summary row — click to expand */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm"
      >
        <span className={cn('text-slate-400 transition', open && 'rotate-90')}>
          ›
        </span>
        <span className="min-w-0 flex-1 truncate font-medium">
          {locText(o, 'title', locale)}
        </span>
        <span className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
          {money(o.price)} · {t('common.advance_word')}{' '}
          {money(o.prepaymentAmount)}
        </span>
        <span className="rounded-full bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 text-xs font-medium text-teal-600 dark:text-teal-400">
          {t('course.groups_count', { n: o.groups?.length ?? 0 })}
        </span>
      </button>

      {open && (
        <div className="border-t border-slate-100 dark:border-slate-800 px-3 py-2.5 text-sm">
          <div className="flex gap-3">
            <button
              onClick={() => setEditing(!editing)}
              className="text-xs font-medium text-teal-600 dark:text-teal-400"
            >
              {editing ? t('common.cancel') : t('common.edit')}
            </button>
            <button
              onClick={remove}
              className="text-xs font-medium text-red-600 dark:text-red-400"
            >
              {t('common.delete')}
            </button>
          </div>
          {editing && (
            <OfferingEditForm
              offering={o}
              onSaved={() => {
                setEditing(false);
                onChange();
              }}
            />
          )}
          <GroupEditor
            offeringId={o.id}
            onChange={onChange}
            groups={o.groups ?? []}
            teachers={teachers}
            addresses={addresses}
          />
        </div>
      )}
    </div>
  );
}
