export interface PriceInfo {
  amount: number;
  currency: string;
  /** Pre-formatted label shown under day number, e.g. "۲.۵M" */
  label?: string;
}

export interface TravelRules {
  minNights?: number;
  maxNights?: number;
  disabledDates?: (date: Date) => boolean;
  allowedCheckInWeekdays?: number[];
}

export interface RangePriceSummary {
  from: Date;
  to: Date;
  nights: number;
  totalPrice: number;
  currency: string;
  jalaliFrom: string;
  jalaliTo: string;
}

/** Phase 5 */
export function computeRangePrice(): RangePriceSummary {
  throw new Error('@avan/travel: not implemented yet — see docs/PHASES.md Phase 5');
}
