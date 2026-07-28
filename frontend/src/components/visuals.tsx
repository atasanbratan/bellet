import { cn } from '../lib/cn';
import { gradientFor, monogram } from '../lib/cover';

type SvgProps = { className?: string };

/* ---------------------------------------------------------------- Brand */

export function Logo({ className }: SvgProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
        <rect x="2" y="2" width="28" height="28" rx="4" fill="#0d9488" />
        <path
          d="M11 21V11.5c0-.3.3-.5.6-.4l7.2 2.2c1.6.5 1.6 2.8 0 3.3L13 18.4"
          fill="none"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="21" r="1.7" fill="#fff" />
      </svg>
      <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Bellet
      </span>
    </span>
  );
}

/* ------------------------------------------------------------ Category icons */

export function CategoryIcon({
  slug,
  className,
}: {
  slug?: string;
  className?: string;
}) {
  const common = {
    className: cn('h-5 w-5', className),
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (slug) {
    case 'carwash':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M5 13l1.5-4A2 2 0 018.4 8h7.2a2 2 0 011.9 1.4L19 13" />
          <path d="M4 13h16v4a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1H7v1a1 1 0 01-1 1H5a1 1 0 01-1-1z" />
          <path d="M8 4c0 1-1 1-1 2M12 3c0 1-1 1-1 2M16 4c0 1-1 1-1 2" />
        </svg>
      );
    case 'barber':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <circle cx="6" cy="6" r="2.5" />
          <circle cx="6" cy="18" r="2.5" />
          <path d="M8 8l12 8M8 16L20 8M8.2 7.8L14 12" />
        </svg>
      );
    default: // education
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M3 8l9-4 9 4-9 4-9-4z" />
          <path d="M7 10v4c0 1.5 2.2 3 5 3s5-1.5 5-3v-4" />
          <path d="M21 8v5" />
        </svg>
      );
  }
}

export function SearchIcon({ className }: SvgProps) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
      />
    </svg>
  );
}

export function ChevronDownIcon({ className }: SvgProps) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function CheckIcon({ className }: SvgProps) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

/* ------------------------------------------------------------- Subject icons */

/**
 * Subject glyphs, keyed by the `icon` name stored on the Subject row (Material
 * Symbols naming). Drawn inline rather than pulled from an icon font — Google's
 * CDN isn't dependable in-country, same reason storage is self-hosted.
 */
export function SubjectIcon({
  icon,
  className,
}: {
  icon?: string | null;
  className?: string;
}) {
  const common = {
    className: cn('h-5 w-5', className),
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (icon) {
    case 'language':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
        </svg>
      );
    case 'computer':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <rect x="3" y="5" width="18" height="12" rx="1.5" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      );
    case 'functions':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M7 5h10l-6 7 6 7H7" />
        </svg>
      );
    case 'music_note':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <circle cx="7" cy="18" r="3" />
          <path d="M10 18V5l9-2v12" />
          <circle cx="16" cy="15" r="3" />
        </svg>
      );
    case 'palette':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M12 3a9 9 0 000 18c1.7 0 2-1.3 1.2-2.2-.8-.9-.5-2.3.8-2.3H17a4 4 0 004-4c0-5-4-9.5-9-9.5z" />
          <circle cx="7.5" cy="11" r="1" />
          <circle cx="12" cy="8" r="1" />
          <circle cx="16" cy="11" r="1" />
        </svg>
      );
    case 'work':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <rect x="3" y="7" width="18" height="13" rx="1.5" />
          <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 12h18" />
        </svg>
      );
    case 'school':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M3 8l9-4 9 4-9 4-9-4z" />
          <path d="M7 10v4c0 1.5 2.2 3 5 3s5-1.5 5-3v-4" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

/* --------------------------------------------------------- Generated cover */

export function Cover({
  name,
  coverKey,
  src,
  slug,
  className,
  monogramClass,
}: {
  name: string;
  coverKey: string;
  src?: string | null;
  slug?: string;
  className?: string;
  monogramClass?: string;
}) {
  if (src) {
    return (
      <img src={src} alt={name} className={cn('object-cover', className)} />
    );
  }
  const [a, b] = gradientFor(coverKey);
  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden',
        className,
      )}
      style={{ backgroundImage: `linear-gradient(135deg, ${a}, ${b})` }}
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-25"
        aria-hidden
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id={`dots-${coverKey.slice(-6)}`}
            width="22"
            height="22"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="2" fill="#fff" />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#dots-${coverKey.slice(-6)})`}
        />
      </svg>
      <div className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/20 blur-xl" />
      <span
        className={cn(
          'relative font-extrabold tracking-tight text-white/95',
          monogramClass ?? 'text-3xl',
        )}
      >
        {monogram(name)}
      </span>
      {slug && (
        <span className="absolute bottom-2 right-2 text-white/80">
          <CategoryIcon slug={slug} className="h-5 w-5" />
        </span>
      )}
    </div>
  );
}

/* --------------------------------------------------------- Hero illustration */

export function HeroArt({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 420 360" className={className} aria-hidden>
      <defs>
        <linearGradient id="c1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id="c2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
        <linearGradient id="c3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      {/* floating course card */}
      <g className="animate-floaty">
        <rect x="60" y="70" width="180" height="120" rx="8" fill="url(#c1)" />
        <rect x="80" y="92" width="90" height="12" rx="2" fill="#94a3b8" />
        <rect x="80" y="114" width="140" height="9" rx="2" fill="#cbd5e1" />
        <rect x="80" y="130" width="120" height="9" rx="2" fill="#cbd5e1" />
        <rect x="80" y="156" width="60" height="18" rx="4" fill="#0d9488" />
      </g>
      {/* graduation cap badge */}
      <g className="animate-floaty-slow">
        <circle cx="300" cy="120" r="46" fill="url(#c2)" />
        <path
          d="M278 116l22-9 22 9-22 9-22-9z"
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M286 120v9c0 4 6 7 14 7s14-3 14-7v-9"
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
      {/* calendar chip */}
      <g className="animate-floaty">
        <rect x="250" y="205" width="110" height="90" rx="8" fill="url(#c3)" />
        <rect x="268" y="225" width="74" height="10" rx="2" fill="#94a3b8" />
        <rect x="268" y="243" width="24" height="24" rx="4" fill="#0d9488" />
        <rect x="300" y="243" width="24" height="24" rx="4" fill="#475569" />
      </g>
      {/* small orbiting dots */}
      <circle cx="50" cy="230" r="10" fill="#334155" className="animate-floaty-slow" />
      <circle cx="380" cy="60" r="8" fill="#0d9488" className="animate-floaty" />
    </svg>
  );
}

/* ----------------------------------------------------------------- Avatar */

export function Avatar({
  name,
  big,
  src,
}: {
  name: string;
  big?: boolean;
  src?: string | null;
}) {
  const [a, b] = gradientFor(name);
  const size = big ? 'h-10 w-10 text-sm' : 'h-7 w-7 text-[11px]';
  if (src) {
    return (
      <img src={src} alt={name} className={cn(size, 'rounded-full object-cover')} />
    );
  }
  return (
    <span
      className={cn(
        size,
        'inline-flex items-center justify-center rounded-full font-bold text-white',
      )}
      style={{ backgroundImage: `linear-gradient(135deg, ${a}, ${b})` }}
    >
      {monogram(name)}
    </span>
  );
}

/* -------------------------------------------------------------- Small icons */

export function StarRow({ className }: SvgProps) {
  return (
    <span className={cn('inline-flex text-amber-400', className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15l-5.2 2.6 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

export function MapPinIcon({ className }: SvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('h-4 w-4', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s-6-5.3-6-10a6 6 0 1112 0c0 4.7-6 10-6 10z" />
      <circle cx="12" cy="11" r="2" />
    </svg>
  );
}

export function ClockIcon({ className }: SvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('h-4 w-4', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function CalendarIcon({ className }: SvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('h-4 w-4', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 9h18M8 2v4M16 2v4" />
    </svg>
  );
}
