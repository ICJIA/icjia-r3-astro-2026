/**
 * @fileoverview Test setup file for Vitest
 * @description Configures the testing environment with minimal mocks/utilities.
 */

import { vi } from "vitest";

// Many composables/pages import vue-router helpers; keep a light mock available.
vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  useRoute: () => ({
    path: "/",
    params: {},
    query: {},
  }),
}));

// Some code imports #app in Nuxt context; provide a minimal mock.
vi.mock("#app", () => ({
  useRuntimeConfig: () => ({
    public: {
      siteBase: "http://localhost:8000",
      apiBase: "http://localhost:8000/api",
    },
  }),
}));

// #imports is handled via vitest.config.ts alias to test/mocks/imports.ts

// Common browser API stubs
// @ts-expect-error - global is available in vitest runtime
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
