// astro/src/lib/slug.ts
//
// URL path normalization helpers. The site uses trailingSlash: 'always'
// (astro.config.ts), so all internal paths emitted from collection
// transforms run through these helpers.

/** Ensure a path ends with `/`. Roots stay `/`. Empty string becomes `/`.
 *
 * @param path  Must begin with `/` for absolute URLs. This function only
 *              normalises the trailing slash; it does NOT prepend a leading
 *              slash. Callers passing bare slugs (e.g. `'news'`) will get
 *              relative paths back. Use `joinSlug()` instead when starting
 *              from path parts.
 */
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
    .map((p) => p.replace(/^\/+|\/+$/g, '').trim())
    .filter((p) => p.length > 0);
  if (cleaned.length === 0) return '/';
  return ensureTrailingSlash(`/${cleaned.join('/')}`);
}
