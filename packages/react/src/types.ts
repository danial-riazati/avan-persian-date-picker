import type { CSSProperties, ReactNode } from 'react';
import type { AvanHoliday } from '@avan-persian/holidays';
import type { CalendarDay, JalaliDate } from '@avan-persian/core';
import type { AvanLocale } from './locale';

export type { AvanLocale, AvanLocaleKey, AvanLocaleDefinition, AvanLocaleStrings } from './locale';

export type AvanNumberOfMonths = 1 | 2 | 3 | 4;

/** `inline` always shows the calendar; `popover` opens it from the input trigger. */
export type AvanPickerDisplay = 'inline' | 'popover';

export interface AvanPickerOpenProps {
  display?: AvanPickerDisplay;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Close the popover after a date is selected. Default: true */
  closeOnSelect?: boolean;
  /**
   * Let users type a date instead of only picking from the calendar. Only applies when
   * `display="popover"`. Default: false.
   */
  allowTextInput?: boolean;
  /** `date-fns-jalali` format token used to parse/format the text input. Default: `yyyy/MM/dd`. */
  inputFormat?: string;
}

export interface AvanTheme {
  fontFamily?: string;
  accent?: string;
  accentForeground?: string;
  muted?: string;
  radius?: string;
  daySize?: string;
  /** Extra CSS variables applied to the `.avan-root` element, e.g. `{ '--avan-shadow': 'none' }`. */
  extra?: CSSProperties & Record<`--${string}`, string | number>;
}

export interface DateRangeValue {
  from: Date | null;
  to: Date | null;
}

/** Free-form metadata attached to a single day — powers badges, pricing, availability, etc. */
export interface AvanDayMeta {
  /** Rendered inside the day cell (e.g. a price label or a colored dot). */
  badge?: ReactNode;
  /** Structured price info; renderable via the default day content or a custom `DayContent`. */
  price?: { amount: number; currency?: string; label?: string };
  availability?: 'available' | 'limited' | 'full' | 'unavailable';
  /** Extra class name merged onto the day button. */
  className?: string;
  /** Force-disable this specific day regardless of other constraints. */
  disabled?: boolean;
  /** Shown as a native `title` tooltip on the day button. */
  tooltip?: string;
  /** Any additional app-specific data, forwarded verbatim to render props. */
  [key: string]: unknown;
}

export type AvanGetDayMeta = (date: Date) => AvanDayMeta | undefined;

export interface AvanDayRenderContext {
  day: CalendarDay;
  isSelected: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
  isDisabled: boolean;
  isOutside: boolean;
  holiday?: AvanHoliday;
  meta?: AvanDayMeta;
}

export interface AvanNavButtonRenderProps {
  direction: 'prev' | 'next';
  label: string;
  disabled?: boolean;
  onClick: () => void;
}

export interface AvanCaptionRenderProps {
  month: number;
  year: number;
  monthLabel: string;
  yearLabel: string;
  onOpenMonths: () => void;
  onOpenYears: () => void;
}

export interface AvanFooterRenderProps {
  visibleMonth: JalaliDate;
  selectedCount: number;
}

/** Swap out pieces of the calendar's rendering without forking the whole component. */
export interface AvanCalendarComponents {
  /** Customize only the content inside a day cell; the button, classes, and handlers stay default. */
  DayContent?: (ctx: AvanDayRenderContext) => ReactNode;
  /** Fully replace a day cell's content, including layout inside the button. */
  Day?: (ctx: AvanDayRenderContext & { defaultContent: ReactNode }) => ReactNode;
  NavButton?: (props: AvanNavButtonRenderProps) => ReactNode;
  Caption?: (props: AvanCaptionRenderProps) => ReactNode;
  Footer?: (props: AvanFooterRenderProps) => ReactNode;
}

export type AvanSelectionMode =
  | 'single'
  | 'multiple'
  | 'range'
  | 'multiRange'
  | 'week'
  | 'month'
  | 'year';

export interface AvanDateConstraints {
  /** Earliest selectable date (inclusive). */
  minDate?: Date;
  /** Latest selectable date (inclusive). */
  maxDate?: Date;
  /** @deprecated Use `minDate` instead. Still bounds the year picker if `minDate` is absent. */
  minYear?: number;
  /** @deprecated Use `maxDate` instead. Still bounds the year picker if `maxDate` is absent. */
  maxYear?: number;
  /** Specific disabled dates, or a predicate. Combined with `minDate`/`maxDate`/weekday rules. */
  isDateDisabled?: (date: Date) => boolean;
  disabledDates?: Date[];
  /** JS `Date#getDay()` indices (0=Sun..6=Sat) that are always disabled. */
  disabledWeekdays?: number[];
  disabledRanges?: DateRangeValue[];
}

export interface AvanCalendarProps extends AvanDateConstraints {
  locale?: AvanLocale;
  dir?: 'rtl' | 'ltr';
  theme?: AvanTheme;
  className?: string;
  children?: ReactNode;
  mode?: AvanSelectionMode;
  /** Show 1–4 consecutive months side by side. Default: 1 */
  numberOfMonths?: AvanNumberOfMonths;

  // single
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (value: Date | null) => void;

  // range
  rangeValue?: DateRangeValue;
  defaultRangeValue?: DateRangeValue;
  onRangeChange?: (value: DateRangeValue) => void;

  // multiple
  multipleValue?: Date[];
  defaultMultipleValue?: Date[];
  onMultipleChange?: (value: Date[]) => void;
  /** Cap the number of dates selectable in `mode="multiple"`. */
  maxMultipleCount?: number;

  // multi-range
  multiRangeValue?: DateRangeValue[];
  defaultMultiRangeValue?: DateRangeValue[];
  onMultiRangeChange?: (value: DateRangeValue[]) => void;
  maxRangeCount?: number;

  // week
  weekValue?: DateRangeValue;
  defaultWeekValue?: DateRangeValue;
  onWeekChange?: (value: DateRangeValue) => void;

  // month
  monthValue?: JalaliDate | null;
  defaultMonthValue?: JalaliDate | null;
  onMonthChange?: (value: JalaliDate | null) => void;

  // year
  yearValue?: number | null;
  defaultYearValue?: number | null;
  onYearChange?: (value: number | null) => void;

  /** Iran holidays. Omitted = bundled 1404–1406 + visible year(s). Pass `[]` to hide. */
  holidays?: AvanHoliday[];
  visibleMonth?: JalaliDate;
  onVisibleMonthChange?: (month: JalaliDate) => void;

  /** JS `Date#getDay()` index (0=Sun..6=Sat) that starts the week. Default from locale (Saturday). */
  weekStartsOn?: number;
  /** JS `Date#getDay()` indices treated as the weekend. Default from locale (Friday). */
  weekendDays?: readonly number[];

  /** Attach free-form metadata (badges, pricing, availability) to individual days. */
  getDayMeta?: AvanGetDayMeta;
  /** Swap out rendering for day content, nav buttons, captions, or a footer slot. */
  components?: AvanCalendarComponents;

  /** Enable swipe (touch) navigation between months. Default: true. */
  enableSwipeNavigation?: boolean;
  /** Enable mouse-wheel navigation between months. Default: false. */
  enableWheelNavigation?: boolean;
  /** Show a "Today" quick-jump button in the footer. Default: false. */
  showTodayButton?: boolean;
  /** Show a "Clear" button in the footer when there's a selection. Default: false. */
  showClearButton?: boolean;
  /** Disable all animations/transitions regardless of `prefers-reduced-motion`. Default: false. */
  disableAnimation?: boolean;
  /** Show a skeleton/loading state instead of the grid (e.g. while data is streaming in). */
  loading?: boolean;
}

export interface AvanDateRangePickerProps
  extends
    Omit<AvanCalendarProps, 'mode' | 'value' | 'defaultValue' | 'onChange'>,
    AvanPickerOpenProps {
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

type AvanCalendarBaseProps = Omit<
  AvanCalendarProps,
  'mode' | 'value' | 'defaultValue' | 'onChange'
>;

export interface AvanMultiDatePickerProps
  extends
    Omit<AvanCalendarBaseProps, 'multipleValue' | 'defaultMultipleValue' | 'onMultipleChange'>,
    AvanPickerOpenProps {
  value?: Date[];
  defaultValue?: Date[];
  onChange?: (value: Date[]) => void;
  placeholder?: string;
}

export interface AvanWeekPickerProps
  extends
    Omit<AvanCalendarBaseProps, 'weekValue' | 'defaultWeekValue' | 'onWeekChange'>,
    AvanPickerOpenProps {
  value?: DateRangeValue;
  defaultValue?: DateRangeValue;
  onChange?: (value: DateRangeValue) => void;
  placeholder?: string;
}

export interface AvanMonthPickerProps
  extends
    Omit<AvanCalendarBaseProps, 'monthValue' | 'defaultMonthValue' | 'onMonthChange'>,
    AvanPickerOpenProps {
  value?: JalaliDate | null;
  defaultValue?: JalaliDate | null;
  onChange?: (value: JalaliDate | null) => void;
  placeholder?: string;
}

export interface AvanYearPickerProps
  extends
    Omit<AvanCalendarBaseProps, 'yearValue' | 'defaultYearValue' | 'onYearChange'>,
    AvanPickerOpenProps {
  value?: number | null;
  defaultValue?: number | null;
  onChange?: (value: number | null) => void;
  placeholder?: string;
}

// ---- Time picker ----

export type AvanTimeValue = { hour: number; minute: number; second?: number };

export interface AvanTimePickerProps {
  value?: AvanTimeValue | null;
  defaultValue?: AvanTimeValue | null;
  onChange?: (value: AvanTimeValue) => void;
  /** 12-hour with AM/PM, or 24-hour. Default: 24. */
  hourCycle?: 12 | 24;
  /** Show a seconds column. Default: false. */
  showSeconds?: boolean;
  /** Minute step, e.g. 5 or 15. Default: 1. */
  minuteStep?: number;
  minTime?: AvanTimeValue;
  maxTime?: AvanTimeValue;
  locale?: AvanLocale;
  dir?: 'rtl' | 'ltr';
  className?: string;
  disabled?: boolean;
}

export interface AvanDateTimePickerProps extends Omit<
  AvanDatePickerProps,
  'value' | 'defaultValue' | 'onChange'
> {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (value: Date | null) => void;
  hourCycle?: 12 | 24;
  showSeconds?: boolean;
  minuteStep?: number;
}
