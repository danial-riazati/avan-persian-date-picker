import { useState } from 'react';

export interface UseControllableOpenOptions {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function useControllableOpen({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
}: UseControllableOpenOptions) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = openProp ?? internalOpen;

  function setOpen(next: boolean) {
    if (openProp === undefined) {
      setInternalOpen(next);
    }

    onOpenChange?.(next);
  }

  function toggleOpen() {
    setOpen(!open);
  }

  return { open, setOpen, toggleOpen };
}
