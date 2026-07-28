import { useI18n } from '../../i18n/LocaleContext';
import GroupCard from '../../components/GroupCard';
import { seatInfo } from '../../lib/seats';
import { canEnroll, enrollmentStatus } from '../../lib/enrollment';
import type { Group } from '../../types';

/** Card grid of a course's groups (toparlar); full groups can't be booked. */
export default function GroupList({
  groups,
  selectedId,
  onPick,
}: {
  groups: Group[];
  selectedId?: string;
  onPick: (g: Group) => void;
}) {
  const { t } = useI18n();

  if (groups.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 py-10 text-center text-slate-400">
        {t('group.none')}
      </p>
    );
  }

  const bookLabel = (g: Group) => {
    const status = enrollmentStatus(g);
    if (status === 'closed') return t('group.enroll_closed');
    if (status === 'not_open') return t('group.enroll_not_open');
    return t('common.book');
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {groups.map((g) => (
        <GroupCard
          key={g.id}
          group={g}
          selected={selectedId === g.id}
          footer={
            <button
              onClick={() => onPick(g)}
              disabled={seatInfo(g).full || !canEnroll(g)}
              className="mt-3 w-full rounded bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {bookLabel(g)}
            </button>
          }
        />
      ))}
    </div>
  );
}
