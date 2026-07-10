# Localization

Avan's locale system controls month/weekday names, all UI strings, text direction, digit style
(Persian vs. Western), week start day, and weekend days — all from one `locale` prop.

## Built-in presets

| Key                 | Direction | Digits        | Week starts on | Weekend |
| ------------------- | --------- | ------------- | -------------- | ------- |
| `'fa-IR'` (default) | RTL       | Persian (۰-۹) | Saturday       | Friday  |
| `'en-IR'`           | LTR       | Western (0-9) | Saturday       | Friday  |

```tsx
<AvanProvider locale="fa-IR" />
<AvanProvider locale="en-IR" />
```

Any component can also override the provider's locale individually:

```tsx
<AvanDatePicker locale="en-IR" />
```

## Direction (RTL/LTR)

`dir` defaults to the locale's direction (`fa-IR` → `rtl`, `en-IR` → `ltr`) but can be set
independently — e.g. to show Persian month names in an LTR-flowing layout:

```tsx
<AvanCalendar locale="fa-IR" dir="ltr" />
```

## Partial overrides

Pass a partial object with `extends` to tweak just a few fields on top of a built-in preset —
useful for renaming a couple of strings without redefining everything:

```tsx
<AvanProvider
  locale={{
    extends: 'fa-IR',
    weekStartsOn: 1, // Monday-first instead of Saturday-first
    strings: { today: 'الان' },
  }}
/>
```

## Fully custom locale

For a language Avan doesn't ship (e.g. Dari/Pashto, or a fully custom English wording), provide
a complete `AvanLocaleDefinition`:

```ts
import type { AvanLocaleDefinition } from '@avan/react';

export const faAF: AvanLocaleDefinition = {
  code: 'fa-AF',
  dir: 'rtl',
  numerals: 'persian',
  weekStartsOn: 1, // Afghanistan: Monday-first week
  weekendDays: [4, 5], // Thursday + Friday
  strings: {
    months: [
      'حمل',
      'ثور',
      'جوزا',
      'سرطان',
      'اسد',
      'سنبله',
      'میزان',
      'عقرب',
      'قوس',
      'جدی',
      'دلو',
      'حوت',
    ],
    weekdays: ['د', 'س', 'چ', 'پ', 'ج', 'ش', 'ی'],
    weekdaysLong: ['دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه', 'یک‌شنبه'],
    today: 'امروز',
    clear: 'پاک کردن',
    previousMonth: 'ماه گذشته',
    nextMonth: 'ماه بعد',
    previousYear: 'سال گذشته',
    nextYear: 'سال بعد',
    previousPage: 'صفحه قبل',
    nextPage: 'صفحه بعد',
    selectMonth: 'ماه را انتخاب کنید',
    selectYear: 'سال را انتخاب کنید',
    selectWeek: 'هفته را انتخاب کنید',
    backToDays: 'بازگشت',
    from: 'از',
    to: 'الی',
    week: 'هفته',
    placeholderDate: 'تاریخ را انتخاب کنید',
    placeholderRange: 'یک بازه انتخاب کنید',
    placeholderMultiple: 'چند تاریخ انتخاب کنید',
    placeholderWeek: 'هفته را انتخاب کنید',
    placeholderMonth: 'ماه را انتخاب کنید',
    placeholderYear: 'سال را انتخاب کنید',
    hour: 'ساعت',
    minute: 'دقیقه',
    second: 'ثانیه',
    am: 'قبل از ظهر',
    pm: 'بعد از ظهر',
    clearSelection: 'حذف انتخاب',
    selectedAnnouncement: 'تاریخ انتخاب شده: {date}',
  },
};
```

```tsx
<AvanProvider locale={faAF} />
```

`AvanLocaleStrings` is fully typed — TypeScript will flag any missing string when you build a
locale from scratch.

## Week start & weekend days independent of locale

Both can be set directly on `AvanCalendar`/any picker without touching the locale object, e.g.
for an org that uses `fa-IR` strings but a Monday-first week:

```tsx
<AvanCalendar locale="fa-IR" weekStartsOn={1} weekendDays={[4, 5]} />
```

## Digits

`numerals: 'persian'` renders day numbers, year labels, and time values with Persian digits
(۰۱۲۳۴۵۶۷۸۹); `'western'` uses plain `0-9`. Parsing (`parseJalali`/`tryParseJalali` in
`@avan/core`, and the text-input mode of `AvanDatePicker`) accepts **either** digit style
regardless of the active locale.

```ts
import { toPersianDigits, toWesternDigits } from '@avan/core';

toPersianDigits('1405/01/01'); // '۱۴۰۵/۰۱/۰۱'
toWesternDigits('۱۴۰۵/۰۱/۰۱'); // '1405/01/01'
```

## Screen reader announcements

`selectedAnnouncement` (with a `{date}` placeholder) drives a live region announced whenever the
selection changes — translate it along with the rest of your custom locale so assistive
technology users get a localized confirmation.
