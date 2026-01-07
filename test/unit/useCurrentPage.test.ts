/**
 * @fileoverview Unit tests for useCurrentPage composable
 * @description Tests for page state and utility functions
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import useCurrentPage from "../../composables/useCurrentPage";

describe("useCurrentPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console.log to avoid test output noise
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("returns slug and a friendly message", () => {
    const result = useCurrentPage({ slug: "eligibility" });
    expect(result.slug).toBe("eligibility");
    expect(result.msg).toBe("Hello from composable function");
  });

  it("returns correct slug for different page slugs", () => {
    const result1 = useCurrentPage({ slug: "funding" });
    expect(result1.slug).toBe("funding");

    const result2 = useCurrentPage({ slug: "contact" });
    expect(result2.slug).toBe("contact");

    const result3 = useCurrentPage({ slug: "board" });
    expect(result3.slug).toBe("board");
  });

  it("always returns the same message regardless of slug", () => {
    const result1 = useCurrentPage({ slug: "page1" });
    const result2 = useCurrentPage({ slug: "page2" });
    expect(result1.msg).toBe(result2.msg);
    expect(result1.msg).toBe("Hello from composable function");
  });

  it("handles empty slug", () => {
    const result = useCurrentPage({ slug: "" });
    expect(result.slug).toBe("");
    expect(result.msg).toBe("Hello from composable function");
  });

  it("handles slug with special characters", () => {
    const result = useCurrentPage({ slug: "page-with-special-chars-123" });
    expect(result.slug).toBe("page-with-special-chars-123");
  });

  it("logs to console when called", () => {
    const consoleSpy = vi.spyOn(console, "log");
    useCurrentPage({ slug: "test" });
    expect(consoleSpy).toHaveBeenCalledWith("in composable function");
  });

  it("returns an object with expected structure", () => {
    const result = useCurrentPage({ slug: "test" });
    expect(result).toHaveProperty("slug");
    expect(result).toHaveProperty("msg");
    expect(typeof result.slug).toBe("string");
    expect(typeof result.msg).toBe("string");
  });
});
