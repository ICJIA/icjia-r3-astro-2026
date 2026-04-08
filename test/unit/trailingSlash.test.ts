/**
 * @fileoverview Unit tests for trailing slash normalization
 * @description Tests for URL normalization logic used in the trailing slash
 * plugin and canonical URL generation to prevent duplicate Plausible entries
 */

import { describe, it, expect } from "vitest";

/**
 * Trailing slash normalization logic (mirrors plugins/trailingSlash.client.js)
 */
function needsTrailingSlash(path: string): boolean {
  return path !== "/" && !path.endsWith("/");
}

function addTrailingSlash(path: string): string {
  return needsTrailingSlash(path) ? path + "/" : path;
}

/**
 * Canonical URL normalization logic (mirrors composables/useSeoMeta.ts)
 */
function buildCanonicalUrl(baseUrl: string, rawPath: string): string {
  const fullPath =
    rawPath !== "/" && !rawPath.endsWith("/") ? rawPath + "/" : rawPath;
  return `${baseUrl}${fullPath}`;
}

describe("Trailing Slash Normalization", () => {
  describe("needsTrailingSlash", () => {
    it("should return false for root path", () => {
      expect(needsTrailingSlash("/")).toBe(false);
    });

    it("should return true for paths without trailing slash", () => {
      expect(needsTrailingSlash("/news")).toBe(true);
      expect(needsTrailingSlash("/contact")).toBe(true);
      expect(needsTrailingSlash("/news/article-slug")).toBe(true);
    });

    it("should return false for paths with trailing slash", () => {
      expect(needsTrailingSlash("/news/")).toBe(false);
      expect(needsTrailingSlash("/contact/")).toBe(false);
      expect(needsTrailingSlash("/news/article-slug/")).toBe(false);
    });
  });

  describe("addTrailingSlash", () => {
    it("should not modify root path", () => {
      expect(addTrailingSlash("/")).toBe("/");
    });

    it("should add trailing slash to paths without one", () => {
      expect(addTrailingSlash("/news")).toBe("/news/");
      expect(addTrailingSlash("/contact")).toBe("/contact/");
      expect(addTrailingSlash("/resources/single-page")).toBe(
        "/resources/single-page/",
      );
    });

    it("should not double-add trailing slash", () => {
      expect(addTrailingSlash("/news/")).toBe("/news/");
      expect(addTrailingSlash("/contact/")).toBe("/contact/");
    });
  });

  describe("buildCanonicalUrl", () => {
    const baseUrl = "https://r3.illinois.gov";

    it("should build canonical URL for root path", () => {
      expect(buildCanonicalUrl(baseUrl, "/")).toBe(
        "https://r3.illinois.gov/",
      );
    });

    it("should add trailing slash to canonical URLs", () => {
      expect(buildCanonicalUrl(baseUrl, "/news")).toBe(
        "https://r3.illinois.gov/news/",
      );
      expect(buildCanonicalUrl(baseUrl, "/contact")).toBe(
        "https://r3.illinois.gov/contact/",
      );
    });

    it("should not double-add trailing slash to canonical URLs", () => {
      expect(buildCanonicalUrl(baseUrl, "/news/")).toBe(
        "https://r3.illinois.gov/news/",
      );
    });

    it("should handle nested paths", () => {
      expect(buildCanonicalUrl(baseUrl, "/news/article-slug")).toBe(
        "https://r3.illinois.gov/news/article-slug/",
      );
      expect(buildCanonicalUrl(baseUrl, "/resources/single-page")).toBe(
        "https://r3.illinois.gov/resources/single-page/",
      );
    });
  });
});
