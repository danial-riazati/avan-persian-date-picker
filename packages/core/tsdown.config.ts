import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/convert.ts', 'src/grid.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
});
