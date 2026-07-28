/** Shared stat glyphs, used by both the admin and owner dashboards. */

const ico = {
  className: 'h-5 w-5',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const UsersIcon = () => (
  <svg viewBox="0 0 24 24" {...ico}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3 20a6 6 0 0112 0M16 5.5a3 3 0 010 5M21 20a6 6 0 00-4-5.7" />
  </svg>
);
export const BuildingIcon = () => (
  <svg viewBox="0 0 24 24" {...ico}>
    <path d="M4 21V6l8-3v18M12 21V9l7 3v9M3 21h18" />
    <path d="M7 8v0M7 12v0M7 16v0" />
  </svg>
);
export const BookIcon = () => (
  <svg viewBox="0 0 24 24" {...ico}>
    <path d="M4 5a2 2 0 012-2h12v16H6a2 2 0 00-2 2z" />
    <path d="M18 3v18" />
  </svg>
);
export const TicketIcon = () => (
  <svg viewBox="0 0 24 24" {...ico}>
    <path d="M4 8a2 2 0 012-2h12a2 2 0 012 2 2 2 0 000 4 2 2 0 000 4 2 2 0 01-2 2H6a2 2 0 01-2-2 2 2 0 000-4 2 2 0 000-4z" />
    <path d="M14 6v12" />
  </svg>
);
export const CoinIcon = () => (
  <svg viewBox="0 0 24 24" {...ico}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v8M9.5 10.5c0-1 1-1.5 2.5-1.5s2.5.7 2.5 1.6c0 2-5 1-5 2.9 0 .9 1 1.5 2.5 1.5s2.5-.6 2.5-1.5" />
  </svg>
);
