/**
 * Locale system for Avan. Ships two presets (`fa-IR`, `en-IR`) but accepts a fully
 * custom `AvanLocaleDefinition` (or a partial override merged onto a preset) so apps can
 * support other languages/regions without forking the library.
 */

export type AvanLocaleKey = 'fa-IR' | 'en-IR';

export interface AvanLocaleStrings {
  /** Full month names, Farvardin (index 0) … Esfand (index 11). */
  months: readonly string[];
  /** Abbreviated weekday labels, starting from `weekStartsOn`. */
  weekdays: readonly string[];
  /** Full weekday names, starting from `weekStartsOn`. Used for `aria-label`s. */
  weekdaysLong: readonly string[];
  today: string;
  clear: string;
  previousMonth: string;
  nextMonth: string;
  previousYear: string;
  nextYear: string;
  previousPage: string;
  nextPage: string;
  selectMonth: string;
  selectYear: string;
  selectWeek: string;
  backToDays: string;
  from: string;
  to: string;
  week: string;
  placeholderDate: string;
  placeholderRange: string;
  placeholderMultiple: string;
  placeholderWeek: string;
  placeholderMonth: string;
  placeholderYear: string;
  hour: string;
  minute: string;
  second: string;
  am: string;
  pm: string;
  clearSelection: string;
  /** Announced by screen readers when the selection changes. `{date}` is interpolated. */
  selectedAnnouncement: string;
}

export interface AvanLocaleDefinition {
  /** BCP-47-ish code, purely informational (e.g. `fa-IR`, `ps-AF`). */
  code: string;
  dir: 'rtl' | 'ltr';
  numerals: 'persian' | 'western';
  /** JS `Date#getDay()` index (0=Sun..6=Sat) that starts the week. */
  weekStartsOn: number;
  /** JS `Date#getDay()` indices treated as the weekend. */
  weekendDays: readonly number[];
  strings: AvanLocaleStrings;
}

const FA_STRINGS: AvanLocaleStrings = {
  months: [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
  ],
  weekdays: ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'],
  weekdaysLong: ['شنبه', 'یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'],
  today: 'امروز',
  clear: 'پاک کردن',
  previousMonth: 'ماه قبل',
  nextMonth: 'ماه بعد',
  previousYear: 'سال قبل',
  nextYear: 'سال بعد',
  previousPage: 'صفحه قبل',
  nextPage: 'صفحه بعد',
  selectMonth: 'انتخاب ماه',
  selectYear: 'انتخاب سال',
  selectWeek: 'انتخاب هفته',
  backToDays: 'بازگشت به تقویم',
  from: 'از',
  to: 'تا',
  week: 'هفته',
  placeholderDate: 'انتخاب تاریخ',
  placeholderRange: 'انتخاب بازه تاریخ',
  placeholderMultiple: 'انتخاب چند تاریخ',
  placeholderWeek: 'انتخاب هفته',
  placeholderMonth: 'انتخاب ماه',
  placeholderYear: 'انتخاب سال',
  hour: 'ساعت',
  minute: 'دقیقه',
  second: 'ثانیه',
  am: 'ق.ظ',
  pm: 'ب.ظ',
  clearSelection: 'پاک کردن انتخاب',
  selectedAnnouncement: 'تاریخ انتخاب‌شده: {date}',
};

const EN_STRINGS: AvanLocaleStrings = {
  months: [
    'Farvardin',
    'Ordibehesht',
    'Khordad',
    'Tir',
    'Mordad',
    'Shahrivar',
    'Mehr',
    'Aban',
    'Azar',
    'Dey',
    'Bahman',
    'Esfand',
  ],
  weekdays: ['Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr'],
  weekdaysLong: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  today: 'Today',
  clear: 'Clear',
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  previousYear: 'Previous year',
  nextYear: 'Next year',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  selectMonth: 'Select month',
  selectYear: 'Select year',
  selectWeek: 'Select week',
  backToDays: 'Back to calendar',
  from: 'From',
  to: 'To',
  week: 'Week',
  placeholderDate: 'Select a date',
  placeholderRange: 'Select a date range',
  placeholderMultiple: 'Select dates',
  placeholderWeek: 'Select a week',
  placeholderMonth: 'Select a month',
  placeholderYear: 'Select a year',
  hour: 'Hour',
  minute: 'Minute',
  second: 'Second',
  am: 'AM',
  pm: 'PM',
  clearSelection: 'Clear selection',
  selectedAnnouncement: 'Selected date: {date}',
};

export const AVAN_LOCALE_PRESETS: Record<AvanLocaleKey, AvanLocaleDefinition> = {
  'fa-IR': {
    code: 'fa-IR',
    dir: 'rtl',
    numerals: 'persian',
    weekStartsOn: 6,
    weekendDays: [5],
    strings: FA_STRINGS,
  },
  'en-IR': {
    code: 'en-IR',
    dir: 'ltr',
    numerals: 'western',
    weekStartsOn: 6,
    weekendDays: [5],
    strings: EN_STRINGS,
  },
};

/** Either a built-in preset key, a full custom locale, or a partial override merged onto `fa-IR`. */
export type AvanLocale =
  | AvanLocaleKey
  | AvanLocaleDefinition
  | (Partial<Omit<AvanLocaleDefinition, 'strings'>> & {
      strings?: Partial<AvanLocaleStrings>;
      /** Base preset to merge partial overrides onto. Default: `fa-IR`. */
      extends?: AvanLocaleKey;
    });

function isFullLocaleDefinition(value: object): value is AvanLocaleDefinition {
  return (
    'strings' in value &&
    'code' in value &&
    'dir' in value &&
    typeof (value as { strings?: unknown }).strings === 'object' &&
    (value as { strings?: AvanLocaleStrings }).strings != null &&
    Array.isArray((value as { strings: AvanLocaleStrings }).strings.months)
  );
}

/** Resolve any `AvanLocale` value (preset key, partial override, or full definition) to a concrete definition. */
export function resolveLocale(locale?: AvanLocale): AvanLocaleDefinition {
  if (!locale) {
    return AVAN_LOCALE_PRESETS['fa-IR'];
  }

  if (typeof locale === 'string') {
    return AVAN_LOCALE_PRESETS[locale] ?? AVAN_LOCALE_PRESETS['fa-IR'];
  }

  if (isFullLocaleDefinition(locale)) {
    return locale;
  }

  const base = AVAN_LOCALE_PRESETS[locale.extends ?? 'fa-IR'];

  return {
    ...base,
    ...locale,
    strings: { ...base.strings, ...locale.strings },
  };
}

/** Interpolate `{date}` (and other `{key}`) placeholders in a locale string template. */
export function formatLocaleString(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}
