# API Reference

## Contents

- [`AvanProvider`](#avanprovider)
- [`AvanCalendar`](#avancalendar)
- [Pickers](#pickers)
  - [`AvanDatePicker`](#avandatepicker)
  - [`AvanDateRangePicker`](#avandaterangepicker)
  - [`AvanMultiDatePicker`](#avanmultidatepicker)
  - [`AvanWeekPicker`](#avanweekpicker)
  - [`AvanMonthPicker`](#avanmonthpicker)
  - [`AvanYearPicker`](#avanyearpicker)
  - [`AvanTimePicker`](#avantimepicker)
  - [`AvanDateTimePicker`](#avandatetimepicker)
- [Shared picker props](#shared-picker-props-avanpickeropenprops)
- [Constraints](#constraints-avandateconstraints)
- [Custom rendering (`components`)](#custom-rendering-components)
- [Hooks](#hooks)
- [`@avan/core`](#avancore)
- [`@avan/holidays`](#avanholidays)
- [`@avan/travel`](#avantravel)

---

## `AvanProvider`

Provides the default locale, direction, theme, and color scheme to every Avan component
underneath it. All of its props can still be overridden per-component.

```tsx
<AvanProvider locale="fa-IR" dir="rtl" colorScheme="light" theme={{ accent: '#2563eb' }}>
  {children}
</AvanProvider>
```

| Prop          | Type                            | Default     | Description                                           |
| ------------- | ------------------------------- | ----------- | ----------------------------------------------------- |
| `locale`      | `AvanLocale`                    | `'fa-IR'`   | Preset key, full definition, or partial override      |
| `dir`         | `'rtl' \| 'ltr'`                | from locale | Text direction override                               |
| `theme`       | `AvanTheme`                     | —           | CSS variable overrides (see [Theming](./theming.md))  |
| `colorScheme` | `'light' \| 'dark' \| 'system'` | `'light'`   | Sets `data-color-scheme`/`data-theme` on the root div |
| `children`    | `ReactNode`                     | —           |                                                       |

---

## `AvanCalendar`

The core calendar grid. Every picker is a thin wrapper around it — use it directly for a fully
inline, trigger-less calendar.

### Selection

| Prop                                                                | Type                                                                               | Description                                         |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------- |
| `mode`                                                              | `'single' \| 'multiple' \| 'range' \| 'multiRange' \| 'week' \| 'month' \| 'year'` | Default `'single'`                                  |
| `value` / `defaultValue` / `onChange`                               | `Date \| null`                                                                     | Single mode                                         |
| `rangeValue` / `defaultRangeValue` / `onRangeChange`                | `DateRangeValue`                                                                   | Range mode                                          |
| `multipleValue` / `defaultMultipleValue` / `onMultipleChange`       | `Date[]`                                                                           | Multiple mode                                       |
| `maxMultipleCount`                                                  | `number`                                                                           | Cap selectable dates in multiple mode               |
| `multiRangeValue` / `defaultMultiRangeValue` / `onMultiRangeChange` | `DateRangeValue[]`                                                                 | Multiple disjoint ranges                            |
| `maxRangeCount`                                                     | `number`                                                                           | Cap number of ranges in multi-range mode            |
| `weekValue` / `defaultWeekValue` / `onWeekChange`                   | `DateRangeValue`                                                                   | Week mode — clicking any day selects its whole week |
| `monthValue` / `defaultMonthValue` / `onMonthChange`                | `JalaliDate \| null`                                                               | Month mode — renders a month grid, no day grid      |
| `yearValue` / `defaultYearValue` / `onYearChange`                   | `number \| null`                                                                   | Year mode — renders a year grid, no day grid        |

### Display

| Prop                                    | Type                    | Default                             | Description                                                      |
| --------------------------------------- | ----------------------- | ----------------------------------- | ---------------------------------------------------------------- |
| `numberOfMonths`                        | `1 \| 2 \| 3 \| 4`      | `1`                                 | Show N consecutive months side by side                           |
| `visibleMonth` / `onVisibleMonthChange` | `JalaliDate`            | current month                       | Controls which month(s) are shown                                |
| `weekStartsOn`                          | `number` (0=Sun..6=Sat) | from locale (6, Saturday)           | First day of the week                                            |
| `weekendDays`                           | `readonly number[]`     | from locale (`[5]`, Friday)         | Days styled as weekend                                           |
| `holidays`                              | `AvanHoliday[]`         | bundled 1404–1406 + visible year(s) | Pass `[]` to hide holiday markers                                |
| `showTodayButton`                       | `boolean`               | `false`                             | Footer "Today" quick-jump                                        |
| `showClearButton`                       | `boolean`               | `false`                             | Footer "Clear" button, shown only when there's a selection       |
| `disableAnimation`                      | `boolean`               | `false`                             | Force-disable transitions regardless of `prefers-reduced-motion` |
| `loading`                               | `boolean`               | `false`                             | Renders a skeleton grid instead of days                          |
| `enableSwipeNavigation`                 | `boolean`               | `true`                              | Touch swipe left/right changes month (RTL-aware)                 |
| `enableWheelNavigation`                 | `boolean`               | `false`                             | Mouse wheel changes month                                        |

### Constraints, locale, theme

See [Constraints](#constraints-avandateconstraints) and [Localization](./localization.md).
`locale`, `dir`, `theme`, and `className` are also accepted directly.

### Metadata & custom rendering

| Prop         | Type                                       | Description                                                                       |
| ------------ | ------------------------------------------ | --------------------------------------------------------------------------------- |
| `getDayMeta` | `(date: Date) => AvanDayMeta \| undefined` | Attach badges, pricing, availability, tooltips, or a forced-disabled flag per day |
| `components` | `AvanCalendarComponents`                   | Override day content, nav buttons, caption, or footer rendering — see below       |

---

## Pickers

All pickers accept every `AvanCalendar` prop relevant to their mode (constraints, locale,
`numberOfMonths`, `getDayMeta`, `components`, etc.) plus the [shared picker
props](#shared-picker-props-avanpickeropenprops) below.

### `AvanDatePicker`

```tsx
<AvanDatePicker
  value={date}
  onChange={setDate}
  display="popover"
  allowTextInput
  placeholder="Select a date"
/>
```

| Prop                                  | Type           | Description                    |
| ------------------------------------- | -------------- | ------------------------------ |
| `value` / `defaultValue` / `onChange` | `Date \| null` |                                |
| `placeholder`                         | `string`       | Trigger/input placeholder text |

### `AvanDateRangePicker`

```tsx
<AvanDateRangePicker value={range} onChange={setRange} numberOfMonths={2} />
```

| Prop                                  | Type             | Description                                |
| ------------------------------------- | ---------------- | ------------------------------------------ |
| `value` / `defaultValue` / `onChange` | `DateRangeValue` | `{ from: Date \| null; to: Date \| null }` |
| `placeholder`                         | `string`         |                                            |

### `AvanMultiDatePicker`

| Prop                                  | Type     | Description |
| ------------------------------------- | -------- | ----------- |
| `value` / `defaultValue` / `onChange` | `Date[]` |             |
| `placeholder`                         | `string` |             |

### `AvanWeekPicker`

| Prop                                  | Type             | Description                   |
| ------------------------------------- | ---------------- | ----------------------------- |
| `value` / `defaultValue` / `onChange` | `DateRangeValue` | The selected week's start/end |
| `placeholder`                         | `string`         |                               |

### `AvanMonthPicker`

| Prop                                  | Type                 | Description |
| ------------------------------------- | -------------------- | ----------- |
| `value` / `defaultValue` / `onChange` | `JalaliDate \| null` |             |
| `placeholder`                         | `string`             |             |

### `AvanYearPicker`

| Prop                                  | Type             | Description |
| ------------------------------------- | ---------------- | ----------- |
| `value` / `defaultValue` / `onChange` | `number \| null` |             |
| `placeholder`                         | `string`         |             |

### `AvanTimePicker`

```tsx
<AvanTimePicker value={time} onChange={setTime} hourCycle={12} showSeconds minuteStep={5} />
```

| Prop                                     | Type                    | Default | Description                     |
| ---------------------------------------- | ----------------------- | ------- | ------------------------------- |
| `value` / `defaultValue` / `onChange`    | `AvanTimeValue \| null` |         | `{ hour, minute, second? }`     |
| `hourCycle`                              | `12 \| 24`              | `24`    | 12-hour renders an AM/PM toggle |
| `showSeconds`                            | `boolean`               | `false` |                                 |
| `minuteStep`                             | `number`                | `1`     | e.g. `5` or `15`                |
| `minTime` / `maxTime`                    | `AvanTimeValue`         |         | Clamp selectable range          |
| `locale`, `dir`, `className`, `disabled` |                         |         |                                 |

### `AvanDateTimePicker`

Combines a calendar (single mode) with an `AvanTimePicker` in one popover/inline widget.

| Prop                                     | Type           | Description                           |
| ---------------------------------------- | -------------- | ------------------------------------- |
| `value` / `defaultValue` / `onChange`    | `Date \| null` | Full date + time                      |
| `hourCycle`, `showSeconds`, `minuteStep` |                | Forwarded to the internal time picker |

---

## Shared picker props (`AvanPickerOpenProps`)

Every picker component (except `AvanCalendar` and `AvanTimePicker`, which have no trigger)
accepts:

| Prop                                    | Type                    | Default        | Description                                                                          |
| --------------------------------------- | ----------------------- | -------------- | ------------------------------------------------------------------------------------ |
| `display`                               | `'inline' \| 'popover'` | `'inline'`     | `inline` always renders the calendar; `popover` opens it from a trigger button/input |
| `open` / `defaultOpen` / `onOpenChange` | `boolean`               | —              | Controlled/uncontrolled open state for `display="popover"`                           |
| `closeOnSelect`                         | `boolean`               | `true`         | Close the popover once a full selection is made                                      |
| `allowTextInput`                        | `boolean`               | `false`        | (`AvanDatePicker` only) Renders a text `<input>` trigger that parses typed dates     |
| `inputFormat`                           | `string`                | `'yyyy/MM/dd'` | `date-fns-jalali` format token used by the text input                                |

---

## Constraints (`AvanDateConstraints`)

Shared by `AvanCalendar` and every picker.

| Prop               | Type                      | Description                                                       |
| ------------------ | ------------------------- | ----------------------------------------------------------------- |
| `minDate`          | `Date`                    | Earliest selectable date (inclusive)                              |
| `maxDate`          | `Date`                    | Latest selectable date (inclusive)                                |
| `isDateDisabled`   | `(date: Date) => boolean` | Arbitrary predicate, combined with everything else below          |
| `disabledDates`    | `Date[]`                  | Specific disabled calendar days                                   |
| `disabledWeekdays` | `number[]`                | JS `Date#getDay()` indices (0=Sun..6=Sat), e.g. `[5]` for Fridays |
| `disabledRanges`   | `DateRangeValue[]`        | One or more disabled date ranges                                  |

All constraints combine (a day is disabled if _any_ rule disables it). `minYear`/`maxYear` are
deprecated aliases that only bound the year picker — prefer `minDate`/`maxDate`.

---

## Custom rendering (`components`)

Swap out individual pieces of the calendar without forking the whole component:

```tsx
<AvanCalendar
  components={{
    DayContent: ({ day, meta, isSelected }) => (
      <>
        {day.date.jalali.day}
        {meta?.price ? <small>{meta.price.label}</small> : null}
      </>
    ),
    Footer: ({ selectedCount }) => <p>{selectedCount} selected</p>,
  }}
/>
```

| Key          | Signature                                                                  | Replaces                                                                    |
| ------------ | -------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `DayContent` | `(ctx: AvanDayRenderContext) => ReactNode`                                 | Only the content inside a day button (button/classes/handlers stay default) |
| `Day`        | `(ctx: AvanDayRenderContext & { defaultContent: ReactNode }) => ReactNode` | The entire day cell, including the button itself                            |
| `NavButton`  | `(props: AvanNavButtonRenderProps) => ReactNode`                           | Previous/next month buttons                                                 |
| `Caption`    | `(props: AvanCaptionRenderProps) => ReactNode`                             | The month/year caption row                                                  |
| `Footer`     | `(props: AvanFooterRenderProps) => ReactNode`                              | The footer slot (in addition to/instead of Today/Clear buttons)             |

`AvanDayRenderContext` gives you `day` (`CalendarDay` from `@avan/core`), `isSelected`,
`isRangeStart`, `isRangeEnd`, `isInRange`, `isDisabled`, `isOutside`, `holiday`, and `meta`
(whatever `getDayMeta` returned for that day).

---

## Hooks

### `useAvanCalendar`

The headless hook that powers `AvanCalendar`. Use it to build a fully custom UI while reusing
Avan's date logic (selection state, month grid, navigation).

```tsx
import { useAvanCalendar } from '@avan/react/client';

const calendar = useAvanCalendar({
  mode: 'range',
  numberOfMonths: 2,
  rangeValue,
  onRangeChange: setRangeValue,
});
```

Returns `visibleMonth`, `monthPanels` (one `{ month, weeks }` per visible month),
`setVisibleMonth`, `goToPreviousMonth`/`goToNextMonth`, `goToPreviousYear`/`goToNextYear`,
`goToday`, `selectDate`, `selectMonthValue`, `selectYearValue`, and `getDayState(day)`.

### `useAvanContext`

Reads the nearest `<AvanProvider>` value (`{ locale, dir, theme }`) directly.

### Utilities

- `resolveLocale(locale?: AvanLocale): AvanLocaleDefinition` — normalize any locale input to a
  concrete definition.
- `AVAN_LOCALE_PRESETS` — the built-in `{ 'fa-IR': ..., 'en-IR': ... }` map.
- `createDisabledResolver(constraints: AvanDateConstraints): (date: Date) => boolean` — combine
  every constraint into a single predicate (used internally, exported for custom UIs).
- `formatJalaliDisplay(date, dirOrLocale, format?)` / `formatNumberDisplay(value, dirOrLocale)` —
  locale-aware formatting helpers (Persian vs. Western digits).

---

## `@avan/core`

Framework-agnostic Jalali date utilities — no React dependency.

```ts
import {
  toJalali,
  toGregorian,
  formatJalali,
  formatJalaliISO,
  parseJalali,
  tryParseJalali,
  isValidJalali,
  getMonthGrid,
  addJalaliMonths,
  daysInJalaliMonth,
  isJalaliLeapYear,
  startOfJalaliWeek,
  endOfJalaliWeek,
  getWeekdayIndex,
  toPersianDigits,
  toWesternDigits,
  isBusinessDay,
  addBusinessDays,
  countBusinessDays,
  getFiscalYearBounds,
  getJalaliQuarter,
  daysInJalaliYear,
  compareJalali,
  getDaysInRange,
} from '@avan/core';
```

| Function                                | Signature                                                  | Description                                                                                     |
| --------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `toJalali`                              | `(date: Date) => JalaliDate`                               | Gregorian → Jalali                                                                              |
| `toGregorian`                           | `(jalali: JalaliDate) => Date`                             | Jalali → Gregorian                                                                              |
| `formatJalali`                          | `(date: Date, pattern?: string) => string`                 | Format using `date-fns-jalali` tokens (default `yyyy/MM/dd`)                                    |
| `formatJalaliISO`                       | `(date: Date) => string`                                   | `YYYY-MM-DD` Jalali ISO string                                                                  |
| `parseJalali`                           | `(input: string) => AvanDate`                              | Parse `YYYY/MM/DD` or `YYYY-MM-DD` (Persian or Western digits); throws on invalid input         |
| `tryParseJalali`                        | `(input: string) => AvanDate \| null`                      | Same, returns `null` instead of throwing                                                        |
| `isValidJalali`                         | `(jalali: JalaliDate) => boolean`                          | Validates day-of-month bounds, including leap years                                             |
| `getMonthGrid`                          | `(year, month, options?) => CalendarDay[][]`               | 6×7 grid for a Jalali month; `options` = `{ today, isDateDisabled, weekStartsOn, weekendDays }` |
| `addJalaliMonths`                       | `(jalali: JalaliDate, amount: number) => JalaliDate`       | Add/subtract months, clamping the day to the target month's length                              |
| `daysInJalaliMonth`                     | `(year: number, month: number) => number`                  | 29–31                                                                                           |
| `isJalaliLeapYear`                      | `(year: number) => boolean`                                |                                                                                                 |
| `startOfJalaliWeek` / `endOfJalaliWeek` | `(date: Date, weekStartsOn?: number) => Date`              |                                                                                                 |
| `getWeekdayIndex`                       | `(date: Date, weekStartsOn?: number) => number`            | 0-based index relative to `weekStartsOn`                                                        |
| `toPersianDigits` / `toWesternDigits`   | `(input: string \| number) => string`                      | Digit conversion                                                                                |
| `isBusinessDay`                         | `(date: Date, options?: BusinessDayOptions) => boolean`    | Default: Friday-only weekend                                                                    |
| `addBusinessDays`                       | `(date: Date, amount: number, options?) => Date`           | Skips weekends/holidays                                                                         |
| `countBusinessDays`                     | `(from: Date, to: Date, options?) => number`               | Inclusive of `from`, exclusive of `to`                                                          |
| `getFiscalYearBounds`                   | `(year: number) => { start: JalaliDate; end: JalaliDate }` | Iran's fiscal year = calendar year                                                              |
| `getJalaliQuarter`                      | `(month: number) => 1 \| 2 \| 3 \| 4`                      |                                                                                                 |
| `daysInJalaliYear`                      | `(year: number) => number`                                 | 365 or 366                                                                                      |
| `compareJalali`                         | `(a: JalaliDate, b: JalaliDate) => -1 \| 0 \| 1`           |                                                                                                 |
| `getDaysInRange`                        | `(from: Date, to: Date) => Date[]`                         | Inclusive, order-independent                                                                    |

Key types: `JalaliDate { year, month, day }`, `AvanDate { gregorian: Date; jalali: JalaliDate }`,
`CalendarDay { date: AvanDate; isCurrentMonth; isToday; isWeekend; isDisabled }`.

---

## `@avan/holidays`

```ts
import {
  getIranHolidays,
  isHoliday,
  getHolidayForDate,
  getFixedSolarIranHolidays,
} from '@avan/holidays';
```

| Function                    | Signature                                                           | Description                                                                         |
| --------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `getIranHolidays`           | `(jalaliYear: number) => AvanHoliday[]`                             | Official calendar for 1404–1406; falls back to fixed solar holidays for other years |
| `isHoliday`                 | `(date: Date, holidays: AvanHoliday[]) => boolean`                  |                                                                                     |
| `getHolidayForDate`         | `(date: Date, holidays: AvanHoliday[]) => AvanHoliday \| undefined` |                                                                                     |
| `getFixedSolarIranHolidays` | `(jalaliYear: number) => AvanHoliday[]`                             | Holidays that repeat on the same Jalali month/day every year                        |

`AvanHoliday { date: string; title: string; titleEn?: string; type: 'public' \| 'religious' \| 'cultural'; tentative?: boolean }`

`AvanCalendar` loads this automatically (bundled years + whatever year(s) are currently
visible) — pass your own `holidays` array to override, or `holidays={[]}` to hide markers.

---

## `@avan/travel`

Booking/pricing helpers that plug straight into `getDayMeta`.

```ts
import {
  validateTravelRange,
  isRangeAvailable,
  computeRangePrice,
  findLowestPriceInMonth,
  createPriceDayMeta,
  TravelRangeError,
} from '@avan/travel';
```

| Function                 | Signature                                                        | Description                                                                 |
| ------------------------ | ---------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `validateTravelRange`    | `(from, to, rules?, getPriceForDate?) => void`                   | Throws `TravelRangeError` on any rule violation                             |
| `isRangeAvailable`       | `(from, to, rules?, getPriceForDate?) => boolean`                | Same checks, returns a boolean                                              |
| `computeRangePrice`      | `(from, to, getPriceForDate, rules?) => RangePriceSummary`       | Validates then sums nightly prices                                          |
| `findLowestPriceInMonth` | `(year, month, getPriceForDate) => { date; price } \| undefined` | For "from ¥X" badges                                                        |
| `createPriceDayMeta`     | `(getPriceForDate) => AvanGetDayMeta`                            | Bridges a pricing function directly into `AvanCalendar`'s `getDayMeta` prop |

`TravelRules { minNights?; maxNights?; disabledDates?; allowedCheckInWeekdays?; businessDaysOnly? }`

See [Recipes → Travel booking](./recipes.md#travel--hotel-booking-calendar) for a full example.
