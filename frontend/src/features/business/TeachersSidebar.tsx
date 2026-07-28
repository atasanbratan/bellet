import type { Teacher } from '../../types';
import { Avatar } from '../../components/visuals';
import { useI18n } from '../../i18n/LocaleContext';

/** Sticky sidebar listing the center's teachers. */
export default function TeachersSidebar({ teachers }: { teachers: Teacher[] }) {
  const { t } = useI18n();

  return (
    <div className="sticky top-24 rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <h2 className="mb-3 font-bold">{t('detail.teachers')}</h2>
      {teachers.length === 0 ? (
        <p className="text-sm text-slate-400">{t('detail.no_teachers')}</p>
      ) : (
        <div className="space-y-3">
          {teachers.map((tc) => (
            <div key={tc.id} className="flex items-center gap-3">
              <Avatar name={tc.name} big src={tc.photo} />
              <div className="min-w-0">
                <div className="font-semibold">{tc.name}</div>
                {tc.bio && (
                  <div className="truncate text-xs text-slate-500 dark:text-slate-400">{tc.bio}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
