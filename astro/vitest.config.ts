import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: false,
    include: ['tests/unit/**/*.test.ts'],
    exclude: ['node_modules', 'dist', '.astro', 'tests/e2e'],
  },
});
