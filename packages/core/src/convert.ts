import type { JalaliDate, AvanDate } from './index';

/**
 * Convert Gregorian Date → Jalali parts.
 * Phase 1: implement with date-fns-jalali getYear/getMonth/getDate.
 */
export function toJalali(_date: Date): JalaliDate {
  throw new Error('@avan/core: toJalali not implemented yet — see docs/PHASES.md Phase 1');
}

/**
 * Convert Jalali parts → Gregorian Date (local noon policy TBD in ADR).
 */
export function toGregorian(_jalali: JalaliDate): Date {
  throw new Error('@avan/core: toGregorian not implemented yet — see docs/PHASES.md Phase 1');
}

export function formatJalali(_date: Date, _pattern = 'yyyy/MM/dd'): string {
  throw new Error('@avan/core: formatJalali not implemented yet — see docs/PHASES.md Phase 1');
}

export function parseJalali(_input: string): AvanDate {
  throw new Error('@avan/core: parseJalali not implemented yet — see docs/PHASES.md Phase 1');
}
