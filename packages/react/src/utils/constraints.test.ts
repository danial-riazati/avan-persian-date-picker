import { describe, expect, it } from 'vitest';
import { createDisabledResolver, isSameCalendarDay, isWithinDay } from './constraints';

describe('createDisabledResolver', () => {
  it('disables dates before minDate and after maxDate', () => {
    const resolver = createDisabledResolver({
      minDate: new Date(2026, 0, 10),
      maxDate: new Date(2026, 0, 20),
    });

    expect(resolver(new Date(2026, 0, 5))).toBe(true);
    expect(resolver(new Date(2026, 0, 15))).toBe(false);
    expect(resolver(new Date(2026, 0, 25))).toBe(true);
  });

  it('disables specific dates', () => {
    const resolver = createDisabledResolver({ disabledDates: [new Date(2026, 0, 15)] });
    expect(resolver(new Date(2026, 0, 15, 8))).toBe(true);
    expect(resolver(new Date(2026, 0, 16))).toBe(false);
  });

  it('disables specific weekdays', () => {
    const resolver = createDisabledResolver({ disabledWeekdays: [0, 6] });
    const sunday = new Date(2026, 0, 4); // a Sunday
    expect(resolver(sunday)).toBe(true);
  });

  it('disables dates within disabledRanges', () => {
    const resolver = createDisabledResolver({
      disabledRanges: [{ from: new Date(2026, 0, 10), to: new Date(2026, 0, 15) }],
    });
    expect(resolver(new Date(2026, 0, 12))).toBe(true);
    expect(resolver(new Date(2026, 0, 20))).toBe(false);
  });

  it('combines with a custom predicate', () => {
    const resolver = createDisabledResolver({ isDateDisabled: (date) => date.getDate() === 1 });
    expect(resolver(new Date(2026, 0, 1))).toBe(true);
    expect(resolver(new Date(2026, 0, 2))).toBe(false);
  });
});

describe('isSameCalendarDay / isWithinDay', () => {
  it('ignores time-of-day when comparing days', () => {
    expect(isSameCalendarDay(new Date(2026, 0, 1, 1), new Date(2026, 0, 1, 23))).toBe(true);
  });

  it('checks inclusive membership regardless of from/to order', () => {
    const a = new Date(2026, 0, 5);
    const b = new Date(2026, 0, 1);
    expect(isWithinDay(new Date(2026, 0, 3), a, b)).toBe(true);
    expect(isWithinDay(new Date(2026, 0, 10), a, b)).toBe(false);
  });
});
