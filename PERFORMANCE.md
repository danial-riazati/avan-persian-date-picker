# Performance

## Bundle size

Measured from a production build (`pnpm build`, `tsdown`/rolldown, ESM output, gzip via
`tsdown`'s reporter) as of this release:

| Package                  | File                                                    | Minified | Gzipped |
| ------------------------ | ------------------------------------------------------- | -------- | ------- |
| `@avan-persian/react`    | `dist/client.js` (every component + hook)               | 75.9 kB  | 14.9 kB |
| `@avan-persian/react`    | `dist/client.css` (all component styles)                | 22.4 kB  | 3.5 kB  |
| `@avan-persian/core`     | `dist/index.js` (root re-export)                        | 1.1 kB   | 0.4 kB  |
| `@avan-persian/holidays` | `dist/index.js` (incl. 3 years of bundled holiday data) | 15.6 kB  | 2.6 kB  |
| `@avan-persian/travel`   | `dist/index.js`                                         | 4.3 kB   | 1.5 kB  |

Notes:

- `@avan-persian/core` exposes per-function subpath exports (`@avan-persian/core/convert`, `@avan-persian/core/grid`,
  `@avan-persian/core/business`, `@avan-persian/core/digits`), each under 1 kB gzipped individually — apps that
  only need date math (no React) can import just what they use.
- `@avan-persian/react/client`'s 14.9 kB gzipped figure includes **every** selection mode, all seven
  picker components, the time picker, and all hooks — there's no per-component code-splitting
  within the package, since the whole surface is small enough that splitting would add bundler
  overhead without a meaningful download-size win for typical apps that use more than one
  picker. Apps using only `AvanDatePicker`, for example, will still download the full client
  bundle; this is a deliberate simplicity/size trade-off given the current total size.
- CSS is a single stylesheet bundled alongside the JS (no runtime CSS-in-JS cost); it's cached
  independently by the browser like any other static asset.
- `@avan-persian/holidays`'s size is dominated by the bundled JSON holiday datasets (1404–1406), not
  code — years outside that range use a small fixed-solar-holiday table instead.

## Rendering behavior

- **Memoization**: the combined disabled-date resolver (`createDisabledResolver`) and year-picker
  bounds calculation are memoized (`useMemo`) keyed on primitive values (`.getTime()` for
  `Date` props) rather than object identity, so passing a freshly-constructed-but-equivalent
  `Date` on every render doesn't force recomputation.
- **Controlled/uncontrolled state**: `useControllableState` avoids double state (no shadow state
  when the component is controlled), so controlled usage doesn't pay for an unused internal
  `useState`.
- **Keyboard navigation**: a single roving tab stop means the grid only ever has one focusable
  cell in the tab order at a time — no need to manage `tabIndex` across dozens of buttons on every
  keystroke beyond the two cells transitioning focus.
- **Live region updates**: the screen-reader announcement effect is deduplicated against the
  last-announced string (`lastAnnounced` ref) so identical consecutive selections don't cause
  redundant DOM writes.
- **Holiday loading**: `useIranHolidays` only recomputes when the visible year(s) or month count
  change (memoized on primitives, not the `visibleMonth` object reference), and merges bundled
  years with the currently visible year(s) rather than loading the entire multi-year dataset
  unconditionally.

## Animation cost

- CSS transitions (popover entrance, selection highlight) are GPU-friendly (`opacity`/`transform`)
  rather than layout-triggering properties.
- `disableAnimation` and `prefers-reduced-motion: reduce` both fully skip the transition/animation
  CSS, avoiding any compositing cost for users who've opted out.

## Testing overhead (not shipped to production)

The `@vitest/coverage-v8` provider adds no runtime cost to production bundles — it instruments
only during `pnpm coverage` test runs.

## Recommendations for consumers

- Prefer `numberOfMonths={1}` on mobile viewports (the CSS already adapts breakpoints down to a
  single-month layout, but the JS still needs to know how many months to generate/keep in the
  DOM — smaller `numberOfMonths` means fewer day cells rendered).
- Pass a stable reference for `isDateDisabled`/`getDayMeta` callbacks (e.g. via `useCallback`)
  when they're not trivial closures, to get the full benefit of the internal memoization chain
  that depends on them.
- For very large `disabledDates`/`disabledRanges` arrays, prefer expressing the same rule as an
  `isDateDisabled` predicate with an efficient lookup (e.g. a `Set`) rather than a large array
  scanned per day — `createDisabledResolver` checks `disabledDates`/`disabledRanges` with
  `Array#some`, which is O(n) per day checked.
