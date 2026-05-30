import { formatJalaliISO } from '@avan/core';
import fixedSolar from '../data/fixed-solar.json';
import holidays1404 from '../data/1404.json';
import holidays1405 from '../data/1405.json';
import holidays1406 from '../data/1406.json';

export interface AvanHoliday {
  /** Jalali ISO date YYYY-MM-DD */
  date: string;
  title: string;
  titleEn?: string;
  type: 'public' | 'religious' | 'cultural';
  tentative?: boolean;
}

interface FixedSolarHoliday {
  month: number;
  day: number;
  title: string;
  titleEn?: string;
  type: AvanHoliday['type'];
  tentative?: boolean;
}

const YEARLY_HOLIDAYS: Record<number, AvanHoliday[]> = {
  1404: holidays1404 as AvanHoliday[],
  1405: holidays1405 as AvanHoliday[],
  1406: holidays1406 as AvanHoliday[],
};

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function toIsoDate(year: number, month: number, day: number): string {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

function mergeHolidayEntries(entries: AvanHoliday[]): AvanHoliday[] {
  const byDate = new Map<string, AvanHoliday>();

  for (const entry of entries) {
    const existing = byDate.get(entry.date);

    if (!existing) {
      byDate.set(entry.date, { ...entry });
      continue;
    }

    byDate.set(entry.date, {
      ...existing,
      title: existing.title.includes(entry.title)
        ? existing.title
        : `${existing.title} / ${entry.title}`,
      titleEn:
        existing.titleEn && entry.titleEn
          ? existing.titleEn.includes(entry.titleEn)
            ? existing.titleEn
            : `${existing.titleEn} / ${entry.titleEn}`
          : (existing.titleEn ?? entry.titleEn),
      type: existing.type === 'public' || entry.type === 'public' ? 'public' : existing.type,
      tentative: existing.tentative || entry.tentative,
    });
  }

  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

function getFixedSolarHolidays(jalaliYear: number): AvanHoliday[] {
  return (fixedSolar as FixedSolarHoliday[]).map((holiday) => ({
    date: toIsoDate(jalaliYear, holiday.month, holiday.day),
    title: holiday.title,
    titleEn: holiday.titleEn,
    type: holiday.type,
    tentative: holiday.tentative,
  }));
}

/**
 * Load all official Iran public holidays for a Jalali year.
 * Uses the published yearly calendar when available, otherwise fixed solar holidays.
 */
export function getIranHolidays(jalaliYear: number): AvanHoliday[] {
  const yearly = YEARLY_HOLIDAYS[jalaliYear];

  if (yearly) {
    return mergeHolidayEntries(yearly);
  }

  return mergeHolidayEntries(getFixedSolarHolidays(jalaliYear));
}

export function isHoliday(date: Date, holidays: AvanHoliday[]): boolean {
  const iso = formatJalaliISO(date);
  return holidays.some((holiday) => holiday.date === iso);
}

export function getHolidayForDate(date: Date, holidays: AvanHoliday[]): AvanHoliday | undefined {
  const iso = formatJalaliISO(date);
  return holidays.find((holiday) => holiday.date === iso);
}

/** All fixed solar holidays that repeat on the same Jalali month/day every year. */
export function getFixedSolarIranHolidays(jalaliYear: number): AvanHoliday[] {
  return getFixedSolarHolidays(jalaliYear);
}
