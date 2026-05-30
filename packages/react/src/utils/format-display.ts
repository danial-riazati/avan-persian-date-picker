import { formatJalali, toPersianDigits } from '@avan/core';
import type { AvanLocale } from '../types';

export function shouldUsePersianDigits(dir: 'rtl' | 'ltr'): boolean {
  return dir === 'rtl';
}

export function formatJalaliDisplay(
  date: Date,
  dir: 'rtl' | 'ltr',
  pattern = 'yyyy/MM/dd',
): string {
  const formatted = formatJalali(date, pattern);
  return shouldUsePersianDigits(dir) ? toPersianDigits(formatted) : formatted;
}

export function formatNumberDisplay(value: number, dir: 'rtl' | 'ltr'): string {
  return shouldUsePersianDigits(dir) ? toPersianDigits(value) : String(value);
}

export function formatMonthCaption(
  monthName: string,
  year: number,
  dir: 'rtl' | 'ltr',
  _locale: AvanLocale,
): string {
  const yearLabel = shouldUsePersianDigits(dir) ? toPersianDigits(year) : String(year);
  return dir === 'rtl' ? `${monthName} ${yearLabel}` : `${monthName} ${yearLabel}`;
}
