# Avan — Persian Date Picker

**آوان — تقویم و انتخاب‌گر تاریخ شمسی (جلالی) برای React**

[![npm](https://img.shields.io/npm/v/%40avan-persian%2Freact?color=1a73e8&label=npm)](https://www.npmjs.com/package/@avan-persian/react)
[![License: MIT](https://img.shields.io/badge/license-MIT-1a73e8.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-1a73e8.svg)](https://www.typescriptlang.org/)

![Avan Persian Date Picker](./assets/avan-banner-fa.jpg)

A **Persian-first**, fully accessible Jalali calendar & date picker for React — built for apps
that need real RTL support, correct Shamsi dates, and Iran's official holidays out of the box.

**🔗 Live demo:** [danialriazati.ir/avan-persian-date-picker](https://danialriazati.ir/avan-persian-date-picker/)
· **📦 npm:** [@avan-persian/react](https://www.npmjs.com/package/@avan-persian/react)
· **💻 source:** [github.com/danial-riazati/avan-persian-date-picker](https://github.com/danial-riazati/avan-persian-date-picker)

---

## Install

```bash
pnpm add @avan-persian/react @avan-persian/core @avan-persian/holidays @avan-persian/themes
```

## Usage

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

> Import components from `@avan-persian/react/client` in Client Components only.

---

## Why Avan

- **Every selection mode** — single, range, multiple, multi-range, week, month, and year.
- **Time & date-time pickers** — 12/24-hour, seconds, minute stepping.
- **Real constraints** — `minDate`/`maxDate`, disabled dates/weekdays/ranges, custom predicates.
- **Iran holidays built in** (`@avan-persian/holidays`) plus business-day & fiscal-year helpers (`@avan-persian/core`).
- **Fully localized** — `fa-IR`/`en-IR` presets or custom locales, RTL/LTR, Persian/Western digits.
- **Accessible** — WAI-ARIA grid keyboard navigation, focus trap, live-region announcements.
- **Themeable** — plain CSS variables, dark mode, Tailwind preset. No CSS-in-JS runtime.
- **Custom rendering** — swap day content, captions, or footer without forking the library.

## Packages

| Package                  | Purpose                                              |
| ------------------------ | ---------------------------------------------------- |
| `@avan-persian/react`    | Calendar + every picker component                    |
| `@avan-persian/core`     | Jalali convert, grid, digits, business days          |
| `@avan-persian/holidays` | Iran public holidays                                 |
| `@avan-persian/themes`   | CSS tokens, dark mode, Tailwind preset, Estedad font |
| `@avan-persian/travel`   | Pricing/availability helpers for booking UIs         |

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

## Development

```bash
git clone https://github.com/danial-riazati/avan-persian-date-picker.git
cd avan-persian-date-picker
corepack pnpm install
corepack pnpm dev:playground   # local playground at localhost:5173
corepack pnpm test
corepack pnpm build
```

Contributions are welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT © [Danial Riazati](https://github.com/danial-riazati)
