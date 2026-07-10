import type { AvanDateConstraints } from '../types';

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isBeforeDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

export function isAfterDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() > startOfDay(b).getTime();
}

export function isSameCalendarDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

export function isWithinDay(date: Date, from: Date, to: Date): boolean {
  const [start, end] = isBeforeDay(from, to) ? [from, to] : [to, from];
  return !isBeforeDay(date, start) && !isAfterDay(date, end);
}

/** Merge every constraint source (min/max date, explicit dates, weekdays, ranges, predicate) into one check. */
export function createDisabledResolver(constraints: AvanDateConstraints): (date: Date) => boolean {
  const { minDate, maxDate, isDateDisabled, disabledDates, disabledWeekdays, disabledRanges } =
    constraints;

  return (date: Date): boolean => {
    if (minDate && isBeforeDay(date, minDate)) return true;
    if (maxDate && isAfterDay(date, maxDate)) return true;
    if (disabledWeekdays?.includes(date.getDay())) return true;
    if (disabledDates?.some((disabled) => isSameCalendarDay(disabled, date))) return true;
    if (
      disabledRanges?.some(
        (range) => range.from && range.to && isWithinDay(date, range.from, range.to),
      )
    ) {
      return true;
    }
    if (isDateDisabled?.(date)) return true;
    return false;
  };
}
