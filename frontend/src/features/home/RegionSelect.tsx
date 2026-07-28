import { useCallback, useEffect, useRef, useState } from 'react';
import type { Province } from '../../types';
import { useI18n } from '../../i18n/LocaleContext';
import { provinceName } from '../../lib/i18nContent';
import { useClickOutside } from '../../lib/useClickOutside';
import { useListboxKeys } from '../../lib/useListboxKeys';
import { cn } from '../../lib/cn';
import { CheckIcon, ChevronDownIcon, MapPinIcon } from '../../components/visuals';

interface Option {
  id: string;
  label: string;
  count?: number;
}

/**
 * Region filter. A listbox rather than a native <select> so it can carry the
 * centre counts and match the subject sidebar — a bare <select> can't style
 * its options, and the count is what stops you picking an empty welayat.
 */
export default function RegionSelect({
  provinces,
  value,
  onChange,
}: {
  provinces: Province[];
  value: string;
  onChange: (id: string) => void;
}) {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useClickOutside<HTMLDivElement>(open, close);
  const listRef = useRef<HTMLUListElement>(null);

  const options: Option[] = [
    { id: '', label: t('home.all_provinces') },
    ...provinces.map((p) => ({
      id: p.id,
      label: provinceName(p, locale),
      count: p.businessCount,
    })),
  ];
  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.id === value),
  );
  const [active, setActive] = useState(selectedIndex);
  const selected = options[selectedIndex];

  // Open on the current choice, and move focus in so arrows work immediately.
  useEffect(() => {
    if (!open) return;
    setActive(selectedIndex);
    listRef.current?.focus();
  }, [open, selectedIndex]);

  const pick = (o: Option) => {
    if (o.count === 0) return; // nothing there — don't offer a dead end
    onChange(o.id);
    close();
  };

  const onKeyDown = useListboxKeys({
    open,
    setOpen,
    count: options.length,
    active,
    setActive,
    onPick: (i) => pick(options[i]),
  });

  return (
    <div ref={ref} className="relative sm:min-w-[200px]" onKeyDown={onKeyDown}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'flex w-full items-center gap-2 rounded border bg-slate-50 px-3 py-2.5 text-sm transition dark:bg-slate-800/60',
          open
            ? 'border-teal-500'
            : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600',
        )}
      >
        <MapPinIcon className="h-4 w-4 flex-shrink-0 text-slate-400" />
        <span className={cn('flex-1 truncate text-left', !value && 'text-slate-500 dark:text-slate-400')}>
          {selected.label}
        </span>
        <ChevronDownIcon
          className={cn('h-4 w-4 flex-shrink-0 text-slate-400 transition', open && 'rotate-180')}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={`region-${active}`}
          className="absolute left-0 right-0 top-full z-30 mt-1 max-h-72 overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg outline-none dark:border-slate-700 dark:bg-slate-900"
        >
          {options.map((o, i) => {
            const empty = o.count === 0;
            return (
              <li
                key={o.id || 'all'}
                id={`region-${i}`}
                role="option"
                aria-selected={o.id === value}
                aria-disabled={empty}
                onClick={() => pick(o)}
                onMouseEnter={() => setActive(i)}
                className={cn(
                  'flex cursor-pointer items-center gap-2 px-3 py-2 text-sm',
                  i === active && !empty && 'bg-slate-100 dark:bg-slate-800',
                  o.id === value && 'font-semibold text-teal-700 dark:text-teal-400',
                  empty && 'cursor-not-allowed opacity-40',
                )}
              >
                <span className="flex-1 truncate">{o.label}</span>
                {o.count !== undefined && (
                  <span className="text-xs text-slate-400">{o.count}</span>
                )}
                {o.id === value && <CheckIcon className="h-4 w-4 flex-shrink-0" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
