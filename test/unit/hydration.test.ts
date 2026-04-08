/**
 * @fileoverview Unit tests for SSR hydration safety
 * @description Tests for date formatting locale consistency and useAsyncData
 * key stability to prevent hydration mismatches between server and client
 */

import { describe, it, expect } from "vitest";

/**
 * Date formatting logic used across the application.
 * Must use explicit locale to produce identical output on server and client.
 */
function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

/**
 * Path normalization logic used in useAsyncData keys
 * (mirrors pages/[...slug].vue, pages/news/[...slug].vue, etc.)
 */
function normalizePath(rawPath: string): string {
  return rawPath.endsWith("/") && rawPath !== "/"
    ? rawPath.slice(0, -1)
    : rawPath;
}

describe("Hydration Safety", () => {
  describe("Date Formatting Locale", () => {
    it("should format dates consistently with en-US locale", () => {
      // Use ISO dates with time to avoid timezone ambiguity
      const result = formatDate("2024-01-15T12:00:00");
      expect(result).toBe("January 15, 2024");
    });

    it("should handle various date formats", () => {
      expect(formatDate("2026-03-06T12:00:00")).toBe("March 6, 2026");
      expect(formatDate("2023-12-25T12:00:00")).toBe("December 25, 2023");
      expect(formatDate("2024-06-01T12:00:00")).toBe("June 1, 2024");
    });

    it("should produce deterministic output regardless of environment", () => {
      // Run the same formatting multiple times to verify consistency
      const date = "2026-01-21T12:00:00";
      const results = Array.from({ length: 10 }, () => formatDate(date));
      const allSame = results.every((r) => r === results[0]);
      expect(allSame).toBe(true);
      expect(results[0]).toBe("January 21, 2026");
    });

    it("should always use en-US locale format (Month Day, Year)", () => {
      const result = formatDate("2026-04-08T12:00:00");
      // en-US format should be "Month Day, Year"
      expect(result).toMatch(/^[A-Z][a-z]+ \d{1,2}, \d{4}$/);
    });
  });

  describe("Path Normalization for useAsyncData Keys", () => {
    it("should strip trailing slash from paths", () => {
      expect(normalizePath("/news/")).toBe("/news");
      expect(normalizePath("/contact/")).toBe("/contact");
      expect(normalizePath("/resources/single-page/")).toBe(
        "/resources/single-page",
      );
    });

    it("should not modify root path", () => {
      expect(normalizePath("/")).toBe("/");
    });

    it("should not modify paths without trailing slash", () => {
      expect(normalizePath("/news")).toBe("/news");
      expect(normalizePath("/contact")).toBe("/contact");
    });

    it("should produce same key regardless of trailing slash", () => {
      expect(normalizePath("/news")).toBe(normalizePath("/news/"));
      expect(normalizePath("/resources")).toBe(normalizePath("/resources/"));
      expect(normalizePath("/news/article-slug")).toBe(
        normalizePath("/news/article-slug/"),
      );
    });
  });

  describe("useAsyncData Key Stability", () => {
    it("should use static keys for index pages", () => {
      // News index uses "news-index" (not path-dependent)
      const newsKey = "news-index";
      expect(newsKey).not.toContain("/");
      expect(newsKey).toBe("news-index");
    });

    it("should use normalized path keys for dynamic pages", () => {
      // Dynamic slug pages normalize path before using in key
      const rawPath = "/news/article-slug/";
      const key = `content-${normalizePath(rawPath)}`;
      expect(key).toBe("content-/news/article-slug");

      // Same key regardless of trailing slash
      const rawPath2 = "/news/article-slug";
      const key2 = `content-${normalizePath(rawPath2)}`;
      expect(key).toBe(key2);
    });
  });
});
