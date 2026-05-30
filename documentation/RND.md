# R&D — Avan Persian Date Picker

Research, competitive analysis, naming, and technical decisions for an open-source Persian calendar library.

---

## 1. Problem statement

Persian websites need calendars that:

- Show **correct Solar Hijri (Jalali / Shamsi)** dates with Iran's official holiday calendar
- Work in **modern React / Next.js** stacks (App Router, Server Components, Tailwind)
- Support **booking UX**: date ranges, nightly pricing, blocked inventory, min-stay rules
- Are **themeable** (brand fonts, colors) without copying component source
- Ship as a **maintainable npm library**, not a copy-pasted shadcn snippet

---

## 2. Competitive landscape (2025–2026)

### 2.1 Established players

| Library                                                                                      | Stars / traction  | Strengths                           | Gaps for our goals                                                 |
| -------------------------------------------------------------------------------------------- | ----------------- | ----------------------------------- | ------------------------------------------------------------------ |
| [react-multi-date-picker](https://github.com/shahabyazdi/react-multi-date-picker)            | ~980★             | Multi-calendar, range modes, mature | Legacy styling, react-date-object coupling, weak travel primitives |
| [persian-date-kit](https://github.com/aliseyedabady/darvix-persian-date-kit)                 | New, active       | SSR-safe, controlled, RHF adapter   | No pricing/holiday/travel layer, smaller ecosystem                 |
| [@mrasti/jalali-react-calendar](https://www.npmjs.com/package/@mrasti/jalali-react-calendar) | Very new          | shadcn-inspired, dual calendar      | Early stage, no travel features                                    |
| [shadcn-jalali-calendar](https://github.com/javadshoja/shadcn-jalali-calendar)               | Registry          | shadcn CLI install                  | Not a unified npm product; copy-paste maintenance                  |
| react-day-picker `/persian` + date-fns-jalali                                                | De facto standard | Excellent a11y, maintained          | No Persian holidays, no pricing, assembly required                 |

### 2.2 Core date engines

| Engine                      | Recommendation                                                                          |
| --------------------------- | --------------------------------------------------------------------------------------- |
| **date-fns-jalali**         | ✅ Primary — tree-shakeable, TS-native, aligns with react-day-picker v9 Persian support |
| jalaali-js                  | Legacy; fine for conversion only                                                        |
| moment-jalaali              | ❌ Avoid — bundle size, maintenance mode                                                |
| dayjs + jalaliday           | Used by persian-date-kit; acceptable but less comprehensive than date-fns-jalali        |
| @persian-tools/persian-date | Good for validation/display; optional peer for input parsing                            |

**Decision:** `@avan/core` wraps `date-fns-jalali` with a stable Avan API so consumers are not locked to date-fns function names.

---

## 3. Differentiation (unique value)

What Avan adds that others don't combine:

1. **Monorepo with clear layers** — core / holidays / react / travel / themes
2. **Travel-first API** — `pricing`, `minNights`, `blockedDates`, `onRangeConfirm` with Jalali metadata
3. **Official Iran holidays** — versioned JSON per year, Friday + public holiday modifiers
4. **Design system ready** — CSS variables + Tailwind v4 preset + optional unstyled headless hooks
5. **Next.js 15 playbook** — documented RSC boundaries, URL state, Server Action serialization
6. **Exact Jalali range semantics** — range boundaries reported as `{ gregorian, jalali }` pairs

---

## 4. Naming

### 4.1 Criteria

- Memorable in Persian **and** English-speaking dev communities
- Available npm scope (`@avan/*` or single package)
- Not generic (`persian-calendar-2`)
- Positive association with **time**, **direction**, or **travel**
- Short CLI import paths

### 4.2 Candidates evaluated

| Name            | Pros                                                    | Cons                                | Verdict            |
| --------------- | ------------------------------------------------------- | ----------------------------------- | ------------------ |
| **Avan** (آوان) | Persian _time_ / _era_; elegant, short; `@avan/*` scope | Less literal than "date" in English | ✅ **Selected**    |
| ShamsiKit       | Descriptive, SEO-friendly                               | Generic; hard to trademark          | Reserve as tagline |
| Ruzgar (روزگار) | Poetic ("era/time")                                     | Hard to spell for devs              | Alt brand          |
| SafarCal        | Obvious travel angle                                    | Too niche sounding                  | Submodule name     |
| Taarikh         | Means "date"                                            | Too generic                         | ❌                 |
| Mehr UI         | Month name + sun                                        | Conflicts with other "Mehr" libs    | ❌                 |
| Jalali Forge    | Technical                                               | Long, cold                          | ❌                 |

### 4.3 Final naming

| Asset               | Value                                          |
| ------------------- | ---------------------------------------------- |
| **Product name**    | Avan Persian Date Picker                       |
| **npm scope**       | `@avan`                                        |
| **Primary package** | `@avan/react` (most users install this + core) |
| **GitHub repo**     | `danial-riazati/avan-persian-date-picker`      |
| **Tagline**         | Modern Jalali date picker for React & Next.js  |

Persian display name: **تقویم و انتخابگر تاریخ آوان**

---

## 5. Technical stack (2026)

| Layer      | Choice                                      | Rationale                             |
| ---------- | ------------------------------------------- | ------------------------------------- |
| Language   | TypeScript 5.x strict                       | Library quality bar                   |
| Monorepo   | pnpm workspaces + Turborepo                 | Fast CI, shared tooling               |
| Bundler    | tsdown (or tsup)                            | ESM + CJS + `.d.ts`, tree-shaking     |
| Date math  | date-fns-jalali                             | Ecosystem alignment                   |
| React      | 19 peer dep                                 | Next.js 15 default                    |
| Styling    | CSS variables + optional Tailwind v4 preset | Framework-agnostic theming            |
| Docs       | Storybook 8 + VitePress site (Phase 6)      | Visual QA + public docs               |
| Tests      | Vitest + @testing-library/react             | Fast, ESM-native                      |
| CI         | GitHub Actions                              | lint, test, build, Changesets publish |
| Versioning | Changesets                                  | Monorepo semver                       |

### 5.1 Next.js compatibility checklist

- [ ] All interactive components marked `'use client'`
- [ ] No `window` / `document` during render (SSR-safe)
- [ ] `suppressHydrationWarning` only where documented
- [ ] Dynamic import example for heavy travel bundle
- [ ] ISO string contract for Server Actions

### 5.2 Accessibility targets

- WCAG 2.2 AA for focus, contrast tokens
- Keyboard: arrow keys, Home/End, PageUp/Down month nav
- `aria-selected`, `aria-disabled`, live region for range summary
- `prefers-reduced-motion` disables slide transitions

---

## 6. Holiday data strategy

**Sources (manual curation + verification):**

- Iran Cabinet / official announcements (Nowruz block, public holidays)
- Friday as weekend (Iran)
- Optional: religious holidays with moon-sighting flag (`tentative: true`)

**Format:**

```ts
interface AvanHoliday {
  date: string; // Jalali ISO: YYYY-MM-DD
  title: string;
  titleEn?: string;
  type: 'public' | 'religious' | 'cultural';
  tentative?: boolean;
}
```

Ship `@avan/holidays/1404`, `1405`, … as subpath exports for tree-shaking.

---

## 7. Risk register

| Risk                                | Mitigation                                                        |
| ----------------------------------- | ----------------------------------------------------------------- |
| Jalali vs Gregorian off-by-one      | Golden tests against known dates; document internal `Date` policy |
| Holiday accuracy                    | Yearly data packages + community PRs                              |
| Scope creep                         | Strict package boundaries in ARCHITECTURE.md                      |
| Competing with free shadcn snippets | Win on travel API, holidays, maintenance, npm DX                  |
| Bundle size                         | Subpath exports; `@avan/travel` optional                          |

---

## 8. Success metrics (post-launch)

- npm weekly downloads (target: 500+/mo within 6 months)
- Used in ≥3 production travel/booking sites (case studies)
- <15kb gzip for `@avan/react` minimal import
- 90%+ test coverage on `@avan/core`

---

## 9. References

- [date-fns-jalali](https://github.com/date-fns-jalali/date-fns-jalali)
- [react-day-picker Persian calendar](https://daypicker.dev/docs/localization#persian-calendar)
- [react-multi-date-picker](https://github.com/shahabyazdi/react-multi-date-picker)
- [persian-date-kit](https://github.com/aliseyedabady/darvix-persian-date-kit)
