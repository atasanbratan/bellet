import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useSaved } from '../auth/SavedContext';
import { useI18n } from '../i18n/LocaleContext';
import { useClickOutside } from '../lib/useClickOutside';
import Identicon from './Identicon';

const item =
  'flex items-center justify-between gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800';

/** Avatar in the header; the account actions live behind it. */
export default function UserMenu() {
  const { user, logout } = useAuth();
  const { count } = useSaved();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useClickOutside<HTMLDivElement>(open, close);

  if (!user) return null;

  // Name is optional at signup; the avatar keys off the id, so it doesn't care.
  const label = user.name?.trim() || user.phone;

  const go = (to: string) => {
    close();
    navigate(to);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        className="rounded ring-offset-2 transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:ring-offset-slate-900"
      >
        <Identicon value={user.userId} className="h-9 w-9" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-30 mt-2 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
            <div className="truncate text-sm font-semibold">{label}</div>
            {user.name && (
              <div className="truncate text-xs text-slate-400">{user.phone}</div>
            )}
          </div>

          <button role="menuitem" onClick={() => go('/saved')} className={`w-full ${item}`}>
            {t('nav.saved')}
            {count > 0 && (
              <span className="rounded-full bg-slate-100 px-1.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                {count}
              </span>
            )}
          </button>
          <button
            role="menuitem"
            onClick={() => go('/bookings')}
            className={`w-full ${item}`}
          >
            {t('nav.bookings')}
          </button>

          <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
          <button
            role="menuitem"
            onClick={async () => {
              close();
              // Leave first: clearing the session while still on an auth-gated
              // page lets its guard bounce us to /login instead of home.
              navigate('/');
              await logout();
            }}
            className={`w-full ${item} text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50`}
          >
            {t('nav.logout')}
          </button>
        </div>
      )}
    </div>
  );
}
