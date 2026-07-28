import { hashString } from './cover';

/**
 * Deterministic pixel avatar: the same key always yields the same face, so a
 * user's avatar is stable across sessions and devices. Generated locally —
 * an avatar service would put a third party in the render path and hand them
 * a user identifier for free.
 *
 * The grid is mirrored down the middle, which is what makes a pile of random
 * bits read as a "face" rather than noise.
 */
export const GRID = 5;

/**
 * Mid-tone inks only. The tile flips with the theme, so an ink has to stay
 * legible on both slate-100 and slate-800 — the darker shades of the app
 * palette vanish against the dark tile.
 */
const INKS = [
  '#14b8a6', // teal
  '#0891b2', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#f43f5e', // rose
  '#f59e0b', // amber
  '#64748b', // slate
  '#d946ef', // fuchsia
];

export interface Identicon {
  /** Row-major GRID×GRID cells; true = filled. */
  cells: boolean[];
  ink: string;
}

export function identicon(key: string): Identicon {
  const seed = hashString(key || 'x');
  // A separate hash for colour, so it isn't correlated with the pattern.
  const ink = INKS[hashString(`${key}#ink`) % INKS.length];

  const half = Math.ceil(GRID / 2); // 3 generated columns, 2 mirrored
  const cells: boolean[] = new Array(GRID * GRID).fill(false);

  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < half; col++) {
      // One bit per generated cell; 15 bits fits in the 32-bit hash.
      const bit = (seed >>> (row * half + col)) & 1;
      if (!bit) continue;
      cells[row * GRID + col] = true;
      cells[row * GRID + (GRID - 1 - col)] = true; // mirror
    }
  }

  return { cells, ink };
}
