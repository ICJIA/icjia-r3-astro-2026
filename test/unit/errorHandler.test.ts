/**
 * @fileoverview Unit tests for error handling utilities
 * @description Tests for the errorHandler utility module used in creator scripts
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Mock modules
const mockJsonfile = {
  writeFile: vi.fn((filePath, data, options, callback) => {
    callback(null); // Success
  }),
};

const mockFs = {
  existsSync: vi.fn(() => false),
  mkdirSync: vi.fn(),
  writeFileSync: vi.fn(),
};

describe("Error Handler Utilities", () => {
  // Suppress console output during tests
  const consoleLog = console.log;
  const consoleError = console.error;
  const consoleWarn = console.warn;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment
    delete process.env.TEST_VAR;
    // Suppress console output
    console.log = vi.fn();
    console.error = vi.fn();
    console.warn = vi.fn();
  });

  afterEach(() => {
    // Restore console methods
    console.log = consoleLog;
    console.error = consoleError;
    console.warn = consoleWarn;
  });

  describe("validateEnvironment", () => {
    it("should pass when all required environment variables are set", () => {
      process.env.TEST_VAR = "test-value";
      const {
        validateEnvironment,
      } = require("../../creators/utils/errorHandler");
      expect(() => validateEnvironment(["TEST_VAR"])).not.toThrow();
    });

    it("should throw error when environment variables are missing", () => {
      const {
        validateEnvironment,
      } = require("../../creators/utils/errorHandler");
      expect(() => validateEnvironment(["MISSING_VAR"])).toThrow(
        "Missing required environment variables",
      );
    });

    it("should throw error with all missing variable names", () => {
      const {
        validateEnvironment,
      } = require("../../creators/utils/errorHandler");
      expect(() => validateEnvironment(["VAR1", "VAR2", "VAR3"])).toThrow(
        "Missing required environment variables: VAR1, VAR2, VAR3",
      );
    });
  });

  describe("safeWriteFile", () => {
    it("should successfully write file when no error occurs", async () => {
      const { safeWriteFile } = require("../../creators/utils/errorHandler");
      await expect(
        safeWriteFile("/test/path.json", { data: "test" }, mockJsonfile),
      ).resolves.not.toThrow();
      expect(mockJsonfile.writeFile).toHaveBeenCalled();
    });

    it("should reject when file write fails", async () => {
      const errorJsonfile = {
        writeFile: vi.fn((filePath, data, options, callback) => {
          callback(new Error("Write failed"));
        }),
      };
      const { safeWriteFile } = require("../../creators/utils/errorHandler");
      await expect(
        safeWriteFile("/test/path.json", { data: "test" }, errorJsonfile),
      ).rejects.toThrow("Write failed");
    });
  });

  describe("safeWriteFileSync", () => {
    it("should successfully write file synchronously", () => {
      const {
        safeWriteFileSync,
      } = require("../../creators/utils/errorHandler");
      expect(() =>
        safeWriteFileSync("/test/path.txt", "content", mockFs),
      ).not.toThrow();
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        "/test/path.txt",
        "content",
        "utf8",
      );
    });

    it("should throw error when file write fails", () => {
      const errorFs = {
        writeFileSync: vi.fn(() => {
          throw new Error("Write failed");
        }),
      };
      const {
        safeWriteFileSync,
      } = require("../../creators/utils/errorHandler");
      expect(() =>
        safeWriteFileSync("/test/path.txt", "content", errorFs),
      ).toThrow("Write failed");
    });
  });

  describe("ensureDirectory", () => {
    it("should create directory when it does not exist", () => {
      const { ensureDirectory } = require("../../creators/utils/errorHandler");
      ensureDirectory("/test/dir", mockFs);
      expect(mockFs.mkdirSync).toHaveBeenCalledWith("/test/dir", {
        recursive: true,
      });
    });

    it("should not create directory when it already exists", () => {
      const existingFs = {
        existsSync: vi.fn(() => true),
        mkdirSync: vi.fn(),
      };
      const { ensureDirectory } = require("../../creators/utils/errorHandler");
      ensureDirectory("/test/dir", existingFs);
      expect(existingFs.mkdirSync).not.toHaveBeenCalled();
    });

    it("should throw error when directory creation fails", () => {
      const errorFs = {
        existsSync: vi.fn(() => false),
        mkdirSync: vi.fn(() => {
          throw new Error("Permission denied");
        }),
      };
      const { ensureDirectory } = require("../../creators/utils/errorHandler");
      expect(() => ensureDirectory("/test/dir", errorFs)).toThrow(
        "Permission denied",
      );
    });
  });

  describe("validateApiResponse", () => {
    it("should return data when response structure is valid", () => {
      const {
        validateApiResponse,
      } = require("../../creators/utils/errorHandler");
      const response = {
        data: {
          pages: {
            data: [{ id: 1 }],
          },
        },
      };
      const result = validateApiResponse(response, "pages.data");
      expect(result).toEqual([{ id: 1 }]);
    });

    it("should throw error when response is missing data property", () => {
      const {
        validateApiResponse,
      } = require("../../creators/utils/errorHandler");
      expect(() => validateApiResponse(null, "pages.data")).toThrow(
        "Invalid API response: missing data property",
      );
    });

    it("should throw error when path segment is missing", () => {
      const {
        validateApiResponse,
      } = require("../../creators/utils/errorHandler");
      const response = {
        data: {
          pages: null,
        },
      };
      expect(() => validateApiResponse(response, "pages.data")).toThrow(
        "Invalid API response: missing path segment",
      );
    });

    it("should throw error when data type is incorrect", () => {
      const {
        validateApiResponse,
      } = require("../../creators/utils/errorHandler");
      const response = {
        data: {
          pages: {
            data: "not-an-array",
          },
        },
      };
      expect(() => validateApiResponse(response, "pages.data")).toThrow(
        "Invalid API response: expected array or object",
      );
    });
  });

  describe("withRetry", () => {
    it("should succeed on first attempt", async () => {
      const { withRetry } = require("../../creators/utils/errorHandler");
      const fn = vi.fn().mockResolvedValue("success");
      const result = await withRetry(fn);
      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should retry on network error and eventually succeed", async () => {
      const { withRetry } = require("../../creators/utils/errorHandler");
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValue("success");
      const result = await withRetry(fn, { maxRetries: 2 });
      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it("should throw error after max retries", async () => {
      const { withRetry } = require("../../creators/utils/errorHandler");
      const fn = vi.fn().mockRejectedValue(new Error("Network error"));
      await expect(withRetry(fn, { maxRetries: 2 })).rejects.toThrow(
        "Network error",
      );
      expect(fn).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });

    it("should not retry on non-retryable errors", async () => {
      const { withRetry } = require("../../creators/utils/errorHandler");
      const error = {
        response: { status: 404 },
      };
      const fn = vi.fn().mockRejectedValue(error);
      await expect(withRetry(fn)).rejects.toEqual(error);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
});
