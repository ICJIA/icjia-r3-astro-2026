/**
 * @fileoverview Error handling utilities for creator scripts
 * @description Provides consistent error handling, validation, and retry logic
 * for content generation scripts
 *
 * @since 1.0.0
 */

/* eslint-disable no-console */

/**
 * Logs an error with clear formatting and context
 * @param {string} message - Error message
 * @param {Error|any} error - Error object or additional context
 * @param {string} context - Additional context about where the error occurred
 */
export function logError(message, error = null, context = null) {
  console.error("\n" + "=".repeat(80));
  console.error("❌ ERROR:", message);
  if (context) {
    console.error("📍 Context:", context);
  }
  if (error) {
    if (error instanceof Error) {
      console.error("💥 Error Message:", error.message);
      if (error.response) {
        console.error("📡 HTTP Status:", error.response.status);
        console.error("📡 HTTP Status Text:", error.response.statusText);
        if (error.response.data) {
          console.error(
            "📡 Response Data:",
            JSON.stringify(error.response.data, null, 2),
          );
        }
      }
      if (error.config) {
        console.error("🌐 Request URL:", error.config.url);
        console.error("🌐 Request Method:", error.config.method?.toUpperCase());
      }
      if (error.stack && process.env.DEBUG) {
        console.error("📚 Stack Trace:\n", error.stack);
      }
    } else {
      console.error("💥 Error Details:", JSON.stringify(error, null, 2));
    }
  }
  console.error("=".repeat(80) + "\n");
}

/**
 * Logs a warning with clear formatting
 * @param {string} message - Warning message
 * @param {any} details - Additional details
 */
export function logWarning(message, details = null) {
  console.warn("\n⚠️  WARNING:", message);
  if (details) {
    console.warn("   Details:", details);
  }
  console.warn("");
}

/**
 * Validates required environment variables
 * @param {Array<string>} requiredVars - Array of required environment variable names
 * @throws {Error} If any required environment variable is missing
 */
export function validateEnvironment(requiredVars) {
  const missing = requiredVars.filter((varName) => !process.env[varName]);
  if (missing.length > 0) {
    const errorMessage = `Missing required environment variables: ${missing.join(", ")}`;
    logError(
      errorMessage,
      null,
      "Environment validation failed. Please check your .env file.",
    );
    throw new Error(errorMessage);
  }
  console.log("✓ Environment variables validated");
}

/**
 * Retry configuration for API calls
 * @typedef {Object} RetryConfig
 * @property {number} maxRetries - Maximum number of retry attempts (default: 3)
 * @property {number} delay - Delay between retries in milliseconds (default: 1000)
 * @property {Function} shouldRetry - Function to determine if error should be retried
 */

/**
 * Default retry configuration
 * @type {RetryConfig}
 */
const defaultRetryConfig = {
  maxRetries: 3,
  delay: 1000,
  shouldRetry: (error) => {
    // Retry on network errors or 5xx status codes
    if (!error.response) return true; // Network error
    const status = error.response.status;
    return status >= 500 && status < 600;
  },
};

/**
 * Sleep utility for delays
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry wrapper for async functions with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {RetryConfig} config - Retry configuration
 * @returns {Promise<any>} Result of the function
 */
export async function withRetry(fn, config = {}) {
  const retryConfig = { ...defaultRetryConfig, ...config };
  let lastError;

  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(
          `🔄 Retry attempt ${attempt + 1}/${retryConfig.maxRetries}`,
        );
      }
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if we've exhausted attempts or error shouldn't be retried
      if (
        attempt === retryConfig.maxRetries ||
        !retryConfig.shouldRetry(error)
      ) {
        if (attempt === retryConfig.maxRetries) {
          logError(
            `Failed after ${retryConfig.maxRetries + 1} attempts`,
            error,
            "Maximum retry attempts exceeded",
          );
        } else {
          logError(
            "Error is not retryable",
            error,
            "Error does not match retry criteria (network errors or 5xx status codes)",
          );
        }
        throw error;
      }

      // Calculate exponential backoff delay
      const delay = retryConfig.delay * Math.pow(2, attempt);
      logWarning(
        `Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`,
        error.message,
      );
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Safe file write with error handling
 * @param {string} filePath - Path to write file
 * @param {any} data - Data to write
 * @param {Function} jsonfile - jsonfile module instance
 * @returns {Promise<void>}
 */
export async function safeWriteFile(filePath, data, jsonfile) {
  return new Promise((resolve, reject) => {
    jsonfile.writeFile(filePath, data, { spaces: 2 }, (err) => {
      if (err) {
        logError(
          `Failed to write file: ${filePath}`,
          err,
          "File write operation failed",
        );
        reject(err);
      } else {
        console.log(`✓ Successfully wrote: ${filePath}`);
        resolve();
      }
    });
  });
}

/**
 * Safe directory creation
 * @param {string} dirPath - Directory path to create
 * @param {Object} fs - fs module instance
 * @returns {void}
 */
export function ensureDirectory(dirPath, fs) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`✓ Created directory: ${dirPath}`);
    }
  } catch (error) {
    logError(
      `Failed to create directory: ${dirPath}`,
      error,
      "Directory creation failed",
    );
    throw error;
  }
}

/**
 * Safe file write (synchronous)
 * @param {string} filePath - Path to write file
 * @param {string} content - Content to write
 * @param {Object} fs - fs module instance
 * @returns {void}
 */
export function safeWriteFileSync(filePath, content, fs) {
  try {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✓ Successfully wrote: ${filePath}`);
  } catch (error) {
    logError(
      `Failed to write file: ${filePath}`,
      error,
      "Synchronous file write operation failed",
    );
    throw error;
  }
}

/**
 * Validates API response structure
 * @param {any} response - API response object
 * @param {string} expectedPath - Expected path in response (e.g., "data.data.pages.data")
 * @returns {any} Validated data
 * @throws {Error} If response structure is invalid
 */
export function validateApiResponse(response, expectedPath) {
  if (!response || !response.data) {
    const error = new Error("Invalid API response: missing data property");
    logError(
      "API response validation failed",
      error,
      `Expected response.data at path: ${expectedPath}`,
    );
    throw error;
  }

  const pathParts = expectedPath.split(".");
  let current = response.data;
  const traversedPath = ["data"];

  for (const part of pathParts) {
    if (current === null || current === undefined) {
      const error = new Error(
        `Invalid API response: missing path segment '${part}' in '${expectedPath}'`,
      );
      logError(
        "API response validation failed",
        error,
        `Traversed path: ${traversedPath.join(".")}, missing: ${part}`,
      );
      throw error;
    }
    current = current[part];
    traversedPath.push(part);
  }

  if (!Array.isArray(current) && typeof current !== "object") {
    const error = new Error(
      `Invalid API response: expected array or object at '${expectedPath}', got ${typeof current}`,
    );
    logError(
      "API response validation failed",
      error,
      `Path: ${expectedPath}, actual type: ${typeof current}, value: ${JSON.stringify(current).substring(0, 100)}`,
    );
    throw error;
  }

  return current;
}

/**
 * Error handler wrapper for creator scripts
 * Provides consistent error reporting and exit codes
 * @param {Function} mainFunction - Main async function to execute
 * @param {string} scriptName - Name of the script for error reporting
 */
export async function runScript(mainFunction, scriptName) {
  const startTime = Date.now();
  console.log(`\n🚀 Starting ${scriptName}...\n`);

  try {
    await mainFunction();
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n${"=".repeat(80)}`);
    console.log(`✅ ${scriptName} completed successfully in ${duration}s`);
    console.log(`${"=".repeat(80)}\n`);
    process.exit(0);
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    logError(
      `${scriptName} failed after ${duration}s`,
      error,
      "Script execution terminated with errors",
    );
    if (error.stack && !process.env.DEBUG) {
      console.error("💡 Tip: Set DEBUG=1 to see full stack trace");
    }
    process.exit(1);
  }
}
