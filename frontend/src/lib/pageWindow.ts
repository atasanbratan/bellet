/** A gap in the page list, rendered as an ellipsis. */
export const GAP = 'gap' as const;

export type PageItem = number | typeof GAP;

/**
 * Page numbers to show around the current page, e.g. 1 … 5 6 7 … 12.
 * Always keeps the first and last page reachable.
 */
export function pageWindow(
  page: number,
  totalPages: number,
  radius = 1,
): PageItem[] {
  if (totalPages <= 1) return [1];

  const pages = new Set<number>([1, totalPages]);
  for (let p = page - radius; p <= page + radius; p++) {
    if (p >= 1 && p <= totalPages) pages.add(p);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const items: PageItem[] = [];
  let previous = 0;
  for (const p of sorted) {
    if (previous && p - previous > 1) items.push(GAP);
    items.push(p);
    previous = p;
  }
  return items;
}
