import { useEffect, useMemo, useState } from 'react';
import { isSameDay } from 'date-fns-jalali';
import {
  addJalaliMonths,
  getMonthGrid,
  toJalali,
  type CalendarDay,
  type JalaliDate,
} from '@avan/core';
import type { DateRangeValue } from '../types';

export interface CalendarMonthPanel {
  month: JalaliDate;
  weeks: CalendarDay[][];
}

export interface UseAvanCalendarOptions {
  visibleMonth?: JalaliDate;
  numberOfMonths?: 1 | 2;
  today?: Date;
  isDateDisabled?: (date: Date) => boolean;
  mode?: 'single' | 'range';
  value?: Date | null;
  rangeValue?: DateRangeValue;
  onValueChange?: (value: Date | null) => void;
  onRangeChange?: (value: DateRangeValue) => void;
  onVisibleMonthChange?: (month: JalaliDate) => void;
}

export function useAvanCalendar(options: UseAvanCalendarOptions = {}) {
  const today = options.today ?? new Date();
  const initialMonth = options.visibleMonth ?? toJalali(today);
  const [visibleMonth, setVisibleMonthState] = useState<JalaliDate>(initialMonth);

  useEffect(() => {
    if (options.visibleMonth) {
      setVisibleMonthState(options.visibleMonth);
    }
  }, [options.visibleMonth?.year, options.visibleMonth?.month]);

  function setVisibleMonth(next: JalaliDate) {
    setVisibleMonthState(next);
    options.onVisibleMonthChange?.(next);
  }

  const numberOfMonths = options.numberOfMonths ?? 1;

  const monthPanels = useMemo((): CalendarMonthPanel[] => {
    const panels: CalendarMonthPanel[] = [];

    for (let index = 0; index < numberOfMonths; index += 1) {
      const month = addJalaliMonths(visibleMonth, index);

      panels.push({
        month,
        weeks: getMonthGrid(month.year, month.month, {
          today,
          isDateDisabled: options.isDateDisabled,
        }),
      });
    }

    return panels;
  }, [
    visibleMonth.year,
    visibleMonth.month,
    numberOfMonths,
    today,
    options.isDateDisabled,
  ]);

  function goToPreviousMonth() {
    setVisibleMonth(addJalaliMonths(visibleMonth, -1));
  }

  function goToNextMonth() {
    setVisibleMonth(addJalaliMonths(visibleMonth, 1));
  }

  function setMonth(month: number) {
    setVisibleMonth({ ...visibleMonth, month });
  }

  function setYear(year: number) {
    setVisibleMonth({ ...visibleMonth, year });
  }

  function setPanelMonth(panelIndex: number, month: number) {
    const panelMonth = addJalaliMonths(visibleMonth, panelIndex);
    setVisibleMonth(addJalaliMonths({ ...panelMonth, month }, -panelIndex));
  }

  function setPanelYear(panelIndex: number, year: number) {
    const panelMonth = addJalaliMonths(visibleMonth, panelIndex);
    setVisibleMonth(addJalaliMonths({ ...panelMonth, year }, -panelIndex));
  }

  function selectDate(date: Date) {
    if (options.mode === 'range') {
      const current = options.rangeValue ?? { from: null, to: null };

      if (!current.from || (current.from && current.to)) {
        options.onRangeChange?.({ from: date, to: null });
        return;
      }

      if (isSameDay(date, current.from)) {
        options.onRangeChange?.({ from: date, to: date });
        return;
      }

      if (date < current.from) {
        options.onRangeChange?.({ from: date, to: current.from });
        return;
      }

      options.onRangeChange?.({ from: current.from, to: date });
      return;
    }

    options.onValueChange?.(date);
  }

  function isSelected(day: CalendarDay): boolean {
    if (options.mode === 'range') {
      const { from, to } = options.rangeValue ?? { from: null, to: null };
      if (!from) {
        return false;
      }

      if (!to) {
        return isSameDay(day.date.gregorian, from);
      }

      const time = day.date.gregorian.getTime();
      return time >= from.getTime() && time <= to.getTime();
    }

    return options.value ? isSameDay(day.date.gregorian, options.value) : false;
  }

  function isRangeStart(day: CalendarDay): boolean {
    const from = options.rangeValue?.from;
    return from ? isSameDay(day.date.gregorian, from) : false;
  }

  function isRangeEnd(day: CalendarDay): boolean {
    const to = options.rangeValue?.to;
    return to ? isSameDay(day.date.gregorian, to) : false;
  }

  return {
    visibleMonth,
    setVisibleMonth,
    numberOfMonths,
    monthPanels,
    goToPreviousMonth,
    goToNextMonth,
    setMonth,
    setYear,
    setPanelMonth,
    setPanelYear,
    selectDate,
    isSelected,
    isRangeStart,
    isRangeEnd,
  };
}
