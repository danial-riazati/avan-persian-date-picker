# @avan-persian/react

![Avan Persian Date Picker](https://raw.githubusercontent.com/danial-riazati/avan-persian-date-picker/main/assets/avan-banner-fa.jpg)

React components for [Avan Persian Date Picker](https://github.com/danial-riazati/avan-persian-date-picker)
— a Jalali (Shamsi) calendar and full set of date/time pickers with RTL, Persian digits, Iran
holidays, and WCAG-compliant accessibility built in.

## Install

```bash
pnpm add @avan-persian/react @avan-persian/themes
```

## Import the CSS

Two stylesheets are required, imported once near your app root:

```ts
import '@avan-persian/themes/default.css'; // design tokens (colors, spacing, dark mode)
import '@avan-persian/react/client.css'; // calendar/picker structural styles
```

## Quick example

```tsx
'use client';

import { useState } from 'react';
import { AvanDateRangePicker, AvanProvider } from '@avan-persian/react/client';
import '@avan-persian/themes/default.css';
import '@avan-persian/react/client.css';

export function Example() {
  const [range, setRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });

  return (
    <AvanProvider dir="rtl" locale="fa-IR">
      <AvanDateRangePicker value={range} onChange={setRange} display="popover" numberOfMonths={2} />
    </AvanProvider>
  );
}
```

## What's inside

`AvanCalendar` (single/range/multiple/multi-range/week/month/year modes) plus dedicated
`AvanDatePicker`, `AvanDateRangePicker`, `AvanMultiDatePicker`, `AvanWeekPicker`, `AvanMonthPicker`,
`AvanYearPicker`, `AvanTimePicker`, and `AvanDateTimePicker` components — all sharing one
`AvanProvider` for locale/direction/theme, min/max/disabled-date constraints, custom day rendering,
keyboard navigation, and screen-reader support.

`@avan-persian/react` (this package's root import) is types-only and safe for Server Components;
interactive components live under `@avan-persian/react/client`. See
[Installation → Client vs. server entry points](https://github.com/danial-riazati/avan-persian-date-picker/blob/main/documentation/installation.md#client-vs-server-entry-points).

## Docs

- [Quickstart](https://github.com/danial-riazati/avan-persian-date-picker/blob/main/documentation/quickstart.md)
- [API reference](https://github.com/danial-riazati/avan-persian-date-picker/blob/main/documentation/api-reference.md)
- [Theming](https://github.com/danial-riazati/avan-persian-date-picker/blob/main/documentation/theming.md)
- [SSR / Next.js](https://github.com/danial-riazati/avan-persian-date-picker/blob/main/documentation/ssr.md)
- [Live demo](https://danial-riazati.github.io/avan-persian-date-picker/)

## License

MIT © [Danial Riazati](https://github.com/danial-riazati)
