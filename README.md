# Avan Persian Date Picker

**آوان — Modern Jalali (Shamsi) calendar & date picker for TypeScript and React**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://www.typescriptlang.org/)
[![Status](https://img.shields.io/badge/status-pre--release-orange.svg)](#roadmap)

Monorepo for **Avan** — a Persian-first date picker with headless Jalali utilities, Iran holiday datasets, CSS-variable theming, and React components ready for Next.js App Router.

---

## What does **Avan** (آوان) mean?

**آوان** (_Avān_) is a Persian word rooted in the flow of **time**, **era**, and the **rhythm of days**.

In classical Persian poetry and prose, _avan_ evokes the passage of moments — the lived texture of dates, seasons, and milestones. For a calendar library, that meaning fits naturally: helping people choose the right day, plan a journey, and align with the **Shamsi (Solar Hijri)** calendar used daily in Iran and by Persian communities worldwide.

> **Avan Persian Date Picker** — time, beautifully handled.

---

## Features

| Feature | Status |
| --- | --- |
| Headless Jalali convert / grid / digits (`@avan/core`) | ✅ |
| Iran public holidays 1404–1406 + fixed solar fallback (`@avan/holidays`) | ✅ |
| `AvanCalendar`, `AvanDatePicker`, `AvanDateRangePicker` | ✅ |
| Single & range selection | ✅ |
| Inline & popover display modes | ✅ |
| One- or two-month layouts (`numberOfMonths={1 \| 2}`) | ✅ |
| RTL-first navigation; LTR + `en-IR` locale | ✅ |
| Built-in holiday markers (auto-loaded; pass `holidays={[]}` to disable) | ✅ |
| CSS-variable theming + bundled Estedad font (`@avan/themes`) | ✅ |
| Responsive sizing (viewport + container queries) | ✅ |
| Travel pricing & booking rules (`@avan/travel`) | 🚧 Planned |
| npm publish | 🚧 Planned |

---

## Packages

| Package | Purpose |
| --- | --- |
| [`@avan/react`](./packages/react) | Calendar, date picker, range picker, `AvanProvider` |
| [`@avan/core`](./packages/core) | Headless Jalali conversion, month grid, Persian digits |
| [`@avan/holidays`](./packages/holidays) | Iran official holidays by Jalali year |
| [`@avan/themes`](./packages/themes) | Default CSS tokens, fonts, Tailwind preset |
| [`@avan/travel`](./packages/travel) | Pricing & booking rules *(stub — Phase 5)* |

---

## Quick start

### Install (from monorepo / workspace)

```bash
git clone https://github.com/danial-riazati/avan-persian-date-picker.git
cd avan-persian-date-picker
corepack pnpm install
corepack pnpm build
```

When published to npm:

```bash
pnpm add @avan/react @avan/core @avan/holidays @avan/themes
```

### React usage

Import interactive components from `@avan/react/client` (Client Components only). Values are native `Date` objects (Gregorian internally); display is Jalali.

```tsx
'use client';

import { useState } from 'react';
import { AvanDateRangePicker, AvanProvider } from '@avan/react/client';
import '@avan/themes/default.css';

export function BookingWidget() {
  const [range, setRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });

  return (
    <AvanProvider dir="rtl" locale="fa-IR">
      <AvanDateRangePicker
        value={range}
        onChange={setRange}
        display="popover"
        numberOfMonths={2}
        placeholder="انتخاب بازه تاریخ"
      />
    </AvanProvider>
  );
}
```

Holidays load automatically from bundled datasets (1404–1406) plus the visible calendar year(s). Override with `holidays={getIranHolidays(1405)}` or disable with `holidays={[]}`.

### Next.js App Router

Use `@avan/react/client` in `'use client'` files only. See [`docs/guides/nextjs.md`](./docs/guides/nextjs.md).

---

## Components

### `AvanCalendar`

Inline month grid — single or range selection.

```tsx
import { AvanCalendar } from '@avan/react/client';

<AvanCalendar
  value={date}
  onChange={setDate}
  numberOfMonths={2}
  dir="rtl"
  locale="fa-IR"
/>;
```

Range mode:

```tsx
<AvanCalendar
  mode="range"
  rangeValue={range}
  onRangeChange={setRange}
/>
```

### `AvanDatePicker` / `AvanDateRangePicker`

Input + calendar. `display="inline"` keeps the calendar visible; `display="popover"` opens it from the trigger.

| Prop | Description |
| --- | --- |
| `display` | `'inline'` (default) or `'popover'` |
| `numberOfMonths` | `1` (default) or `2` |
| `open` / `defaultOpen` / `onOpenChange` | Controlled popover state |
| `closeOnSelect` | Close popover after selection (default: `true`) |
| `holidays` | Custom list; omitted = auto; `[]` = none |
| `minYear` / `maxYear` | Limit year dropdown |
| `isDateDisabled` | `(date: Date) => boolean` |
| `theme` | Inline token overrides (`fontFamily`, `accent`, …) |

---

## Headless core

```ts
import {
  toJalali,
  toGregorian,
  formatJalali,
  parseJalali,
  getMonthGrid,
  toPersianDigits,
} from '@avan/core';

const jalali = toJalali(new Date());
const grid = getMonthGrid({ year: 1405, month: 1 });
const label = toPersianDigits(formatJalali(new Date(), 'yyyy/MM/dd'));
```

Subpath exports: `@avan/core/convert`, `@avan/core/grid`.

---

## Holidays

```ts
import { getIranHolidays, isHoliday, getHolidayForDate } from '@avan/holidays';

const holidays = getIranHolidays(1405);
isHoliday(new Date(), holidays);
```

Yearly JSON datasets: **1404**, **1405**, **1406**. Other years fall back to fixed solar holidays (Nowruz block, 22 Bahman, etc.).

---

## Theming

Import the default theme (includes Estedad font faces):

```tsx
import '@avan/themes/default.css';
```

Override tokens on `.avan-root` or via the `theme` prop:

```css
.avan-root {
  --avan-font-family: 'Vazirmatn', 'Estedad', system-ui, sans-serif;
  --avan-accent: hsl(210 90% 50%);
  --avan-day-size: 2.5rem;
  --avan-day-radius: 0.5rem;
  --avan-holiday-dot-size: 0.35rem;
}
```

Also available: `@avan/themes/dark.css`, `@avan/themes/tailwind`.

Responsive tokens scale down on tablet (≤1024px) and mobile (≤640px). Holiday dots stay larger on desktop and shrink on smaller viewports.

---

## Playground

Interactive demo with all picker modes, two-month layouts, popovers, and holiday listings:

```bash
corepack pnpm dev:playground
```

Open [http://localhost:5173](http://localhost:5173).

---

## Development

```bash
git clone https://github.com/danial-riazati/avan-persian-date-picker.git
cd avan-persian-date-picker
corepack pnpm install
corepack pnpm test      # vitest in @avan/core, @avan/holidays
corepack pnpm build
corepack pnpm typecheck
corepack pnpm lint
```

Requires **Node.js ≥ 20** and **pnpm ≥ 9**.

### Repository layout

```
packages/
  core/       Headless Jalali engine
  holidays/   Iran holiday data + loader
  react/      Calendar & pickers
  themes/     CSS tokens & fonts
  travel/     Booking/pricing (planned)
examples/
  playground/ Vite demo app
docs/         Architecture, phases, publishing guide
```

---

## Roadmap

- [x] Phase 0 — R&D, naming (**Avan** / آوان), monorepo scaffold
- [x] Phase 1 — `@avan/core` (convert, grid, digits, tests)
- [x] Phase 2 — `@avan/holidays` (1404–1406 datasets)
- [x] Phase 3 — `@avan/react` (calendar, pickers, popover, two-month mode)
- [x] Phase 4 — `@avan/themes` (default CSS, Estedad, responsive tokens)
- [ ] Phase 5 — `@avan/travel` (pricing, min-stay, blocked dates)
- [ ] Phase 6 — Docs site, Storybook, more examples
- [ ] Phase 7 — npm publish (`@avan/*` v1.0.0)

Details: [`docs/PHASES.md`](./docs/PHASES.md)

---

## Documentation

| Doc | Description |
| --- | --- |
| [Architecture](./docs/ARCHITECTURE.md) | Monorepo structure |
| [Implementation phases](./docs/PHASES.md) | Build plan & exit criteria |
| [Publishing guide](./docs/PUBLISHING.md) | npm scope, CI release |
| [Next.js guide](./docs/guides/nextjs.md) | App Router integration |
| [R&D notes](./docs/RND.md) | Market research & tech choices |

---

## Contributing

Contributions welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## License

MIT © [Danial Riazati](https://github.com/danial-riazati) and contributors
