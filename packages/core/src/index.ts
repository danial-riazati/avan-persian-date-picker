/**
 * @avan/core — Public types (Phase 1 implementation target)
 * @see README.md
 */

export interface JalaliDate {
  /** Jalali year, e.g. 1405 */
  year: number;
  /** Month 1–12 (Farvardin = 1) */
  month: number;
  /** Day 1–31 */
  day: number;
}

/** Canonical Avan date: Gregorian internally, Jalali for display */
export interface AvanDate {
  gregorian: Date;
  jalali: JalaliDate;
}

export interface CalendarDay {
  date: AvanDate;
  isCurrentMonth: boolean;
  isToday: boolean;
  /** Friday in Iran */
  isWeekend: boolean;
  isDisabled: boolean;
}

export type JalaliISO = `${number}-${string}-${string}`;

export * from './convert';
export * from './grid';
export * from './digits';
