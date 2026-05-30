# Avan Playground

Local browser demo for **Avan Persian Date Picker**.

## Run

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
