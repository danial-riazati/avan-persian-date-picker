# Avan Persian Date Picker

**آوان — Jalali (Shamsi) calendar & date picker for React**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://www.typescriptlang.org/)

Persian-first date picker: RTL calendar, range selection, Iran holidays, CSS theming.

**Live demo:** [danialriazati.ir/avan-persian-date-picker](https://danialriazati.ir/avan-persian-date-picker/)

---

## Install

```bash
pnpm add @avan/react @avan/core @avan/holidays @avan/themes
```

## Usage

```tsx
'use client';

import { useState } from 'react';
import { AvanDateRangePicker, AvanProvider } from '@avan/react/client';
import '@avan/themes/default.css';
import '@avan/react/client.css';

export function Example() {
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

Import components from `@avan/react/client` in Client Components only.

---

## Features

- **Every selection mode**: single, range, multiple, multi-range, week, month, and year.
- **1–4 month views**, inline or popover display, controlled or uncontrolled.
- **Time & date-time pickers** with 12/24-hour cycles, seconds, and minute stepping.
- **Constraints**: `minDate`/`maxDate`, disabled dates/weekdays/ranges, custom predicates.
- **Custom rendering**: swap day content, nav buttons, captions, or footer without forking.
- **Day metadata**: badges, pricing, availability — powers travel/e-commerce calendars.
- **Iran holidays** built in (`@avan/holidays`), business-day & fiscal-year helpers (`@avan/core`).
- **Full localization**: `fa-IR`/`en-IR` presets or fully custom locales, RTL/LTR, Persian/Western digits, configurable week start.
- **Accessible**: WAI-ARIA grid keyboard navigation, focus trap, live-region announcements, reduced motion & high contrast support.
- **Themeable**: CSS variables, dark mode, Tailwind preset — no CSS-in-JS runtime.

## Packages

| Package          | Purpose                                              |
| ---------------- | ---------------------------------------------------- |
| `@avan/react`    | Calendar + every picker component                    |
| `@avan/core`     | Jalali convert, grid, digits, business days          |
| `@avan/holidays` | Iran public holidays                                 |
| `@avan/themes`   | CSS tokens, dark mode, Tailwind preset, Estedad font |
| `@avan/travel`   | Pricing/availability helpers for booking UIs         |

## Documentation

Full guides live in [`documentation/`](./documentation/README.md):
[Installation](./documentation/installation.md) ·
[Quickstart](./documentation/quickstart.md) ·
[API Reference](./documentation/api-reference.md) ·
[Theming](./documentation/theming.md) ·
[Localization](./documentation/localization.md) ·
[SSR](./documentation/ssr.md) ·
[Recipes](./documentation/recipes.md) ·
[Accessibility](./ACCESSIBILITY.md) ·
[FAQ](./documentation/faq.md)

---

## Playground

Run locally: `corepack pnpm dev:playground` → [localhost:5173](http://localhost:5173)

The live demo is the built app in **`docs/`** (not markdown). CI updates it on every push.

**Settings → Pages → branch `main` → folder `/docs`**

If you see a Jekyll error, switch Pages source away from **GitHub Actions** — use **Deploy from branch** instead. The `docs/.nojekyll` file disables Jekyll.

---

## Development

```bash
git clone https://github.com/danial-riazati/avan-persian-date-picker.git
cd avan-persian-date-picker
corepack pnpm install
corepack pnpm test
corepack pnpm build
```

## License

MIT © [Danial Riazati](https://github.com/danial-riazati)
