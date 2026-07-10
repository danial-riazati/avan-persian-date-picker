import { describe, it, expect } from 'vitest';
import { getIranHolidays } from '../src/index';

describe('@avan-persian/holidays', () => {
  it('returns all 26 official holidays for 1404', () => {
    const holidays = getIranHolidays(1404);
    expect(holidays).toHaveLength(26);
    expect(holidays[0]?.date).toBe('1404-01-01');
    expect(holidays.some((holiday) => holiday.date === '1404-04-15')).toBe(true);
  });

  it('returns all 26 official holidays for 1405', () => {
    const holidays = getIranHolidays(1405);
    expect(holidays).toHaveLength(26);
    expect(holidays[0]?.date).toBe('1405-01-01');
    expect(holidays.some((holiday) => holiday.date === '1405-04-04')).toBe(true);
  });

  it('returns all 27 official holidays for 1406', () => {
    const holidays = getIranHolidays(1406);
    expect(holidays).toHaveLength(27);
    expect(holidays.some((holiday) => holiday.date === '1406-12-08')).toBe(true);
  });

  it('falls back to fixed solar holidays for unknown years', () => {
    const holidays = getIranHolidays(1400);
    expect(holidays.length).toBeGreaterThanOrEqual(10);
    expect(holidays.some((holiday) => holiday.date === '1400-01-01')).toBe(true);
  });
});
