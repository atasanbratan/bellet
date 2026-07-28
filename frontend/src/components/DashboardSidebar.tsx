import { type ReactNode } from 'react';
import { useI18n } from '../i18n/LocaleContext';
import { cn } from '../lib/cn';

export interface SidebarItem<K extends string> {
  key: K;
  labelKey: string;
  icon: ReactNode;
}

/** Vertical section menu used by the admin and owner dashboards. */
export default function DashboardSidebar<K extends string>({
  items,
  active,
  onSelect,
}: {
  items: SidebarItem<K>[];
  active: K;
  onSelect: (s: K) => void;
}) {
  const { t } = useI18n();

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <nav className="flex gap-1 overflow-x-auto rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 lg:flex-col">
        {items.map((it) => (
          <button
            key={it.key}
            onClick={() => onSelect(it.key)}
            className={cn(
              // Active is marked by a teal edge + tint rather than a filled
              // block — the design system keeps solid fills for actions.
              'flex flex-shrink-0 items-center gap-2.5 rounded border-l-2 px-3 py-2.5 text-sm font-medium transition lg:rounded-l-none',
              active === it.key
                ? 'border-teal-600 bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                : 'border-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
            )}
          >
            {it.icon}
            {t(it.labelKey)}
          </button>
        ))}
      </nav>
    </aside>
  );
}

/** Shared stroke props for the 24×24 outline icons in sidebar items. */
export const sidebarIconProps = {
  className: 'h-4.5 w-4.5',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};
