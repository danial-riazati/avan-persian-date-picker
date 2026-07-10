import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/convert.ts', 'src/grid.ts', 'src/business.ts', 'src/digits.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
});
