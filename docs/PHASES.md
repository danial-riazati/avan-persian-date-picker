# Implementation Phases — Avan Persian Date Picker

Senior-engineer execution plan. Each phase has **exit criteria** before moving on.

Estimated total: **8–12 weeks** (solo, part-time) or **4–6 weeks** (full-time).

---

## Phase 0 — R&D & repository scaffold ✅

**Goal:** Validate direction, name, and repo skeleton.

**Tasks:**

- [x] Competitive analysis → [`RND.md`](./RND.md)
- [x] Choose name: **Avan** (آوان) — Avan Persian Date Picker
- [x] Monorepo layout + README
- [ ] Create GitHub repo [`danial-riazati/avan-persian-date-picker`](https://github.com/danial-riazati/avan-persian-date-picker)
- [ ] Add MIT LICENSE, CODE_OF_CONDUCT, SECURITY.md

**Exit criteria:** README renders; `pnpm install` succeeds; CI stub green.

---

## Phase 1 — `@avan/core` (headless engine)

**Goal:** Framework-agnostic Jalali date utilities with exhaustive tests.

**Duration:** ~1.5 weeks

### 1.1 Types & contracts

```ts
// packages/core/src/types.ts
export interface JalaliDate {
  year: number;
  month: number;  // 1-12
  day: number;    // 1-31
}

export interface AvanDate {
  gregorian: Date;
  jalali: JalaliDate;
}

export interface CalendarDay {
  date: AvanDate;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean; // Friday in Iran
  isDisabled: boolean;
}
```

### 1.2 Implement

| Module | Functions |
|---|---|
| `convert` | `toJalali`, `toGregorian`, `parseJalali`, `formatJalali` |
| `grid` | `getMonthGrid`, `getWeekDays`, `addMonths`, `startOfMonth` |
| `compare` | `isSameDay`, `isBefore`, `isAfter`, `isWithinInterval` |
| `validate` | `isValidJalali`, `daysInMonth`, leap year helper |

### 1.3 Tests

- Golden vectors: Nowruz boundaries, Esfand 29/30, leap years
- Property tests for round-trip `gregorian → jalali → gregorian`

### 1.4 Build

```bash
# packages/core/package.json exports
{
  "exports": {
    ".": "./dist/index.js",
    "./convert": "./dist/convert.js",
    "./grid": "./dist/grid.js"
  }
}
```

**Exit criteria:** 95%+ coverage; zero runtime deps OR only `date-fns-jalali`; published to npm `@avan/core@0.1.0` (canary).

---

## Phase 2 — `@avan/holidays`

**Goal:** Accurate, tree-shakeable Iran holiday datasets.

**Duration:** ~1 week

### 2.1 Data pipeline

```
packages/holidays/
  data/
    1404.json
    1405.json
  scripts/
    validate-holidays.ts   # CI: all dates valid Jalali
  src/
    get-holidays.ts
    modifiers.ts           # Map holidays → DayModifier[]
```

### 2.2 API

```ts
import { getIranHolidays, isHoliday } from '@avan/holidays';

const holidays = getIranHolidays(1405);
isHoliday(new Date(), holidays);
```

### 2.3 Include

- Fixed public holidays (Nowruz block, 22 Bahman, etc.)
- Fridays as weekend (configurable)
- `tentative` flag for religious dates

**Exit criteria:** JSON schema validated in CI; Storybook story showing holiday dots on calendar.

---

## Phase 3 — `@avan/react` (base UI)

**Goal:** Production calendar + pickers without travel features yet.

**Duration:** ~2 weeks

### 3.1 Component tree

```
AvanProvider          # locale, dir, theme tokens
├── AvanCalendar      # inline month grid
├── AvanDatePicker    # input + popover
└── AvanDateRangePicker
```

### 3.2 Implementation order

1. **Headless hook** `useAvanCalendar` — state: visible month, selection, focused day
2. **Day cell** — slots: `renderDay`, `DayButton` unstyled
3. **Month navigation** — prev/next, month/year dropdown
4. **Selection modes** — single, range, multiple (optional v0.2)
5. **Popover** — Radix Popover OR native positioning (peer `@radix-ui/react-popover`)

### 3.3 Next.js integration

- Export `'use client'` entry only from `@avan/react/client`
- SSR-safe: default month from prop, not `new Date()` alone during SSR mismatch

```tsx
// packages/react/src/client.ts
'use client';
export { AvanCalendar, AvanDatePicker, AvanDateRangePicker } from './components';
```

### 3.4 a11y

- Roving tabindex on day grid
- Arrow key navigation
- Screen reader labels in Farsi + English

**Exit criteria:** Storybook stories for single + range; RTL/LTR; works in Next.js 15 sample app.

---

## Phase 4 — `@avan/themes` (design system)

**Goal:** Beautiful default UI + full customization.

**Duration:** ~1 week

### 4.1 CSS architecture

```css
/* packages/themes/default.css */
.Avan-root {
  --Avan-font-family: ...;
  --Avan-accent: ...;
  /* 20–30 tokens */
}
```

### 4.2 Presets

- `default` — clean modern (Vazirmatn-friendly)
- `minimal` — borderless
- `travel` — price-friendly taller cells
- `dark` — `[data-theme="dark"]`

### 4.3 Tailwind v4

```ts
// @avan/themes/tailwind
export default {
  theme: {
    extend: {
      colors: { Avan: { accent: 'var(--Avan-accent)' } },
    },
  },
};
```

### 4.4 Font strategy

- No bundled fonts — document Vazirmatn, IRANSans, Yekan via CSS vars
- `theme.fontFamily` prop overrides `--Avan-font-family`

**Exit criteria:** Demo switching themes live in Storybook; contrast passes WCAG AA with default tokens.

---

## Phase 5 — `@avan/travel` (tourism & pricing)

**Goal:** Differentiator for booking sites.

**Duration:** ~2 weeks

### 5.1 Features

| Feature | API sketch |
|---|---|
| Price per night | `pricing: Record<JalaliISO, PriceInfo>` |
| Range total | `computeRangePrice(from, to, pricing)` |
| Min/max nights | `rules.minNights`, `rules.maxNights` |
| Blocked dates | `rules.disabledDates(date) => boolean` |
| Check-in/out days | `rules.allowedCheckInWeekdays` |
| Hover preview | Show subtotal while selecting range |

### 5.2 Components

```tsx
<AvanTravelCalendar
  pricing={pricing}
  rules={rules}
  onRangeConfirm={(summary) => {
    // summary.jalaliFrom, summary.jalaliTo, summary.totalPrice
  }}
/>
```

### 5.3 UX details

- Price badge under day number (truncate with `label` prop)
- Holiday + high-price visual hierarchy
- Mobile: two-month vertical scroll for range selection

**Exit criteria:** Reference implementation: fake hotel booking page in `examples/nextjs-travel`.

---

## Phase 6 — Documentation & DX

**Goal:** Adoption-ready developer experience.

**Duration:** ~1.5 weeks

### 6.1 Docs site (VitePress)

- Getting started (Next.js, Vite, CRA)
- Theming guide
- Travel recipes
- Holiday data contribution guide
- API reference (typedoc)

### 6.2 Examples

```
examples/
  nextjs-app-router/     # Primary
  vite-react/
  react-hook-form/
  node-scripts/          # core-only usage
```

### 6.3 Tooling

- Changesets + GitHub Actions → npm publish
- Bundle size CI (size-limit)
- Playwright smoke tests for examples

**Exit criteria:** GitHub Pages or Vercel docs site live; all examples deploy.

---

## Phase 7 — npm publish & community

**Goal:** Stable v1.0.0.

**Duration:** ~1 week

### 7.1 Pre-release checklist

- [ ] Semver policy documented
- [ ] CHANGELOG for 1.0.0
- [ ] Security policy
- [ ] npm org `@avan` created
- [ ] `@avan/react`, `@avan/core`, `@avan/holidays` published
- [ ] `@avan/travel` optional peer

### 7.2 Launch

- Show HN / Iranian dev communities / Twitter
- Comparison table vs alternatives (honest)
- "Adopters" section in README

**Exit criteria:** v1.0.0 tagged; install works from npm in fresh Next.js 15 project in <5 minutes.

---

## Phase 8 — Post v1 (backlog)

- Vue adapter (`@avan/vue`)
- iCal export for selected range
- Locale packs: `fa-IR`, `en-IR`, `ar-IR`
- Moon-sighting religious holiday updates via optional CDN fetch
- Figma kit matching CSS tokens

---

## Suggested weekly cadence (solo dev)

| Week | Focus |
|---|---|
| 1 | Phase 1 core + tests |
| 2 | Phase 2 holidays + Phase 3 hook |
| 3 | Phase 3 components |
| 4 | Phase 4 themes |
| 5–6 | Phase 5 travel |
| 7 | Phase 6 docs |
| 8 | Phase 7 publish + polish |

---

## Definition of Done (global)

Every PR must:

1. Include tests for `@avan/core` changes
2. Update Storybook if UI changed
3. Pass `pnpm lint && pnpm test && pnpm build`
4. Not increase default bundle over budget without ADR
