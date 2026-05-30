# Avan Playground

Local browser demo for **Avan Persian Date Picker**.

**Live demo:** [danial-riazati.github.io/avan-persian-date-picker](https://danial-riazati.github.io/avan-persian-date-picker/)

## Run locally

From the monorepo root:

```bash
corepack prepare pnpm@9.15.0 --activate
corepack pnpm install
corepack pnpm dev:playground
```

Or run directly in this folder (always works on Windows):

```bash
cd examples/playground
corepack pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).

## What you can test

- Single Jalali calendar selection
- Date picker — inline (`display="inline"`) or popover (`display="popover"`)
- Range picker (travel check-in / check-out) — inline or popover
- Iran holidays for 1404, 1405, and 1406 (all years loaded; navigate freely in calendars)
- English LTR variant

Changes in `packages/*` hot-reload through Vite aliases.

## Deploy (GitHub Pages)

Pushes to `main` run [`.github/workflows/deploy-playground.yml`](../../.github/workflows/deploy-playground.yml).

First-time setup in the GitHub repo:

1. **Settings → Pages**
2. **Build and deployment → Source:** GitHub Actions
3. Push to `main` (or run the workflow manually)

Production build uses base path `/avan-persian-date-picker/` (set via `GITHUB_PAGES=true` in CI).
