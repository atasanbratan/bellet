// Deterministic cover art: a stable gradient + monogram derived from a key,
// so every business/teacher looks designed even without an uploaded photo.
// Slate-and-teal only: covers are a neutral backdrop, never a colour accent —
// saturated multi-hue gradients here are what made the UI read as playful.
const PALETTES: [string, string][] = [
  ['#0f172a', '#334155'],
  ['#134e4a', '#0f766e'],
  ['#1e293b', '#0f766e'],
  ['#0f766e', '#0d9488'],
  ['#334155', '#475569'],
  ['#115e59', '#1e293b'],
  ['#0d9488', '#155e75'],
  ['#1e3a8a', '#0f172a'],
];

export function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(h, 31) + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function gradientFor(key: string): [string, string] {
  return PALETTES[hashString(key || 'x') % PALETTES.length];
}

export function monogram(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? '').join('') || '?';
}
