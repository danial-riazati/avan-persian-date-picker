import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/tailwind.preset.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
});
