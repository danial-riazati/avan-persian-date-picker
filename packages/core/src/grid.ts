import { addDays, getDay, isSameDay } from 'date-fns-jalali';
import type { CalendarDay, JalaliDate } from './index';
import { createAvanDate, toGregorian } from './convert';

export interface MonthGridOptions {
  /** Highlight today */
  today?: Date;
  /** Disable specific dates */
  isDateDisabled?: (date: Date) => boolean;
}

const GRID_WEEKS = 6;
const DAYS_PER_WEEK = 7;

/** Iran week starts on Saturday. Returns 0 for Saturday … 6 for Friday. */
function getIranWeekdayIndex(date: Date): number {
  return (getDay(date) + 1) % 7;
}

export function getMonthGrid(
  year: number,
  month: number,
  options: MonthGridOptions = {},
): CalendarDay[][] {
  const today = options.today ? atLocalNoon(options.today) : atLocalNoon(new Date());
  const firstOfMonth = toGregorian({ year, month, day: 1 });
  const gridStart = addDays(firstOfMonth, -getIranWeekdayIndex(firstOfMonth));
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
        isWeekend: getDay(gregorian) === 5,
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
