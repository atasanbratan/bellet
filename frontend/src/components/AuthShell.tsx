import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Logo, HeroArt } from './visuals';
import { useI18n } from '../i18n/LocaleContext';

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
      <div className="grid md:grid-cols-2">
        <div className="bg-mesh relative hidden flex-col justify-between p-8 text-white md:flex">
          <Link to="/">
            <Logo />
          </Link>
          <HeroArt className="my-4 w-full" />
          <div>
            <p className="text-xl font-bold">{t('authshell.tagline')}</p>
            <p className="text-sm text-white/80">{t('authshell.sub')}</p>
          </div>
        </div>
        <div className="p-8">
          <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
          <div className="mt-6">{children}</div>
          {footer && <div className="mt-5 text-sm text-slate-500 dark:text-slate-400">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

export const inputClass =
  'w-full rounded border border-slate-300 dark:border-slate-600 px-3 py-2.5 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-800';

export const buttonClass =
  'w-full rounded bg-teal-600 py-2.5 font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50';
