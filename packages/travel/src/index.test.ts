import { describe, expect, it } from 'vitest';
import { toGregorian, toJalali } from '@avan-persian/core';
import {
  computeRangePrice,
  createPriceDayMeta,
  findLowestPriceInMonth,
  isRangeAvailable,
  TravelRangeError,
  validateTravelRange,
  type GetPriceForDate,
} from './index';

const checkIn = toGregorian({ year: 1405, month: 1, day: 1 });
const checkOut = toGregorian({ year: 1405, month: 1, day: 4 });

const pricing: GetPriceForDate = (date) => {
  const day = toJalali(date).day;
  if (day === 3) return { amount: 500_000, currency: 'IRR', availability: 'full' };
  return { amount: 200_000 + day * 10_000, currency: 'IRR', availability: 'available' };
};

describe('@avan-persian/travel', () => {
  it('computes total price across nights (checkout night excluded)', () => {
    const cheap: GetPriceForDate = () => ({ amount: 100_000, currency: 'IRR' });
    const summary = computeRangePrice(checkIn, checkOut, cheap);
    expect(summary.nights).toBe(3);
    expect(summary.totalPrice).toBe(300_000);
    expect(summary.currency).toBe('IRR');
    expect(summary.nightly).toHaveLength(3);
  });

  it('rejects a range shorter than minNights', () => {
    const cheap: GetPriceForDate = () => ({ amount: 100_000, currency: 'IRR' });
    expect(() => computeRangePrice(checkIn, checkOut, cheap, { minNights: 5 })).toThrow(
      TravelRangeError,
    );
  });

  it('rejects a range covering an unavailable night', () => {
    expect(() => validateTravelRange(checkIn, checkOut, {}, pricing)).toThrow(TravelRangeError);
    expect(isRangeAvailable(checkIn, checkOut, {}, pricing)).toBe(false);
  });

  it('accepts a range with no unavailable nights', () => {
    const shortStay = toGregorian({ year: 1405, month: 1, day: 2 });
    expect(isRangeAvailable(checkIn, shortStay, {}, pricing)).toBe(true);
  });

  it('enforces allowed check-in weekdays', () => {
    const cheap: GetPriceForDate = () => ({ amount: 100_000, currency: 'IRR' });
    const wrongWeekday = checkIn.getDay() === 0 ? 1 : 0;
    expect(() =>
      validateTravelRange(checkIn, checkOut, { allowedCheckInWeekdays: [wrongWeekday] }, cheap),
    ).toThrow(TravelRangeError);
  });

  it('finds the lowest available price in a month', () => {
    const result = findLowestPriceInMonth(1405, 1, pricing);
    expect(result).toBeDefined();
    expect(result?.price.availability).toBe('available');
  });

  it('bridges pricing data into day-meta-shaped objects', () => {
    const getDayMeta = createPriceDayMeta(pricing);
    const meta = getDayMeta(toGregorian({ year: 1405, month: 1, day: 3 }));
    expect(meta?.disabled).toBe(true);
    expect(meta?.availability).toBe('full');

    const available = getDayMeta(toGregorian({ year: 1405, month: 1, day: 5 }));
    expect(available?.disabled).toBe(false);
  });
});
