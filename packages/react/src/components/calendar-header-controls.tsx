'use client';

import { useMemo, type ReactNode } from 'react';
import type { AvanLocale } from '../types';
import { formatNumberDisplay } from '../utils/format-display';

export type CalendarPickerView = 'days' | 'months' | 'years';

interface NavChevronProps {
  direction: 'prev' | 'next';
}

export function NavChevron({ direction }: NavChevronProps) {
  return (
    <svg
      className={[
        'avan-calendar__nav-icon',
        direction === 'prev' ? 'avan-calendar__nav-icon--prev' : 'avan-calendar__nav-icon--next',
      ].join(' ')}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      {direction === 'prev' ? (
        <path
          d="M10 3L5 8L10 13"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M6 3L11 8L6 13"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

interface CalendarNavButtonProps {
  direction: 'prev' | 'next';
  label: string;
  disabled?: boolean;
  className?: string;
  onClick: () => void;
}

/** Nav buttons: LTR = prev left (←), next right (→). RTL = prev right (→), next left (←). */
export function CalendarNavButton({
  direction,
  label,
  disabled,
  className,
  onClick,
}: CalendarNavButtonProps) {
  return (
    <button
      type="button"
      className={['avan-calendar__nav', className].filter(Boolean).join(' ')}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      <NavChevron direction={direction} />
    </button>
  );
}

interface CalendarNavRowProps {
  dir: 'rtl' | 'ltr';
  prevLabel: string;
  nextLabel: string;
  onPrevious: () => void;
  onNext: () => void;
  children: ReactNode;
}

function navChevronForPrevious(dir: 'rtl' | 'ltr'): 'prev' | 'next' {
  return dir === 'rtl' ? 'next' : 'prev';
}

function navChevronForNext(dir: 'rtl' | 'ltr'): 'prev' | 'next' {
  return dir === 'rtl' ? 'prev' : 'next';
}

export function CalendarNavRow({
  dir,
  prevLabel,
  nextLabel,
  onPrevious,
  onNext,
  children,
}: CalendarNavRowProps) {
  return (
    <div className="avan-calendar__header-nav" dir={dir}>
      <CalendarNavButton
        direction={navChevronForPrevious(dir)}
        label={prevLabel}
        onClick={onPrevious}
      />
      <div className="avan-calendar__header-center">{children}</div>
      <CalendarNavButton direction={navChevronForNext(dir)} label={nextLabel} onClick={onNext} />
    </div>
  );
}

interface PickerToolbarProps {
  dir: 'rtl' | 'ltr';
  prevLabel: string;
  nextLabel: string;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  children: ReactNode;
}

export function PickerToolbar({
  dir,
  prevLabel,
  nextLabel,
  prevDisabled,
  nextDisabled,
  onPrevious,
  onNext,
  children,
}: PickerToolbarProps) {
  return (
    <div className="avan-calendar__picker-toolbar" dir={dir}>
      <CalendarNavButton
        direction={navChevronForPrevious(dir)}
        className="avan-calendar__picker-nav"
        label={prevLabel}
        disabled={prevDisabled}
        onClick={onPrevious}
      />
      <div className="avan-calendar__picker-range-wrap">{children}</div>
      <CalendarNavButton
        direction={navChevronForNext(dir)}
        className="avan-calendar__picker-nav"
        label={nextLabel}
        disabled={nextDisabled}
        onClick={onNext}
      />
    </div>
  );
}

interface CalendarCaptionProps {
  locale: AvanLocale;
  dir: 'rtl' | 'ltr';
  month: number;
  year: number;
  monthNames: readonly string[];
  pickerView: CalendarPickerView;
  onOpenMonths: () => void;
  onOpenYears: () => void;
}

export function CalendarCaption({
  locale,
  dir,
  month,
  year,
  monthNames,
  pickerView,
  onOpenMonths,
  onOpenYears,
}: CalendarCaptionProps) {
  const monthName = monthNames[month - 1] ?? '';
  const yearLabel = formatNumberDisplay(year, dir);

  return (
    <div className="avan-calendar__caption">
      <button
        type="button"
        className={[
          'avan-calendar__caption-chip',
          pickerView === 'months' && 'avan-calendar__caption-chip--active',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-expanded={pickerView === 'months'}
        onClick={onOpenMonths}
      >
        {monthName}
      </button>
      <button
        type="button"
        className={[
          'avan-calendar__caption-chip',
          pickerView === 'years' && 'avan-calendar__caption-chip--active',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-expanded={pickerView === 'years'}
        onClick={onOpenYears}
      >
        {yearLabel}
      </button>
    </div>
  );
}

interface MonthPickerGridProps {
  dir: 'rtl' | 'ltr';
  locale: AvanLocale;
  month: number;
  monthNames: readonly string[];
  onSelect: (month: number) => void;
}

export function MonthPickerGrid({
  dir,
  locale,
  month,
  monthNames,
  onSelect,
}: MonthPickerGridProps) {
  const title = locale === 'fa-IR' ? 'انتخاب ماه' : 'Select month';

  return (
    <div className="avan-calendar__picker" dir={dir}>
      <div className="avan-calendar__picker-title">{title}</div>
      <div className="avan-calendar__picker-grid avan-calendar__picker-grid--months" role="listbox">
        {monthNames.map((name, index) => {
          const monthNumber = index + 1;
          const isSelected = monthNumber === month;

          return (
            <button
              key={name}
              type="button"
              role="option"
              aria-selected={isSelected}
              className={[
                'avan-calendar__picker-cell',
                isSelected && 'avan-calendar__picker-cell--selected',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onSelect(monthNumber)}
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface YearPickerGridProps {
  dir: 'rtl' | 'ltr';
  locale: AvanLocale;
  year: number;
  minYear: number;
  maxYear: number;
  page: number;
  onPageChange: (page: number) => void;
  onSelect: (year: number) => void;
}

const YEARS_PER_PAGE = 12;

export function getYearPageForYear(year: number, minYear: number): number {
  return Math.floor((year - minYear) / YEARS_PER_PAGE);
}

export function getYearPageCount(minYear: number, maxYear: number): number {
  const total = maxYear - minYear + 1;
  return Math.max(1, Math.ceil(total / YEARS_PER_PAGE));
}

export function getYearsForPage(minYear: number, maxYear: number, page: number): number[] {
  const start = minYear + page * YEARS_PER_PAGE;
  const end = Math.min(start + YEARS_PER_PAGE - 1, maxYear);
  const years: number[] = [];

  for (let y = start; y <= end; y += 1) {
    years.push(y);
  }

  while (years.length < YEARS_PER_PAGE) {
    years.push(NaN);
  }

  return years;
}

export function YearPickerGrid({
  dir,
  locale,
  year,
  minYear,
  maxYear,
  page,
  onPageChange,
  onSelect,
}: YearPickerGridProps) {
  const pageCount = getYearPageCount(minYear, maxYear);
  const years = useMemo(() => getYearsForPage(minYear, maxYear, page), [minYear, maxYear, page]);
  const pageStart = minYear + page * YEARS_PER_PAGE;
  const pageEnd = Math.min(pageStart + YEARS_PER_PAGE - 1, maxYear);

  const title = locale === 'fa-IR' ? 'انتخاب سال' : 'Select year';
  const rangeLabel = `${formatNumberDisplay(pageStart, dir)} – ${formatNumberDisplay(pageEnd, dir)}`;
  const prevLabel = locale === 'fa-IR' ? 'صفحه قبل' : 'Previous page';
  const nextLabel = locale === 'fa-IR' ? 'صفحه بعد' : 'Next page';

  return (
    <div className="avan-calendar__picker" dir={dir}>
      <div className="avan-calendar__picker-title">{title}</div>

      <PickerToolbar
        dir={dir}
        prevLabel={prevLabel}
        nextLabel={nextLabel}
        prevDisabled={page <= 0}
        nextDisabled={page >= pageCount - 1}
        onPrevious={() => onPageChange(page - 1)}
        onNext={() => onPageChange(page + 1)}
      >
        <span className="avan-calendar__picker-range" dir={dir}>
          {rangeLabel}
        </span>
      </PickerToolbar>

      <div className="avan-calendar__picker-grid avan-calendar__picker-grid--years" role="listbox">
        {years.map((y, index) => {
          if (Number.isNaN(y)) {
            return <span key={`empty-${index}`} className="avan-calendar__picker-cell--empty" />;
          }

          const isSelected = y === year;

          return (
            <button
              key={y}
              type="button"
              role="option"
              aria-selected={isSelected}
              className={[
                'avan-calendar__picker-cell',
                isSelected && 'avan-calendar__picker-cell--selected',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onSelect(y)}
            >
              {formatNumberDisplay(y, dir)}
            </button>
          );
        })}
      </div>

      <div className="avan-calendar__picker-pages">
        {formatNumberDisplay(page + 1, dir)} / {formatNumberDisplay(pageCount, dir)}
      </div>
    </div>
  );
}
