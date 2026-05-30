import type { CalendarDay } from './index';

export interface MonthGridOptions {
  /** Highlight today */
  today?: Date;
  /** Disable specific dates */
  isDateDisabled?: (date: Date) => boolean;
}

/**
 * Build a 6-week calendar grid for a Jalali month.
 * Phase 1 implementation target.
 */
export function getMonthGrid(
  _year: number,
  _month: number,
  _options: MonthGridOptions = {},
): CalendarDay[][] {
  throw new Error('@avan/core: getMonthGrid not implemented yet — see docs/PHASES.md Phase 1');
}
