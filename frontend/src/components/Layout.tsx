import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useI18n } from '../i18n/LocaleContext';
import { Logo } from './visuals';
import LanguageSwitcher from './LanguageSwitcher';
import GlobalSearch from './GlobalSearch';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';

export default function Layout() {
  const { user } = useAuth();
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="glass sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
          <Link to="/" className="flex-shrink-0 text-teal-600 dark:text-teal-400">
            <Logo />
          </Link>
          <GlobalSearch className="hidden min-w-0 flex-1 md:block md:max-w-2xl" />
          <nav className="ml-auto flex flex-shrink-0 items-center gap-1 text-sm font-medium sm:gap-2">
            <Link
              to="/"
              className="hidden rounded px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-teal-600 dark:hover:text-teal-400 sm:block"
            >
              {t('nav.browse')}
            </Link>
            {user?.role === 'OWNER' && (
              <Link
                to="/dashboard"
                className="rounded px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-teal-600 dark:hover:text-teal-400"
              >
                {t('nav.dashboard')}
              </Link>
            )}
            {user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className="rounded px-3 py-2 font-semibold text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {t('nav.admin')}
              </Link>
            )}
            <ThemeToggle />
            <LanguageSwitcher />
            {user ? (
              <UserMenu />
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded px-3 py-2 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="rounded bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
                >
                  {t('nav.signup')}
                </Link>
              </>
            )}
          </nav>
        </div>
        {/* Mobile: search gets its own row */}
        <div className="px-4 pb-3 md:hidden">
          <GlobalSearch />
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-slate-400 sm:flex-row">
          <Logo className="text-slate-500 dark:text-slate-400" />
          <span>{t('footer.copy')}</span>
        </div>
      </footer>
    </div>
  );
}
