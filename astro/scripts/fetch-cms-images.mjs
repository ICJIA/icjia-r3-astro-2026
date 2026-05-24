#!/usr/bin/env node
// astro/scripts/fetch-cms-images.mjs
//
// Build-time pipeline: pull every Strapi-hosted body image referenced by R3
// content, download once, run Sharp to emit WebP variants at multiple
// widths, and write the lookup manifest (src/lib/cmsImageManifest.json).
// The markdown sanitizer (src/lib/markdown.ts) consults the manifest at
// render time and rewrites <img src> + adds srcset + intrinsic dimensions.
//
// Outputs:
//   - public/_cms-img/<hash>-<width>.webp   (gitignored, regenerated per build)
//   - src/lib/cmsImageManifest.json         (committed — small + useful diffs)
// Cache:
//   - .cache/cms-img/<hash>                 (gitignored buffer cache; re-runs
//                                            of this script skip the network)
//
// Safe to run repeatedly. If Strapi is unreachable, prints a warning and
// exits 0 with the existing manifest preserved — the markdown hook silently
// falls back to the original Strapi URL when a lookup misses, so the site
// continues to build.

import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const STRAPI_ORIGIN =
  process.env.PUBLIC_API_BASE_URL ?? 'https://r3.icjia-api.cloud';
const CACHE_DIR = path.join(ROOT, '.cache', 'cms-img');
const OUT_DIR = path.join(ROOT, 'public', '_cms-img');
const MANIFEST_PATH = path.join(ROOT, 'src', 'lib', 'cmsImageManifest.json');

// Mobile-first variant ladder, capped at the source width (no upscale).
// 640 covers most retina mobile; 960 covers desktop ~720px article body
// at 1x and retina at 480px; 1280 is the safety ceiling for very wide
// embeds. Source-width is always emitted last so high-DPR clients on
// large viewports still get the full resolution.
const WIDTHS = [640, 960, 1280];
const QUALITY = 82;

// Strapi v4 GraphQL — Astro's content.config.ts uses these same shapes.
// We only need the `body` field; everything else is irrelevant for the
// image-URL scan. Limit 200 covers the full content set with room to grow.
const QUERIES = {
  pages:     `{ pages(pagination: { limit: 200 })     { data { attributes { body } } } }`,
  posts:     `{ posts(pagination: { limit: 200 })     { data { attributes { body } } } }`,
  resources: `{ resources(pagination: { limit: 200 }) { data { attributes { body } } } }`,
  weeklyFaqs:`{ weeklyFaqs(pagination: { limit: 200 }){ data { attributes { body } } } }`,
};

// Matches the Strapi CDN's `/uploads/<name>.<ext>` URLs in both markdown
// `![](...)` syntax and raw `<img src="...">`. The capture group keeps the
// extension so we can skip animated GIFs that Sharp can't help (we still
// process them in-place — Sharp emits a still WebP — but logging is
// clearer this way).
const URL_RX = /https?:\/\/r3\.icjia-api\.cloud\/uploads\/[A-Za-z0-9_./-]+\.(?:jpg|jpeg|png|gif|webp)/gi;

async function gqlBodies(name, query) {
  const res = await fetch(`${STRAPI_ORIGIN}/graphql`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(`${name}: ${json.errors[0]?.message ?? 'GraphQL error'}`);
  const rows = json.data?.[name]?.data ?? [];
  return rows.map((r) => r.attributes?.body ?? '').filter(Boolean);
}

async function collectUrls() {
  const urls = new Set();
  for (const [name, q] of Object.entries(QUERIES)) {
    try {
      const bodies = await gqlBodies(name, q);
      for (const body of bodies) {
        for (const m of body.matchAll(URL_RX)) urls.add(m[0]);
      }
    } catch (err) {
      console.warn(`[cms-img] ${name}: ${err.message} — skipping`);
    }
  }
  return [...urls];
}

function hashUrl(url) {
  return createHash('sha1').update(url).digest('hex').slice(0, 16);
}

async function ensureCached(url) {
  const hash = hashUrl(url);
  const cachePath = path.join(CACHE_DIR, hash);
  if (existsSync(cachePath)) {
    return { hash, buf: await fs.readFile(cachePath), fromCache: true };
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(cachePath, buf);
  return { hash, buf, fromCache: false };
}

async function processOne(url) {
  const { hash, buf, fromCache } = await ensureCached(url);
  const meta = await sharp(buf).metadata();
  if (!meta.width || !meta.height) {
    throw new Error('no dimensions');
  }

  // Cap variants at source width; always emit the source-width variant
  // last so very large viewports / high DPR aren't capped at 1280.
  const widths = WIDTHS.filter((w) => w < meta.width);
  widths.push(meta.width);

  const variants = [];
  for (const w of widths) {
    const file = `${hash}-${w}.webp`;
    const out = path.join(OUT_DIR, file);
    if (!existsSync(out)) {
      await sharp(buf).resize({ width: w }).webp({ quality: QUALITY }).toFile(out);
    }
    variants.push({ src: `/_cms-img/${file}`, w });
  }

  const largest = variants[variants.length - 1];
  return {
    entry: {
      src: largest.src,
      srcset: variants.map((v) => `${v.src} ${v.w}w`).join(', '),
      width: meta.width,
      height: meta.height,
    },
    fromCache,
  };
}

async function main() {
  console.log(`[cms-img] scanning ${STRAPI_ORIGIN} for body image URLs`);
  const urls = await collectUrls();
  console.log(`[cms-img] found ${urls.length} unique URL(s)`);

  if (urls.length === 0) {
    console.log('[cms-img] no URLs to process — leaving existing manifest in place');
    return;
  }

  await fs.mkdir(OUT_DIR, { recursive: true });

  const manifest = {};
  let cached = 0;
  let downloaded = 0;
  let failed = 0;
  for (const url of urls) {
    try {
      const { entry, fromCache } = await processOne(url);
      manifest[url] = entry;
      if (fromCache) cached++; else downloaded++;
    } catch (err) {
      failed++;
      console.warn(`[cms-img] ${url}: ${err.message} — skipping`);
    }
  }

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
  console.log(
    `[cms-img] manifest: ${Object.keys(manifest).length} entries ` +
    `(${downloaded} fetched, ${cached} cached, ${failed} failed) → ` +
    path.relative(ROOT, MANIFEST_PATH),
  );
}

main().catch((err) => {
  // Don't fail the build on a pipeline error — site still works with the
  // existing manifest, and missing entries just fall through to the
  // original Strapi URLs at render time. Log loudly so the failure is
  // visible in Netlify build output.
  console.error('[cms-img] pipeline failed:', err.message);
  console.error('[cms-img] continuing with existing manifest (degraded performance, not a build break)');
  process.exit(0);
});
