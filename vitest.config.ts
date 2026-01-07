/**
 * Vitest configuration for Nuxt/Vue testing.
 * @see https://vitest.dev/config/
 */

import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [vue()],

  test: {
    globals: true,
    environment: "happy-dom",
    include: ["test/**/*.test.ts", "test/**/*.spec.ts"],
    exclude: ["node_modules", "dist", ".output", ".nuxt"],

    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: "./coverage",
      exclude: [
        "node_modules",
        "test",
        "**/*.d.ts",
        "**/*.config.*",
        ".nuxt",
        ".output",
      ],
    },

    reporters: ["verbose", "json"],
    outputFile: {
      json: "./test-results.json",
    },

    setupFiles: ["./test/setup.ts"],
    testTimeout: 10000,
  },

  resolve: {
    alias: {
      "~": resolve(__dirname, "./"),
      "@": resolve(__dirname, "./"),
      "#imports": resolve(__dirname, "./test/mocks/imports.ts"),
    },
  },
});


