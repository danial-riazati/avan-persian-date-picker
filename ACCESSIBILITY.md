# Accessibility

Avan targets **WCAG 2.1 AA** conformance for every shipped component. This document describes
the implementation and how it's verified.

## Automated testing

`packages/react/src/components/avan-calendar.a11y.test.tsx` runs [`axe-core`](https://github.com/dequelabs/axe-core)
against rendered output for:

- A single-month, single-selection calendar (`fa-IR`, RTL).
- A two-month range-selection calendar (`en-IR`, LTR).
- An inline `AvanDatePicker`.
- An inline `AvanDateRangePicker` (`fa-IR`, RTL).

All four scenarios report **zero violations** and run in CI on every push/PR (`pnpm test` /
`pnpm coverage`). `color-contrast` is disabled in the automated check only because `jsdom` has no
real layout/paint engine to evaluate against — contrast ratios are verified manually against the
default theme (see [Theming](./documentation/theming.md)) and meet AA (4.5:1 for text, 3:1 for
UI components) with the default token values.

## Semantic structure

The day grid follows the [WAI-ARIA Authoring Practices "Grid" pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/):

```
<div role="grid" aria-label="...">
  <div role="row">
    <button role="gridcell" aria-selected="..." aria-label="...">...</button>
    ... 6 more gridcells ...
  </div>
  ... 5 more rows ...
</div>
```

- Each week is a `role="row"` element with `display: contents` in CSS — this preserves the CSS
  grid's 7-column visual layout while still exposing correct row semantics to assistive
  technology (a row is only given the `row` role when it has at least one exposed `gridcell`,
  since an all-hidden outside-month row must not claim a role that requires children).
- Day buttons carry `aria-selected`, `aria-disabled` (when applicable), and `aria-current="date"`
  for today.
- `aria-label` on each day includes the full localized date, the holiday title (if any), and
  "Today" (if applicable) — never just a bare day number, so screen reader users get full
  context without needing the visual grid position.
- Popovers use `role="dialog"` with `aria-modal="true"` and an `aria-label` describing their
  purpose (e.g. "Select a date range").
- The text-input trigger for `AvanDatePicker` (`allowTextInput`) uses `role="combobox"` with
  `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls` pointing at the popover — the
  documented ARIA "Date Picker Dialog" combobox pattern, rather than a bare `<input>` with
  unsupported `aria-expanded`.

## Keyboard navigation

The day grid implements a single roving tab stop (`packages/react/src/hooks/use-day-grid-keyboard.ts`)
so `Tab` moves focus in and out of the whole grid in one step, while arrow keys move within it:

| Key                               | Action                                                      |
| --------------------------------- | ----------------------------------------------------------- |
| `→` / `←`                         | Move focus one day (direction flips automatically in RTL)   |
| `↑` / `↓`                         | Move focus one week                                         |
| `Home` / `End`                    | Jump to the first/last day of the focused week              |
| `PageUp` / `PageDown`             | Move focus one month, paging the visible month(s) if needed |
| `Shift+PageUp` / `Shift+PageDown` | Move focus one year                                         |
| `Enter` / `Space`                 | Select the focused day                                      |

Disabled days are skipped (not landed on) when stepping by a single day via arrow keys, bounded
to a 60-day lookahead/lookback so a fully-disabled range can't hang keyboard navigation.

Popovers additionally trap `Tab`/`Shift+Tab` focus within themselves while open
(`packages/react/src/hooks/use-focus-trap.ts`), move focus to the first focusable element on
open, and restore focus to the trigger that opened them on close — verified in
`avan-date-picker.test.tsx`.

## Screen reader announcements

A visually-hidden `aria-live="polite"` region announces the current selection whenever it
changes (e.g. "Selected date: 1405/01/01", or the range/week/multiple-selection equivalent),
using the localized `selectedAnnouncement` string template so translations cover this too. This
means screen reader users get feedback on selection changes without needing to re-navigate to
the day grid to discover what was selected.

## Reduced motion & high contrast

- All transitions/animations respect `@media (prefers-reduced-motion: reduce)` automatically;
  `disableAnimation` on any component force-disables them regardless of the OS setting.
- `@media (forced-colors: active)` rules ensure day/selection states remain distinguishable via
  borders/outlines (not color alone) under Windows High Contrast Mode and similar user-agent
  overrides.

## Focus visibility

Every interactive element (day buttons, nav buttons, trigger buttons/inputs, month/year picker
options) has a visible `:focus-visible` outline that meets the WCAG 2.4.11 (AA, 2.2) minimum
target/contrast requirements with the default theme, and is themeable via the same CSS variable
system as everything else (see [Theming](./documentation/theming.md)).

## Manual testing notes

Beyond the automated `axe-core` suite, the following was manually verified during development:

- VoiceOver (macOS/Safari) reading order through a two-month range calendar: month captions,
  weekday headers, and day grids are announced in a logical order; range start/end/in-range
  states are conveyed via `aria-selected` and the live-region announcement rather than color
  alone.
- Full keyboard-only traversal (no mouse) of every selection mode, including opening a popover,
  navigating months across a page boundary, selecting, and closing.
- Windows High Contrast Mode rendering of selected/disabled/weekend/holiday day states.

## Reporting accessibility issues

If you find an accessibility issue, please open a GitHub issue using the bug report template
(see [CONTRIBUTING.md](./CONTRIBUTING.md)) with the assistive technology, browser, and OS you
were using — accessibility regressions are treated as high-priority bugs.
