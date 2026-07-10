# Migration Guide

Avan follows [semantic versioning](https://semver.org/) and publishes release notes for every
version via [Changesets](https://github.com/changesets/changesets) — see each package's
`CHANGELOG.md` (generated on release) for the exact list of changes in a given version.

This guide covers breaking changes between major versions once they ship. Since the current
release is pre-`1.0.0`, there is nothing to migrate from yet — this page will be filled in as
breaking changes land.

## General upgrade steps

1. Read the release notes / changelog for the version(s) you're skipping.
2. Update every `@avan-persian/*` package together (`pnpm up "@avan-persian/*"`) — packages in this monorepo are
   versioned independently but tested together, so mixing major versions across packages is
   unsupported.
3. Run your test suite; Avan's own components are covered by unit, component, and accessibility
   tests, but app-specific integrations (custom `getDayMeta`, custom locales, custom `components`
   overrides) should be re-verified after any major bump.
4. Check the [API Reference](./api-reference.md) for the props/exports you use — deprecated APIs
   are marked with `@deprecated` in the TypeScript types (e.g. `minYear`/`maxYear`, superseded by
   `minDate`/`maxDate`) and typically removed only in a following major version.

## Deprecated APIs (still supported)

| Deprecated                                      | Use instead           | Why                                                                                                                                                   |
| ----------------------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `minYear` / `maxYear` on `AvanCalendar`/pickers | `minDate` / `maxDate` | Day-level precision instead of year-only bounds; `minYear`/`maxYear` still work as a fallback for the year picker when `minDate`/`maxDate` are absent |

## Renamed/removed internal files

`packages/react/src/constants.ts` (hardcoded month/weekday names) was removed and replaced by
the locale system in `packages/react/src/locale.ts`. This only affects code that imported from
Avan's internal source paths directly (unsupported) — the public `@avan-persian/react`/`@avan-persian/react/client`
exports are unaffected.
