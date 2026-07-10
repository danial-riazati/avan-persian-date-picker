import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

// jsdom doesn't implement PointerEvent fully; components use pointer events for swipe nav.
if (typeof window !== 'undefined' && !window.PointerEvent) {
  class PointerEventPolyfill extends MouseEvent implements Partial<PointerEvent> {
    pointerId = 1;
    pointerType = 'mouse';
    constructor(type: string, params: MouseEventInit = {}) {
      super(type, params);
    }
  }
  // @ts-expect-error -- minimal polyfill, not a full PointerEvent implementation
  window.PointerEvent = PointerEventPolyfill;
}
