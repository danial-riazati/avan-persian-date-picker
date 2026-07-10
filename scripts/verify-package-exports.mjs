#!/usr/bin/env node
/**
 * Post-build sanity check for every publishable package: every path referenced by
 * `package.json#exports` (and `main`/`types`) must exist on disk, and every top-level entry in
 * `files` must exist and be non-empty. Run after `pnpm build`, before publishing.
 *
 * Catches the class of bug where an export subpath is added/kept in `package.json` but the build
 * step no longer emits the file (or vice versa) — which would otherwise only surface as a broken
 * import for real npm consumers, long after publish.
 */
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const packagesDir = join(rootDir, 'packages');

/** @type {string[]} */
let errors = [];

function collectExportTargets(exportsField, acc = []) {
  if (!exportsField) return acc;
  if (typeof exportsField === 'string') {
    acc.push(exportsField);
    return acc;
  }
  if (typeof exportsField === 'object') {
    for (const value of Object.values(exportsField)) {
      collectExportTargets(value, acc);
    }
  }
  return acc;
}

function checkPackage(pkgDir) {
  const pkgJsonPath = join(pkgDir, 'package.json');
  if (!existsSync(pkgJsonPath)) return;

  const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
  if (pkg.private) return;

  const name = pkg.name ?? pkgDir;
  const targets = new Set(collectExportTargets(pkg.exports));
  if (pkg.main) targets.add(pkg.main);
  if (pkg.types) targets.add(pkg.types);
  if (pkg.module) targets.add(pkg.module);

  for (const target of targets) {
    const abs = join(pkgDir, target);
    if (!existsSync(abs)) {
      errors.push(`${name}: exports/main/types references missing file "${target}"`);
    } else if (statSync(abs).size === 0) {
      errors.push(`${name}: exports/main/types references empty file "${target}"`);
    }
  }

  for (const entry of pkg.files ?? []) {
    const abs = join(pkgDir, entry);
    if (!existsSync(abs)) {
      errors.push(`${name}: "files" entry "${entry}" does not exist (build ran?)`);
    }
  }

  if (!pkg.files || pkg.files.length === 0) {
    errors.push(`${name}: missing "files" allowlist — publish would include the whole package dir`);
  }

  if (!existsSync(join(pkgDir, 'README.md'))) {
    errors.push(`${name}: missing README.md — npm package page will be empty`);
  }
}

const packageDirs = readdirSync(packagesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => join(packagesDir, entry.name));

for (const dir of packageDirs) {
  checkPackage(dir);
}

if (errors.length > 0) {
  console.error('✖ Package export verification failed:\n');
  for (const error of errors) console.error(`  - ${error}`);
  console.error(`\n${errors.length} problem(s) found.`);
  process.exit(1);
}

console.log(
  `✔ Verified exports for ${packageDirs.length} package(s) — all referenced files exist.`,
);
