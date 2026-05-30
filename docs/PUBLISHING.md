# Publishing Avan — GitHub & npm guide

The best setup for an open-source Persian date picker: **one public GitHub monorepo** + **scoped npm packages** under `@avan/*`.

---

## Recommended names

| Asset                 | Recommended                                          | Why                                                                                       |
| --------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **GitHub repository** | `avan-persian-date-picker`                           | Clear on Google/npm; says exactly what it is                                              |
| **GitHub URL**        | `github.com/danial-riazati/avan-persian-date-picker` | Use your personal account to start; migrate to org later                                  |
| **npm scope**         | `@avan`                                              | Short, matches brand — create at [npmjs.com/org/create](https://www.npmjs.com/org/create) |
| **Primary install**   | `@avan/react`                                        | What most users add                                                                       |
| **Product name**      | Avan Persian Date Picker                             | README, docs, marketing                                                                   |
| **Persian name**      | تقویم و انتخابگر تاریخ آوان                          | Optional for Persian docs site                                                            |

### If `@avan` is taken on npm

Use one of these (pick one and stay consistent):

| Fallback scope | Example package              |
| -------------- | ---------------------------- |
| `@avan-shamsi` | `@avan-shamsi/react`         |
| `@avan-date`   | `@avan-date/react`           |
| Your username  | `@danial-riazati/avan-react` |

> **Tip:** Check availability before branding hard: `npm view @avan/react` (404 = name likely free).

### GitHub org (optional, later)

When the project grows, create org **`avan-shamsi`** or **`avan-date`** and transfer the repo:

```
github.com/avan-shamsi/avan-persian-date-picker
```

---

## Step-by-step: first publish

### 1. Create the GitHub repository

```bash
cd C:\Users\Danial\avan-persian-date-picker

git add -A
git commit -m "chore: Avan Persian Date Picker monorepo scaffold"
git branch -M main
```

**On GitHub (web UI):**

1. **New repository**
2. Name: **`avan-persian-date-picker`**
3. Description: `Modern Jalali (Shamsi) date picker for React & Next.js — آوان`
4. Public, **no** README (you already have one)
5. License: MIT (already in repo)

**Push:**

```bash
git remote add origin https://github.com/danial-riazati/avan-persian-date-picker.git
git push -u origin main
```

---

### 2. Create npm organization `@avan`

1. Log in at [npmjs.com](https://www.npmjs.com/)
2. **Account → Organizations → Create**
3. Name: `avan`
4. Free unlimited public packages

Link npm to GitHub org (optional but recommended for trusted publishes).

---

### 3. Configure package metadata

Each package under `packages/*/package.json` should include:

```json
{
  "name": "@avan/react",
  "version": "0.1.0",
  "publishConfig": {
    "access": "public"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/danial-riazati/avan-persian-date-picker.git",
    "directory": "packages/react"
  },
  "homepage": "https://github.com/danial-riazati/avan-persian-date-picker#readme",
  "bugs": {
    "url": "https://github.com/danial-riazati/avan-persian-date-picker/issues"
  },
  "keywords": [
    "avan",
    "persian",
    "jalali",
    "shamsi",
    "date-picker",
    "calendar",
    "react",
    "nextjs",
    "rtl",
    "farsi",
    "iran",
    "holidays"
  ]
}
```

Repeat for `@avan/core`, `@avan/holidays`, `@avan/themes`, `@avan/travel`.

---

### 4. Authentication for CI (recommended)

**Do not** publish from your laptop long-term. Use GitHub Actions + npm token.

1. npm → **Access Tokens** → Generate **Automation** token
2. GitHub repo → **Settings → Secrets → Actions**
3. Add secret: `NPM_TOKEN`

Add `.github/workflows/release.yml` when Phase 1+ is ready (after Changesets):

```yaml
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
          registry-url: https://registry.npmjs.org
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: changesets/action@v1
        with:
          publish: pnpm release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

### 5. Versioning workflow (Changesets)

Already configured in root `package.json`:

```bash
# After completing a feature:
pnpm changeset          # pick @avan/core, patch/minor, summary
git add .
git commit -m "chore: version packages"
git push

# On merge to main, CI publishes to npm automatically
```

**First manual publish** (before CI):

```bash
pnpm login
pnpm build
pnpm changeset publish
```

---

### 6. What to publish when (order)

| Order | Package          | When                                        |
| ----- | ---------------- | ------------------------------------------- |
| 1     | `@avan/core`     | Phase 1 complete + tests green              |
| 2     | `@avan/holidays` | Phase 2                                     |
| 3     | `@avan/themes`   | Phase 4 (CSS, no build blocker)             |
| 4     | `@avan/react`    | Phase 3 — **main entry most users install** |
| 5     | `@avan/travel`   | Phase 5 — optional peer                     |

Start with **`0.1.0`** until Phase 3 calendar UI works; then **`1.0.0`** when API is stable.

---

### 7. npm package page quality

On first publish, npm pulls from `README.md` in each package. Add a short `packages/react/README.md`:

```markdown
# @avan/react

React components for **Avan Persian Date Picker** (Jalali / Shamsi).

Full docs: https://github.com/danial-riazati/avan-persian-date-picker
```

Add **repository**, **keywords**, and **homepage** so npm search ranks for: `persian date picker`, `jalali`, `shamsi`, `react`, `nextjs`.

---

### 8. GitHub repo polish (before announcing)

- [ ] Pin repo description: _Avan — Modern Jalali date picker for React & Next.js (آوان)_
- [ ] Add topics: `persian`, `jalali`, `shamsi`, `datepicker`, `react`, `nextjs`, `typescript`, `rtl`, `iran`, `calendar`
- [ ] Enable **Issues** and **Discussions**
- [ ] Add `SECURITY.md` for responsible disclosure
- [ ] GitHub Pages or Vercel for docs (Phase 6)

---

## Summary — do this

```
GitHub:  danial-riazati/avan-persian-date-picker
npm:     @avan/react  (+ @avan/core, @avan/holidays, …)
License: MIT
Release: Changesets + GitHub Actions + NPM_TOKEN
```

This is the standard pattern used by mature monorepos (TanStack, Radix, etc.): **one GitHub repo**, **multiple scoped npm packages**, automated releases from `main`.
