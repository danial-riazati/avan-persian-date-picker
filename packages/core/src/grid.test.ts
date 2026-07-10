import { describe, it, expect } from 'vitest';
import {
  getMonthGrid,
  getWeekdayIndex,
  startOfJalaliWeek,
  endOfJalaliWeek,
  addJalaliMonths,
} from './grid';
import { toGregorian } from './convert';

describe('@avan/core grid', () => {
  it('defaults to a Saturday-first week (Iran)', () => {
    const saturday = toGregorian({ year: 1405, month: 1, day: 1 });
    expect(getWeekdayIndex(saturday)).toBe(0);
    const friday = toGregorian({ year: 1405, month: 1, day: 7 });
    expect(getWeekdayIndex(friday)).toBe(6);
  });

  it('supports a Monday-first week when configured', () => {
    const saturday = toGregorian({ year: 1405, month: 1, day: 1 });
    // Monday-first week: Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6.
    expect(getWeekdayIndex(saturday, 1)).toBe(5);
  });

  it('marks Friday as the weekend by default in the month grid', () => {
    const weeks = getMonthGrid(1405, 1);
    const friday = weeks.flat().find((day) => day.date.jalali.day === 7);
    expect(friday?.isWeekend).toBe(true);
  });

  it('supports custom weekend days in the month grid', () => {
    const weeks = getMonthGrid(1405, 1, { weekendDays: [4, 5] });
    const thursday = weeks.flat().find((day) => day.date.jalali.day === 6);
    expect(thursday?.isWeekend).toBe(true);
  });

  it('computes start/end of week', () => {
    const wednesday = toGregorian({ year: 1405, month: 1, day: 5 });
    const start = startOfJalaliWeek(wednesday);
    const end = endOfJalaliWeek(wednesday);
    expect(start.getTime()).toBe(toGregorian({ year: 1405, month: 1, day: 1 }).getTime());
    expect(end.getTime()).toBe(toGregorian({ year: 1405, month: 1, day: 7 }).getTime());
  });

  it('clamps day-of-month when adding months across shorter months', () => {
    const esfand31 = { year: 1404, month: 12, day: 29 };
    const next = addJalaliMonths(esfand31, 1);
    expect(next).toEqual({ year: 1405, month: 1, day: 29 });
  });

  it('handles year rollover in both directions', () => {
    expect(addJalaliMonths({ year: 1404, month: 11, day: 15 }, 3)).toEqual({
      year: 1405,
      month: 2,
      day: 15,
    });
    expect(addJalaliMonths({ year: 1405, month: 1, day: 15 }, -2)).toEqual({
      year: 1404,
      month: 11,
      day: 15,
    });
  });
});
