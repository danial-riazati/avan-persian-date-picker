# Contributing to Avan Persian Date Picker

Thanks for your interest in contributing! This document explains how to get
set up, the structure of the monorepo, and the process for submitting
changes.

> This project does not currently have a maintainer response-time SLA, but
> issues and pull requests are welcome and will be reviewed as time allows.

## Prerequisites

- **Node.js** `>=20`
- **pnpm**, managed via [Corepack](https://nodejs.org/api/corepack.html)
  (Node's built-in package manager shim). This repo pins its version via the
  `packageManager` field in `package.json`.

To enable Corepack and get the pinned pnpm version:

```bash
corepack enable
corepack prepare pnpm@9.15.0 --activate
```

## Getting Started

```bash
git clone https://github.com/danial-riazati/avan-persian-date-picker.git
cd avan-persian-date-picker
pnpm install
```

## Monorepo Structure

This is a [pnpm](https://pnpm.io/) + [Turborepo](https://turbo.build/repo)
monorepo. The main packages live under `packages/`:

| Package          | Description                                                |
| ---------------- | ---------------------------------------------------------- |
| `@avan/core`     | Headless Jalali (Persian) date utilities                   |
| `@avan/react`    | React components for the date picker (the main UI package) |
| `@avan/holidays` | Iran public holidays data and helpers                      |
| `@avan/themes`   | Design tokens and CSS themes (including a Tailwind preset) |
| `@avan/travel`   | Travel & pricing extensions built on top of `@avan/react`  |

There's also a demo/development app:

| Directory             | Description                                    |
| --------------------- | ---------------------------------------------- |
| `examples/playground` | Vite + React playground app for manual testing |

## Common Commands

Run these from the repo root (they fan out to the relevant packages via
Turborepo):

```bash
pnpm dev              # run all packages in watch mode
pnpm dev:playground   # run just the playground demo app
pnpm build            # build all packages
pnpm test             # run all package tests
pnpm typecheck        # run TypeScript project-wide type checking
pnpm lint             # run Prettier check + ESLint across the repo
pnpm lint:fix         # auto-fix ESLint issues where possible
```

To run a command for a single package, use pnpm's `--filter` flag, for
example:

```bash
pnpm --filter @avan/core test
pnpm --filter @avan/react typecheck
pnpm --filter @avan/react build
```

## Code Style

- **TypeScript strict mode** is enabled repo-wide (`tsconfig.base.json`).
  Please avoid `any` and unnecessary type assertions where possible.
- **Prettier** formats the codebase; run `pnpm lint` before committing (or
  configure your editor to format on save using the repo's `.prettierrc`).
- **ESLint** (flat config, `eslint.config.js`) enforces additional rules,
  including React, React Hooks, and TypeScript best practices.
- **Accessibility (a11y)**: this is an accessibility-focused component
  library. Any new interactive UI element (buttons, day cells, inputs,
  popovers, etc.) **must**:
  - Be operable via keyboard (tab order, arrow-key navigation where
    appropriate, `Enter`/`Space` activation, `Escape` to close overlays).
  - Include appropriate ARIA roles/attributes (e.g. `aria-selected`,
    `aria-label`, `role="grid"`/`role="gridcell"` for calendar grids,
    `aria-live` for announcements where relevant).
  - Be checked against `eslint-plugin-jsx-a11y` rules (part of `pnpm lint`).
  - Respect focus management (visible focus states, no focus traps unless
    intentional and escapable).

## Commit Message Conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org/).
Recent commit history uses prefixes such as:

- `feat:` — a new feature
- `fix:` — a bug fix
- `docs:` — documentation-only changes
- `chore:` — maintenance tasks, tooling, dependency bumps
- `refactor:` — code changes that neither fix a bug nor add a feature
- `test:` — adding or updating tests
- `ci:` — changes to CI configuration
- `style:` — formatting-only changes (e.g. Prettier)

Example: `fix(react): correct focus trap in calendar popover`

## Adding a Changeset

This repo uses [Changesets](https://github.com/changesets/changesets) to
manage versioning and changelogs across the `@avan/*` packages. **Any PR that
changes the behavior or public API of a published package should include a
changeset.**

Before opening your PR, run:

```bash
pnpm changeset
```

Follow the prompts to select the affected package(s), choose a semver bump
type (patch/minor/major), and write a short summary. This will create a
Markdown file under `.changeset/` — commit it along with your code changes.

## Branching & Pull Request Process

1. Fork the repository (or create a branch, if you have write access).
2. Create a descriptive branch, e.g. `fix/calendar-keyboard-nav` or
   `feat/travel-price-range`.
3. Make your changes, following the code style guidance above.
4. Add or update tests for any behavior change.
5. Add a changeset if your change affects a published package (see above).
6. Before opening the PR, verify locally:
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm build
   ```
7. Open a pull request against `main` using the PR template, filling in all
   relevant sections (summary, related issues, type of change, checklist,
   and screenshots/recordings for any visual change).
8. Respond to review feedback. CI must pass before a PR can be merged.

## Reporting Issues

Please use the issue templates (bug report or feature request) when opening
a new issue, and search existing issues first to avoid duplicates.

## Code of Conduct

By participating in this project, you agree to abide by the
[Code of Conduct](./CODE_OF_CONDUCT.md).

## Security Issues

Please **do not** file public issues for security vulnerabilities — see
[SECURITY.md](./SECURITY.md) for how to report them responsibly.
