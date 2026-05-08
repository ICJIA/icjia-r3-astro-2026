// astro/scripts/smoke-collections.ts
//
// Live build-time smoke test: hits Strapi + Hub, prints the count of rows
// loaded for each collection. Fails loudly if any collection comes back
// empty (which would indicate a query / schema mismatch).
//
// Note: `weeklyFaqs` may legitimately have 0 published rows on R3 Strapi
// (per Task 2.1 discovery). Treat 0 weeklyFaqs as a warning, not a failure.
//
// This script is intentionally self-contained (does NOT import src/lib/strapi.ts
// which uses import.meta.env — a Vite/Astro-only construct). It mirrors the
// same query strings used in src/content.config.ts so the same GraphQL surface
// is exercised. Results confirm each loader's query, response-shape parsing, and
// field names agree with the live API at the time of the smoke run.
//
// Usage: yarn smoke

// Import from src/lib/tags.ts (no Vite/Astro deps, safe in tsx).
// .js extension is required for ESM resolution under tsx.
import { HUB_TAGS } from '../src/lib/tags.js';

const STRAPI_ORIGIN = 'https://r3.icjia-api.cloud';
const HUB_ORIGIN = 'https://researchhub.icjia-api.cloud';
const FETCH_TIMEOUT_MS = 30_000;

interface GraphQLError { message: string }
interface V4Response { data?: Record<string, { data: unknown[] }>; errors?: GraphQLError[] }
interface V3Response { data?: Record<string, unknown[]>; errors?: GraphQLError[] }

async function postGraphQL(origin: string, query: string): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${origin}/graphql`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    return res.json();
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError')
      throw new Error(`timed out after ${FETCH_TIMEOUT_MS / 1000}s`);
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

async function countV4(gqlField: string, query: string): Promise<number> {
  const json = (await postGraphQL(STRAPI_ORIGIN, query)) as V4Response;
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join('; '));
  const rows = json.data?.[gqlField]?.data;
  if (!Array.isArray(rows)) throw new Error(`no data.${gqlField}.data array in response`);
  return rows.length;
}

async function countV3(gqlField: string, query: string): Promise<number> {
  const json = (await postGraphQL(HUB_ORIGIN, query)) as V3Response;
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join('; '));
  const rows = json.data?.[gqlField];
  if (!Array.isArray(rows)) throw new Error(`no data.${gqlField} array in response`);
  return rows.length;
}

// Mirror the exact queries from src/content.config.ts.
type CollectionDef =
  | { name: string; kind: 'v4'; gqlField: string; query: string }
  | { name: string; kind: 'v3'; gqlField: string; query: string };

const COLLECTIONS: CollectionDef[] = [
  {
    name: 'pages',
    kind: 'v4',
    gqlField: 'pages',
    query: `query {
      pages {
        data {
          id
          attributes {
            title slug section summary body
            hideFromSitemap showTableOfContents searchMeta
            createdAt updatedAt publishedAt
          }
        }
      }
    }`,
  },
  {
    name: 'news',
    kind: 'v4',
    gqlField: 'posts',
    query: `query {
      posts {
        data {
          id
          attributes {
            title slug dateOverride summary body searchMeta
            hideFromSitemap hideFromSearch showTableOfContents
            section
            createdAt updatedAt publishedAt
          }
        }
      }
    }`,
  },
  {
    name: 'faqs',
    kind: 'v4',
    gqlField: 'weeklyFaqs',
    query: `query {
      weeklyFaqs {
        data {
          id
          attributes {
            title slug summary body week dateOverride attachmentHeading
            createdAt updatedAt publishedAt
          }
        }
      }
    }`,
  },
  {
    name: 'resources',
    kind: 'v4',
    gqlField: 'resources',
    query: `query {
      resources {
        data {
          id
          attributes {
            title slug summary body searchMeta
            hideFromSitemap hideFromSearch showTableOfContents
            createdAt updatedAt publishedAt
          }
        }
      }
    }`,
  },
  {
    name: 'hubArticles',
    kind: 'v3',
    gqlField: 'articles',
    query: `query {
      articles(where: { tags_contains: [${HUB_TAGS.map((t) => JSON.stringify(t)).join(', ')}] }, limit: 100) {
        _id title slug abstract date
        updatedAt createdAt
        tags
        authors
        splash
        thumbnail
      }
    }`,
  },
];

// Collections allowed to return 0 rows without failing the smoke test.
// weeklyFaqs has no published rows on R3 Strapi (Task 2.1 discovery).
const ZERO_OK = new Set(['faqs']);

let allOk = true;

for (const col of COLLECTIONS) {
  let count: number;
  try {
    count =
      col.kind === 'v4'
        ? await countV4(col.gqlField, col.query)
        : await countV3(col.gqlField, col.query);
  } catch (err) {
    console.error(
      `${col.name.padEnd(14)} ERROR: ${err instanceof Error ? err.message : String(err)}`,
    );
    allOk = false;
    continue;
  }

  const indicator =
    count === 0
      ? ZERO_OK.has(col.name)
        ? '⚠  0 (expected — weeklyFaqs has no published rows, see Task 2.1)'
        : '❌ 0'
      : `✓ ${count}`;

  console.log(`${col.name.padEnd(14)} ${indicator}`);

  if (count === 0 && !ZERO_OK.has(col.name)) {
    console.error(`FAIL: ${col.name} returned 0 rows`);
    allOk = false;
  }
}

if (!allOk) {
  console.error('\nSmoke FAILED — at least one collection returned 0 rows unexpectedly.');
  process.exit(1);
}

console.log('\nAll collections returned at least 1 row (or were expected to be empty).');
