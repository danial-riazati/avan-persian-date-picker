# Recipes

Real-world patterns built from the pieces documented in the [API Reference](./api-reference.md).

## Travel / hotel booking calendar

`@avan-persian/travel` bridges a pricing function straight into `AvanCalendar#getDayMeta`, and validates
booking rules (min/max nights, blackout dates, business-days-only, check-in weekday) before you
commit a reservation.

```tsx
'use client';

import { useMemo, useState } from 'react';
import { AvanDateRangePicker, AvanProvider } from '@avan-persian/react/client';
import {
  createPriceDayMeta,
  computeRangePrice,
  isRangeAvailable,
  type GetPriceForDate,
  type TravelRules,
} from '@avan-persian/travel';
import { toJalali } from '@avan-persian/core';
import type { DateRangeValue } from '@avan-persian/react';
import '@avan-persian/themes/default.css';
import '@avan-persian/react/client.css';

const rules: TravelRules = { minNights: 2, maxNights: 14, allowedCheckInWeekdays: [4, 5, 6] };

const getPriceForDate: GetPriceForDate = (date) => {
  const { day } = toJalali(date);
  const isWeekendRate = day % 7 === 0;
  return {
    amount: isWeekendRate ? 3_200_000 : 2_400_000,
    currency: 'IRR',
    label: isWeekendRate ? '۳.۲M' : '۲.۴M',
    availability: day === 13 ? 'full' : 'available',
  };
};

export function HotelBookingCalendar() {
  const [range, setRange] = useState<DateRangeValue>({ from: null, to: null });
  const getDayMeta = useMemo(() => createPriceDayMeta(getPriceForDate), []);

  const summary =
    range.from && range.to && isRangeAvailable(range.from, range.to, rules, getPriceForDate)
      ? computeRangePrice(range.from, range.to, getPriceForDate, rules)
      : null;

  return (
    <AvanProvider dir="rtl" locale="fa-IR">
      <AvanDateRangePicker
        value={range}
        onChange={setRange}
        numberOfMonths={2}
        getDayMeta={getDayMeta}
      />
      {summary ? (
        <p>
          {summary.nights} شب — جمع: {summary.totalPrice.toLocaleString()} {summary.currency}
        </p>
      ) : null}
    </AvanProvider>
  );
}
```

## E-commerce delivery slot picker

A single-date picker that disables past days, blackout dates (e.g. holidays with no delivery
crew), and shows a "fastest delivery" badge:

```tsx
'use client';

import { useState } from 'react';
import { AvanDatePicker, AvanProvider } from '@avan-persian/react/client';
import { getIranHolidays, isHoliday } from '@avan-persian/holidays';
import { toJalali } from '@avan-persian/core';

const holidays = getIranHolidays(1405);

export function DeliveryDatePicker() {
  const [date, setDate] = useState<Date | null>(null);
  const today = new Date();

  return (
    <AvanProvider dir="rtl" locale="fa-IR">
      <AvanDatePicker
        value={date}
        onChange={setDate}
        minDate={today}
        isDateDisabled={(d) => isHoliday(d, holidays)}
        getDayMeta={(d) => {
          const daysFromNow = Math.round((d.getTime() - today.getTime()) / 86_400_000);
          return daysFromNow === 1
            ? { badge: '⚡ سریع‌ترین', className: 'fastest-delivery' }
            : undefined;
        }}
      />
    </AvanProvider>
  );
}
```

## Inside a form (react-hook-form)

Any picker's `value`/`onChange` shape is a plain `Date` (or `DateRangeValue`/`Date[]`), so it
drops directly into `Controller`:

```tsx
import { Controller, useForm } from 'react-hook-form';
import { AvanDatePicker } from '@avan-persian/react/client';

function BirthDateField() {
  const { control } = useForm<{ birthDate: Date | null }>();
  return (
    <Controller
      name="birthDate"
      control={control}
      rules={{ required: true }}
      render={({ field }) => (
        <AvanDatePicker value={field.value} onChange={field.onChange} display="popover" />
      )}
    />
  );
}
```

## Inside a modal/dialog

`display="inline"` avoids nested popovers/z-index fights inside a modal — render the calendar
directly in the dialog body:

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <AvanDateRangePicker display="inline" value={range} onChange={setRange} />
    <button onClick={confirm}>Confirm</button>
  </DialogContent>
</Dialog>
```

If you do need `display="popover"` inside a dialog, Avan's popover already traps focus and
restores it to the trigger on close, so it composes safely with most dialog implementations —
just make sure the dialog's own focus trap doesn't fight with Avan's (most headless dialog
libraries release their trap while a nested one is open, e.g. via `Radix`'s `Portal`).

## Multi-city / disjoint ranges

`mode="multiRange"` lets users pick several independent stay ranges (e.g. a multi-city
itinerary) in one calendar:

```tsx
<AvanCalendar
  mode="multiRange"
  multiRangeValue={ranges}
  onMultiRangeChange={setRanges}
  maxRangeCount={3}
  numberOfMonths={2}
/>
```

## Business-day-only deadlines

```ts
import { addBusinessDays, isBusinessDay, countBusinessDays } from '@avan-persian/core';

const deadline = addBusinessDays(new Date(), 5); // skips Fridays automatically
```

Pass `holidayDates` (an array of `YYYY-MM-DD` Jalali ISO strings) to also skip public holidays:

```ts
import { getIranHolidays } from '@avan-persian/holidays';

const holidayDates = getIranHolidays(1405).map((h) => h.date);
const deadline = addBusinessDays(new Date(), 5, { holidayDates });
```
