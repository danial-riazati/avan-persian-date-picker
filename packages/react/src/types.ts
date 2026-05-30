import type { ReactNode } from 'react';
import type { AvanHoliday } from '@avan/holidays';
import type { JalaliDate } from '@avan/core';

export type AvanLocale = 'fa-IR' | 'en-IR';

export type AvanNumberOfMonths = 1 | 2;

/** `inline` always shows the calendar; `popover` opens it from the input trigger. */
export type AvanPickerDisplay = 'inline' | 'popover';

export interface AvanPickerOpenProps {
  display?: AvanPickerDisplay;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Close the popover after a date is selected. Default: true */
  closeOnSelect?: boolean;
}

export interface AvanTheme {
  fontFamily?: string;
  accent?: string;
  accentForeground?: string;
  muted?: string;
  radius?: string;
  daySize?: string;
}

export interface DateRangeValue {
  from: Date | null;
  to: Date | null;
}

export interface AvanCalendarProps {
  locale?: AvanLocale;
  dir?: 'rtl' | 'ltr';
  theme?: AvanTheme;
  className?: string;
  children?: ReactNode;
  mode?: 'single' | 'range';
  /** Show one or two consecutive months side by side. Default: 1 */
  numberOfMonths?: AvanNumberOfMonths;
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (value: Date | null) => void;
  rangeValue?: DateRangeValue;
  defaultRangeValue?: DateRangeValue;
  onRangeChange?: (value: DateRangeValue) => void;
  /** Iran holidays. Omitted = bundled 1404–1406 + visible year(s). Pass `[]` to hide. */
  holidays?: AvanHoliday[];
  visibleMonth?: JalaliDate;
  onVisibleMonthChange?: (month: JalaliDate) => void;
  minYear?: number;
  maxYear?: number;
  isDateDisabled?: (date: Date) => boolean;
}

export interface AvanDateRangePickerProps
  extends Omit<AvanCalendarProps, 'mode' | 'value' | 'onChange'>, AvanPickerOpenProps {
  value?: DateRangeValue;
  defaultValue?: DateRangeValue;
  onChange?: (value: DateRangeValue) => void;
  placeholder?: string;
}

export interface AvanDatePickerProps
  extends Omit<AvanCalendarProps, 'mode' | 'rangeValue' | 'onRangeChange'>, AvanPickerOpenProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (value: Date | null) => void;
  placeholder?: string;
}
