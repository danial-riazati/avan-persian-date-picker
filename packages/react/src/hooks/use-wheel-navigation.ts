import { useRef, type WheelEvent as ReactWheelEvent } from 'react';

export interface UseWheelNavigationOptions {
  enabled?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  /** Minimum ms between month changes so a single scroll gesture doesn't skip many months. */
  throttleMs?: number;
}

/** Vertical mouse-wheel scroll changes the visible month, throttled to avoid over-triggering. */
export function useWheelNavigation(options: UseWheelNavigationOptions) {
  const lastFired = useRef(0);
  const enabled = options.enabled ?? false;

  function onWheel(event: ReactWheelEvent<HTMLElement>) {
    if (!enabled || Math.abs(event.deltaY) < Math.abs(event.deltaX)) {
      return;
    }

    const now = Date.now();
    const throttleMs = options.throttleMs ?? 350;

    if (now - lastFired.current < throttleMs) {
      return;
    }

    lastFired.current = now;

    if (event.deltaY > 0) {
      options.onNext();
    } else if (event.deltaY < 0) {
      options.onPrevious();
    }
  }

  return { onWheel };
}
