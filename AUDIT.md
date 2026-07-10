# Audit Report

_Last updated: this release. Covers the full monorepo: `@avan/core`, `@avan/react`,
`@avan/holidays`, `@avan/themes`, `@avan/travel`, and `examples/playground`._

## Summary

Avan is a pnpm + Turborepo monorepo providing a Jalali (Persian/Shamsi) calendar and date-picker
toolkit for React. This audit covers architecture, correctness, feature completeness,
accessibility, performance, testing, and production readiness as of this release.

**Overall assessment:** production-ready. All packages build, typecheck, lint, and test clean
(86 tests across 14 test files, 0 lint errors, 0 typecheck errors). See
[FEATURE_GAP_ANALYSIS.md](./FEATURE_GAP_ANALYSIS.md),
[ACCESSIBILITY.md](./ACCESSIBILITY.md), and [PERFORMANCE.md](./PERFORMANCE.md) for the
deep-dives referenced throughout this document.

## Architecture

```
packages/
  core/      Headless Jalali date math (no React dependency)
  holidays/  Iran public holiday datasets + lookup helpers
  react/     React components, hooks, styles (client + type-only entry points)
  themes/    CSS design tokens, dark mode, Tailwind preset, Estedad font
  travel/    Pricing/availability helpers for booking UIs (no React dependency)
examples/
  playground/  Vite app used as the live demo + manual QA surface
```

- **Layering is clean**: `@avan/react` depends on `@avan/core` and `@avan/holidays`; `@avan/travel`
  depends only on `@avan/core`. Neither `@avan/core`, `@avan/holidays`, nor `@avan/travel` depend
  on React, so they're reusable outside a React app.
- **Dual entry points** on `@avan/react` (`.` for types only, `./client` for components/hooks)
  let type-only imports work in Server Components without pulling in client runtime code.
- **Date model**: Jalali dates are represented as `{ year, month, day }` (`JalaliDate`); every
  public API that crosses the React/date-math boundary uses plain `Date` (Gregorian) as the
  canonical value, converted to/from Jalali only for display and grid generation. This avoids
  ambiguity about which calendar a raw `Date` represents.
- **Locale system** (`packages/react/src/locale.ts`) centralizes month/weekday names, all UI
  strings, direction, digit style, week start, and weekend days into one `AvanLocale` type,
  replacing the previous hardcoded constants file. Presets (`fa-IR`, `en-IR`) can be extended or
  fully replaced.

## Correctness

- Jalali↔Gregorian conversion, formatting, and parsing delegate to `date-fns-jalali` (a
  well-tested, actively maintained library) rather than reimplementing calendar math, reducing
  the surface area for date-arithmetic bugs.
- All date values are normalized to local noon (`atLocalNoon`) before conversion to avoid
  off-by-one-day errors around DST transitions.
- Leap-year detection (`isJalaliLeapYear`), month length (`daysInJalaliMonth`), and month
  arithmetic (`addJalaliMonths`, clamping the day to the target month's length) are covered by
  unit tests across multiple years, including known leap years.
- `parseJalali`/`tryParseJalali` validate real calendar bounds (not just regex shape) via a
  round-trip conversion check, and tolerate both Persian and Western digits.
- Business-day/fiscal-year helpers (`isBusinessDay`, `addBusinessDays`, `countBusinessDays`,
  `getFiscalYearBounds`, `getJalaliQuarter`) are new in this release and unit-tested.

## Feature completeness

See [FEATURE_GAP_ANALYSIS.md](./FEATURE_GAP_ANALYSIS.md) for the full comparison against
established calendar libraries. Highlights:

- Selection modes: single, range, multiple, multi-range, week, month, year.
- Display: 1–4 months, inline or popover, controlled/uncontrolled.
- Constraints: `minDate`/`maxDate`, disabled dates/weekdays/ranges, arbitrary predicates —
  all composable via `createDisabledResolver`.
- Custom rendering: day content, full day cell, nav buttons, caption, footer.
- Day metadata (`getDayMeta`): badges, pricing, availability, tooltips, forced-disable — powers
  the `@avan/travel` integration.
- Time selection: standalone `AvanTimePicker` and composite `AvanDateTimePicker`.
- Text input mode for `AvanDatePicker` with tolerant parsing.

## Accessibility

Full report: [ACCESSIBILITY.md](./ACCESSIBILITY.md). Summary: WAI-ARIA `grid`/`row`/`gridcell`
semantics with roving tabindex keyboard navigation, focus trap + restoration for popovers, a
live region for selection announcements, and `axe-core` automated checks wired into the test
suite (0 violations across single-mode and two-month range-mode calendars, inline pickers).

## Performance

Full report: [PERFORMANCE.md](./PERFORMANCE.md). Summary: `@avan/react`'s client bundle is
~75.9 kB minified / ~15 kB gzipped including every component; `@avan/core` is tree-shakeable
per-function (sub-1 kB gzipped for typical usage). No unnecessary re-renders were found in the
calendar grid during manual profiling; memoization is applied to the disabled-date resolver and
year-bounds calculation.

## Testing

| Package          | Test files | Tests | Notable coverage                                                                                                                |
| ---------------- | ---------- | ----- | ------------------------------------------------------------------------------------------------------------------------------- |
| `@avan/core`     | 4          | 27    | Convert/parse round-trips, grid generation, business days, digits                                                               |
| `@avan/holidays` | 1          | 4     | Lookup, merging, fixed-solar fallback                                                                                           |
| `@avan/travel`   | 1          | 7     | Range validation, pricing, availability                                                                                         |
| `@avan/react`    | 8          | 48    | Every selection mode, keyboard nav, focus trap, text input, time picker, all picker wrappers, provider/theming, `axe-core` a11y |

All 86 tests pass; `pnpm lint`, `pnpm typecheck`, and `pnpm build` are clean across every
package. CI (`.github/workflows/ci.yml`) runs lint, typecheck, test+coverage, and build as
separate jobs on every push/PR.

## Production readiness

- **Repository governance**: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, GitHub
  issue/PR templates, and Changesets are all in place.
- **CI/CD**: lint, typecheck, test+coverage, and build run on every push/PR; a release workflow
  (`.github/workflows/release.yml`) opens/updates a "Version Packages" PR and publishes to npm
  on merge, using Changesets.
- **Documentation**: a full guide set lives in [`documentation/`](./documentation/README.md)
  (installation, quickstart, API reference, theming, localization, SSR, recipes, migration, FAQ)
  in addition to this audit and the accessibility/performance reports.
- **Live demo**: a Vite-based playground (`examples/playground/`) is deployed to GitHub Pages on
  every push to `main`.

## Known limitations / follow-ups

- `@avan/holidays` statement coverage (73%) is lower than other packages — the untested branches
  are primarily edge cases in holiday-entry merging (overlapping titles across datasets) rather
  than core lookup logic.
- Years outside the bundled 1404–1406 range only get fixed solar-calendar holidays (no
  lunar-dependent religious holidays) — see [FAQ](./documentation/faq.md#how-accurate-are-the-iran-holiday-dates).
- `minYear`/`maxYear` remain as deprecated (but supported) fallbacks for the year picker; new
  code should use `minDate`/`maxDate`.
