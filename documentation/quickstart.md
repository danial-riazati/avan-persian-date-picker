# Quickstart

Every example below assumes:

```tsx
'use client';

import '@avan/themes/default.css';
import '@avan/react/client.css';
import { AvanProvider } from '@avan/react/client';
```

Wrap your app (or the part of it that uses Avan) once in an `<AvanProvider>` to set the default
locale, text direction, and theme:

```tsx
<AvanProvider dir="rtl" locale="fa-IR">
  {/* your app */}
</AvanProvider>
```

## Single date

```tsx
import { useState } from 'react';
import { AvanDatePicker } from '@avan/react/client';

function Example() {
  const [date, setDate] = useState<Date | null>(null);
  return <AvanDatePicker value={date} onChange={setDate} display="popover" />;
}
```

## Date range

```tsx
import { useState } from 'react';
import { AvanDateRangePicker } from '@avan/react/client';
import type { DateRangeValue } from '@avan/react';

function Example() {
  const [range, setRange] = useState<DateRangeValue>({ from: null, to: null });
  return (
    <AvanDateRangePicker value={range} onChange={setRange} display="popover" numberOfMonths={2} />
  );
}
```

## Multiple dates

```tsx
import { useState } from 'react';
import { AvanMultiDatePicker } from '@avan/react/client';

function Example() {
  const [dates, setDates] = useState<Date[]>([]);
  return <AvanMultiDatePicker value={dates} onChange={setDates} />;
}
```

## A whole week

```tsx
import { useState } from 'react';
import { AvanWeekPicker } from '@avan/react/client';
import type { DateRangeValue } from '@avan/react';

function Example() {
  const [week, setWeek] = useState<DateRangeValue>({ from: null, to: null });
  return <AvanWeekPicker value={week} onChange={setWeek} />;
}
```

## Month or year only

```tsx
import { useState } from 'react';
import { AvanMonthPicker, AvanYearPicker } from '@avan/react/client';
import type { JalaliDate } from '@avan/react';

function Example() {
  const [month, setMonth] = useState<JalaliDate | null>(null);
  const [year, setYear] = useState<number | null>(null);
  return (
    <>
      <AvanMonthPicker value={month} onChange={setMonth} />
      <AvanYearPicker value={year} onChange={setYear} />
    </>
  );
}
```

## Time and date + time

```tsx
import { useState } from 'react';
import { AvanTimePicker, AvanDateTimePicker } from '@avan/react/client';
import type { AvanTimeValue } from '@avan/react';

function Example() {
  const [time, setTime] = useState<AvanTimeValue | null>(null);
  const [dateTime, setDateTime] = useState<Date | null>(null);
  return (
    <>
      <AvanTimePicker value={time} onChange={setTime} hourCycle={24} showSeconds />
      <AvanDateTimePicker value={dateTime} onChange={setDateTime} display="popover" />
    </>
  );
}
```

## Just the calendar grid (headless-ish)

Every picker above wraps `<AvanCalendar>`. Use it directly for a fully inline calendar (no
input/trigger), e.g. embedded in a sidebar:

```tsx
import { AvanCalendar } from '@avan/react/client';

function Example() {
  return <AvanCalendar mode="range" numberOfMonths={2} showTodayButton showClearButton />;
}
```

## Constraints (min/max/disabled dates)

```tsx
import { AvanDatePicker } from '@avan/react/client';
import { toGregorian } from '@avan/core';

<AvanDatePicker
  minDate={new Date()}
  maxDate={toGregorian({ year: 1405, month: 6, day: 31 })}
  disabledWeekdays={[5]} // Fridays
  isDateDisabled={(date) => date.getDate() === 13}
/>;
```

## Uncontrolled usage

Every picker also supports `defaultValue` for uncontrolled usage, mirroring native form inputs:

```tsx
<AvanDatePicker defaultValue={new Date()} onChange={(date) => console.log(date)} />
```

## Next steps

- Full prop tables: [API Reference](./api-reference.md)
- Colors, dark mode, custom CSS variables: [Theming](./theming.md)
- Other languages, custom week start, RTL/LTR: [Localization](./localization.md)
- Booking/pricing calendars: [Recipes](./recipes.md)
