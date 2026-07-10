import { describe, it, expect } from 'vitest';
import { toJalali, toGregorian, formatJalali, parseJalali, tryParseJalali } from '../src/convert';
import { getMonthGrid } from '../src/grid';

describe('@avan/core', () => {
  it('converts Nowruz 1405 correctly', () => {
    const nowruz = new Date(2026, 2, 21, 12, 0, 0);
    expect(toJalali(nowruz)).toEqual({ year: 1405, month: 1, day: 1 });
    expect(formatJalali(nowruz)).toBe('1405/01/01');
  });

  it('round-trips Jalali → Gregorian → Jalali', () => {
    const jalali = { year: 1404, month: 12, day: 29 };
    const gregorian = toGregorian(jalali);
    expect(toJalali(gregorian)).toEqual(jalali);
  });

  it('parses Jalali strings', () => {
    const parsed = parseJalali('1405/01/01');
    expect(parsed.jalali).toEqual({ year: 1405, month: 1, day: 1 });
    expect(formatJalali(parsed.gregorian)).toBe('1405/01/01');
  });

  it('parses Persian-digit Jalali strings', () => {
    const parsed = parseJalali('۱۴۰۵/۰۱/۰۱');
    expect(parsed.jalali).toEqual({ year: 1405, month: 1, day: 1 });
  });

  it('rejects invalid Jalali dates without throwing via tryParseJalali', () => {
    expect(tryParseJalali('not-a-date')).toBeNull();
    expect(tryParseJalali('1405/13/40')).toBeNull();
    expect(tryParseJalali('1405/01/01')).not.toBeNull();
  });

  it('rejects Esfand 30 in a non-leap year', () => {
    expect(tryParseJalali('1404/12/30')).toBeNull();
  });

  it('accepts Esfand 30 in a leap year', () => {
    expect(tryParseJalali('1403/12/30')).not.toBeNull();
  });

  it('builds a 6-week month grid', () => {
    const weeks = getMonthGrid(1405, 1);
    expect(weeks).toHaveLength(6);
    expect(weeks.every((week) => week.length === 7)).toBe(true);

    const currentMonthDays = weeks.flat().filter((day) => day.isCurrentMonth);
    expect(currentMonthDays).toHaveLength(31);
  });
});
