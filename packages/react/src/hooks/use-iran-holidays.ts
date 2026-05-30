import { useMemo } from 'react';
import { addJalaliMonths, type JalaliDate } from '@avan/core';
import { getIranHolidays, type AvanHoliday } from '@avan/holidays';

/** Official yearly datasets shipped with `@avan/holidays`. */
export const AVAN_BUNDLED_HOLIDAY_YEARS = [1404, 1405, 1406] as const;

function collectHolidayYears(visibleMonth: JalaliDate, numberOfMonths: 1 | 2): number[] {
  const years = new Set<number>(AVAN_BUNDLED_HOLIDAY_YEARS);

  years.add(visibleMonth.year);

  if (numberOfMonths === 2) {
    years.add(addJalaliMonths(visibleMonth, 1).year);
  }

  return [...years].sort((first, second) => first - second);
}

/**
 * Loads Iran holidays for bundled years plus the currently visible calendar year(s).
 * Pass `holidays={[]}` to disable markers.
 */
export function useIranHolidays(
  visibleMonth: JalaliDate,
  numberOfMonths: 1 | 2,
  holidays?: AvanHoliday[],
): AvanHoliday[] {
  const defaultHolidays = useMemo(() => {
    const years = collectHolidayYears(visibleMonth, numberOfMonths);
    return years.flatMap((year) => getIranHolidays(year));
  }, [visibleMonth.year, visibleMonth.month, numberOfMonths]);

  return holidays ?? defaultHolidays;
}
