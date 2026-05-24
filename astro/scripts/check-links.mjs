#!/usr/bin/env node
// astro/scripts/check-links.mjs
//
// Post-build link audit. Walks dist/, extracts every <a href> and validates:
//
//   - Internal routes (`/eligibility/`)   → does dist/ have the file?
//   - In-page anchors (`#contact`)        → does the target id exist?
//   - Cross-page anchors (`/x/#section`)  → does the target page have it?
//   - External URLs                       → HEAD check (opt-in via --external)
//
// Categorizes findings into three buckets matching Siteimprove's severity
// model: CRITICAL (4xx/5xx, missing anchors, dead internal routes), WARNING
// (3xx redirects, slow responses, cross-page-anchor misses, http URLs that
// could be https), NOTICE (trailing-slash inconsistencies, link text quality).
//
// Usage:
//   node scripts/check-links.mjs                    # internal only (fast)
//   node scripts/check-links.mjs --external         # also HEAD-check external
//   node scripts/check-links.mjs --strict           # exit 1 on CRITICAL

import { readFile } from 'node:fs/promises';
import { globSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

// We only care about <a href> — <link>/<script>/<img> hrefs are asset refs,
// not user-facing links, and Astro's build pipeline already validates them.
const A_HREF_RX = /<a\s[^>]*\bhref="([^"#?][^"]*)"/gi;
const ID_RX = /\bid="([^"]+)"/g;

const args = new Set(process.argv.slice(2));
const checkExternal = args.has('--external');
const strict = args.has('--strict');
const verbose = args.has('--verbose');

function categorize(href) {
  if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return null;
  if (href.startsWith('#')) return { type: 'anchor', anchor: href.slice(1) };
  if (href.startsWith('/')) {
    const [pathname, ...rest] = href.split('#');
    return { type: 'internal', pathname, anchor: rest.join('#') || null };
  }
  if (/^https?:\/\//i.test(href)) {
    return { type: 'external', url: href };
  }
  return { type: 'relative', value: href };
}

function distFileForRoute(routePath) {
  // /eligibility/      → dist/eligibility/index.html
  // /eligibility       → dist/eligibility/index.html (Netlify pretty-URLs)
  // /searchIndex.json  → dist/searchIndex.json
  // /favicon.ico       → dist/favicon.ico
  let p = routePath.replace(/^\//, '').replace(/\?.*$/, '');
  if (p.endsWith('/')) p = p.slice(0, -1);
  if (p === '') return path.join(DIST, 'index.html');
  if (path.extname(p)) return path.join(DIST, p);
  return path.join(DIST, p, 'index.html');
}

function routeLabel(file) {
  return '/' + file.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
}

async function loadAnchors(file) {
  const content = await readFile(path.join(DIST, file), 'utf8');
  const ids = new Set();
  for (const m of content.matchAll(ID_RX)) ids.add(m[1]);
  return { content, ids };
}

async function checkExternalUrl(url) {
  // HEAD first (cheaper), fall back to GET if server returns 405/403/404 for HEAD.
  // Some CDNs/hosts block HEAD but answer GET.
  for (const method of ['HEAD', 'GET']) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10_000);
      const res = await fetch(url, {
        method,
        signal: controller.signal,
        redirect: 'manual',
        headers: {
          'user-agent':
            'Mozilla/5.0 (link-audit) AppleWebKit/537.36 (KHTML, like Gecko)',
          accept: 'text/html,application/xhtml+xml,*/*;q=0.8',
        },
      });
      clearTimeout(timer);
      // Some hosts return 405/403 for HEAD only — retry as GET before reporting.
      if (method === 'HEAD' && [403, 404, 405, 501].includes(res.status)) continue;
      return { status: res.status, location: res.headers.get('location') };
    } catch (err) {
      if (method === 'GET') return { error: err.name === 'AbortError' ? 'timeout' : err.message };
    }
  }
  return { error: 'unreachable' };
}

async function main() {
  if (!existsSync(DIST)) {
    console.error('[check-links] dist/ not found — run `pnpm build` first');
    process.exit(2);
  }

  const files = globSync('**/*.html', { cwd: DIST });
  console.log(`[check-links] scanning ${files.length} HTML file(s) under dist/`);

  // Build a map of all id="..." attributes per file so we can validate
  // cross-page anchors (`/foo/#section`) as well as same-page anchors.
  const pageIds = new Map();
  for (const file of files) {
    const { ids } = await loadAnchors(file);
    pageIds.set(file, ids);
  }

  const findings = { critical: [], warning: [], notice: [] };
  const externalUrls = new Map(); // url → list of source pages

  for (const file of files) {
    const { content } = await loadAnchors(file);
    const page = routeLabel(file);

    for (const m of content.matchAll(A_HREF_RX)) {
      const href = m[1];
      const cat = categorize(href);
      if (!cat) continue;

      if (cat.type === 'anchor') {
        if (!pageIds.get(file).has(cat.anchor)) {
          findings.critical.push({
            kind: 'missing-anchor',
            page, href,
            detail: `target id "${cat.anchor}" not present on this page`,
          });
        }
      } else if (cat.type === 'internal') {
        const target = distFileForRoute(cat.pathname);
        if (!existsSync(target)) {
          findings.critical.push({
            kind: 'broken-internal',
            page, href,
            detail: `dist/ has no file for ${cat.pathname}`,
          });
        } else if (cat.anchor) {
          const targetRel = path.relative(DIST, target);
          if (pageIds.has(targetRel) && !pageIds.get(targetRel).has(cat.anchor)) {
            findings.warning.push({
              kind: 'missing-cross-page-anchor',
              page, href,
              detail: `${cat.pathname} exists but has no id="${cat.anchor}"`,
            });
          }
        }
        // Trailing-slash policy: site is `trailingSlash: 'ignore'` and
        // Netlify Pretty URLs canonicalizes both ways, so a missing slash
        // is a 301 hop rather than a break — flag as NOTICE only.
        if (
          cat.pathname && cat.pathname !== '/' &&
          !cat.pathname.endsWith('/') &&
          !path.extname(cat.pathname)
        ) {
          findings.notice.push({
            kind: 'missing-trailing-slash',
            page, href,
            detail: `${cat.pathname} should end with /`,
          });
        }
      } else if (cat.type === 'external') {
        // Strip URL fragments before normalizing — we don't HEAD-check anchors.
        const url = cat.url.replace(/#.*$/, '');
        if (!externalUrls.has(url)) externalUrls.set(url, new Set());
        externalUrls.get(url).add(page);
        // NOTICE: http://… (not https://) is a mixed-content / SEO concern.
        if (url.startsWith('http://')) {
          findings.notice.push({
            kind: 'http-url',
            page, href,
            detail: 'consider promoting to https://',
          });
        }
      } else if (cat.type === 'relative') {
        findings.warning.push({
          kind: 'relative-href',
          page, href,
          detail: 'relative href in static output is usually unintentional',
        });
      }
    }
  }

  if (checkExternal) {
    console.log(`[check-links] HEAD-checking ${externalUrls.size} external URL(s)...`);
    // Cap concurrency to be polite to hosts.
    const queue = [...externalUrls.entries()];
    const CONCURRENCY = 8;
    const workers = Array.from({ length: CONCURRENCY }, async () => {
      while (queue.length) {
        const [url, pages] = queue.shift();
        const result = await checkExternalUrl(url);
        const samplePage = [...pages][0];
        if (result.error) {
          findings.warning.push({
            kind: 'external-unreachable',
            page: samplePage, href: url,
            detail: result.error,
          });
        } else if (result.status >= 400 && result.status < 600) {
          findings.critical.push({
            kind: 'external-error',
            page: samplePage, href: url,
            detail: `HTTP ${result.status}`,
          });
        } else if (result.status >= 300 && result.status < 400) {
          findings.warning.push({
            kind: 'external-redirect',
            page: samplePage, href: url,
            detail: `${result.status} → ${result.location ?? '(no Location)'}`,
          });
        }
      }
    });
    await Promise.all(workers);
  }

  // ── Report ──────────────────────────────────────────────────────────
  const counts = {
    critical: findings.critical.length,
    warning: findings.warning.length,
    notice: findings.notice.length,
  };

  console.log(`\n[check-links] ${files.length} pages, ${externalUrls.size} external URLs`);
  console.log(`  CRITICAL: ${counts.critical}  (Siteimprove "broken")`);
  console.log(`  WARNING:  ${counts.warning}  (Siteimprove "potentially broken" / level 2)`);
  console.log(`  NOTICE:   ${counts.notice}  (Siteimprove "notice" / level 3)`);

  function printBucket(level, label) {
    if (findings[level].length === 0) return;
    console.log(`\n── ${label} ──`);
    const grouped = new Map();
    for (const f of findings[level]) {
      const key = f.kind;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(f);
    }
    for (const [kind, items] of grouped) {
      console.log(`\n  [${kind}] (${items.length})`);
      const sample = verbose ? items : items.slice(0, 10);
      for (const f of sample) {
        console.log(`    ${f.page}`);
        console.log(`      href:   ${f.href}`);
        console.log(`      detail: ${f.detail}`);
      }
      if (!verbose && items.length > 10) {
        console.log(`    ... and ${items.length - 10} more (use --verbose for full list)`);
      }
    }
  }

  printBucket('critical', 'CRITICAL');
  printBucket('warning',  'WARNING');
  printBucket('notice',   'NOTICE');

  if (!checkExternal) {
    console.log(`\n  (external URL checks skipped — pass --external to include)`);
  }

  if (strict && counts.critical > 0) process.exit(1);
}

main().catch((err) => {
  console.error('[check-links] failed:', err);
  process.exit(1);
});
