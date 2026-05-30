'use client';

import { useEffect, useMemo, useState } from 'react';
import { getHolidayForDate } from '@avan/holidays';
import type { CalendarDay } from '@avan/core';
import type { AvanLocale, AvanNumberOfMonths } from '../types';
import { useAvanContext } from '../context/avan-context';
import { JALALI_MONTHS_EN, JALALI_MONTHS_FA, WEEKDAYS_EN, WEEKDAYS_FA } from '../constants';
import { useAvanCalendar } from '../hooks/use-avan-calendar';
import { useIranHolidays } from '../hooks/use-iran-holidays';
import type { AvanCalendarProps } from '../types';
import { formatJalaliDisplay, formatNumberDisplay } from '../utils/format-display';
import {
  CalendarCaption,
  CalendarNavRow,
  getYearPageForYear,
  MonthPickerGrid,
  YearPickerGrid,
  type CalendarPickerView,
} from './calendar-header-controls';
import '../styles/calendar.css';

const DEFAULT_YEAR_SPAN = 15;

function resolveYearBounds(
  visibleYear: number,
  minYear?: number,
  maxYear?: number,
): { minYear: number; maxYear: number } {
  return {
    minYear: minYear ?? visibleYear - DEFAULT_YEAR_SPAN,
    maxYear: maxYear ?? visibleYear + DEFAULT_YEAR_SPAN,
  };
}

function previousMonthLabel(locale: AvanLocale): string {
  return locale === 'fa-IR' ? 'ماه قبل' : 'Previous month';
}

function nextMonthLabel(locale: AvanLocale): string {
  return locale === 'fa-IR' ? 'ماه بعد' : 'Next month';
}

function backToDaysLabel(locale: AvanLocale): string {
  return locale === 'fa-IR' ? 'بازگشت به تقویم' : 'Back to calendar';
}

function formatMonthHeading(
  month: { year: number; month: number },
  locale: AvanLocale,
  dir: 'rtl' | 'ltr',
  monthNames: string[],
): string {
  if (locale === 'fa-IR') {
    return `${monthNames[month.month - 1]} ${formatNumberDisplay(month.year, dir)}`;
  }

  return `${monthNames[month.month - 1]} ${month.year}`;
}

interface MonthDaysGridProps {
  weeks: CalendarDay[][];
  gridLabel: string;
  weekdays: string[];
  dir: 'rtl' | 'ltr';
  holidays: AvanCalendarProps['holidays'];
  calendar: ReturnType<typeof useAvanCalendar>;
  hideOutsideDays?: boolean;
}

function MonthDaysGrid({
  weeks,
  gridLabel,
  weekdays,
  dir,
  holidays = [],
  calendar,
  hideOutsideDays = false,
}: MonthDaysGridProps) {
  return (
    <>
      <div className="avan-calendar__weekdays" aria-hidden="true">
        {weekdays.map((label) => (
          <div key={label} className="avan-calendar__weekday">
            {label}
          </div>
        ))}
      </div>

      <div className="avan-calendar__grid" role="grid" aria-label={gridLabel}>
        {weeks.map((week, weekIndex) =>
          week.map((day) => {
            if (!day.isCurrentMonth && hideOutsideDays) {
              return (
                <div
                  key={`${weekIndex}-${day.date.gregorian.getTime()}`}
                  className="avan-calendar__day avan-calendar__day--empty"
                  aria-hidden="true"
                />
              );
            }

            const isOutside = !day.isCurrentMonth;
            const holiday = getHolidayForDate(day.date.gregorian, holidays);
            const selected = calendar.isSelected(day);
            const rangeStart = calendar.isRangeStart(day);
            const rangeEnd = calendar.isRangeEnd(day);
            const isDisabled = day.isDisabled || isOutside;
            const classes = [
              'avan-calendar__day',
              isOutside && 'avan-calendar__day--outside',
              day.isToday && 'avan-calendar__day--today',
              day.isWeekend && 'avan-calendar__day--weekend',
              isDisabled && 'avan-calendar__day--disabled',
              selected && 'avan-calendar__day--selected',
              rangeStart && 'avan-calendar__day--range-start',
              rangeEnd && 'avan-calendar__day--range-end',
              holiday && 'avan-calendar__day--holiday',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <button
                key={`${weekIndex}-${day.date.gregorian.getTime()}`}
                type="button"
                className={classes}
                role="gridcell"
                disabled={isDisabled}
                aria-disabled={isOutside || undefined}
                aria-label={formatJalaliDisplay(day.date.gregorian, dir)}
                aria-selected={selected}
                title={holiday?.title}
                onClick={() => {
                  if (isDisabled) {
                    return;
                  }

                  calendar.selectDate(day.date.gregorian);
                }}
              >
                <span className="avan-calendar__day-number">
                  {formatNumberDisplay(day.date.jalali.day, dir)}
                </span>
                {holiday ? (
                  <span className="avan-calendar__holiday-dot" aria-hidden="true" />
                ) : null}
              </button>
            );
          }),
        )}
      </div>
    </>
  );
}

export function AvanCalendar({
  locale: localeProp,
  dir: dirProp,
  className,
  mode = 'single',
  numberOfMonths = 1,
  value = null,
  defaultValue,
  rangeValue,
  defaultRangeValue,
  onChange,
  onRangeChange,
  holidays,
  visibleMonth: visibleMonthProp,
  onVisibleMonthChange,
  minYear,
  maxYear,
  isDateDisabled,
}: AvanCalendarProps) {
  const context = useAvanContext();
  const locale = localeProp ?? context.locale;
  const dir = dirProp ?? context.dir;
  const monthNames = locale === 'fa-IR' ? JALALI_MONTHS_FA : JALALI_MONTHS_EN;
  const weekdays = locale === 'fa-IR' ? WEEKDAYS_FA : WEEKDAYS_EN;
  const monthsToShow: AvanNumberOfMonths = numberOfMonths === 2 ? 2 : 1;

  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue ?? null);
  const [internalRange, setInternalRange] = useState(defaultRangeValue ?? { from: null, to: null });
  const [pickerView, setPickerView] = useState<CalendarPickerView>('days');
  const [yearPage, setYearPage] = useState(0);
  const [activePanelIndex, setActivePanelIndex] = useState(0);

  const selectedValue = value ?? internalValue;
  const selectedRange = rangeValue ?? internalRange;

  const calendar = useAvanCalendar({
    visibleMonth: visibleMonthProp,
    numberOfMonths: monthsToShow,
    mode,
    value: selectedValue,
    rangeValue: selectedRange,
    isDateDisabled,
    onVisibleMonthChange,
    onValueChange: (next) => {
      if (value === undefined) {
        setInternalValue(next);
      }
      onChange?.(next);
    },
    onRangeChange: (next) => {
      if (rangeValue === undefined) {
        setInternalRange(next);
      }
      onRangeChange?.(next);
    },
  });

  const resolvedHolidays = useIranHolidays(calendar.visibleMonth, monthsToShow, holidays);

  const pickerMonth =
    monthsToShow === 2
      ? (calendar.monthPanels[activePanelIndex]?.month ?? calendar.visibleMonth)
      : calendar.visibleMonth;

  const yearBounds = useMemo(
    () => resolveYearBounds(pickerMonth.year, minYear, maxYear),
    [pickerMonth.year, minYear, maxYear],
  );

  useEffect(() => {
    setYearPage(getYearPageForYear(pickerMonth.year, yearBounds.minYear));
  }, [pickerMonth.year, yearBounds.minYear]);

  const primaryMonthLabel = formatMonthHeading(pickerMonth, locale, dir, monthNames);

  function openMonths(panelIndex = 0) {
    setActivePanelIndex(panelIndex);
    setPickerView('months');
  }

  function openYears(panelIndex = 0) {
    setActivePanelIndex(panelIndex);
    const panelMonth = calendar.monthPanels[panelIndex]?.month ?? calendar.visibleMonth;
    setYearPage(getYearPageForYear(panelMonth.year, yearBounds.minYear));
    setPickerView('years');
  }

  function handleMonthSelect(month: number) {
    if (monthsToShow === 2) {
      calendar.setPanelMonth(activePanelIndex, month);
    } else {
      calendar.setMonth(month);
    }

    setPickerView('days');
  }

  function handleYearSelect(year: number) {
    if (monthsToShow === 2) {
      calendar.setPanelYear(activePanelIndex, year);
    } else {
      calendar.setYear(year);
    }

    setPickerView('months');
  }

  return (
    <div
      className={['avan-calendar', monthsToShow === 2 && 'avan-calendar--2-months', className]
        .filter(Boolean)
        .join(' ')}
      dir={dir}
    >
      <div className="avan-calendar__header">
        {pickerView === 'days' ? (
          <CalendarNavRow
            dir={dir}
            prevLabel={previousMonthLabel(locale)}
            nextLabel={nextMonthLabel(locale)}
            onPrevious={calendar.goToPreviousMonth}
            onNext={calendar.goToNextMonth}
          >
            {monthsToShow === 1 ? (
              <CalendarCaption
                locale={locale}
                dir={dir}
                month={calendar.visibleMonth.month}
                year={calendar.visibleMonth.year}
                monthNames={monthNames}
                pickerView={pickerView}
                onOpenMonths={() => openMonths(0)}
                onOpenYears={() => openYears(0)}
              />
            ) : (
              <span className="avan-calendar__header-spacer" aria-hidden="true" />
            )}
          </CalendarNavRow>
        ) : (
          <div className="avan-calendar__header-picker">
            <CalendarCaption
              locale={locale}
              dir={dir}
              month={pickerMonth.month}
              year={pickerMonth.year}
              monthNames={monthNames}
              pickerView={pickerView}
              onOpenMonths={() => openMonths(activePanelIndex)}
              onOpenYears={() => openYears(activePanelIndex)}
            />
            <button
              type="button"
              className="avan-calendar__back-btn"
              onClick={() => setPickerView('days')}
            >
              {backToDaysLabel(locale)}
            </button>
          </div>
        )}
      </div>

      {pickerView === 'days' ? (
        monthsToShow === 1 ? (
          <MonthDaysGrid
            weeks={calendar.monthPanels[0]?.weeks ?? []}
            gridLabel={primaryMonthLabel}
            weekdays={weekdays}
            dir={dir}
            holidays={resolvedHolidays}
            calendar={calendar}
          />
        ) : (
          <div className="avan-calendar__months">
            {calendar.monthPanels.map((panel, panelIndex) => {
              const panelLabel = formatMonthHeading(panel.month, locale, dir, monthNames);

              return (
                <section
                  key={`${panel.month.year}-${panel.month.month}`}
                  className="avan-calendar__month-panel"
                  aria-label={panelLabel}
                >
                  <div className="avan-calendar__month-header">
                    <CalendarCaption
                      locale={locale}
                      dir={dir}
                      month={panel.month.month}
                      year={panel.month.year}
                      monthNames={monthNames}
                      pickerView={pickerView}
                      onOpenMonths={() => openMonths(panelIndex)}
                      onOpenYears={() => openYears(panelIndex)}
                    />
                  </div>
                  <MonthDaysGrid
                    weeks={panel.weeks}
                    gridLabel={panelLabel}
                    weekdays={weekdays}
                    dir={dir}
                    holidays={resolvedHolidays}
                    calendar={calendar}
                    hideOutsideDays
                  />
                </section>
              );
            })}
          </div>
        )
      ) : null}

      {pickerView === 'months' ? (
        <MonthPickerGrid
          dir={dir}
          locale={locale}
          month={pickerMonth.month}
          monthNames={monthNames}
          onSelect={handleMonthSelect}
        />
      ) : null}

      {pickerView === 'years' ? (
        <YearPickerGrid
          dir={dir}
          locale={locale}
          year={pickerMonth.year}
          minYear={yearBounds.minYear}
          maxYear={yearBounds.maxYear}
          page={yearPage}
          onPageChange={setYearPage}
          onSelect={handleYearSelect}
        />
      ) : null}
    </div>
  );
}
