import type { Group } from '../types';

/** Seats taken/left in a group; capacity 0 means unlimited. */
export function seatInfo(g: Group) {
  const taken = g._count?.bookings ?? 0;
  const unlimited = g.capacity <= 0;
  const left = unlimited ? Infinity : Math.max(g.capacity - taken, 0);
  return { taken, left, unlimited, full: !unlimited && left === 0 };
}
