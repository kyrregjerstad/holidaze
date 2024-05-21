import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],

  test: {
    environment: 'jsdom',
    exclude: ['**/node_modules/**', '**/e2e/**'],
    setupFiles: ['./vitest/vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname,
    },
  },
});
