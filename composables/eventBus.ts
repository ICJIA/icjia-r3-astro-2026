/**
 * @fileoverview Event bus composable for the ICJIA R3 Nuxt 3 application.
 * Provides a type-safe event system using mitt for component communication.
 *
 * Based on: https://dev.to/israelortuno/event-bus-pattern-in-nuxt-3-with-full-typescript-support-1okp
 *
 * @since 1.0.0
 */

import mitt from "mitt";

/**
 * Type definition for application-wide events.
 * Add new event types here to maintain type safety across the application.
 *
 * @typedef {Object} ApplicationEvents
 * @property {"user:registered"} "user:registered" - Event fired when a user registers, payload is null
 *
 * @example
 * ```typescript
 * // To add a new event type:
 * type ApplicationEvents = {
 *   "user:registered": null;
 *   "data:updated": { id: string; data: any };
 * };
 * ```
 */
type ApplicationEvents = {
  "user:registered": null;
};

/**
 * Mitt event emitter instance configured with application event types.
 * This provides the core event bus functionality with full TypeScript support.
 *
 * @type {Emitter<ApplicationEvents>}
 */
const emitter = mitt<ApplicationEvents>();

/**
 * Event emission function for triggering application events.
 * Use this to emit events that other parts of the application can listen to.
 *
 * @function useEvent
 * @param {keyof ApplicationEvents} type - The event type to emit
 * @param {ApplicationEvents[keyof ApplicationEvents]} data - The event payload data
 *
 * @example
 * ```typescript
 * // Emit a user registration event
 * useEvent("user:registered", null);
 *
 * // In a component:
 * const handleRegistration = () => {
 *   // ... registration logic
 *   useEvent("user:registered", null);
 * };
 * ```
 *
 * @since 1.0.0
 */
export const useEvent = emitter.emit;

/**
 * Event listener function for subscribing to application events.
 * Use this to listen for events emitted by other parts of the application.
 *
 * @function useListen
 * @param {keyof ApplicationEvents} type - The event type to listen for
 * @param {Function} handler - The callback function to execute when the event is fired
 *
 * @example
 * ```typescript
 * // Listen for user registration events
 * useListen("user:registered", () => {
 *   console.log("User registered!");
 * });
 *
 * // In a component setup:
 * onMounted(() => {
 *   useListen("user:registered", handleUserRegistration);
 * });
 *
 * onUnmounted(() => {
 *   // Clean up listeners if needed
 *   emitter.off("user:registered", handleUserRegistration);
 * });
 * ```
 *
 * @since 1.0.0
 */
export const useListen = emitter.on;
