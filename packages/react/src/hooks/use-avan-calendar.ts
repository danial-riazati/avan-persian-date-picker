import { useEffect, useMemo, useState } from 'react';
import { isSameDay } from 'date-fns-jalali';
import {
  addJalaliMonths,
  endOfJalaliWeek,
  getMonthGrid,
  startOfJalaliWeek,
  toJalali,
  type CalendarDay,
  type JalaliDate,
} from '@avan/core';
import type { AvanSelectionMode, DateRangeValue } from '../types';
import { isWithinDay } from '../utils/constraints';

export interface CalendarMonthPanel {
  month: JalaliDate;
  weeks: CalendarDay[][];
}

export interface DayState {
  isSelected: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
}

export interface UseAvanCalendarOptions {
  visibleMonth?: JalaliDate;
  numberOfMonths?: 1 | 2 | 3 | 4;
  today?: Date;
  weekStartsOn?: number;
  weekendDays?: readonly number[];
  isDateDisabled?: (date: Date) => boolean;
  mode?: AvanSelectionMode;

  value?: Date | null;
  onValueChange?: (value: Date | null) => void;

  rangeValue?: DateRangeValue;
  onRangeChange?: (value: DateRangeValue) => void;

  multipleValue?: Date[];
  onMultipleChange?: (value: Date[]) => void;
  maxMultipleCount?: number;

  multiRangeValue?: DateRangeValue[];
  onMultiRangeChange?: (value: DateRangeValue[]) => void;
  maxRangeCount?: number;

  weekValue?: DateRangeValue;
  onWeekChange?: (value: DateRangeValue) => void;

  monthValue?: JalaliDate | null;
  onMonthChange?: (value: JalaliDate | null) => void;

  yearValue?: number | null;
  onYearChange?: (value: number | null) => void;

  onVisibleMonthChange?: (month: JalaliDate) => void;
}

const EMPTY_RANGE: DateRangeValue = { from: null, to: null };

function nextRangeValue(current: DateRangeValue, date: Date): DateRangeValue {
  if (!current.from || (current.from && current.to)) {
    return { from: date, to: null };
  }

  if (isSameDay(date, current.from)) {
    return { from: date, to: date };
  }

  if (date < current.from) {
    return { from: date, to: current.from };
  }

  return { from: current.from, to: date };
}

export function useAvanCalendar(options: UseAvanCalendarOptions = {}) {
  const today = options.today ?? new Date();
  const initialMonth = options.visibleMonth ?? toJalali(today);
  const [visibleMonth, setVisibleMonthState] = useState<JalaliDate>(initialMonth);

  useEffect(() => {
    if (options.visibleMonth) {
      setVisibleMonthState(options.visibleMonth);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          weekStartsOn: options.weekStartsOn,
          weekendDays: options.weekendDays,
        }),
      });
    }

    return panels;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    visibleMonth.year,
    visibleMonth.month,
    numberOfMonths,
    today,
    options.isDateDisabled,
    options.weekStartsOn,
    options.weekendDays,
  ]);

  function goToPreviousMonth() {
    setVisibleMonth(addJalaliMonths(visibleMonth, -1));
  }

  function goToNextMonth() {
    setVisibleMonth(addJalaliMonths(visibleMonth, 1));
  }

  function goToPreviousYear() {
    setVisibleMonth(addJalaliMonths(visibleMonth, -12));
  }

  function goToNextYear() {
    setVisibleMonth(addJalaliMonths(visibleMonth, 12));
  }

  function goToday() {
    setVisibleMonth(toJalali(today));
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
    switch (options.mode) {
      case 'range': {
        options.onRangeChange?.(nextRangeValue(options.rangeValue ?? EMPTY_RANGE, date));
        return;
      }

      case 'multiRange': {
        const ranges = options.multiRangeValue ?? [];
        const last = ranges[ranges.length - 1];

        if (!last || (last.from && last.to)) {
          if (options.maxRangeCount && ranges.length >= options.maxRangeCount) {
            return;
          }
          options.onMultiRangeChange?.([...ranges, { from: date, to: null }]);
          return;
        }

        const updated = [...ranges];
        updated[updated.length - 1] = nextRangeValue(last, date);
        options.onMultiRangeChange?.(updated);
        return;
      }

      case 'multiple': {
        const current = options.multipleValue ?? [];
        const existingIndex = current.findIndex((existing) => isSameDay(existing, date));

        if (existingIndex >= 0) {
          options.onMultipleChange?.(current.filter((_, index) => index !== existingIndex));
          return;
        }

        if (options.maxMultipleCount && current.length >= options.maxMultipleCount) {
          options.onMultipleChange?.([...current.slice(1), date]);
          return;
        }

        options.onMultipleChange?.([...current, date]);
        return;
      }

      case 'week': {
        const from = startOfJalaliWeek(date, options.weekStartsOn);
        const to = endOfJalaliWeek(date, options.weekStartsOn);
        options.onWeekChange?.({ from, to });
        return;
      }

      default: {
        options.onValueChange?.(date);
      }
    }
  }

  function selectMonthValue(year: number, month: number) {
    options.onMonthChange?.({ year, month, day: 1 });
  }

  function selectYearValue(year: number) {
    options.onYearChange?.(year);
  }

  function getDayState(day: CalendarDay): DayState {
    const date = day.date.gregorian;

    switch (options.mode) {
      case 'range': {
        const { from, to } = options.rangeValue ?? EMPTY_RANGE;
        if (!from)
          return { isSelected: false, isRangeStart: false, isRangeEnd: false, isInRange: false };
        const isRangeStart = isSameDay(date, from);
        const isRangeEnd = to ? isSameDay(date, to) : false;
        const isInRange = Boolean(to) && isWithinDay(date, from, to as Date);
        return {
          isSelected: isInRange || (!to && isRangeStart),
          isRangeStart,
          isRangeEnd,
          isInRange,
        };
      }

      case 'multiRange': {
        const ranges = options.multiRangeValue ?? [];
        for (const range of ranges) {
          if (!range.from) continue;
          const isRangeStart = isSameDay(date, range.from);
          const isRangeEnd = range.to ? isSameDay(date, range.to) : false;
          const isInRange = Boolean(range.to) && isWithinDay(date, range.from, range.to as Date);
          if (isRangeStart || isRangeEnd || isInRange) {
            return { isSelected: true, isRangeStart, isRangeEnd, isInRange };
          }
        }
        return { isSelected: false, isRangeStart: false, isRangeEnd: false, isInRange: false };
      }

      case 'multiple': {
        const isSelected = (options.multipleValue ?? []).some((existing) =>
          isSameDay(existing, date),
        );
        return { isSelected, isRangeStart: false, isRangeEnd: false, isInRange: false };
      }

      case 'week': {
        const { from, to } = options.weekValue ?? EMPTY_RANGE;
        if (!from || !to)
          return { isSelected: false, isRangeStart: false, isRangeEnd: false, isInRange: false };
        const isInRange = isWithinDay(date, from, to);
        return {
          isSelected: isInRange,
          isRangeStart: isSameDay(date, from),
          isRangeEnd: isSameDay(date, to),
          isInRange,
        };
      }

      default: {
        const isSelected = options.value ? isSameDay(date, options.value) : false;
        return { isSelected, isRangeStart: false, isRangeEnd: false, isInRange: false };
      }
    }
  }

  return {
    visibleMonth,
    setVisibleMonth,
    numberOfMonths,
    monthPanels,
    goToPreviousMonth,
    goToNextMonth,
    goToPreviousYear,
    goToNextYear,
    goToday,
    setMonth,
    setYear,
    setPanelMonth,
    setPanelYear,
    selectDate,
    selectMonthValue,
    selectYearValue,
    getDayState,
  };
}
