import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const githubPagesBase = process.env.GITHUB_PAGES === 'true' ? '/avan-persian-date-picker/' : '/';

export default defineConfig({
  base: githubPagesBase,
  plugins: [react()],
  resolve: {
    alias: {
      '@avan/core': path.resolve(__dirname, '../../packages/core/src'),
      '@avan/holidays': path.resolve(__dirname, '../../packages/holidays/src'),
      '@avan/react/client': path.resolve(__dirname, '../../packages/react/src/client.ts'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
