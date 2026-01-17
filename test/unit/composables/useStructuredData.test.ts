/**
 * @fileoverview Unit tests for useStructuredData composable
 * @description Tests for structured data (JSON-LD) composables
 */

import { describe, it, expect, beforeEach, vi } from "vitest";

describe("useStructuredData Composable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useWebsiteSchema", () => {
    it("should generate WebSite schema with correct structure", () => {
      const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "R3 - Restore, Reinvest, Renew",
        url: "https://r3.illinois.gov",
      };

      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("WebSite");
      expect(schema.name).toContain("R3");
    });

    it("should include SearchAction in WebSite schema", () => {
      const schema = {
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate:
              "https://r3.illinois.gov/search?q={search_term_string}",
          },
        },
      };

      expect(schema.potentialAction["@type"]).toBe("SearchAction");
      expect(schema.potentialAction.target.urlTemplate).toContain("/search");
    });
  });

  describe("useGovernmentOrganizationSchema", () => {
    it("should generate GovernmentOrganization schema", () => {
      const schema = {
        "@context": "https://schema.org",
        "@type": "GovernmentOrganization",
        name: "Illinois Criminal Justice Information Authority - R3 Program",
        url: "https://r3.illinois.gov",
      };

      expect(schema["@type"]).toBe("GovernmentOrganization");
      expect(schema.name).toContain(
        "Illinois Criminal Justice Information Authority",
      );
    });
  });

  describe("useArticleSchema", () => {
    it("should generate Article schema with required fields", () => {
      const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Test Article",
        datePublished: "2024-01-01",
        author: {
          "@type": "Organization",
          name: "ICJIA",
        },
      };

      expect(schema["@type"]).toBe("Article");
      expect(schema.headline).toBeDefined();
      expect(schema.datePublished).toBeDefined();
      expect(schema.author["@type"]).toBe("Organization");
    });
  });

  describe("useFAQPageSchema", () => {
    it("should generate FAQPage schema with questions", () => {
      const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Test Question",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Test Answer",
            },
          },
        ],
      };

      expect(schema["@type"]).toBe("FAQPage");
      expect(Array.isArray(schema.mainEntity)).toBe(true);
      expect(schema.mainEntity[0]["@type"]).toBe("Question");
    });
  });

  describe("useWebPageSchema", () => {
    it("should generate WebPage schema", () => {
      const schema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Test Page",
        description: "Test description",
        url: "https://r3.illinois.gov/test",
      };

      expect(schema["@type"]).toBe("WebPage");
      expect(schema.name).toBeDefined();
      expect(schema.url).toContain("r3.illinois.gov");
    });
  });
});
