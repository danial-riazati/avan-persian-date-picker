/**
 * Ambient-only import: pulls in `@testing-library/jest-dom`'s `vitest`
 * `Assertion` augmentation (`toBeInTheDocument`, `toHaveAttribute`, etc.) for
 * every `*.test.tsx` file typechecked as part of this package's `src` program.
 * `vitest.setup.ts` also imports this at runtime; this file exists purely so
 * `tsc` (which only includes `src`) sees the same matcher types.
 */
import '@testing-library/jest-dom/vitest';
