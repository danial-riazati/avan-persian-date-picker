# @avan-persian/holidays

Official Iran public holiday datasets (Jalali calendar) for
[Avan Persian Date Picker](https://github.com/danial-riazati/avan-persian-date-picker). Used
automatically by `@avan-persian/react` calendars, or standalone in any project that needs Iran holiday
data.

## Install

```bash
pnpm add @avan-persian/holidays
```

## Quick example

```ts
import { getIranHolidays, isHoliday, getHolidayForDate } from '@avan-persian/holidays';

const holidays1405 = getIranHolidays(1405); // AvanHoliday[] for the Jalali year 1405
isHoliday(new Date(), holidays1405); // boolean
getHolidayForDate(new Date(), holidays1405); // AvanHoliday | undefined
```

Bundled published-calendar years (`1404`–`1406`) are available directly as JSON:

```ts
import holidays1405 from '@avan-persian/holidays/1405';
```

Years outside the bundled range fall back to fixed solar (Nowruz, etc.) holidays automatically.

## License

MIT © [Danial Riazati](https://github.com/danial-riazati)
