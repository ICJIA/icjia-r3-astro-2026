#!/usr/bin/env node
// astro/scripts/build-hub-card-images.mjs
//
// Build-time pipeline (sibling of fetch-cms-images.mjs): the /research/
// card grid renders the committed Research Hub splash images
// (public/hub-images/<id>-splash.jpeg) inside a fixed 200px-tall,
// cover-cropped card slot — but the sources are full-resolution photos
// (up to 5743px wide / ~440 KiB), which cost /research/ its mobile
// Lighthouse performance score (LCP 4.1s in the 2026-07-05 audit).
//
// This script emits card-sized WebP variants that the research page
// serves via srcset. Aspect ratio is preserved (resize by width only) so
// the browser's `object-fit: cover` crop renders identically to the
// original at every viewport.
//
// Outputs:
//   - public/_hub-card/<id>-<width>.webp  (gitignored, regenerated per build)
//
// Unlike the CMS pipeline there is no source-width fallback variant: the
// card slot has a hard display ceiling (~700 CSS px wide), so 1280px
// covers 2x DPR everywhere and a 5743px variant would never be selected.
//
// Safe to run repeatedly (skips variants that already exist). If the
// output dir is missing at render time — e.g. `astro dev` without a prior
// build — the research page falls back to the original splash JPEGs, so
// nothing breaks; this mirrors how the CMS image manifest degrades.

import { promises as fs } from 'node:fs';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SRC_DIR = path.join(ROOT, 'public', 'hub-images');
const OUT_DIR = path.join(ROOT, 'public', '_hub-card');

// Same ladder + quality as fetch-cms-images.mjs, capped at source width.
const WIDTHS = [640, 960, 1280];
const QUALITY = 82;

async function main() {
  if (!existsSync(SRC_DIR)) {
    console.log('[hub-card] no public/hub-images directory — nothing to do');
    return;
  }
  const splashes = (await fs.readdir(SRC_DIR)).filter((f) =>
    f.endsWith('-splash.jpeg'),
  );
  if (splashes.length === 0) {
    console.log('[hub-card] no *-splash.jpeg sources — nothing to do');
    return;
  }

  await fs.mkdir(OUT_DIR, { recursive: true });

  let emitted = 0;
  let skipped = 0;
  let failed = 0;
  for (const file of splashes) {
    const id = file.replace(/-splash\.jpeg$/, '');
    try {
      const buf = await fs.readFile(path.join(SRC_DIR, file));
      const meta = await sharp(buf).metadata();
      if (!meta.width) throw new Error('no dimensions');

      const widths = WIDTHS.filter((w) => w <= meta.width);
      if (widths.length === 0) widths.push(meta.width); // tiny source: 1:1 copy

      for (const w of widths) {
        const out = path.join(OUT_DIR, `${id}-${w}.webp`);
        if (existsSync(out)) {
          skipped++;
          continue;
        }
        await sharp(buf).resize({ width: w }).webp({ quality: QUALITY }).toFile(out);
        emitted++;
      }
    } catch (err) {
      failed++;
      console.warn(`[hub-card] ${file}: ${err.message} — skipping`);
    }
  }

  console.log(
    `[hub-card] ${splashes.length} source(s) → ${emitted} variant(s) written, ` +
    `${skipped} already present, ${failed} failed → ${path.relative(ROOT, OUT_DIR)}`,
  );
}

main().catch((err) => {
  // Same philosophy as fetch-cms-images.mjs: never fail the build — the
  // research page falls back to the original splash JPEGs.
  console.error('[hub-card] pipeline failed:', err.message);
  console.error('[hub-card] continuing without card variants (degraded performance, not a build break)');
  process.exit(0);
});
