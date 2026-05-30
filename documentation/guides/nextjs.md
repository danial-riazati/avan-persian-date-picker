# Next.js 15 App Router integration

## Install

```bash
pnpm add @avan/react @avan/core @avan/holidays @avan/themes
```

## Client boundary

All interactive Avan components must run in Client Components:

```tsx
// components/booking-calendar.tsx
'use client';

import { AvanDateRangePicker } from '@avan/react/client';
import '@avan/themes/default.css';

export function BookingCalendar() {
  // ...
}
```

Server Components can import types and `@avan/core` utilities only.

## Font setup (recommended)

```tsx
// app/layout.tsx
import { Vazirmatn } from 'next/font/google';

const vazirmatn = Vazirmatn({ subsets: ['arabic'], variable: '--font-vazirmatn' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body>{children}</body>
    </html>
  );
}
```

Pass to calendar:

```tsx
<AvanDateRangePicker theme={{ fontFamily: 'var(--font-vazirmatn)' }} />
```

## Server Actions

Serialize dates as ISO strings:

```tsx
'use server';

export async function bookStay(data: { from: string; to: string }) {
  const from = new Date(data.from);
  const to = new Date(data.to);
  // ...
}
```

```tsx
await bookStay({
  from: range.from!.toISOString(),
  to: range.to!.toISOString(),
});
```

## URL search params (shareable ranges)

```tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';

// Sync ?from=2026-03-20&to=2026-03-25 with picker state
```

## Dynamic import (optional)

For heavy travel bundle:

```tsx
import dynamic from 'next/dynamic';

const AvanTravelCalendar = dynamic(() => import('@avan/travel').then((m) => m.AvanTravelCalendar), {
  ssr: false,
  loading: () => <CalendarSkeleton />,
});
```

## Hydration

Pass `defaultMonth` from server when showing a specific month to avoid mismatch:

```tsx
<AvanCalendar defaultMonth={new Date('2026-03-20T12:00:00')} />
```

See Phase 3 in [PHASES.md](../PHASES.md) for SSR implementation details.
