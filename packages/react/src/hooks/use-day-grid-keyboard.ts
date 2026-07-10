'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { addDays, isSameDay } from 'date-fns-jalali';
import {
  addJalaliMonths,
  endOfJalaliWeek,
  startOfJalaliWeek,
  toGregorian,
  toJalali,
} from '@avan-persian/core';

export interface UseDayGridKeyboardOptions {
  dir: 'rtl' | 'ltr';
  weekStartsOn?: number;
  /** How many Jalali months are currently visible (1–4). Used to know when to page. */
  numberOfMonths: number;
  /** Called with a month delta (e.g. -1, +1, -12, +12) when focus needs to move off-screen. */
  onNavigateMonths: (deltaMonths: number) => void;
  onSelect: (date: Date) => void;
  /** A date is skipped while navigating (but never fully unreachable) when this returns true. */
  isDateDisabled?: (date: Date) => boolean;
  today?: Date;
  /** The date that should receive roving focus when nothing has been focused yet. */
  initialDate?: Date;
}

/**
 * Implements the WAI-ARIA "grid" keyboard pattern for a day grid: arrow keys move focus by
 * day/week (RTL-aware), Home/End jump to week bounds, PageUp/PageDown change month, and
 * Shift+PageUp/PageDown change year. Focus is roved via a single tabbable cell + refs, so the
 * grid itself only needs one tab stop.
 */
export function useDayGridKeyboard(options: UseDayGridKeyboardOptions) {
  const today = options.today ?? new Date();
  const [focusedDate, setFocusedDate] = useState<Date>(options.initialDate ?? today);
  const dayRefs = useRef(new Map<string, HTMLButtonElement>());
  const pendingFocusKey = useRef<string | null>(null);

  function keyOf(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }

  function registerDayRef(date: Date, el: HTMLButtonElement | null) {
    const key = keyOf(date);
    if (el) {
      dayRefs.current.set(key, el);
      if (pendingFocusKey.current === key) {
        el.focus();
        pendingFocusKey.current = null;
      }
    } else {
      dayRefs.current.delete(key);
    }
  }

  function moveFocusTo(date: Date) {
    const monthDelta = monthsBetween(date, focusedDate);
    setFocusedDate(date);
    const key = keyOf(date);

    if (dayRefs.current.has(key)) {
      dayRefs.current.get(key)?.focus();
    } else {
      pendingFocusKey.current = key;
    }

    if (monthDelta !== 0) {
      options.onNavigateMonths(monthDelta);
    }
  }

  function monthsBetween(target: Date, current: Date): number {
    const targetJalali = toJalali(target);
    const currentJalali = toJalali(current);
    const totalMonthsDiff =
      (targetJalali.year - currentJalali.year) * 12 + (targetJalali.month - currentJalali.month);

    // Only page when the target falls outside the currently visible span of months.
    if (totalMonthsDiff >= options.numberOfMonths) {
      return totalMonthsDiff - options.numberOfMonths + 1;
    }
    if (totalMonthsDiff < 0) {
      return totalMonthsDiff;
    }
    return 0;
  }

  function step(date: Date, days: number): Date {
    let next = addDays(date, days);
    let guard = 0;
    // Skip disabled days while stepping by a single day so keyboard users don't get stuck,
    // but never skip more than ~60 days to avoid an infinite loop against fully-disabled ranges.
    while (options.isDateDisabled?.(next) && guard < 60) {
      next = addDays(next, days < 0 ? -1 : 1);
      guard += 1;
    }
    return next;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, date: Date) {
    const isRtl = options.dir === 'rtl';
    const weekStartsOn = options.weekStartsOn;

    switch (event.key) {
      case 'ArrowRight': {
        event.preventDefault();
        moveFocusTo(step(date, isRtl ? -1 : 1));
        break;
      }
      case 'ArrowLeft': {
        event.preventDefault();
        moveFocusTo(step(date, isRtl ? 1 : -1));
        break;
      }
      case 'ArrowDown': {
        event.preventDefault();
        moveFocusTo(step(date, 7));
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        moveFocusTo(step(date, -7));
        break;
      }
      case 'Home': {
        event.preventDefault();
        moveFocusTo(startOfJalaliWeek(date, weekStartsOn));
        break;
      }
      case 'End': {
        event.preventDefault();
        moveFocusTo(endOfJalaliWeek(date, weekStartsOn));
        break;
      }
      case 'PageUp': {
        event.preventDefault();
        moveFocusTo(toGregorian(addJalaliMonths(toJalali(date), event.shiftKey ? -12 : -1)));
        break;
      }
      case 'PageDown': {
        event.preventDefault();
        moveFocusTo(toGregorian(addJalaliMonths(toJalali(date), event.shiftKey ? 12 : 1)));
        break;
      }
      case 'Enter':
      case ' ': {
        event.preventDefault();
        options.onSelect(date);
        break;
      }
      default:
        break;
    }
  }

  useEffect(() => {
    if (options.initialDate && !isSameDay(options.initialDate, focusedDate)) {
      setFocusedDate(options.initialDate);
    }
    // Only re-sync when the caller explicitly hands us a new initial date (e.g. after selection).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.initialDate?.getTime()]);

  /** Keep the roving tab stop in sync when a cell receives focus by mouse/touch, not keyboard. */
  function syncFocusedDate(date: Date) {
    if (!isSameDay(date, focusedDate)) {
      setFocusedDate(date);
    }
  }

  return { focusedDate, handleKeyDown, registerDayRef, moveFocusTo, syncFocusedDate };
}
