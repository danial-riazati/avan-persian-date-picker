import {
  getDate as getJalaliDate,
  getMonth as getJalaliMonth,
  getYear as getJalaliYear,
  newDate,
  format,
} from 'date-fns-jalali';
import type { JalaliDate, AvanDate } from './index';

/** Normalize to local noon to reduce DST edge cases. */
function atLocalNoon(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
}

export function toJalali(date: Date): JalaliDate {
  const normalized = atLocalNoon(date);
  return {
    year: getJalaliYear(normalized),
    month: getJalaliMonth(normalized) + 1,
    day: getJalaliDate(normalized),
  };
}

export function toGregorian(jalali: JalaliDate): Date {
  return atLocalNoon(newDate(jalali.year, jalali.month - 1, jalali.day));
}

export function formatJalali(date: Date, pattern = 'yyyy/MM/dd'): string {
  return format(atLocalNoon(date), pattern);
}

export function formatJalaliISO(date: Date): string {
  const jalali = toJalali(date);
  const month = String(jalali.month).padStart(2, '0');
  const day = String(jalali.day).padStart(2, '0');
  return `${jalali.year}-${month}-${day}`;
}

export function parseJalali(input: string): AvanDate {
  const match = /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/.exec(input.trim());
  if (!match) {
    throw new Error(`@avan/core: invalid Jalali date "${input}"`);
  }

  const jalali: JalaliDate = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };

  if (!isValidJalali(jalali)) {
    throw new Error(`@avan/core: invalid Jalali date "${input}"`);
  }

  return {
    gregorian: toGregorian(jalali),
    jalali,
  };
}

export function isValidJalali(jalali: JalaliDate): boolean {
  if (jalali.month < 1 || jalali.month > 12 || jalali.day < 1) {
    return false;
  }

  try {
    const gregorian = toGregorian(jalali);
    const roundTrip = toJalali(gregorian);
    return (
      roundTrip.year === jalali.year &&
      roundTrip.month === jalali.month &&
      roundTrip.day === jalali.day
    );
  } catch {
    return false;
  }
}

export function createAvanDate(date: Date): AvanDate {
  return {
    gregorian: atLocalNoon(date),
    jalali: toJalali(date),
  };
}
