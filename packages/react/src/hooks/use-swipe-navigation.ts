import { useRef, type PointerEvent as ReactPointerEvent } from 'react';

export interface UseSwipeNavigationOptions {
  dir: 'rtl' | 'ltr';
  enabled?: boolean;
  onSwipePrevious: () => void;
  onSwipeNext: () => void;
  /** Minimum horizontal drag distance (px) to count as a swipe. Default: 45. */
  threshold?: number;
}

/** Touch/pointer swipe-left/right to change month, RTL-aware. */
export function useSwipeNavigation(options: UseSwipeNavigationOptions) {
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const enabled = options.enabled ?? true;

  function onPointerDown(event: ReactPointerEvent<HTMLElement>) {
    if (!enabled || event.pointerType !== 'touch') {
      return;
    }
    startX.current = event.clientX;
    startY.current = event.clientY;
  }

  function onPointerUp(event: ReactPointerEvent<HTMLElement>) {
    if (!enabled || startX.current === null || startY.current === null) {
      return;
    }

    const deltaX = event.clientX - startX.current;
    const deltaY = event.clientY - startY.current;
    const threshold = options.threshold ?? 45;

    startX.current = null;
    startY.current = null;

    if (Math.abs(deltaX) < threshold || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }

    const swipedForward = deltaX < 0;
    const goNext = options.dir === 'rtl' ? !swipedForward : swipedForward;

    if (goNext) {
      options.onSwipeNext();
    } else {
      options.onSwipePrevious();
    }
  }

  function onPointerCancel() {
    startX.current = null;
    startY.current = null;
  }

  return { onPointerDown, onPointerUp, onPointerCancel };
}
