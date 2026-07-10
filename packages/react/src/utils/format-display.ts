import { formatJalali, toPersianDigits } from '@avan/core';
import type { AvanLocaleDefinition } from '../locale';

export function shouldUsePersianDigits(dirOrLocale: 'rtl' | 'ltr' | AvanLocaleDefinition): boolean {
  if (typeof dirOrLocale === 'string') {
    return dirOrLocale === 'rtl';
  }

  return dirOrLocale.numerals === 'persian';
}

export function formatJalaliDisplay(
  date: Date,
  dirOrLocale: 'rtl' | 'ltr' | AvanLocaleDefinition,
  pattern = 'yyyy/MM/dd',
): string {
  const formatted = formatJalali(date, pattern);
  return shouldUsePersianDigits(dirOrLocale) ? toPersianDigits(formatted) : formatted;
}

export function formatNumberDisplay(
  value: number,
  dirOrLocale: 'rtl' | 'ltr' | AvanLocaleDefinition,
): string {
  return shouldUsePersianDigits(dirOrLocale) ? toPersianDigits(value) : String(value);
}
