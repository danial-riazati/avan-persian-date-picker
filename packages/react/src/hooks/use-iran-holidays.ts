import { useMemo } from 'react';
import { addJalaliMonths, type JalaliDate } from '@avan/core';
import { getIranHolidays, type AvanHoliday } from '@avan/holidays';

/** Official yearly datasets shipped with `@avan/holidays`. */
export const AVAN_BUNDLED_HOLIDAY_YEARS = [1404, 1405, 1406] as const;

function collectHolidayYears(visibleMonth: JalaliDate, numberOfMonths: number): number[] {
  const years = new Set<number>(AVAN_BUNDLED_HOLIDAY_YEARS);

  years.add(visibleMonth.year);

  for (let index = 1; index < numberOfMonths; index += 1) {
    years.add(addJalaliMonths(visibleMonth, index).year);
  }

  return [...years].sort((first, second) => first - second);
}

/**
 * Loads Iran holidays for bundled years plus the currently visible calendar year(s).
 * Pass `holidays={[]}` to disable markers.
 */
export function useIranHolidays(
  visibleMonth: JalaliDate,
  numberOfMonths: number,
  holidays?: AvanHoliday[],
): AvanHoliday[] {
  const defaultHolidays = useMemo(() => {
    const years = collectHolidayYears(visibleMonth, numberOfMonths);
    return years.flatMap((year) => getIranHolidays(year));
    // Only the year/month matter for which holiday years get loaded; narrowing the deps
    // to those (instead of the `visibleMonth` object reference) avoids needless recomputation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleMonth.year, visibleMonth.month, numberOfMonths]);

  return holidays ?? defaultHolidays;
}
