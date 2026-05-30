# Avan Persian Date Picker

**آوان — Modern Jalali (Shamsi) calendar & date picker for TypeScript, React, and Next.js**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://www.typescriptlang.org/)
[![npm](https://img.shields.io/npm/v/@avan/react.svg)](https://www.npmjs.com/package/@avan/react)

---

## What does **Avan** (آوان) mean?

**آوان** (_Avān_) is a Persian word rooted in the flow of **time**, **era**, and the **rhythm of days**.

In classical Persian poetry and prose, _avan_ evokes the passage of moments — the lived texture of dates, seasons, and milestones. It is also used as a graceful Persian given name. For a calendar library, that meaning fits naturally: helping people choose the right day, plan a journey, and align with the **Shamsi (Solar Hijri)** calendar used daily in Iran and by Persian communities worldwide.

> **Avan Persian Date Picker** — time, beautifully handled.

---

## Why Avan?

Persian products deserve more than outdated pickers or copy-pasted shadcn snippets. Avan is a **professional, npm-ready library** built for:

- **Every Persian site** — shops, dashboards, blogs, admin panels
- **Travel & tourism** — nightly pricing, check-in/out ranges, blocked dates
- **Modern stacks** — Next.js 15+ App Router, React 19, Tailwind v4
- **Full customization** — your fonts, colors, radius, dark mode

| Capability                      | Avan              | Typical alternatives |
| ------------------------------- | ----------------- | -------------------- |
| Headless core (any framework)   | `@avan/core`      | React-only           |
| Next.js App Router / SSR-safe   | Built-in patterns | Partial              |
| CSS-variable theming            | First-class       | CSS overrides        |
| Iran holidays (Nowruz, …)       | `@avan/holidays`  | Manual               |
| Travel: prices, min-stay, rules | `@avan/travel`    | DIY                  |
| Exact Jalali range metadata     | Native            | Gregorian leaks      |
| Tree-shakeable ESM              | Subpath exports   | Monolithic bundles   |

---

## Packages

| Package                                 | Install  | Purpose                               |
| --------------------------------------- | -------- | ------------------------------------- |
| [`@avan/react`](./packages/react)       | Main UI  | Calendar, DatePicker, DateRangePicker |
| [`@avan/core`](./packages/core)         | Optional | Headless Jalali math & grid           |
| [`@avan/holidays`](./packages/holidays) | Optional | Iran public holidays by year          |
| [`@avan/travel`](./packages/travel)     | Optional | Pricing & booking rules               |
| [`@avan/themes`](./packages/themes)     | Optional | CSS tokens + Tailwind preset          |

---

## Quick start

```bash
pnpm add @avan/react @avan/core @avan/holidays @avan/themes
```

```tsx
'use client';

import { useState } from 'react';
import { AvanDateRangePicker } from '@avan/react/client';
import { getIranHolidays } from '@avan/holidays';
import '@avan/themes/default.css';

export function BookingWidget() {
  const [range, setRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });

  return (
    <AvanDateRangePicker
      value={range}
      onChange={setRange}
      holidays={getIranHolidays(1405)}
      locale="fa-IR"
      dir="rtl"
      theme={{
        fontFamily: 'var(--font-vazirmatn)',
        accent: 'hsl(210 90% 50%)',
      }}
    />
  );
}
```

### Next.js 15

Import from `@avan/react/client` in Client Components only. Values stay as native `Date` (Gregorian internally); display is Jalali. See [`docs/guides/nextjs.md`](./docs/guides/nextjs.md).

---

## Theming

Match any brand without forking components:

```css
.avan-root {
  --avan-font-family: 'Vazirmatn', 'IRANSans', system-ui, sans-serif;
  --avan-accent: hsl(210 90% 50%);
  --avan-accent-foreground: hsl(0 0% 100%);
  --avan-muted: hsl(210 20% 96%);
  --avan-day-radius: 0.5rem;
  --avan-day-size: 2.5rem;
}
```

```tsx
<AvanDateRangePicker
  theme={{
    fontFamily: 'var(--font-yekan)',
    accent: '#0066cc',
  }}
/>
```

---

## Travel & booking

```tsx
import { AvanTravelCalendar } from '@avan/travel';

<AvanTravelCalendar
  pricing={{
    '1405/01/15': { amount: 2_500_000, currency: 'IRR', label: '۲.۵M' },
  }}
  rules={{ minNights: 2, maxNights: 14 }}
  holidays={holidays}
  onRangeConfirm={({ jalaliFrom, jalaliTo, nights, totalPrice }) => {
    // Exact Shamsi boundaries + price summary
  }}
/>;
```

---

## Design principles

1. **Gregorian internally, Jalali at the edge** — Safe for APIs, timezones, and databases.
2. **Headless core** — `@avan/core` has zero React dependency.
3. **RTL-first** — Persian UX by default; LTR supported.
4. **Accessible** — Keyboard navigation, ARIA, reduced motion.
5. **Open source** — MIT license, community holiday data.

---

## Documentation

| Doc                                          | Description                             |
| -------------------------------------------- | --------------------------------------- |
| [**Publishing guide**](./docs/PUBLISHING.md) | GitHub repo name, npm setup, CI release |
| [Implementation phases](./docs/PHASES.md)    | Step-by-step build plan                 |
| [Architecture](./docs/ARCHITECTURE.md)       | Monorepo structure                      |
| [R&D notes](./docs/RND.md)                   | Market research & tech choices          |
| [Next.js guide](./docs/guides/nextjs.md)     | App Router integration                  |

---

## Development

```bash
git clone https://github.com/danial-riazati/avan-persian-date-picker.git
cd avan-persian-date-picker
pnpm install
pnpm dev
pnpm test
pnpm build
```

Requires **Node.js ≥ 20** and **pnpm ≥ 9**.

---

## Roadmap

- [x] Phase 0 — R&D, naming (**Avan** / آوان), repo scaffold
- [ ] Phase 1 — `@avan/core`
- [ ] Phase 2 — `@avan/holidays`
- [ ] Phase 3 — `@avan/react`
- [ ] Phase 4 — `@avan/themes`
- [ ] Phase 5 — `@avan/travel`
- [ ] Phase 6 — Docs + **npm publish**

Details: [`docs/PHASES.md`](./docs/PHASES.md)

---

## Publish & contribute

Ready to ship? Read **[docs/PUBLISHING.md](./docs/PUBLISHING.md)** for the recommended GitHub repo name, npm scope, and release workflow.

Contributions welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## License

MIT © Avan Persian Date Picker contributors
