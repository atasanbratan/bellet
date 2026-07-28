/**
 * Keyboard behaviour for a listbox popover, per the ARIA pattern: arrows move
 * the active option (wrapping), Home/End jump to the ends, Enter/Space picks,
 * Tab and Escape dismiss. Escape/outside-click are handled by useClickOutside.
 */
export function useListboxKeys({
  open,
  setOpen,
  count,
  active,
  setActive,
  onPick,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  count: number;
  active: number;
  setActive: (updater: (index: number) => number) => void;
  onPick: (index: number) => void;
}) {
  return (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        e.preventDefault();
        const step = e.key === 'ArrowDown' ? 1 : -1;
        setActive((i) => (i + step + count) % count);
        break;
      }
      case 'Home':
        e.preventDefault();
        setActive(() => 0);
        break;
      case 'End':
        e.preventDefault();
        setActive(() => count - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onPick(active);
        break;
      case 'Tab':
        setOpen(false);
        break;
    }
  };
}
