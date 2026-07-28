import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useSaved } from '../auth/SavedContext';
import { useI18n } from '../i18n/LocaleContext';
import { cn } from '../lib/cn';

function HeartIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 20s-7-4.4-9.2-8.4A5.2 5.2 0 0112 5.6a5.2 5.2 0 019.2 6C19 15.6 12 20 12 20z" />
    </svg>
  );
}

/**
 * Bookmark toggle.
 * - `icon`    small heart tucked on a browse card
 * - `full`    labelled button on a light surface
 * - `overlay` glass button sitting on top of the cover photo
 */
export default function SaveButton({
  businessId,
  variant = 'icon',
}: {
  businessId: string;
  variant?: 'icon' | 'full' | 'overlay';
}) {
  const { t } = useI18n();
  const { user } = useAuth();
  const { isSaved, toggle } = useSaved();
  const navigate = useNavigate();
  const saved = isSaved(businessId);

  const onClick = (e: React.MouseEvent) => {
    // Cards wrap this in a link — don't navigate when hearting.
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    toggle(businessId);
  };

  const label = t(saved ? 'saved.remove' : 'saved.add');

  if (variant === 'icon') {
    return (
      <button
        onClick={onClick}
        aria-label={label}
        aria-pressed={saved}
        title={label}
        className={cn(
          'grid h-7 w-7 place-items-center rounded border backdrop-blur-sm transition',
          saved
            ? 'border-rose-200 bg-white/90 text-rose-600 dark:border-rose-900 dark:bg-slate-900/85'
            : 'border-slate-200/60 bg-white/90 text-slate-500 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-900/85 dark:text-slate-300',
        )}
      >
        <HeartIcon filled={saved} className="h-4 w-4" />
      </button>
    );
  }

  // Sits on the cover photo, so it can't rely on the page's surface colours.
  if (variant === 'overlay') {
    return (
      <button
        onClick={onClick}
        aria-pressed={saved}
        className={cn(
          'inline-flex items-center gap-2 rounded border px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition active:scale-95',
          saved
            ? 'border-white/30 bg-white/20'
            : 'border-white/20 bg-white/10 hover:bg-white/20',
        )}
      >
        <HeartIcon
          filled={saved}
          className={cn('h-4 w-4', saved && 'text-rose-400')}
        />
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      aria-pressed={saved}
      className={cn(
        'inline-flex items-center gap-2 rounded border px-3 py-1.5 text-sm font-medium transition',
        saved
          ? 'border-rose-300 text-rose-600 dark:border-rose-800 dark:text-rose-400'
          : 'border-slate-300 text-slate-700 hover:border-rose-300 hover:text-rose-600 dark:border-slate-600 dark:text-slate-200',
      )}
    >
      <HeartIcon filled={saved} className="h-4 w-4" />
      {label}
    </button>
  );
}
