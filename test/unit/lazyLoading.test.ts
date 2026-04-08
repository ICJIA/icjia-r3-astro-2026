/**
 * @fileoverview Unit tests for lazy-loaded dependencies
 * @description Tests verifying that render-blocking dependencies (Fuse.js,
 * DOMPurify, axios) are loaded via dynamic import() rather than static import
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(__dirname, "../..");

describe("Lazy Loading", () => {
  describe("Search Page (Fuse.js)", () => {
    const searchPageContent = readFileSync(
      resolve(projectRoot, "pages/search.vue"),
      "utf-8",
    );

    it("should not have static import of fuse.js", () => {
      expect(searchPageContent).not.toMatch(/^import\s+Fuse\s+from/m);
      expect(searchPageContent).not.toMatch(
        /^import\s+\{.*\}\s+from\s+["']fuse\.js["']/m,
      );
    });

    it("should use dynamic import for fuse.js", () => {
      expect(searchPageContent).toMatch(/import\(["']fuse\.js["']\)/);
    });

    it("should initialize Fuse inside onMounted", () => {
      expect(searchPageContent).toMatch(/onMounted\(async/);
      expect(searchPageContent).toMatch(/new Fuse\(searchIndex/);
    });

    it("should guard search calls with null check on fuse ref", () => {
      expect(searchPageContent).toMatch(/if\s*\(fuse\.value\)/);
    });
  });

  describe("Contact Page (DOMPurify & axios)", () => {
    const contactPageContent = readFileSync(
      resolve(projectRoot, "pages/contact.vue"),
      "utf-8",
    );

    it("should not have static import of dompurify", () => {
      expect(contactPageContent).not.toMatch(
        /^import\s+DOMPurify\s+from\s+["']dompurify["']/m,
      );
    });

    it("should not have static import of axios", () => {
      expect(contactPageContent).not.toMatch(
        /^import\s+axios\s+from\s+["']axios["']/m,
      );
    });

    it("should use dynamic import for dompurify", () => {
      expect(contactPageContent).toMatch(/import\(["']dompurify["']\)/);
    });

    it("should use dynamic import for axios", () => {
      expect(contactPageContent).toMatch(/import\(["']axios["']\)/);
    });

    it("should lazy load only on first form submission", () => {
      expect(contactPageContent).toMatch(/if\s*\(!DOMPurify\)/);
      expect(contactPageContent).toMatch(/if\s*\(!axios\)/);
    });
  });
});
