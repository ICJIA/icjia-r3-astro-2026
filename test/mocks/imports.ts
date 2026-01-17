/**
 * @fileoverview Mock for #imports Nuxt alias
 * @description Provides mocked implementations of Nuxt composables for testing
 */

import { ref, Ref } from "vue";

// Global state map for useState
const stateMap = new Map<string, Ref<any>>();

/**
 * Reset all state (for testing)
 */
export function resetState() {
  stateMap.clear();
}

/**
 * Mock implementation of Nuxt's useState composable
 */
export function useState<T>(key: string, init?: () => T | T): Ref<T> {
  if (!stateMap.has(key)) {
    const value = typeof init === "function" ? (init as () => T)() : init;
    stateMap.set(key, ref(value) as Ref<T>);
  }
  return stateMap.get(key) as Ref<T>;
}

// Export other common Nuxt composables as needed
export const useRouter = () => ({
  push: () => {},
  replace: () => {},
  back: () => {},
});

export const useRoute = () => ({
  path: "/",
  params: {},
  query: {},
});

export const useRuntimeConfig = () => ({
  public: {
    siteBase: "http://localhost:8000",
    apiBase: "http://localhost:8000/api",
  },
});
