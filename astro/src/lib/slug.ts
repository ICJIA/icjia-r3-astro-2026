// astro/src/lib/slug.ts
//
// URL path normalization helpers. The site uses trailingSlash: 'always'
// (astro.config.ts), so all internal paths emitted from collection
// transforms run through these helpers.

/** Ensure a path ends with `/`. Roots stay `/`. Empty string becomes `/`. */
export function ensureTrailingSlash(path: string): string {
  if (!path) return '/';
  if (path === '/') return path;
  return path.endsWith('/') ? path : `${path}/`;
}

/** Join path parts into a single trailing-slash-terminated path.
 * Strips leading/trailing slashes from each part, drops empty parts, then
 * joins with single slashes. Returns `/` if no non-empty parts given. */
export function joinSlug(...parts: string[]): string {
  const cleaned = parts
    .map((p) => p.replace(/^\/+|\/+$/g, ''))
    .filter(Boolean);
  if (cleaned.length === 0) return '/';
  return ensureTrailingSlash(`/${cleaned.join('/')}`);
}
