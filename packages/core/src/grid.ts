import { addDays, getDay, isSameDay } from 'date-fns-jalali';
import type { CalendarDay, JalaliDate } from './index';
import { createAvanDate, toGregorian } from './convert';

export interface MonthGridOptions {
  /** Highlight today */
  today?: Date;
  /** Disable specific dates */
  isDateDisabled?: (date: Date) => boolean;
  /**
   * JS `Date#getDay()` index (0=Sun..6=Sat) that starts the week. Default: 6 (Saturday, Iran).
   * Pass 1 for a Monday-first (ISO-like) week, 0 for Sunday-first, etc.
   */
  weekStartsOn?: number;
  /** JS `Date#getDay()` indices treated as the weekend. Default: `[5]` (Friday, Iran). */
  weekendDays?: readonly number[];
}

const GRID_WEEKS = 6;
const DAYS_PER_WEEK = 7;
const DEFAULT_WEEK_STARTS_ON = 6; // Saturday
const DEFAULT_WEEKEND_DAYS: readonly number[] = [5]; // Friday

/** Iran week starts on Saturday by default. Returns 0 for the configured first day of week. */
export function getWeekdayIndex(date: Date, weekStartsOn = DEFAULT_WEEK_STARTS_ON): number {
  return (getDay(date) - weekStartsOn + 7) % 7;
}

/** Start (00:00-normalized to noon) of the calendar week containing `date`. */
export function startOfJalaliWeek(date: Date, weekStartsOn = DEFAULT_WEEK_STARTS_ON): Date {
  return addDays(atLocalNoon(date), -getWeekdayIndex(date, weekStartsOn));
}

/** End of the calendar week containing `date`. */
export function endOfJalaliWeek(date: Date, weekStartsOn = DEFAULT_WEEK_STARTS_ON): Date {
  return addDays(startOfJalaliWeek(date, weekStartsOn), DAYS_PER_WEEK - 1);
}

export function getMonthGrid(
  year: number,
  month: number,
  options: MonthGridOptions = {},
): CalendarDay[][] {
  const today = options.today ? atLocalNoon(options.today) : atLocalNoon(new Date());
  const weekStartsOn = options.weekStartsOn ?? DEFAULT_WEEK_STARTS_ON;
  const weekendDays = options.weekendDays ?? DEFAULT_WEEKEND_DAYS;
  const firstOfMonth = toGregorian({ year, month, day: 1 });
  const gridStart = addDays(firstOfMonth, -getWeekdayIndex(firstOfMonth, weekStartsOn));
  const weeks: CalendarDay[][] = [];

  for (let week = 0; week < GRID_WEEKS; week += 1) {
    const days: CalendarDay[] = [];

    for (let weekday = 0; weekday < DAYS_PER_WEEK; weekday += 1) {
      const offset = week * DAYS_PER_WEEK + weekday;
      const gregorian = addDays(gridStart, offset);
      const avanDate = createAvanDate(gregorian);

      days.push({
        date: avanDate,
        isCurrentMonth: avanDate.jalali.year === year && avanDate.jalali.month === month,
        isToday: isSameDay(gregorian, today),
        isWeekend: weekendDays.includes(getDay(gregorian)),
        isDisabled: options.isDateDisabled?.(gregorian) ?? false,
      });
    }

    weeks.push(days);
  }

  return weeks;
}

export function addJalaliMonths(jalali: JalaliDate, amount: number): JalaliDate {
  let monthIndex = jalali.month - 1 + amount;
  let year = jalali.year;

  while (monthIndex < 0) {
    monthIndex += 12;
    year -= 1;
  }

  while (monthIndex > 11) {
    monthIndex -= 12;
    year += 1;
  }

  const day = Math.min(jalali.day, daysInJalaliMonth(year, monthIndex + 1));
  return { year, month: monthIndex + 1, day };
}

export function daysInJalaliMonth(year: number, month: number): number {
  if (month <= 6) {
    return 31;
  }

  if (month <= 11) {
    return 30;
  }

  return isJalaliLeapYear(year) ? 30 : 29;
}

export function isJalaliLeapYear(year: number): boolean {
  const mod = ((year + 38) * 31) % 128;
  return mod < 31;
}

function atLocalNoon(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
}
