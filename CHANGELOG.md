# Changelog

This file summarizes notable changes across the whole monorepo at a glance. Once packages start
publishing releases, each package also gets its own auto-generated `CHANGELOG.md`
(via [Changesets](https://github.com/changesets/changesets)) with per-version, per-package
detail — this root file is a human-curated overview.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/); this project
follows [Semantic Versioning](https://semver.org/) once it reaches `1.0.0`.

## [0.1.1]

### Changed

- Added the project's promo banner (real product-screenshot collage) to every package's npm
  README, and to the root `README.md`.
- Removed the stale `docs/` folder left over from an earlier GitHub Pages deploy strategy — CI
  now publishes the playground straight to the `gh-pages` branch.

## [0.1.0] — first public release

A comprehensive audit-and-productionize pass across the whole toolkit, and the first version
published to npm.

### Added

- **New selection modes**: `multiple`, `multiRange`, `week`, `month`, `year` (previously only
  `single`/`range`) on `AvanCalendar` and dedicated picker components (`AvanMultiDatePicker`,
  `AvanWeekPicker`, `AvanMonthPicker`, `AvanYearPicker`).
- **Time selection**: `AvanTimePicker` and `AvanDateTimePicker`, with 12/24-hour cycles, seconds,
  and configurable minute stepping.
- **`@avan-persian/travel`**: booking/pricing helpers (`validateTravelRange`, `isRangeAvailable`,
  `computeRangePrice`, `findLowestPriceInMonth`, `createPriceDayMeta`) for travel/hotel/e-commerce
  calendars.
- **Locale system overhaul**: `AvanLocaleDefinition`/`AvanLocale` types support full custom
  locales (any language) or partial overrides on top of the `fa-IR`/`en-IR` presets, replacing
  hardcoded month/weekday name constants.
- **Configurable week**: `weekStartsOn` and `weekendDays` props (previously hardcoded to
  Saturday-first / Friday-weekend).
- **Constraints**: `disabledWeekdays` and `disabledRanges` as first-class props, composed with
  `minDate`/`maxDate`/`isDateDisabled`/`disabledDates` via `createDisabledResolver`.
- **Custom rendering**: `components` prop (`DayContent`, `Day`, `NavButton`, `Caption`, `Footer`)
  and `getDayMeta` for per-day badges/pricing/availability/tooltips.
- **Navigation UX**: touch swipe navigation, opt-in mouse-wheel navigation, "Today"/"Clear"
  footer buttons, loading/skeleton state.
- **Accessibility**: WAI-ARIA grid keyboard navigation (roving tabindex, arrow keys,
  Home/End/PageUp/PageDown), popover focus trap with restoration, live-region selection
  announcements, `role="combobox"` text-input trigger.
- **`@avan-persian/core` additions**: `business.ts` module (`isBusinessDay`, `addBusinessDays`,
  `countBusinessDays`, `getFiscalYearBounds`, `getJalaliQuarter`, `daysInJalaliYear`,
  `compareJalali`, `getDaysInRange`), `tryParseJalali`, `startOfJalaliWeek`/`endOfJalaliWeek`,
  `getWeekdayIndex`.
- **Text input mode** for `AvanDatePicker` (`allowTextInput`) with tolerant Persian/Western digit
  and `/`/`-` separator parsing.
- **Testing**: full unit/component/accessibility test suite (86 tests) using Vitest,
  `@testing-library/react`, and `axe-core`.
- **Repository governance & CI**: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, GitHub
  issue/PR templates, ESLint flat config, Changesets, and CI jobs for lint/typecheck/coverage/build
  plus an automated release workflow.
- **Documentation**: full guide set (`documentation/`) covering installation, quickstart, API
  reference, theming, localization, SSR, recipes, migration, and FAQ, plus this changelog and the
  audit/accessibility/performance reports.

### Changed

- `AvanTheme.extra` is now typed to accept arbitrary `--custom-property` CSS variables (previously
  typed as plain `CSSProperties`, which rejected custom properties at the type level).
- Day metadata/format-display utilities are now locale-aware (`AvanLocaleDefinition`) instead of
  taking a bare `dir` string in some call sites.
- `jsdom` pinned to `25.0.1` in `@avan-persian/react`'s dev dependencies to avoid an ESM/CJS interop issue
  with `html-encoding-sniffer` present in some `jsdom` v29.x releases.

### Fixed

- Day grid rows now expose proper `role="row"` ARIA semantics (previously gridcells were direct
  children of `role="grid"` with no row grouping), resolving `aria-required-parent`/
  `aria-required-children` axe violations.
- Text-input trigger no longer sets `aria-expanded` on a bare `role="textbox"` (unsupported by
  that role); it now uses `role="combobox"` with `aria-controls`, matching the WAI-ARIA "Date
  Picker Dialog" pattern.
- Focus trap no longer relies on `offsetParent` (always `null` in `jsdom`, and unreliable for
  legitimately-visible elements in some layouts) to determine focusable elements.
- **`@avan-persian/react`'s structural CSS (`.avan-calendar`, `.avan-day`, popover, time-picker layout) was
  unreachable by real consumers** — it was built to `dist/client.css` but never exposed via
  `package.json#exports`, and no documentation mentioned importing it. Added a `"./client.css"`
  export and updated every doc/example to `import '@avan-persian/react/client.css'` alongside
  `@avan-persian/themes/default.css`. Added `scripts/verify-package-exports.mjs`, run in CI after every
  build, to catch this class of bug (an `exports` entry pointing at a file the build doesn't emit,
  or vice versa) before it reaches npm again.
- `@avan-persian/holidays` was missing `"./1404"` and `"./1406"` subpath exports for its bundled yearly
  datasets (only `"./1405"` was wired up).
- `@avan-persian/react`'s `main` field pointed at the client (interactive) bundle while its `exports["."]`
  pointed at the server-safe types-only bundle — inconsistent behavior between `exports`-aware and
  legacy tooling. `main` now matches `exports["."]`.
- `@avan-persian/themes`'s Tailwind preset shipped as raw, unbuilt TypeScript (`src/tailwind.preset.ts`),
  which breaks for any Tailwind config that doesn't run through a TS loader. It's now compiled to
  `dist/tailwind.preset.js` + `.d.ts` via `tsdown`, like every other package.

## [0.0.0] — initial scaffold

Initial monorepo scaffold: `@avan-persian/core`, `@avan-persian/react`, `@avan-persian/holidays`, `@avan-persian/themes`, basic
`AvanCalendar`/`AvanDatePicker`/`AvanDateRangePicker`, CI build/lint pipeline, and GitHub Pages
playground deployment.
