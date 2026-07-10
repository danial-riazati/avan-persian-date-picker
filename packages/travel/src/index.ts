import { addDays } from 'date-fns-jalali';
import { formatJalaliISO, getMonthGrid, isBusinessDay } from '@avan-persian/core';

export interface PriceInfo {
  amount: number;
  currency: string;
  /** Pre-formatted label shown under day number, e.g. "۲.۵M" */
  label?: string;
}

export type DayAvailability = 'available' | 'limited' | 'full' | 'unavailable';

export interface DayPriceInfo extends PriceInfo {
  availability?: DayAvailability;
  /** Remaining inventory (rooms, seats, slots…) for capacity-aware UIs. */
  remaining?: number;
}

export type GetPriceForDate = (date: Date) => DayPriceInfo | undefined;

export interface TravelRules {
  minNights?: number;
  maxNights?: number;
  disabledDates?: (date: Date) => boolean;
  /** JS `Date#getDay()` indices (0=Sun..6=Sat) allowed as a check-in day. */
  allowedCheckInWeekdays?: number[];
  /** Require every night in the range to be a business day (see `@avan-persian/core#isBusinessDay`). */
  businessDaysOnly?: boolean;
}

export interface RangePriceSummary {
  from: Date;
  to: Date;
  nights: number;
  totalPrice: number;
  currency: string;
  jalaliFrom: string;
  jalaliTo: string;
  /** Per-night breakdown, in order from `from` (inclusive) to `to` (exclusive). */
  nightly: { date: Date; price: DayPriceInfo }[];
}

export class TravelRangeError extends Error {
  constructor(message: string) {
    super(`@avan-persian/travel: ${message}`);
    this.name = 'TravelRangeError';
  }
}

function assertValidRange(from: Date, to: Date): void {
  if (to.getTime() <= from.getTime()) {
    throw new TravelRangeError('"to" must be after "from"');
  }
}

function nightsBetween(from: Date, to: Date): Date[] {
  const nights: Date[] = [];
  let cursor = from;
  while (cursor.getTime() < to.getTime()) {
    nights.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return nights;
}

/** Validate a candidate check-in/check-out range against booking rules. Throws on violation. */
export function validateTravelRange(
  from: Date,
  to: Date,
  rules: TravelRules = {},
  getPriceForDate?: GetPriceForDate,
): void {
  assertValidRange(from, to);
  const nights = nightsBetween(from, to);

  if (rules.minNights && nights.length < rules.minNights) {
    throw new TravelRangeError(`minimum stay is ${rules.minNights} night(s), got ${nights.length}`);
  }

  if (rules.maxNights && nights.length > rules.maxNights) {
    throw new TravelRangeError(`maximum stay is ${rules.maxNights} night(s), got ${nights.length}`);
  }

  if (rules.allowedCheckInWeekdays && !rules.allowedCheckInWeekdays.includes(from.getDay())) {
    throw new TravelRangeError('check-in weekday is not allowed');
  }

  for (const night of nights) {
    if (rules.disabledDates?.(night)) {
      throw new TravelRangeError(`night ${formatJalaliISO(night)} is disabled`);
    }

    if (rules.businessDaysOnly && !isBusinessDay(night)) {
      throw new TravelRangeError(`night ${formatJalaliISO(night)} is not a business day`);
    }

    const price = getPriceForDate?.(night);
    if (price && (price.availability === 'full' || price.availability === 'unavailable')) {
      throw new TravelRangeError(`night ${formatJalaliISO(night)} is not available`);
    }
  }
}

/** Like `validateTravelRange`, but returns a boolean instead of throwing. */
export function isRangeAvailable(
  from: Date,
  to: Date,
  rules: TravelRules = {},
  getPriceForDate?: GetPriceForDate,
): boolean {
  try {
    validateTravelRange(from, to, rules, getPriceForDate);
    return true;
  } catch {
    return false;
  }
}

/** Sum nightly prices for a check-in/check-out range, validating booking rules first. */
export function computeRangePrice(
  from: Date,
  to: Date,
  getPriceForDate: GetPriceForDate,
  rules: TravelRules = {},
): RangePriceSummary {
  validateTravelRange(from, to, rules, getPriceForDate);

  const nights = nightsBetween(from, to);
  const nightly = nights.map((date) => {
    const price = getPriceForDate(date) ?? { amount: 0, currency: 'IRR' };
    return { date, price };
  });

  const currency = nightly.find((n) => n.price.currency)?.price.currency ?? 'IRR';
  const totalPrice = nightly.reduce((sum, n) => sum + n.price.amount, 0);

  return {
    from,
    to,
    nights: nights.length,
    totalPrice,
    currency,
    jalaliFrom: formatJalaliISO(from),
    jalaliTo: formatJalaliISO(to),
    nightly,
  };
}

/** Find the cheapest available day in a Jalali month — powers "lowest price" badges/sorting. */
export function findLowestPriceInMonth(
  year: number,
  month: number,
  getPriceForDate: GetPriceForDate,
): { date: Date; price: DayPriceInfo } | undefined {
  const weeks = getMonthGrid(year, month);
  let lowest: { date: Date; price: DayPriceInfo } | undefined;

  for (const week of weeks) {
    for (const day of week) {
      if (!day.isCurrentMonth) continue;
      const price = getPriceForDate(day.date.gregorian);
      if (!price || price.availability === 'full' || price.availability === 'unavailable') continue;
      if (!lowest || price.amount < lowest.price.amount) {
        lowest = { date: day.date.gregorian, price };
      }
    }
  }

  return lowest;
}

/**
 * Bridges a pricing source into the shape `@avan-persian/react`'s `AvanCalendar#getDayMeta` expects,
 * without adding a hard dependency on React. Returns plain objects with `badge`/`price`/
 * `availability`/`tooltip`/`disabled` fields.
 */
export function createPriceDayMeta(getPriceForDate: GetPriceForDate) {
  return (date: Date) => {
    const price = getPriceForDate(date);
    if (!price) return undefined;

    return {
      price: { amount: price.amount, currency: price.currency, label: price.label },
      availability: price.availability,
      disabled: price.availability === 'full' || price.availability === 'unavailable',
      tooltip: price.remaining !== undefined ? `${price.remaining} remaining` : undefined,
    };
  };
}
