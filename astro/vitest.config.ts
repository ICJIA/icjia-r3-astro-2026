import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'happy-dom',
    globals: false,
    include: ['tests/unit/**/*.test.ts'],
    exclude: ['node_modules', 'dist', '.astro', 'tests/e2e'],
  },
});
