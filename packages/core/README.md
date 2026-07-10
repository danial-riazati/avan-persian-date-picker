# @avan/core

Headless Jalali (Persian/Shamsi) date utilities — the calendar-math engine behind
[Avan Persian Date Picker](https://github.com/danial-riazati/avan-persian-date-picker). Zero UI,
zero dependencies beyond `date-fns-jalali`, fully tree-shakeable.

## Install

```bash
pnpm add @avan/core
```

## What's inside

- **Conversion** — `toJalali`, `toGregorian`, `formatJalali`, `parseJalali`, `tryParseJalali`
- **Grid** — `getMonthGrid`, `addJalaliMonths`, `startOfJalaliWeek`, `endOfJalaliWeek`, configurable
  `weekStartsOn`
- **Business logic** — `isBusinessDay`, `daysInJalaliYear`, `isJalaliLeapYear`,
  `getJalaliFiscalYearBounds`, `getJalaliQuarter`, day-range enumeration
- **Digits** — `toPersianDigits` / `toWesternDigits` for locale-aware numeral formatting

## Quick example

```ts
import { toJalali, formatJalali, getMonthGrid } from '@avan/core';

const j = toJalali(new Date()); // { year, month, day }
formatJalali(new Date(), 'yyyy/MM/dd'); // "1405/04/19"
getMonthGrid(1405, 4); // 6 weeks × 7 CalendarDay cells, ready to render
```

## Docs

Full API reference: [documentation/api-reference.md](https://github.com/danial-riazati/avan-persian-date-picker/blob/main/documentation/api-reference.md#avancore)

## License

MIT © [Danial Riazati](https://github.com/danial-riazati)
