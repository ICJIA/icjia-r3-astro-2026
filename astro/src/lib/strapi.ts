// astro/src/lib/strapi.ts
//
// Shared GraphQL helpers used by every content collection in
// content.config.ts. Strict-on-failure: build dies loudly if Strapi or the
// Research Hub returns non-200 or a GraphQL `errors[]` payload.
//
// R3 Strapi runs Strapi v4. Research Hub runs Strapi v3 with a different
// response shape — see hubQuery vs strapiQuery below.

const STRAPI_ORIGIN =
  import.meta.env.PUBLIC_API_BASE_URL ?? 'https://r3.icjia-api.cloud';
const HUB_ORIGIN =
  import.meta.env.PUBLIC_HUB_API_BASE_URL ?? 'https://researchhub.icjia-api.cloud';

interface GraphQLError { message: string; }

// Strapi v4: { data: { [name]: { data: T[] } } }
interface V4Response<T> {
  data?: Record<string, { data: T[] }>;
  errors?: GraphQLError[];
}

// Strapi v3: { data: { [name]: T[] } }
interface V3Response<T> {
  data?: Record<string, T[]>;
  errors?: GraphQLError[];
}

const FETCH_TIMEOUT_MS = 30_000;

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
    if (!res.ok) {
      throw new Error(`${origin}/graphql: HTTP ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error(`${origin}/graphql: timed out after ${FETCH_TIMEOUT_MS / 1000}s`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

function checkErrors(json: { errors?: GraphQLError[] }, origin: string, name: string): void {
  if (json.errors && json.errors.length > 0) {
    throw new Error(
      `${origin}/graphql ${name}: ${json.errors.map((e) => e.message).join('; ')}`,
    );
  }
}

/** Run a GraphQL query against R3 Strapi (v4). Returns the row array under
 * `data[name].data`. Strict on failure: throws on HTTP non-200, GraphQL
 * `errors[]`, or unexpected response shape. */
export async function strapiQuery<T>(name: string, query: string): Promise<T[]> {
  const json = (await postGraphQL(STRAPI_ORIGIN, query)) as V4Response<T>;
  checkErrors(json, STRAPI_ORIGIN, name);
  const rows = json.data?.[name]?.data;
  if (!Array.isArray(rows)) {
    throw new Error(
      `${STRAPI_ORIGIN}/graphql ${name}: response had no data.${name}.data array`,
    );
  }
  return rows;
}

/** Run a GraphQL query against the Research Hub (Strapi v3). Returns the
 * flat row array under `data[name]`. Strict on failure: throws on HTTP
 * non-200, GraphQL `errors[]`, or unexpected response shape. */
export async function hubQuery<T>(name: string, query: string): Promise<T[]> {
  const json = (await postGraphQL(HUB_ORIGIN, query)) as V3Response<T>;
  checkErrors(json, HUB_ORIGIN, name);
  const rows = json.data?.[name];
  if (!Array.isArray(rows)) {
    throw new Error(
      `${HUB_ORIGIN}/graphql ${name}: response had no data.${name} array`,
    );
  }
  return rows;
}

/** Resolve a possibly-relative media URL to an absolute one. Hub URLs are
 * usually already absolute; Strapi v4 returns relative paths under /uploads. */
export function absoluteMediaURL(relative: string | undefined | null): string | undefined {
  if (!relative) return undefined;
  if (/^https?:\/\//i.test(relative)) return relative;
  if (relative.startsWith('//')) return `https:${relative}`;
  const sep = relative.startsWith('/') ? '' : '/';
  return `${STRAPI_ORIGIN}${sep}${relative}`;
}

/** Strip Markdown + HTML for plain-text search indexing. */
export function rawText(input: string | null | undefined): string {
  if (!input) return '';
  return input
    .replace(/<[^>]+>/g, ' ')                  // HTML tags
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')     // images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')   // links → text
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')        // headings
    .replace(/(\*\*|__)(.+?)\1/g, '$2')        // bold
    .replace(/([*_])(.+?)\1/g, '$2')           // italic
    .replace(/`([^`]+)`/g, '$1')               // inline code
    .replace(/^\s*[-*+]\s+/gm, '')             // bullets
    .replace(/\s+/g, ' ')                      // collapse whitespace
    .trim();
}
