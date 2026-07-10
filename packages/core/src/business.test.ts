import { describe, it, expect } from 'vitest';
import {
  addBusinessDays,
  compareJalali,
  countBusinessDays,
  daysInJalaliYear,
  getDaysInRange,
  getFiscalYearBounds,
  getJalaliQuarter,
  isBusinessDay,
} from './business';
import { toGregorian } from './convert';

describe('@avan/core business', () => {
  it('treats Friday as the only default weekend day', () => {
    // 1405/01/01 is a Saturday (Nowruz 1405 falls on Saturday).
    const saturday = toGregorian({ year: 1405, month: 1, day: 1 });
    const friday = toGregorian({ year: 1405, month: 1, day: 7 });
    expect(isBusinessDay(saturday)).toBe(true);
    expect(isBusinessDay(friday)).toBe(false);
  });

  it('honors custom weekend days and holiday dates', () => {
    const date = toGregorian({ year: 1405, month: 1, day: 2 }); // Sunday
    expect(isBusinessDay(date, { weekendDays: [0, 5] })).toBe(false);
    expect(isBusinessDay(date, { holidayDates: ['1405-01-02'] })).toBe(false);
  });

  it('adds business days skipping the weekend', () => {
    const thursday = toGregorian({ year: 1405, month: 1, day: 6 });
    // +1 business day should skip Friday (1/7) and land on Saturday (1/8).
    const next = addBusinessDays(thursday, 1);
    expect(next.getTime()).toBe(toGregorian({ year: 1405, month: 1, day: 8 }).getTime());
  });

  it('supports negative business day offsets', () => {
    const saturday = toGregorian({ year: 1405, month: 1, day: 8 });
    const prev = addBusinessDays(saturday, -1);
    expect(prev.getTime()).toBe(toGregorian({ year: 1405, month: 1, day: 6 }).getTime());
  });

  it('counts business days in a range', () => {
    const from = toGregorian({ year: 1405, month: 1, day: 1 });
    const to = toGregorian({ year: 1405, month: 1, day: 8 });
    // 1..7 inclusive-exclusive, only 1/7 (Friday) excluded => 6 business days.
    expect(countBusinessDays(from, to)).toBe(6);
  });

  it('computes fiscal year bounds aligned to the calendar year', () => {
    const bounds = getFiscalYearBounds(1404);
    expect(bounds.start).toEqual({ year: 1404, month: 1, day: 1 });
    expect(bounds.end).toEqual({ year: 1404, month: 12, day: 30 });
  });

  it('computes the correct quarter for each month', () => {
    expect(getJalaliQuarter(1)).toBe(1);
    expect(getJalaliQuarter(3)).toBe(1);
    expect(getJalaliQuarter(4)).toBe(2);
    expect(getJalaliQuarter(9)).toBe(3);
    expect(getJalaliQuarter(12)).toBe(4);
  });

  it('reports 365 or 366 days per year matching leap-year rules', () => {
    expect(daysInJalaliYear(1404)).toBe(366);
    expect(daysInJalaliYear(1403)).toBe(365);
  });

  it('compares Jalali dates', () => {
    expect(compareJalali({ year: 1405, month: 1, day: 1 }, { year: 1405, month: 1, day: 2 })).toBe(
      -1,
    );
    expect(compareJalali({ year: 1405, month: 1, day: 1 }, { year: 1405, month: 1, day: 1 })).toBe(
      0,
    );
    expect(compareJalali({ year: 1405, month: 2, day: 1 }, { year: 1405, month: 1, day: 1 })).toBe(
      1,
    );
  });

  it('enumerates all days in a range regardless of order', () => {
    const from = toGregorian({ year: 1405, month: 1, day: 1 });
    const to = toGregorian({ year: 1405, month: 1, day: 5 });
    expect(getDaysInRange(from, to)).toHaveLength(5);
    expect(getDaysInRange(to, from)).toHaveLength(5);
  });
});
