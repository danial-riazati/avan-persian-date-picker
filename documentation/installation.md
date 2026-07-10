# Installation

## Packages

Avan is a small set of focused packages — install only what you need.

| Package          | Purpose                                                         | Depends on                     |
| ---------------- | --------------------------------------------------------------- | ------------------------------ |
| `@avan/core`     | Headless Jalali date math: convert, grid, format, business days | —                              |
| `@avan/react`    | React components: calendar + all pickers                        | `@avan/core`, `@avan/holidays` |
| `@avan/holidays` | Official Iran public holiday datasets                           | `@avan/core`                   |
| `@avan/themes`   | CSS design tokens, dark mode, Tailwind preset, Estedad font     | —                              |
| `@avan/travel`   | Pricing/availability helpers for booking & travel UIs           | `@avan/core`                   |

Most apps only need `@avan/react` + `@avan/themes` — the other two are pulled in automatically
as dependencies of `@avan/react` (or opt-in extras for `@avan/travel`).

```bash
pnpm add @avan/react @avan/themes
# or
npm install @avan/react @avan/themes
# or
yarn add @avan/react @avan/themes
```

Add `@avan/travel` only if you're building booking/pricing UIs:

```bash
pnpm add @avan/travel
```

## Peer dependencies

`@avan/react` requires React 18 or newer:

```json
{
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18"
  }
}
```

## Import the CSS

Avan ships plain CSS (no CSS-in-JS runtime). Two stylesheets are required, imported once near your
app root:

```ts
import '@avan/themes/default.css'; // design tokens (colors, spacing, dark mode support)
import '@avan/react/client.css'; // calendar/picker structural styles
```

`@avan/themes/default.css` defines the CSS custom properties (`--avan-accent`, `--avan-day-size`,
etc.) and `.avan-root` scoping; `@avan/react/client.css` defines the actual `.avan-calendar`,
`.avan-day`, popover, and time-picker layout rules. Both are required — importing only one will
render an unstyled or broken-looking calendar.

For dark mode, additionally import:

```ts
import '@avan/themes/dark.css';
```

See [Theming](./theming.md) for how `dark.css` and `colorScheme` interact, and how to override
individual CSS variables.

## Client vs. server entry points

`@avan/react` has two entry points:

- **`@avan/react`** (`import ... from '@avan/react'`) — types only. Safe to import from Server
  Components or shared type-only modules; contains no React runtime code.
- **`@avan/react/client`** (`import ... from '@avan/react/client'`) — all components and hooks.
  Every component here uses hooks and browser APIs, so it must be rendered from a **Client
  Component** (Next.js App Router) or anywhere client-side React runs (Vite, CRA, Pages Router).

```tsx
'use client';

import { AvanDatePicker, AvanProvider } from '@avan/react/client';
```

If you only need types (e.g. to type a prop that accepts an `AvanTheme`), import from the
package root instead:

```ts
import type { AvanTheme, AvanLocale } from '@avan/react';
```

## Framework notes

- **Next.js (App Router):** mark the file/component that renders any Avan component with
  `'use client'`. See [SSR guide](./ssr.md) for a full example and hydration tips.
- **Next.js (Pages Router):** works out of the box; no `'use client'` needed since everything
  renders client-side by default.
- **Vite / CRA / Remix / plain React:** works out of the box, `@avan/react/client` is just a
  normal ESM import.

## TypeScript

Avan is written in strict TypeScript and ships its own `.d.ts` files — no `@types/*` package is
needed.
