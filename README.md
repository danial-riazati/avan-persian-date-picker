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

## Packages

| Package          | Purpose                        |
| ---------------- | ------------------------------ |
| `@avan/react`    | Calendar, date & range pickers |
| `@avan/core`     | Jalali convert, grid, digits   |
| `@avan/holidays` | Iran public holidays           |
| `@avan/themes`   | CSS tokens + Estedad font      |

---

## Playground

Run locally: `corepack pnpm dev:playground` → [localhost:5173](http://localhost:5173)

GitHub Pages only allows **`/`** or **`/docs`**. CI deploys the built playground into **`docs/`** (the React app, not this README).

**Settings → Pages → branch `main` → folder `/docs`**

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
