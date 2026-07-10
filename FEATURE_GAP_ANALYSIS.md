# Feature Gap Analysis

Benchmarked against widely-used modern date-picker/calendar libraries: **react-day-picker**,
**MUI X Date Pickers**, **Ant Design DatePicker**, and Persian-specific alternatives
(`react-multi-date-picker`, `shamsi-date-picker`). Goal: identify gaps, then close them for
Avan's Persian-first use case.

## Selection modes

| Mode            | react-day-picker | MUI X    | Ant Design      | **Avan**          |
| --------------- | ---------------- | -------- | --------------- | ----------------- |
| Single date     | ✅               | ✅       | ✅              | ✅                |
| Range           | ✅               | ✅ (Pro) | ✅              | ✅                |
| Multiple dates  | ✅               | ❌       | ✅ (`multiple`) | ✅                |
| Multiple ranges | ❌               | ❌       | ❌              | ✅ (`multiRange`) |
| Week            | ❌ (via range)   | ❌       | ✅              | ✅                |
| Month only      | ❌               | ✅       | ✅              | ✅                |
| Year only       | ❌               | ✅       | ✅              | ✅                |

Avan matches or exceeds every benchmarked library on selection modes, including disjoint
multi-range selection (useful for multi-city travel itineraries) that none of the benchmarks
offer natively.

## Display & layout

| Feature                                 | Benchmarks                                | **Avan**                              |
| --------------------------------------- | ----------------------------------------- | ------------------------------------- |
| 1–2 month views                         | ✅ (all)                                  | ✅                                    |
| 3–4 month views                         | Partial (custom composition)              | ✅ (`numberOfMonths={3\|4}` built in) |
| Inline vs. popover                      | ✅ (all)                                  | ✅                                    |
| Touch swipe navigation                  | react-day-picker: ❌ / MUI: ❌ / AntD: ❌ | ✅                                    |
| Mouse wheel navigation                  | ❌ (all)                                  | ✅ (opt-in)                           |
| Loading/skeleton state                  | ❌ (all)                                  | ✅                                    |
| Custom day/nav/caption/footer rendering | ✅ (all, via render props/slots)          | ✅ (`components` prop)                |

## Constraints

| Feature                 | Benchmarks                      | **Avan**                                       |
| ----------------------- | ------------------------------- | ---------------------------------------------- |
| `minDate`/`maxDate`     | ✅                              | ✅                                             |
| Disabled specific dates | ✅                              | ✅                                             |
| Disabled weekdays       | Partial (custom predicate only) | ✅ (`disabledWeekdays`, first-class)           |
| Disabled ranges         | Partial                         | ✅ (`disabledRanges`, first-class)             |
| Arbitrary predicate     | ✅                              | ✅ (`isDateDisabled`, composes with the above) |

## Time & date-time

| Feature               | Benchmarks     | **Avan** |
| --------------------- | -------------- | -------- |
| Time picker           | ✅ (MUI, AntD) | ✅       |
| Date + time composite | ✅ (MUI, AntD) | ✅       |
| 12/24-hour cycle      | ✅             | ✅       |
| Seconds               | ✅             | ✅       |
| Minute stepping       | ✅             | ✅       |

## Persian/Jalali-specific (the actual differentiator)

| Feature                                            | react-multi-date-picker | shamsi-date-picker | **Avan**                                            |
| -------------------------------------------------- | ----------------------- | ------------------ | --------------------------------------------------- |
| Jalali calendar                                    | ✅                      | ✅                 | ✅                                                  |
| Iran public holidays bundled                       | ❌                      | ❌                 | ✅ (`@avan-persian/holidays`, 1404–1406 + fallback) |
| Business-day helpers (Iran weekend)                | ❌                      | ❌                 | ✅ (`@avan-persian/core` business module)           |
| Fiscal year / quarter helpers                      | ❌                      | ❌                 | ✅                                                  |
| Persian ⇄ Western digit conversion                 | ✅                      | ✅                 | ✅                                                  |
| Configurable week start (not just Saturday)        | ❌                      | ❌                 | ✅                                                  |
| Full custom locale objects (not just string swaps) | ❌                      | Partial            | ✅ (`AvanLocaleDefinition`)                         |
| RTL + LTR support decoupled from digit style       | Partial                 | Partial            | ✅ (`dir` independent of `locale`)                  |

## Accessibility

| Feature                          | react-day-picker                | MUI X            | Ant Design       | **Avan**                                 |
| -------------------------------- | ------------------------------- | ---------------- | ---------------- | ---------------------------------------- |
| WAI-ARIA grid pattern            | ✅                              | ✅               | Partial          | ✅                                       |
| Roving tabindex keyboard nav     | ✅                              | ✅               | ✅               | ✅                                       |
| Focus trap in popover            | Delegated to caller             | ✅               | ✅               | ✅ (built in)                            |
| Live region announcements        | ❌                              | Partial          | ❌               | ✅                                       |
| Automated `axe-core` tests in CI | Library-internal, not published | Library-internal | Library-internal | ✅ (published in this repo's test suite) |

## Domain extensions (travel/e-commerce)

| Feature                                                                | Benchmarks              | **Avan**                               |
| ---------------------------------------------------------------------- | ----------------------- | -------------------------------------- |
| Per-day pricing/availability metadata                                  | ❌ (custom render only) | ✅ (`getDayMeta`, typed `AvanDayMeta`) |
| Booking rule validation (min/max nights, blackout, business-days-only) | ❌                      | ✅ (`@avan-persian/travel`)            |
| Range price summary                                                    | ❌                      | ✅ (`computeRangePrice`)               |
| "Lowest price this month" helper                                       | ❌                      | ✅ (`findLowestPriceInMonth`)          |

## Gaps closed in this release

The following were identified as gaps versus the benchmarks and closed as part of this audit
cycle:

- ✅ Added `multiple`, `multiRange`, `week`, `month`, `year` selection modes (previously only
  `single`/`range`).
- ✅ Added `weekStartsOn`/`weekendDays` configuration (previously hardcoded to Saturday-first).
- ✅ Replaced hardcoded locale strings with a full `AvanLocaleDefinition` system supporting
  custom languages.
- ✅ Added `AvanTimePicker`/`AvanDateTimePicker` (previously date-only).
- ✅ Added `disabledWeekdays`/`disabledRanges` as first-class constraint props.
- ✅ Added `getDayMeta` + `components` custom-rendering API.
- ✅ Added swipe/wheel navigation, loading skeletons, today/clear footer buttons.
- ✅ Added `@avan-persian/travel` for real booking/pricing use cases.
- ✅ Added business-day, fiscal-year, and quarter helpers to `@avan-persian/core`.
- ✅ Added WAI-ARIA grid keyboard navigation, focus trap, and live-region announcements.

## Remaining gaps / candidates for future releases

- **Range with disabled-date awareness mid-drag**: some libraries visually preview an in-progress
  range against disabled dates before the second click; Avan currently only enforces
  disabled-ness on click, not during hover preview.
- **Virtualized year picker** for very large min/max year spans (currently paginated in fixed
  pages of 12, which is sufficient for realistic ranges but not virtualized for e.g. 500+ years).
- **Built-in adapter for other UI kits' form primitives** (e.g. a documented MUI/Chakra
  `TextField` adapter) — currently documented via the generic [Recipes](./documentation/recipes.md)
  pattern instead of a dedicated adapter package.
