# FAQ

## Nothing renders / "hooks can only be called inside a function component"

You likely imported from `@avan-persian/react` instead of `@avan-persian/react/client`, or forgot `'use client'`
in Next.js App Router. See [Installation → Client vs. server entry points](./installation.md#client-vs-server-entry-points).

## Styles look broken / unstyled

You need **two** stylesheets imported once near your app root — a design-token theme and the
component structural CSS:

```ts
import '@avan-persian/themes/default.css';
import '@avan-persian/react/client.css';
```

Importing only `@avan-persian/themes/default.css` sets CSS variables but not the actual `.avan-calendar`
layout rules, so the calendar will render as plain unstyled buttons in a grid. Importing only
`@avan-persian/react/client.css` renders the layout but without colors/spacing tokens. Both are required.

If you're using a bundler that doesn't support CSS imports from `node_modules` by default (rare
in modern tooling), copy the CSS files into your own stylesheet pipeline instead.

## How do I get Persian digits / Persian month names?

Use `locale="fa-IR"` (the default) — it sets `numerals: 'persian'` and Persian month/weekday
names automatically. See [Localization](./localization.md).

## How do I change the week to start on a different day?

```tsx
<AvanCalendar weekStartsOn={1} /> {/* Monday-first */}
```

`0` = Sunday … `6` = Saturday, matching JS's native `Date#getDay()`. See
[Localization → Week start & weekend days](./localization.md#week-start--weekend-days-independent-of-locale).

## How do I disable Fridays (or any other weekday)?

```tsx
<AvanCalendar disabledWeekdays={[5]} />
```

## How do I show more than one month?

```tsx
<AvanCalendar numberOfMonths={2} /> {/* 1 | 2 | 3 | 4 */}
```

## Can I use this without React?

`@avan-persian/core` has zero React dependency and can be used standalone for date math (conversion,
formatting, business days, etc.) in any JS/TS environment — Node scripts, other frameworks, CLI
tools. `@avan-persian/react` is the only package that requires React.

## Does Avan work with Vue/Svelte/Angular?

Not out of the box — `@avan-persian/react` is React-specific. `@avan-persian/core` (date logic) and
`@avan-persian/holidays` (holiday data) are framework-agnostic and can be used to build a calendar UI in
any framework.

## How accurate are the Iran holiday dates?

Years 1404–1406 ship an official yearly calendar (public/religious/cultural holidays, including
tentative religious dates that depend on moon sighting). Years outside that range fall back to
fixed solar-calendar holidays only (won't include lunar-dependent religious holidays). See
[`@avan-persian/holidays`](./api-reference.md#avanholidays).

## Why does `parseJalali` throw on some strings?

`parseJalali` requires a strict `YYYY/MM/DD` or `YYYY-MM-DD` shape (Persian or Western digits)
and validates it's a real calendar day (correct days-per-month, leap years). Use
`tryParseJalali`, which returns `null` instead of throwing, if you're parsing untrusted user
input:

```ts
import { tryParseJalali } from '@avan-persian/core';

const parsed = tryParseJalali(userInput); // AvanDate | null
```

## How do I report a bug or request a feature?

Please use the issue templates on GitHub — see [CONTRIBUTING.md](../CONTRIBUTING.md).

## Where's the live demo?

[danialriazati.ir/avan-persian-date-picker](https://danialriazati.ir/avan-persian-date-picker/) —
source lives in `examples/playground/`, run it locally with `pnpm dev:playground`.
