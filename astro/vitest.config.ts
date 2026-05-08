import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
      // Astro's `astro:content` is a virtual module resolved by Astro's Vite
      // plugin at build time. Vitest needs a concrete shim that re-exports the
      // same underlying implementations (defineCollection from
      // astro/content/config, z from zod/v4) so collection schemas can be
      // imported and exercised directly in unit tests.
      'astro:content': fileURLToPath(
        new URL('./src/__mocks__/astro-content.ts', import.meta.url),
      ),
    },
  },
  test: {
    environment: 'happy-dom',
    globals: false,
    include: ['tests/unit/**/*.test.ts'],
    exclude: ['node_modules', 'dist', '.astro', 'tests/e2e'],
  },
});
