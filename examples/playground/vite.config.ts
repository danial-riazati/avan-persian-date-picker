import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
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
