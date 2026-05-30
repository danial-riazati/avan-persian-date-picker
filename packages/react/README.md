# @avan/react

React components for **Avan Persian Date Picker** — Jalali (Shamsi) calendar, single date picker, and range picker.

## Install

```bash
pnpm add @avan/react @avan/core @avan/holidays @avan/themes
```

Peer dependency: `react` ≥ 18.

## Usage

```tsx
'use client';

import { useState } from 'react';
import {
  AvanProvider,
  AvanCalendar,
  AvanDatePicker,
  AvanDateRangePicker,
} from '@avan/react/client';
import '@avan/themes/default.css';

export function Example() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <AvanProvider dir="rtl" locale="fa-IR">
      <AvanDatePicker
        value={date}
        onChange={setDate}
        display="popover"
        placeholder="یک تاریخ انتخاب کنید"
      />
    </AvanProvider>
  );
}
```

## Exports

| Export | Description |
| --- | --- |
| `AvanCalendar` | Inline month grid (single or range) |
| `AvanDatePicker` | Single date input + calendar |
| `AvanDateRangePicker` | Range input + calendar |
| `AvanProvider` | Default `dir`, `locale`, `theme` |
| `useAvanCalendar` | Headless calendar state hook |

Types and server-safe exports: `@avan/react`  
Client components: `@avan/react/client`

## Key props

- `display`: `'inline'` \| `'popover'`
- `numberOfMonths`: `1` \| `2`
- `holidays`: auto-loaded when omitted; `[]` disables markers
- `dir`: `'rtl'` \| `'ltr'`
- `locale`: `'fa-IR'` \| `'en-IR'`

Full documentation: [github.com/danial-riazati/avan-persian-date-picker](https://github.com/danial-riazati/avan-persian-date-picker)
