/**
 * @fileoverview State management composables for the ICJIA R3 Nuxt 3 application.
 * This module provides reactive state management using Nuxt 3's native useState composable,
 * replacing Pinia stores as per project preferences.
 *
 * @since 1.0.0
 */

import { useState } from "#imports";
import { readonly } from "vue";

/**
 * Provides a reactive counter state for general counting operations.
 *
 * @returns {Ref<number>} A reactive reference to the counter value, initialized to 0
 *
 * @example
 * ```typescript
 * const counter = useCounter();
 * counter.value++; // Increment counter
 * console.log(counter.value); // Access current value
 * ```
 *
 * @since 1.0.0
 */
export const useCounter = () => useState<number>("counter", () => 0);

/**
 * Provides a reactive color state for theme or UI color management.
 *
 * @returns {Ref<string>} A reactive reference to the color value, initialized to "pink"
 *
 * @example
 * ```typescript
 * const color = useColor();
 * color.value = "blue"; // Change color
 * console.log(color.value); // Access current color
 * ```
 *
 * @since 1.0.0
 */
export const useColor = () => useState<string>("color", () => "pink");

/**
 * Provides a reactive navigation toggle state for mobile menu visibility.
 *
 * @returns {Ref<boolean>} A reactive reference to the navigation toggle state, initialized to false
 *
 * @example
 * ```typescript
 * const navToggle = useNavToggle();
 * navToggle.value = true; // Show mobile navigation
 * navToggle.value = !navToggle.value; // Toggle navigation
 * ```
 *
 * @since 1.0.0
 */
export const useNavToggle = () => useState<boolean>("nav", () => false);

/**
 * Provides a reactive counter state with a custom initial value.
 *
 * @param {number} val - The initial value for the counter
 * @returns {Ref<number>} A reactive reference to the counter value, initialized to the provided value
 *
 * @example
 * ```typescript
 * const counter = useSimpleCounter(10);
 * counter.value += 5; // Now equals 15
 * console.log(counter.value); // Access current value
 * ```
 *
 * @since 1.0.0
 */
export const useSimpleCounter = (val: number) =>
  useState<number>("test", () => val);

/**
 * Provides a reactive translation toggle state for language switching functionality.
 *
 * @returns {Ref<boolean>} A reactive reference to the translation toggle state, initialized to false
 *
 * @example
 * ```typescript
 * const translateToggle = useTranslateToggle();
 * translateToggle.value = true; // Enable translation mode
 * translateToggle.value = !translateToggle.value; // Toggle translation
 * ```
 *
 * @since 1.0.0
 */
export const useTranslateToggle = () =>
  useState<boolean>("translate", () => false);

/**
 * Provides reactive state for storing search query history.
 * This replaces Pinia stores for search state management as per project preferences.
 *
 * @returns {Ref<string[]>} A reactive reference to an array of search queries, initialized to empty array
 *
 * @example
 * ```typescript
 * const searchQueries = useSearchQueries();
 * searchQueries.value.push("new query"); // Add a query
 * console.log(searchQueries.value); // Access all queries
 * ```
 *
 * @since 1.0.0
 */
export const useSearchQueries = () =>
  useState<string[]>("searchQueries", () => []);

/**
 * Provides reactive state for storing FAQ search query history.
 * This replaces Pinia stores for FAQ search state management as per project preferences.
 *
 * @returns {Ref<string[]>} A reactive reference to an array of FAQ search queries, initialized to empty array
 *
 * @example
 * ```typescript
 * const faqQueries = useFaqSearchQueries();
 * faqQueries.value.push("FAQ query"); // Add a FAQ query
 * console.log(faqQueries.value); // Access all FAQ queries
 * ```
 *
 * @since 1.0.0
 */
export const useFaqSearchQueries = () =>
  useState<string[]>("faqSearchQueries", () => []);

/**
 * Provides search actions and state management for general search functionality.
 * This composable encapsulates search query management with methods to add and clear queries.
 *
 * @returns {Object} An object containing search state and actions
 * @returns {Readonly<Ref<string[]>>} returns.queries - Read-only reactive reference to search queries array
 * @returns {Function} returns.addNewQuery - Function to add a new search query
 * @returns {Function} returns.clearQueries - Function to clear all search queries
 *
 * @example
 * ```typescript
 * const { queries, addNewQuery, clearQueries } = useSearchActions();
 *
 * // Add a new search query
 * addNewQuery("criminal justice reform");
 *
 * // Access current queries (read-only)
 * console.log(queries.value); // ["criminal justice reform"]
 *
 * // Clear all queries
 * clearQueries();
 * ```
 *
 * @since 1.0.0
 */
export const useSearchActions = () => {
  const queries = useSearchQueries();

  /**
   * Adds a new search query to the queries array.
   * Automatically trims whitespace and removes duplicates.
   *
   * @param {string} query - The search query to add
   *
   * @example
   * ```typescript
   * addNewQuery("  research data  "); // Adds "research data" (trimmed)
   * addNewQuery("research data"); // Won't add duplicate
   * ```
   */
  const addNewQuery = (query: string) => {
    if (query && query.trim()) {
      queries.value.push(query.trim());
      // Remove duplicates
      queries.value = [...new Set(queries.value)];
    }
  };

  /**
   * Clears all search queries from the state.
   *
   * @example
   * ```typescript
   * clearQueries(); // queries.value becomes []
   * ```
   */
  const clearQueries = () => {
    queries.value = [];
  };

  return {
    queries: readonly(queries),
    addNewQuery,
    clearQueries,
  };
};

/**
 * Provides FAQ search actions and state management for FAQ-specific search functionality.
 * This composable encapsulates FAQ search query management with methods to add and clear queries.
 *
 * @returns {Object} An object containing FAQ search state and actions
 * @returns {Readonly<Ref<string[]>>} returns.faqQueries - Read-only reactive reference to FAQ search queries array
 * @returns {Function} returns.addNewFaqQuery - Function to add a new FAQ search query
 * @returns {Function} returns.clearFaqQueries - Function to clear all FAQ search queries
 *
 * @example
 * ```typescript
 * const { faqQueries, addNewFaqQuery, clearFaqQueries } = useFaqSearchActions();
 *
 * // Add a new FAQ search query
 * addNewFaqQuery("eligibility requirements");
 *
 * // Access current FAQ queries (read-only)
 * console.log(faqQueries.value); // ["eligibility requirements"]
 *
 * // Clear all FAQ queries
 * clearFaqQueries();
 * ```
 *
 * @since 1.0.0
 */
export const useFaqSearchActions = () => {
  const faqQueries = useFaqSearchQueries();

  /**
   * Adds a new FAQ search query to the FAQ queries array.
   * Automatically trims whitespace and removes duplicates.
   *
   * @param {string} query - The FAQ search query to add
   *
   * @example
   * ```typescript
   * addNewFaqQuery("  funding process  "); // Adds "funding process" (trimmed)
   * addNewFaqQuery("funding process"); // Won't add duplicate
   * ```
   */
  const addNewFaqQuery = (query: string) => {
    if (query && query.trim()) {
      faqQueries.value.push(query.trim());
      // Remove duplicates
      faqQueries.value = [...new Set(faqQueries.value)];
    }
  };

  /**
   * Clears all FAQ search queries from the state.
   *
   * @example
   * ```typescript
   * clearFaqQueries(); // faqQueries.value becomes []
   * ```
   */
  const clearFaqQueries = () => {
    faqQueries.value = [];
  };

  return {
    faqQueries: readonly(faqQueries),
    addNewFaqQuery,
    clearFaqQueries,
  };
};
