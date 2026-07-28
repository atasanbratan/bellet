import { useI18n } from '../../i18n/LocaleContext';
import Identicon from '../../components/Identicon';
import TablePager from '../../components/TablePager';
import type { AdminUser, Role } from '../../types';

const roleBadge: Record<Role, string> = {
  ADMIN: 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900',
  OWNER: 'bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300',
  CLIENT: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
};

interface Props {
  items: AdminUser[];
  page: number;
  totalPages: number;
  total: number;
  loading: boolean;
  onPage: (page: number) => void;
}

export default function UsersTable({
  items,
  page,
  totalPages,
  total,
  loading,
  onPage,
}: Props) {
  const { t, locale } = useI18n();

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">{t('table.name')}</th>
              <th className="px-4 py-3 font-medium">{t('table.phone')}</th>
              <th className="px-4 py-3 font-medium">{t('table.role')}</th>
              <th className="px-4 py-3 font-medium">{t('table.verified')}</th>
              <th className="px-4 py-3 font-medium">{t('table.joined')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Identicon value={u.id} className="h-7 w-7 flex-shrink-0" />
                    <span className="font-medium">{u.name ?? '—'}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{u.phone}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${roleBadge[u.role]}`}
                  >
                    {t(`role.${u.role}`)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {u.phoneVerified ? (
                    <span className="text-teal-600 dark:text-teal-400">✓ {t('common.yes')}</span>
                  ) : (
                    <span className="text-slate-400">{t('common.no')}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {new Date(u.createdAt).toLocaleDateString(locale)}
                </td>
              </tr>
            ))}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                  {t('admin.empty')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <TablePager
        page={page}
        totalPages={totalPages}
        total={total}
        loading={loading}
        onPage={onPage}
      />
    </div>
  );
}
