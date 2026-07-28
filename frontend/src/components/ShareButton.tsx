import { useEffect, useState } from 'react';
import { useI18n } from '../i18n/LocaleContext';
import { cn } from '../lib/cn';

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.2 10.8l7.6-4.1M8.2 13.2l7.6 4.1" />
    </svg>
  );
}

/**
 * Share a centre. Uses the OS share sheet where available (phones), and falls
 * back to copying the link — which is what most desktop browsers will do.
 * `variant="overlay"` is the solid button that sits on the cover photo.
 */
export default function ShareButton({
  title,
  variant = 'default',
}: {
  title: string;
  variant?: 'default' | 'overlay';
}) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        return; // user dismissed the sheet — not an error worth surfacing
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard needs a secure context; nothing sensible left to try.
    }
  };

  return (
    <button
      onClick={share}
      className={cn(
        'inline-flex items-center gap-2 rounded text-sm transition',
        variant === 'overlay'
          ? 'bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700 active:scale-95'
          : 'border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:border-teal-400 hover:text-teal-700 dark:border-slate-600 dark:text-slate-200 dark:hover:text-teal-400',
      )}
    >
      <ShareIcon className="h-4 w-4" />
      {copied ? t('share.copied') : t('share.label')}
    </button>
  );
}
