/**
 * @fileoverview Unit tests for state management composables
 * @description Tests for useState-based composables in composables/states.ts
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { resetState } from "../../test/mocks/imports";
import {
  useCounter,
  useColor,
  useNavToggle,
  useSimpleCounter,
  useTranslateToggle,
  useSearchQueries,
  useFaqSearchQueries,
  useSearchActions,
  useFaqSearchActions,
} from "../../composables/states";

describe("State Management Composables", () => {
  beforeEach(() => {
    // Reset state between tests
    resetState();
    vi.clearAllMocks();
  });

  describe("useCounter", () => {
    it("initializes with default value of 0", () => {
      const counter = useCounter();
      expect(counter.value).toBe(0);
    });

    it("allows incrementing the counter", () => {
      const counter = useCounter();
      counter.value++;
      expect(counter.value).toBe(1);
    });

    it("allows decrementing the counter", () => {
      const counter = useCounter();
      counter.value = 5;
      counter.value--;
      expect(counter.value).toBe(4);
    });

    it("maintains state across multiple calls", () => {
      const counter1 = useCounter();
      counter1.value = 10;
      const counter2 = useCounter();
      expect(counter2.value).toBe(10);
    });
  });

  describe("useColor", () => {
    it("initializes with default value of 'pink'", () => {
      const color = useColor();
      expect(color.value).toBe("pink");
    });

    it("allows changing the color", () => {
      const color = useColor();
      color.value = "blue";
      expect(color.value).toBe("blue");
    });

    it("maintains state across multiple calls", () => {
      const color1 = useColor();
      color1.value = "green";
      const color2 = useColor();
      expect(color2.value).toBe("green");
    });
  });

  describe("useNavToggle", () => {
    it("initializes with default value of false", () => {
      const navToggle = useNavToggle();
      expect(navToggle.value).toBe(false);
    });

    it("allows toggling navigation state", () => {
      const navToggle = useNavToggle();
      navToggle.value = true;
      expect(navToggle.value).toBe(true);
      navToggle.value = false;
      expect(navToggle.value).toBe(false);
    });

    it("maintains state across multiple calls", () => {
      const navToggle1 = useNavToggle();
      navToggle1.value = true;
      const navToggle2 = useNavToggle();
      expect(navToggle2.value).toBe(true);
    });
  });

  describe("useSimpleCounter", () => {
    it("initializes with provided value", () => {
      const counter = useSimpleCounter(5);
      expect(counter.value).toBe(5);
    });

    it("allows modifying the counter value", () => {
      const counter = useSimpleCounter(10);
      counter.value += 5;
      expect(counter.value).toBe(15);
    });

    it("handles negative initial values", () => {
      const counter = useSimpleCounter(-5);
      expect(counter.value).toBe(-5);
    });

    it("handles zero initial value", () => {
      const counter = useSimpleCounter(0);
      expect(counter.value).toBe(0);
    });
  });

  describe("useTranslateToggle", () => {
    it("initializes with default value of false", () => {
      const translateToggle = useTranslateToggle();
      expect(translateToggle.value).toBe(false);
    });

    it("allows enabling translation mode", () => {
      const translateToggle = useTranslateToggle();
      translateToggle.value = true;
      expect(translateToggle.value).toBe(true);
    });

    it("maintains state across multiple calls", () => {
      const translateToggle1 = useTranslateToggle();
      translateToggle1.value = true;
      const translateToggle2 = useTranslateToggle();
      expect(translateToggle2.value).toBe(true);
    });
  });

  describe("useSearchQueries", () => {
    it("initializes with empty array", () => {
      const queries = useSearchQueries();
      expect(queries.value).toEqual([]);
    });

    it("allows adding queries", () => {
      const queries = useSearchQueries();
      queries.value.push("test query");
      expect(queries.value).toContain("test query");
    });

    it("maintains state across multiple calls", () => {
      const queries1 = useSearchQueries();
      queries1.value.push("query 1");
      const queries2 = useSearchQueries();
      expect(queries2.value).toContain("query 1");
    });
  });

  describe("useFaqSearchQueries", () => {
    it("initializes with empty array", () => {
      const faqQueries = useFaqSearchQueries();
      expect(faqQueries.value).toEqual([]);
    });

    it("allows adding FAQ queries", () => {
      const faqQueries = useFaqSearchQueries();
      faqQueries.value.push("FAQ query");
      expect(faqQueries.value).toContain("FAQ query");
    });

    it("maintains state across multiple calls", () => {
      const faqQueries1 = useFaqSearchQueries();
      faqQueries1.value.push("FAQ 1");
      const faqQueries2 = useFaqSearchQueries();
      expect(faqQueries2.value).toContain("FAQ 1");
    });
  });

  describe("useSearchActions", () => {
    it("returns readonly queries reference", () => {
      const { queries } = useSearchActions();
      expect(queries.value).toEqual([]);
    });

    it("adds new query with addNewQuery", () => {
      const { queries, addNewQuery } = useSearchActions();
      addNewQuery("test search");
      expect(queries.value).toContain("test search");
    });

    it("trims whitespace when adding queries", () => {
      const { queries, addNewQuery } = useSearchActions();
      addNewQuery("  trimmed query  ");
      expect(queries.value).toContain("trimmed query");
      expect(queries.value).not.toContain("  trimmed query  ");
    });

    it("removes duplicates when adding queries", () => {
      const { queries, addNewQuery } = useSearchActions();
      addNewQuery("duplicate");
      addNewQuery("duplicate");
      expect(queries.value.filter((q) => q === "duplicate").length).toBe(1);
    });

    it("does not add empty queries", () => {
      const { queries, addNewQuery } = useSearchActions();
      addNewQuery("");
      addNewQuery("   ");
      expect(queries.value.length).toBe(0);
    });

    it("clears all queries with clearQueries", () => {
      const { queries, addNewQuery, clearQueries } = useSearchActions();
      addNewQuery("query 1");
      addNewQuery("query 2");
      expect(queries.value.length).toBe(2);
      clearQueries();
      expect(queries.value.length).toBe(0);
    });

    it("maintains state across multiple instances", () => {
      const { addNewQuery } = useSearchActions();
      addNewQuery("shared query");
      const { queries } = useSearchActions();
      expect(queries.value).toContain("shared query");
    });
  });

  describe("useFaqSearchActions", () => {
    it("returns readonly faqQueries reference", () => {
      const { faqQueries } = useFaqSearchActions();
      expect(faqQueries.value).toEqual([]);
    });

    it("adds new FAQ query with addNewFaqQuery", () => {
      const { faqQueries, addNewFaqQuery } = useFaqSearchActions();
      addNewFaqQuery("FAQ search");
      expect(faqQueries.value).toContain("FAQ search");
    });

    it("trims whitespace when adding FAQ queries", () => {
      const { faqQueries, addNewFaqQuery } = useFaqSearchActions();
      addNewFaqQuery("  trimmed FAQ  ");
      expect(faqQueries.value).toContain("trimmed FAQ");
    });

    it("removes duplicates when adding FAQ queries", () => {
      const { faqQueries, addNewFaqQuery } = useFaqSearchActions();
      addNewFaqQuery("duplicate FAQ");
      addNewFaqQuery("duplicate FAQ");
      expect(faqQueries.value.filter((q) => q === "duplicate FAQ").length).toBe(
        1,
      );
    });

    it("does not add empty FAQ queries", () => {
      const { faqQueries, addNewFaqQuery } = useFaqSearchActions();
      addNewFaqQuery("");
      addNewFaqQuery("   ");
      expect(faqQueries.value.length).toBe(0);
    });

    it("clears all FAQ queries with clearFaqQueries", () => {
      const { faqQueries, addNewFaqQuery, clearFaqQueries } =
        useFaqSearchActions();
      addNewFaqQuery("FAQ 1");
      addNewFaqQuery("FAQ 2");
      expect(faqQueries.value.length).toBe(2);
      clearFaqQueries();
      expect(faqQueries.value.length).toBe(0);
    });

    it("maintains separate state from regular search queries", () => {
      const { addNewQuery } = useSearchActions();
      const { faqQueries, addNewFaqQuery } = useFaqSearchActions();
      addNewQuery("regular query");
      addNewFaqQuery("FAQ query");
      expect(faqQueries.value).toContain("FAQ query");
      expect(faqQueries.value).not.toContain("regular query");
    });
  });
});
