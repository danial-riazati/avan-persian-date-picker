'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getHolidayForDate } from '@avan/holidays';
import {
  addJalaliMonths,
  toGregorian,
  toJalali,
  type CalendarDay,
  type JalaliDate,
} from '@avan/core';
import type { AvanCalendarProps, AvanNumberOfMonths } from '../types';
import { useAvanContext } from '../context/avan-context';
import { resolveLocale, formatLocaleString, type AvanLocaleDefinition } from '../locale';
import { useAvanCalendar, type DayState } from '../hooks/use-avan-calendar';
import { useIranHolidays } from '../hooks/use-iran-holidays';
import { useControllableState } from '../hooks/use-controllable-state';
import { useDayGridKeyboard } from '../hooks/use-day-grid-keyboard';
import { useSwipeNavigation } from '../hooks/use-swipe-navigation';
import { useWheelNavigation } from '../hooks/use-wheel-navigation';
import { createDisabledResolver } from '../utils/constraints';
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

function monthIndex(j: { year: number; month: number }): number {
  return j.year * 12 + (j.month - 1);
}

function resolveYearBounds(
  visibleYear: number,
  minDate?: Date,
  maxDate?: Date,
  minYear?: number,
  maxYear?: number,
): { minYear: number; maxYear: number } {
  const minFromDate = minDate ? toJalali(minDate).year : undefined;
  const maxFromDate = maxDate ? toJalali(maxDate).year : undefined;

  return {
    minYear: minFromDate ?? minYear ?? visibleYear - DEFAULT_YEAR_SPAN,
    maxYear: maxFromDate ?? maxYear ?? visibleYear + DEFAULT_YEAR_SPAN,
  };
}

function formatMonthHeading(
  month: { year: number; month: number },
  locale: AvanLocaleDefinition,
  dir: 'rtl' | 'ltr',
): string {
  return `${locale.strings.months[month.month - 1]} ${formatNumberDisplay(month.year, dir)}`;
}

interface MonthDaysGridProps {
  weeks: CalendarDay[][];
  gridLabel: string;
  locale: AvanLocaleDefinition;
  dir: 'rtl' | 'ltr';
  holidays: AvanCalendarProps['holidays'];
  calendar: ReturnType<typeof useAvanCalendar>;
  hideOutsideDays?: boolean;
  isDayDisabled: (date: Date) => boolean;
  getDayMeta?: AvanCalendarProps['getDayMeta'];
  components?: AvanCalendarProps['components'];
  keyboard: ReturnType<typeof useDayGridKeyboard>;
  loading?: boolean;
}

function MonthDaysGrid({
  weeks,
  gridLabel,
  locale,
  dir,
  holidays = [],
  calendar,
  hideOutsideDays = false,
  isDayDisabled,
  getDayMeta,
  components,
  keyboard,
  loading,
}: MonthDaysGridProps) {
  if (loading) {
    return (
      <>
        <div className="avan-calendar__weekdays" aria-hidden="true">
          {locale.strings.weekdays.map((label) => (
            <div key={label} className="avan-calendar__weekday">
              {label}
            </div>
          ))}
        </div>
        <div
          className="avan-calendar__grid avan-calendar__grid--loading"
          role="grid"
          aria-busy="true"
          aria-label={gridLabel}
        >
          {Array.from({ length: 42 }, (_, index) => (
            <div key={index} className="avan-calendar__day-skeleton" aria-hidden="true" />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="avan-calendar__weekdays" aria-hidden="true">
        {locale.strings.weekdays.map((label) => (
          <div key={label} className="avan-calendar__weekday">
            {label}
          </div>
        ))}
      </div>

      <div className="avan-calendar__grid" role="grid" aria-label={gridLabel}>
        {weeks.map((week, weekIndex) => {
          // A week with every day hidden (outside-month, `hideOutsideDays`) exposes no
          // gridcells to assistive tech, so it must not claim the ARIA `row` role either.
          const weekHasVisibleCell = week.some((day) => day.isCurrentMonth || !hideOutsideDays);

          return (
            <div
              key={weekIndex}
              role={weekHasVisibleCell ? 'row' : undefined}
              className="avan-calendar__week-row"
            >
              {week.map((day) => {
                const dateKey = `${weekIndex}-${day.date.gregorian.getTime()}`;

                if (!day.isCurrentMonth && hideOutsideDays) {
                  return (
                    <div
                      key={dateKey}
                      role="gridcell"
                      className="avan-calendar__day avan-calendar__day--empty"
                      aria-hidden="true"
                    />
                  );
                }

                const isOutside = !day.isCurrentMonth;
                const holiday = getHolidayForDate(day.date.gregorian, holidays);
                const meta = getDayMeta?.(day.date.gregorian);
                const state: DayState = calendar.getDayState(day);
                const isDisabled =
                  day.isDisabled ||
                  isOutside ||
                  isDayDisabled(day.date.gregorian) ||
                  Boolean(meta?.disabled);
                const isFocused =
                  keyboard.focusedDate.getTime() === day.date.gregorian.getTime() ||
                  (day.date.gregorian.getFullYear() === keyboard.focusedDate.getFullYear() &&
                    day.date.gregorian.getMonth() === keyboard.focusedDate.getMonth() &&
                    day.date.gregorian.getDate() === keyboard.focusedDate.getDate());

                const classes = [
                  'avan-calendar__day',
                  isOutside && 'avan-calendar__day--outside',
                  day.isToday && 'avan-calendar__day--today',
                  day.isWeekend && 'avan-calendar__day--weekend',
                  isDisabled && 'avan-calendar__day--disabled',
                  state.isSelected && 'avan-calendar__day--selected',
                  state.isRangeStart && 'avan-calendar__day--range-start',
                  state.isRangeEnd && 'avan-calendar__day--range-end',
                  holiday && 'avan-calendar__day--holiday',
                  meta?.availability && `avan-calendar__day--availability-${meta.availability}`,
                  meta?.className,
                ]
                  .filter(Boolean)
                  .join(' ');

                const label = formatJalaliDisplay(day.date.gregorian, dir);
                const ariaLabelParts = [label];
                if (holiday) ariaLabelParts.push(holiday.title);
                if (day.isToday) ariaLabelParts.push(locale.strings.today);

                const defaultContent = (
                  <>
                    <span className="avan-calendar__day-number">
                      {formatNumberDisplay(day.date.jalali.day, dir)}
                    </span>
                    {meta?.badge ? (
                      <span className="avan-calendar__day-badge">{meta.badge}</span>
                    ) : null}
                    {meta?.price ? (
                      <span className="avan-calendar__day-price">
                        {meta.price.label ??
                          `${meta.price.amount}${meta.price.currency ? ` ${meta.price.currency}` : ''}`}
                      </span>
                    ) : null}
                    {holiday && !meta?.badge ? (
                      <span className="avan-calendar__holiday-dot" aria-hidden="true" />
                    ) : null}
                  </>
                );

                const context = {
                  day,
                  isSelected: state.isSelected,
                  isRangeStart: state.isRangeStart,
                  isRangeEnd: state.isRangeEnd,
                  isInRange: state.isInRange,
                  isDisabled,
                  isOutside,
                  holiday,
                  meta,
                };

                if (components?.Day) {
                  return <div key={dateKey}>{components.Day({ ...context, defaultContent })}</div>;
                }

                return (
                  <button
                    key={dateKey}
                    ref={(el) => keyboard.registerDayRef(day.date.gregorian, el)}
                    type="button"
                    className={classes}
                    role="gridcell"
                    disabled={isDisabled}
                    aria-disabled={isOutside || undefined}
                    aria-label={ariaLabelParts.join(', ')}
                    aria-selected={state.isSelected}
                    aria-current={day.isToday ? 'date' : undefined}
                    title={meta?.tooltip ?? holiday?.title}
                    tabIndex={isFocused ? 0 : -1}
                    onFocus={() => keyboard.syncFocusedDate(day.date.gregorian)}
                    onKeyDown={(event) => keyboard.handleKeyDown(event, day.date.gregorian)}
                    onClick={() => {
                      if (isDisabled) return;
                      calendar.selectDate(day.date.gregorian);
                    }}
                  >
                    {components?.DayContent ? components.DayContent(context) : defaultContent}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}

export function AvanCalendar(props: AvanCalendarProps) {
  const {
    locale: localeProp,
    dir: dirProp,
    className,
    mode = 'single',
    numberOfMonths = 1,
    value,
    defaultValue,
    onChange,
    rangeValue,
    defaultRangeValue,
    onRangeChange,
    multipleValue,
    defaultMultipleValue,
    onMultipleChange,
    maxMultipleCount,
    multiRangeValue,
    defaultMultiRangeValue,
    onMultiRangeChange,
    maxRangeCount,
    weekValue,
    defaultWeekValue,
    onWeekChange,
    monthValue,
    defaultMonthValue,
    onMonthChange,
    yearValue,
    defaultYearValue,
    onYearChange,
    holidays,
    visibleMonth: visibleMonthProp,
    onVisibleMonthChange,
    minYear,
    maxYear,
    minDate,
    maxDate,
    isDateDisabled,
    disabledDates,
    disabledWeekdays,
    disabledRanges,
    weekStartsOn: weekStartsOnProp,
    weekendDays: weekendDaysProp,
    getDayMeta,
    components,
    enableSwipeNavigation = true,
    enableWheelNavigation = false,
    showTodayButton = false,
    showClearButton = false,
    loading = false,
  } = props;

  const context = useAvanContext();
  const locale = useMemo(
    () => resolveLocale(localeProp ?? context.locale),
    [localeProp, context.locale],
  );
  const dir = dirProp ?? context.dir ?? locale.dir;
  const weekStartsOn = weekStartsOnProp ?? locale.weekStartsOn;
  const weekendDays = weekendDaysProp ?? locale.weekendDays;
  const monthsToShow = Math.min(Math.max(numberOfMonths, 1), 4) as AvanNumberOfMonths;

  const [selectedValue, setSelectedValue] = useControllableState<Date | null>(
    value,
    defaultValue ?? null,
    onChange,
  );
  const [selectedRange, setSelectedRange] = useControllableState(
    rangeValue,
    defaultRangeValue ?? { from: null, to: null },
    onRangeChange,
  );
  const [selectedMultiple, setSelectedMultiple] = useControllableState<Date[]>(
    multipleValue,
    defaultMultipleValue ?? [],
    onMultipleChange,
  );
  const [selectedMultiRange, setSelectedMultiRange] = useControllableState(
    multiRangeValue,
    defaultMultiRangeValue ?? [],
    onMultiRangeChange,
  );
  const [selectedWeek, setSelectedWeek] = useControllableState(
    weekValue,
    defaultWeekValue ?? { from: null, to: null },
    onWeekChange,
  );
  const [selectedMonth, setSelectedMonth] = useControllableState<JalaliDate | null>(
    monthValue,
    defaultMonthValue ?? null,
    onMonthChange,
  );
  const [selectedYear, setSelectedYear] = useControllableState<number | null>(
    yearValue,
    defaultYearValue ?? null,
    onYearChange,
  );

  const [pickerView, setPickerView] = useState<CalendarPickerView>('days');
  const [yearPage, setYearPage] = useState(0);
  const [activePanelIndex, setActivePanelIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  // Compared by time value (not object reference) so a new-but-equivalent `Date` prop doesn't
  // recompute memoized values below on every render.
  const minDateTime = minDate?.getTime();
  const maxDateTime = maxDate?.getTime();

  const combinedIsDateDisabled = useMemo(
    () =>
      createDisabledResolver({
        minDate,
        maxDate,
        minYear,
        maxYear,
        isDateDisabled,
        disabledDates,
        disabledWeekdays,
        disabledRanges,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- narrowed to `minDateTime`/`maxDateTime` above
    [
      minDateTime,
      maxDateTime,
      minYear,
      maxYear,
      isDateDisabled,
      disabledDates,
      disabledWeekdays,
      disabledRanges,
    ],
  );

  const calendar = useAvanCalendar({
    visibleMonth: visibleMonthProp,
    numberOfMonths: monthsToShow,
    mode,
    value: selectedValue,
    rangeValue: selectedRange,
    multipleValue: selectedMultiple,
    multiRangeValue: selectedMultiRange,
    weekValue: selectedWeek,
    isDateDisabled: combinedIsDateDisabled,
    weekStartsOn,
    weekendDays,
    onVisibleMonthChange,
    maxMultipleCount,
    maxRangeCount,
    onValueChange: setSelectedValue,
    onRangeChange: setSelectedRange,
    onMultipleChange: setSelectedMultiple,
    onMultiRangeChange: setSelectedMultiRange,
    onWeekChange: setSelectedWeek,
  });

  const resolvedHolidays = useIranHolidays(calendar.visibleMonth, monthsToShow, holidays);

  const pickerMonth =
    monthsToShow > 1
      ? (calendar.monthPanels[activePanelIndex]?.month ?? calendar.visibleMonth)
      : calendar.visibleMonth;

  const yearBounds = useMemo(
    () => resolveYearBounds(pickerMonth.year, minDate, maxDate, minYear, maxYear),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- narrowed to `minDateTime`/`maxDateTime` above
    [pickerMonth.year, minDateTime, maxDateTime, minYear, maxYear],
  );

  useEffect(() => {
    setYearPage(getYearPageForYear(pickerMonth.year, yearBounds.minYear));
  }, [pickerMonth.year, yearBounds.minYear]);

  const minJalali = minDate ? toJalali(minDate) : undefined;
  const maxJalali = maxDate ? toJalali(maxDate) : undefined;
  const lastPanelMonth = addJalaliMonths(calendar.visibleMonth, monthsToShow - 1);
  const prevDisabled = minJalali
    ? monthIndex(calendar.visibleMonth) <= monthIndex(minJalali)
    : false;
  const nextDisabled = maxJalali ? monthIndex(lastPanelMonth) >= monthIndex(maxJalali) : false;

  const primaryMonthLabel = formatMonthHeading(pickerMonth, locale, dir);

  const swipeHandlers = useSwipeNavigation({
    dir,
    enabled: enableSwipeNavigation && pickerView === 'days',
    onSwipePrevious: () => !prevDisabled && calendar.goToPreviousMonth(),
    onSwipeNext: () => !nextDisabled && calendar.goToNextMonth(),
  });

  const { onWheel } = useWheelNavigation({
    enabled: enableWheelNavigation && pickerView === 'days',
    onPrevious: () => !prevDisabled && calendar.goToPreviousMonth(),
    onNext: () => !nextDisabled && calendar.goToNextMonth(),
  });

  const focusAnchor =
    mode === 'single'
      ? (selectedValue ?? undefined)
      : mode === 'range'
        ? (selectedRange.from ?? undefined)
        : mode === 'week'
          ? (selectedWeek.from ?? undefined)
          : undefined;

  // Fall back to the 1st of the visible month so the roving tab stop always lands on a
  // rendered cell, even when there's no selection and "today" falls outside the visible span.
  const keyboardAnchor = focusAnchor ?? toGregorian({ ...calendar.visibleMonth, day: 1 });

  const keyboard = useDayGridKeyboard({
    dir,
    weekStartsOn,
    numberOfMonths: monthsToShow,
    isDateDisabled: combinedIsDateDisabled,
    initialDate: keyboardAnchor,
    onNavigateMonths: (delta) =>
      calendar.setVisibleMonth(addJalaliMonths(calendar.visibleMonth, delta)),
    onSelect: (date) => {
      if (!combinedIsDateDisabled(date)) {
        calendar.selectDate(date);
      }
    },
  });

  const [announcement, setAnnouncement] = useState('');
  const lastAnnounced = useRef<string>('');
  // Narrowed to primitives derived from the selection so the announcement effect below only
  // re-fires when the selected value actually changes, not on every render.
  const selectedValueTime = selectedValue?.getTime();
  const selectedRangeToTime = selectedRange.to?.getTime();
  const selectedWeekToTime = selectedWeek.to?.getTime();

  useEffect(() => {
    let text = '';
    if (mode === 'single' && selectedValue) text = formatJalaliDisplay(selectedValue, dir);
    else if (mode === 'range' && selectedRange.to) {
      text = `${formatJalaliDisplay(selectedRange.from as Date, dir)} – ${formatJalaliDisplay(selectedRange.to, dir)}`;
    } else if (mode === 'multiple' && selectedMultiple.length > 0) {
      text = selectedMultiple.map((d) => formatJalaliDisplay(d, dir)).join(', ');
    } else if (mode === 'week' && selectedWeek.to) {
      text = `${formatJalaliDisplay(selectedWeek.from as Date, dir)} – ${formatJalaliDisplay(selectedWeek.to, dir)}`;
    }

    if (text && text !== lastAnnounced.current) {
      lastAnnounced.current = text;
      setAnnouncement(formatLocaleString(locale.strings.selectedAnnouncement, { date: text }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- narrowed to primitives derived from the selection
  }, [mode, selectedValueTime, selectedRangeToTime, selectedMultiple.length, selectedWeekToTime]);

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
    if (monthsToShow > 1) {
      calendar.setPanelMonth(activePanelIndex, month);
    } else {
      calendar.setMonth(month);
    }
    setPickerView('days');
  }

  function handleYearSelect(year: number) {
    if (monthsToShow > 1) {
      calendar.setPanelYear(activePanelIndex, year);
    } else {
      calendar.setYear(year);
    }
    setPickerView('months');
  }

  function handleClear() {
    switch (mode) {
      case 'range':
        setSelectedRange({ from: null, to: null });
        break;
      case 'multiple':
        setSelectedMultiple([]);
        break;
      case 'multiRange':
        setSelectedMultiRange([]);
        break;
      case 'week':
        setSelectedWeek({ from: null, to: null });
        break;
      case 'month':
        setSelectedMonth(null);
        break;
      case 'year':
        setSelectedYear(null);
        break;
      default:
        setSelectedValue(null);
    }
  }

  const hasSelection =
    mode === 'single'
      ? Boolean(selectedValue)
      : mode === 'range'
        ? Boolean(selectedRange.from)
        : mode === 'multiple'
          ? selectedMultiple.length > 0
          : mode === 'multiRange'
            ? selectedMultiRange.length > 0
            : mode === 'week'
              ? Boolean(selectedWeek.from)
              : mode === 'month'
                ? Boolean(selectedMonth)
                : Boolean(selectedYear);

  const rootClassName = [
    'avan-calendar',
    monthsToShow > 1 && `avan-calendar--${monthsToShow}-months`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // ---- Year-only selection mode: skip the day grid entirely. ----
  if (mode === 'year') {
    return (
      <div className={rootClassName} dir={dir}>
        <YearPickerGrid
          dir={dir}
          locale={locale}
          year={selectedYear ?? calendar.visibleMonth.year}
          minYear={yearBounds.minYear}
          maxYear={yearBounds.maxYear}
          page={yearPage}
          onPageChange={setYearPage}
          onSelect={(year) => setSelectedYear(year)}
        />
        {showClearButton && hasSelection ? (
          <button type="button" className="avan-calendar__clear-btn" onClick={handleClear}>
            {locale.strings.clearSelection}
          </button>
        ) : null}
      </div>
    );
  }

  // ---- Month-only selection mode: year nav + a month grid, no days. ----
  if (mode === 'month') {
    const monthYear = selectedMonth?.year ?? calendar.visibleMonth.year;

    return (
      <div className={rootClassName} dir={dir}>
        <CalendarNavRow
          dir={dir}
          prevLabel={locale.strings.previousYear}
          nextLabel={locale.strings.nextYear}
          prevDisabled={minJalali ? monthYear <= minJalali.year : false}
          nextDisabled={maxJalali ? monthYear >= maxJalali.year : false}
          onPrevious={() =>
            calendar.setVisibleMonth({ ...calendar.visibleMonth, year: monthYear - 1 })
          }
          onNext={() => calendar.setVisibleMonth({ ...calendar.visibleMonth, year: monthYear + 1 })}
        >
          <strong className="avan-calendar__month-mode-year">
            {formatNumberDisplay(monthYear, dir)}
          </strong>
        </CalendarNavRow>
        <MonthPickerGrid
          dir={dir}
          locale={locale}
          month={selectedMonth && selectedMonth.year === monthYear ? selectedMonth.month : 0}
          monthNames={locale.strings.months}
          onSelect={(month) => setSelectedMonth({ year: monthYear, month, day: 1 })}
          isMonthDisabled={(month) => {
            if (
              minJalali &&
              (monthYear < minJalali.year ||
                (monthYear === minJalali.year && month < minJalali.month))
            )
              return true;
            if (
              maxJalali &&
              (monthYear > maxJalali.year ||
                (monthYear === maxJalali.year && month > maxJalali.month))
            )
              return true;
            return false;
          }}
        />
        {showClearButton && hasSelection ? (
          <button type="button" className="avan-calendar__clear-btn" onClick={handleClear}>
            {locale.strings.clearSelection}
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={rootClassName}
      dir={dir}
      onPointerDown={swipeHandlers.onPointerDown}
      onPointerUp={swipeHandlers.onPointerUp}
      onPointerCancel={swipeHandlers.onPointerCancel}
      onWheel={onWheel}
    >
      <div className="avan-sr-only" aria-live="polite" role="status">
        {announcement}
      </div>

      <div className="avan-calendar__header">
        {pickerView === 'days' ? (
          <CalendarNavRow
            dir={dir}
            prevLabel={locale.strings.previousMonth}
            nextLabel={locale.strings.nextMonth}
            prevDisabled={prevDisabled}
            nextDisabled={nextDisabled}
            onPrevious={calendar.goToPreviousMonth}
            onNext={calendar.goToNextMonth}
            renderNavButton={components?.NavButton}
          >
            {monthsToShow === 1 ? (
              <CalendarCaption
                dir={dir}
                month={calendar.visibleMonth.month}
                year={calendar.visibleMonth.year}
                monthNames={locale.strings.months}
                pickerView={pickerView}
                onOpenMonths={() => openMonths(0)}
                onOpenYears={() => openYears(0)}
                render={components?.Caption}
              />
            ) : (
              <span className="avan-calendar__header-spacer" aria-hidden="true" />
            )}
          </CalendarNavRow>
        ) : (
          <div className="avan-calendar__header-picker">
            <CalendarCaption
              dir={dir}
              month={pickerMonth.month}
              year={pickerMonth.year}
              monthNames={locale.strings.months}
              pickerView={pickerView}
              onOpenMonths={() => openMonths(activePanelIndex)}
              onOpenYears={() => openYears(activePanelIndex)}
            />
            <button
              type="button"
              className="avan-calendar__back-btn"
              onClick={() => setPickerView('days')}
            >
              {locale.strings.backToDays}
            </button>
          </div>
        )}
      </div>

      {pickerView === 'days' ? (
        monthsToShow === 1 ? (
          <MonthDaysGrid
            weeks={calendar.monthPanels[0]?.weeks ?? []}
            gridLabel={primaryMonthLabel}
            locale={locale}
            dir={dir}
            holidays={resolvedHolidays}
            calendar={calendar}
            isDayDisabled={combinedIsDateDisabled}
            getDayMeta={getDayMeta}
            components={components}
            keyboard={keyboard}
            loading={loading}
          />
        ) : (
          <div className={`avan-calendar__months avan-calendar__months--${monthsToShow}`}>
            {calendar.monthPanels.map((panel, panelIndex) => {
              const panelLabel = formatMonthHeading(panel.month, locale, dir);

              return (
                <section
                  key={`${panel.month.year}-${panel.month.month}`}
                  className="avan-calendar__month-panel"
                  aria-label={panelLabel}
                >
                  <div className="avan-calendar__month-header">
                    <CalendarCaption
                      dir={dir}
                      month={panel.month.month}
                      year={panel.month.year}
                      monthNames={locale.strings.months}
                      pickerView={pickerView}
                      onOpenMonths={() => openMonths(panelIndex)}
                      onOpenYears={() => openYears(panelIndex)}
                    />
                  </div>
                  <MonthDaysGrid
                    weeks={panel.weeks}
                    gridLabel={panelLabel}
                    locale={locale}
                    dir={dir}
                    holidays={resolvedHolidays}
                    calendar={calendar}
                    hideOutsideDays
                    isDayDisabled={combinedIsDateDisabled}
                    getDayMeta={getDayMeta}
                    components={components}
                    keyboard={keyboard}
                    loading={loading}
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
          monthNames={locale.strings.months}
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

      {pickerView === 'days' && (components?.Footer || showTodayButton || showClearButton) ? (
        <div className="avan-calendar__footer">
          {components?.Footer ? (
            components.Footer({
              visibleMonth: calendar.visibleMonth,
              selectedCount: mode === 'multiple' ? selectedMultiple.length : hasSelection ? 1 : 0,
            })
          ) : (
            <>
              {showTodayButton ? (
                <button
                  type="button"
                  className="avan-calendar__today-btn"
                  onClick={calendar.goToday}
                >
                  {locale.strings.today}
                </button>
              ) : null}
              {showClearButton && hasSelection ? (
                <button type="button" className="avan-calendar__clear-btn" onClick={handleClear}>
                  {locale.strings.clearSelection}
                </button>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
