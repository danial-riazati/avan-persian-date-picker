# Contributing to Avan Persian Date Picker

Thank you for helping build the Persian date picker library the ecosystem deserves.

## Development setup

```bash
git clone https://github.com/danial-riazati/avan-persian-date-picker.git
cd avan-persian-date-picker
pnpm install
pnpm dev
```

Requirements: **Node.js ≥ 20**, **pnpm ≥ 9**.

## Project structure

- `packages/core` — date math (no React)
- `packages/holidays` — Iran holiday datasets
- `packages/react` — UI components
- `packages/travel` — booking / pricing features
- `packages/themes` — CSS tokens

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).

## Workflow

1. Open an issue for non-trivial changes
2. Branch from `main`: `feat/core-parse-jalali`
3. Write tests for `@avan/core` changes
4. Run `pnpm lint && pnpm test && pnpm build`
5. Add a Changeset: `pnpm changeset`
6. Open PR with description + screenshots (UI)

## Code style

- TypeScript strict mode
- Prefer explicit types on public APIs
- Persian copy in stories/docs should use correct Unicode (ی ک, not Arabic ي ك)
- RTL-first component tests

## Holiday data contributions

Add or fix holidays in `packages/holidays/data/YYYY.json` with source link in PR description.

## Questions

Open a GitHub Discussion or issue.
