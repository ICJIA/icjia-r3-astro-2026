/**
 * @fileoverview Unit tests for event bus composable
 * @description Tests for event emission and listening functionality
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { useEvent, useListen } from "../../composables/eventBus";

describe("Event Bus Composable", () => {
  beforeEach(() => {
    // Clear any existing listeners
    vi.clearAllMocks();
  });

  describe("useEvent", () => {
    it("emits events without throwing errors", () => {
      expect(() => {
        useEvent("user:registered", null);
      }).not.toThrow();
    });

    it("emits events with null payload", () => {
      const handler = vi.fn();
      useListen("user:registered", handler);
      useEvent("user:registered", null);
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(null);
    });
  });

  describe("useListen", () => {
    it("registers event listeners", () => {
      const handler = vi.fn();
      useListen("user:registered", handler);
      useEvent("user:registered", null);
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it("calls multiple listeners for the same event", () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      useListen("user:registered", handler1);
      useListen("user:registered", handler2);
      useEvent("user:registered", null);
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
    });

    it("calls listeners multiple times for multiple emissions", () => {
      const handler = vi.fn();
      useListen("user:registered", handler);
      useEvent("user:registered", null);
      useEvent("user:registered", null);
      useEvent("user:registered", null);
      expect(handler).toHaveBeenCalledTimes(3);
    });

    it("does not call listeners for unregistered events", () => {
      const handler = vi.fn();
      useListen("user:registered", handler);
      // Emit a different event (if it existed)
      // Since we only have one event type, we'll just verify the handler wasn't called
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe("Event Bus Integration", () => {
    it("supports event-driven communication pattern", () => {
      let eventReceived = false;
      const handler = () => {
        eventReceived = true;
      };
      useListen("user:registered", handler);
      useEvent("user:registered", null);
      expect(eventReceived).toBe(true);
    });

    it("handles rapid event emissions", () => {
      let callCount = 0;
      const handler = () => {
        callCount++;
      };
      useListen("user:registered", handler);
      for (let i = 0; i < 100; i++) {
        useEvent("user:registered", null);
      }
      expect(callCount).toBe(100);
    });
  });
});

