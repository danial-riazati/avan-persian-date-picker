# Server-Side Rendering

Avan's components are interactive (keyboard navigation, popovers, controlled state) and use
React hooks and browser APIs, so they must render on the client. This is a standard
"presentational logic on the client, layout on the server" split — nothing Avan-specific.

## Next.js App Router

Mark the component that renders Avan with `'use client'`, then import from the client entry
point:

```tsx
// app/components/booking-date-picker.tsx
'use client';

import { useState } from 'react';
import { AvanDateRangePicker, AvanProvider } from '@avan/react/client';
import '@avan/themes/default.css';
import '@avan/react/client.css';
import type { DateRangeValue } from '@avan/react';

export function BookingDatePicker() {
  const [range, setRange] = useState<DateRangeValue>({ from: null, to: null });
  return (
    <AvanProvider dir="rtl" locale="fa-IR">
      <AvanDateRangePicker value={range} onChange={setRange} display="popover" numberOfMonths={2} />
    </AvanProvider>
  );
}
```

Then use `<BookingDatePicker />` from any Server Component as usual — Next.js automatically
renders it on the client.

**Do not** import `@avan/react/client` from a Server Component or a file without `'use client'`
— React will fail at build time because hooks aren't available during server rendering. If you
only need a _type_ (e.g. `AvanTheme`) in server code, import it from the type-only root package
instead:

```ts
import type { AvanTheme } from '@avan/react'; // no 'use client' needed — types only
```

## Next.js Pages Router

No special handling needed — everything under `pages/` already renders on the client by
default (after hydration):

```tsx
import { AvanDatePicker, AvanProvider } from '@avan/react/client';
import '@avan/themes/default.css';
import '@avan/react/client.css';

export default function BookingPage() {
  return (
    <AvanProvider>
      <AvanDatePicker />
    </AvanProvider>
  );
}
```

## Hydration notes

- Avoid rendering a picker with a `defaultValue`/`value` derived from `new Date()` computed on
  the server and again on the client — the two renders can disagree by milliseconds/days near
  midnight and trigger a hydration mismatch. Prefer initializing date state in `useEffect` or
  from a stable, serialized value passed down as a prop.
- The calendar grid itself is deterministic for a given `visibleMonth` + `today`, so as long as
  `today`/`visibleMonth` match between server and client (or are only computed client-side),
  there's no mismatch risk.

## Remix / Vite / CRA

No special handling needed — these all render the whole app client-side (Vite/CRA) or you
control loader vs. component boundaries yourself (Remix); import `@avan/react/client` from any
component that needs it.

## Streaming / Suspense

Avan's `AvanCalendar`/pickers accept a `loading` prop that renders a skeleton grid instead of
real days — useful while day metadata (pricing, availability) is still streaming in via
`getDayMeta`:

```tsx
<AvanCalendar loading={isPricingLoading} getDayMeta={getDayMeta} />
```
