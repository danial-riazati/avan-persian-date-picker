import { addDays, getDay } from 'date-fns-jalali';
import type { JalaliDate } from './index';
import { formatJalaliISO } from './convert';
import { daysInJalaliMonth, isJalaliLeapYear } from './grid';

/** JS `Date#getDay()` index for Friday — Iran's single weekly day off. */
export const IRAN_WEEKEND_DAYS: readonly number[] = [5];

/** JS `Date#getDay()` indices for Thu+Fri — common Gulf/regional weekend, some Iranian orgs. */
export const THU_FRI_WEEKEND_DAYS: readonly number[] = [4, 5];

export interface BusinessDayOptions {
  /** JS `Date#getDay()` indices (0=Sun..6=Sat) treated as non-working days. Default: Friday only. */
  weekendDays?: readonly number[];
  /** ISO (`YYYY-MM-DD`, Jalali) holiday dates treated as non-working days. */
  holidayDates?: readonly string[];
}

/** Is this date a working day given weekend/holiday rules? Defaults to Iran's Friday weekend. */
export function isBusinessDay(date: Date, options: BusinessDayOptions = {}): boolean {
  const weekendDays = options.weekendDays ?? IRAN_WEEKEND_DAYS;

  if (weekendDays.includes(getDay(date))) {
    return false;
  }

  if (options.holidayDates?.length) {
    const iso = formatJalaliISO(date);
    if (options.holidayDates.includes(iso)) {
      return false;
    }
  }

  return true;
}

/** Add `amount` business days to `date`, skipping weekends/holidays. `amount` may be negative. */
export function addBusinessDays(
  date: Date,
  amount: number,
  options: BusinessDayOptions = {},
): Date {
  const step = amount < 0 ? -1 : 1;
  let remaining = Math.abs(amount);
  let cursor = date;

  while (remaining > 0) {
    cursor = addDays(cursor, step);
    if (isBusinessDay(cursor, options)) {
      remaining -= 1;
    }
  }

  return cursor;
}

/** Count business days between two dates (inclusive of `from`, exclusive of `to`). */
export function countBusinessDays(from: Date, to: Date, options: BusinessDayOptions = {}): number {
  const direction = to.getTime() >= from.getTime() ? 1 : -1;
  let cursor = from;
  let count = 0;

  while (direction === 1 ? cursor.getTime() < to.getTime() : cursor.getTime() > to.getTime()) {
    if (isBusinessDay(cursor, options)) {
      count += 1;
    }
    cursor = addDays(cursor, direction);
  }

  return count;
}

/** Iran's fiscal year is calendar-aligned: 1 Farvardin – 29/30 Esfand of the same Jalali year. */
export function getFiscalYearBounds(year: number): { start: JalaliDate; end: JalaliDate } {
  return {
    start: { year, month: 1, day: 1 },
    end: { year, month: 12, day: daysInJalaliMonth(year, 12) },
  };
}

/** Fiscal/calendar quarter (1–4) for a Jalali month. Q1 Farvardin–Khordad … Q4 Dey–Esfand. */
export function getJalaliQuarter(month: number): 1 | 2 | 3 | 4 {
  return (Math.floor((month - 1) / 3) + 1) as 1 | 2 | 3 | 4;
}

/** Total days in a Jalali year (365, or 366 in a leap year). */
export function daysInJalaliYear(year: number): number {
  return isJalaliLeapYear(year) ? 366 : 365;
}

/** Compare two Jalali calendar dates. Returns -1, 0, or 1 (like `Array#sort` comparators). */
export function compareJalali(a: JalaliDate, b: JalaliDate): -1 | 0 | 1 {
  if (a.year !== b.year) return a.year < b.year ? -1 : 1;
  if (a.month !== b.month) return a.month < b.month ? -1 : 1;
  if (a.day !== b.day) return a.day < b.day ? -1 : 1;
  return 0;
}

/** All calendar days between `from` and `to` (inclusive), regardless of order. */
export function getDaysInRange(from: Date, to: Date): Date[] {
  const [start, end] = from.getTime() <= to.getTime() ? [from, to] : [to, from];
  const days: Date[] = [];
  let cursor = start;

  while (cursor.getTime() <= end.getTime()) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }

  return days;
}
