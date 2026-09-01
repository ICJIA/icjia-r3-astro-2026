# Astro Migration Changelog

All notable changes to the Astro rebuild of r3.illinois.gov live here.
Most recent at the top; entries grouped by date, days in reverse
chronological order.

---

## v1.0.12 — 2026-09-01

Homepage hero swap. With both R3 NOFOs closed, the two-up splash row was
advertising two expired funding opportunities as the first thing on the page.
It is replaced by a single full-bleed band pointing at the R3 StoryMap, built
from a supplied PowerPoint mock. The splash row is **preserved, not deleted** —
it returns on a one-line flag flip when the next NOFO opens.

**`src/lib/manualPages.ts`** — new `SHOW_HOMEPAGE_SPLASH: boolean` switch.
`false` (current) renders `HomeHero`; `true` restores the untouched
`HOMEPAGE_SPLASH` two-up row. Typed `boolean` rather than left as the literal
`false` so TypeScript does not narrow it and flag the splash branch in
`index.astro` as dead code. Verified in both positions: flipping to `true`
brings the original row back unchanged.

**`src/components/HomeHero.astro`** (new) — the band. Fills the same 650px slot
the splash row did (the mock's geometry measures to exactly that height, so
nothing below shifts when the flag is flipped), stepping down to 480px ≤959px
and 380px ≤600px — the source is 2.18:1 and would otherwise crop to a vertical
sliver on a phone. Whole band is one link to the StoryMap, `target="_blank"`
with an sr-only "opens in a new tab"; the accessible name is the panel's own
heading plus body text, so the visible "Click here" never stands alone as link
text. Centred panel is opaque, which makes contrast a fixed property of the
panel colour instead of a function of the photo behind it.

**`src/assets/home-hero-background.png`** (new) — 2000×918 source. Ships as
WebP at 55 KB (640w) through 329 KB (2000w), not the 5.4 MB original.

**`src/lib/homeHero.ts`** (new) — the `<Image>` options, in one place because
two call sites need to agree on them: the component that renders the image and
the page that preloads it. If they drifted, Astro would emit two sets of files
and the browser would fetch the hero twice.

**`src/layouts/BaseLayout.astro`** — `preloadImages` now accepts
`{ href, imagesrcset, imagesizes }` as well as a plain string. A responsive
image needs its preload to carry the same srcset/sizes the `<img>` will use; a
bare `href` preload warms one candidate while the browser picks another and
downloads the image twice. Backwards compatible, and nothing was passing this
prop before.

**`src/pages/index.astro`** — hero slot is now a ternary on the flag, and the
LCP preload the file's header comment had claimed since Phase 4g.3 is actually
wired. Build output confirmed byte-identical `imagesrcset` and `srcset`.

**`src/components/HomePhotoBoxes.astro`** — Applicant Tools contrast rework.
contrastcap was raising seven warnings here: every one passed, but all seven
were pixel-sampled over a photo, meaning the ratio held only at the sampled
position and only for the photos the CMS happens to serve today. This entry's
predecessor had already patched a real 3.38:1 failure in the same spot. The
title/description block now sits on its own scrim at alpha 0.85, dense enough
that the worst case a photo can produce — a pure-white pixel — still measures
12.9:1. White text holds AA down to alpha 0.458, so the guarantee survives any
future image swap. The scrim is translucent, not solid, so the photo still
reads through it. Fixed 200px height aligns all four bars; the bottom 28px
fades into the photo, and text stays AA-safe to y=185px against a worst
measured wrap of y=168px (four-line Collaboratives copy at the narrowest 2-up
column, ~965px). The full-tile wash drops from a 0.6→0.5 gradient to a flat
0.22 now that it no longer doubles as the text backdrop, and the text-shadows
go with it — they existed only to lift white text off photos.

**`src/lib/navConfig.ts`** — StoryMap URL extracted to `R3_STORYMAP_URL`, now
shared by the About menu and the hero rather than spelled out twice.

Verified: `astro check` 0/0/0, 129/129 unit tests, production build clean.
axe-core 0 violations (AA + best-practice + experimental). contrastcap
**0 failures, 0 warnings — down from 7 warnings**. Lighthouse desktop
100/100/100/100; mobile 99/100/100/100 with LCP 2.2s, measured against a
stashed-baseline rebuild that scored 98 and 2.3s beforehand. Hero and photo
grid screenshotted at 375px, 965px and 1072px.

---

## v1.0.11 — 2026-07-08

SiteImprove SEO/QA scoresheet remediation. The sheet's findings are almost
all editorial (title length, text-to-code ratio, readability, word count) or
correct-as-is — every empty `alt` on the site is an intentional decorative
image (`role="presentation"`, accessible name on the link), and a build-wide
scan found **zero** content images missing alt. The live site already scores
Lighthouse SEO 100 / A11y 100 / Perf 96. Four code-fixable items are handled
here; the rest are content-author work, catalogued in
`docs/siteimprove-content-checklist-2026-07-08.md`.

**`src/layouts/BaseLayout.astro`** — page `<title>` reworked from `R3 | {title}`
to `{title} | Restore, Reinvest, Renew (R3)` (unique name first, brand last —
SEO best practice). Bare section titles were 11–14 chars (`R3 | Contact`),
under SiteImprove's ~30-char floor; they now run 37–40. The suffix is
**adaptive**: when the full brand would push a title past 60 chars it falls
back to a minimal ` | R3`, so short titles get lifted without compounding the
long news headlines Strapi supplies (60–170 chars). Also adds `og:site_name`.

**`src/pages/index.astro`** — homepage title `"Restore. Reinvest. Renew."` →
`"Illinois R3 Grant Program"`, so with the new suffix it reads
`Illinois R3 Grant Program | Restore, Reinvest, Renew (R3)` (57 chars) instead
of a redundant `<program> | <program>`.

**`src/pages/resources/index.astro`** — resource cover `<Image>` switched from
`inferSize` to an explicit `width={800} height={534}`. `inferSize` set the
width attribute to the Strapi upload's intrinsic size (up to 7276px), so Astro
emitted the fallback `src` at full resolution — a 4.5 MB `.webp` shipped beside
the tiny 400/800w `srcset` (SiteImprove "images larger than 1MB"; two files,
4.5 MB + 1.0 MB). Capping the width caps the fallback (now 51 KB / 33 KB); the
card is `object-fit:cover` in a fixed 300px box, so the declared aspect never
drives layout. The build now ships **zero** images over 1 MB.

**`src/pages/search.astro`** — meta description lengthened 31 → ~130 chars.

Verified: `astro check` 0/0/0, 129/129 unit tests, e2e title regexes still
match the new format, build ships no image > 1 MB, `/resources/` grid
screenshotted unchanged.

---

## v1.0.10 — 2026-07-05

Fixes from today's full-site audit (lightcap + axecap + contrastcap, all
26 sitemap pages, mobile + desktop). The site audited clean nearly
everywhere — 0 axe violations in 52 runs, 0 contrast failures, Lighthouse
100s across the board — except three items: `/research/` mobile
performance (87, LCP 4.1s), the noindex `/resources/single-page/` view
appearing in the sitemap, and third-party ArcGIS embed noise on
`/eligibility/` (accepted; see end of entry).

**`scripts/build-hub-card-images.mjs`** (new) — prebuild sibling of
`fetch-cms-images.mjs`: emits 640/960/1280px WebP variants (q82, aspect
preserved) of every committed `public/hub-images/*-splash.jpeg` into
gitignored `public/_hub-card/`. The research grid was serving the
full-resolution splash JPEGs (up to 5743px / 443 KiB) into a 200px-tall
cover-cropped card slot — ~2.2 MB of image waste on desktop, ~819 KiB on
mobile. Worst offender drops 443 KiB → 26 KiB at the mobile breakpoint.
Chained into `prebuild`; also runnable as `pnpm build:hub-card-images`.
Never fails the build (same philosophy as the CMS pipeline).

**`src/pages/research/index.astro`** — cards now render the `_hub-card`
variants via `srcset` plus a `sizes` attribute derived from the grid CSS,
falling back to the original splash JPEG when the variants are absent
(`astro dev` doesn't run prebuild) and to the Hub CDN URL when no local
image exists — the same degradation ladder as the CMS image manifest.

**`astro.config.ts`** — the sitemap filter now also drops
`/resources/single-page/`: it is a deliberately-noindex printable view,
and a noindex URL inside the sitemap reads as a soft error in Search
Console. Sitemap goes 26 → 25 URLs; the page itself still builds,
renders, and keeps its `noindex`.

**`tests/e2e/sitemap.spec.ts`** — exclusion test extended to assert
`/resources/single-page/` stays out of `sitemap-0.xml`.

**`playwright.config.ts`** — webServer command switched `yarn` → `pnpm`,
matching the v1.0.3 package-manager standardization (under Corepack,
`yarn` errors against a pnpm `packageManager` pin).

Audited but deliberately unchanged: `/eligibility/` Perf 98 / BP 96 traces
entirely to the embedded ArcGIS StoryMap (third-party cookie flag,
bf-cache blockers, Esri's 5-minute CDN TTL — not actionable in-repo); the
awards-article body image already ships WebP + srcset from the CMS
pipeline and its residual ~20 KiB flag is srcset-ladder granularity; the
home page's 12 contrast *warnings* are text-over-image advisories that
all measure 6.11–11.73:1, comfortably past their AA thresholds.

## v1.0.9 — 2026-05-27

Three small wins from the v6.4 Astro-conversion checklist: a sitemap
discovery fix, a search affordance on the 404 page, and a `?q=`
deep-link reader so the two connect.

**`netlify.toml`** — added two `[[redirects]]` blocks mapping
`/sitemap.xml` and `/sitemap.xml/` to `/sitemap-0.xml` with `status =
200` (rewrite, not 301, so the canonical sitemap URL stays
`/sitemap.xml` in search-console reports). `@astrojs/sitemap` always
emits `sitemap-index.xml` + `sitemap-0.xml`, never `sitemap.xml`, but
`public/robots.txt` advertises the conventional `/sitemap.xml` URL.
Without these rules, crawlers following robots hit a 404.

**`src/pages/404.astro`** — added a `<form method="get"
action="/search/">` with a `name="q"` input between the heading and the
quick-links grid, plus a "Still can't find what you're looking for?
Contact us." fallback line. R3 navy styling, 44px touch targets, focus
rings. Pure HTML, no JS — the submission target hits the new `?q=`
reader in Search.vue.

**`src/components/Search.vue`** — `onMounted` now reads `?q=` from
`URLSearchParams` and prefills the `query` ref + focuses
`#search-input` before fetching the index. So `/search/?q=foo` arrives
with the query already in the input and results materialize as soon as
Fuse builds. Drives the 404 → search hand-off; also works for any
external link that sets `q`.

**Verified:**

- `pnpm check` — 0/0/0 (43 files)
- `pnpm test`  — 129/129 pass
- Browser at `/search/?q=grants` → input focused with value "grants",
  32 matches rendered with chip filters populated by type.
- Mobile (375px) 404: hero scales down, form row stays inline, quick
  links wrap, contact fallback line readable.

---

## v1.0.8 — 2026-05-24

Convert `/funding` from a meta-refresh page to a proper Netlify edge 301.
Closes the last Siteimprove flag on the site.

**`astro.config.ts`** — removed the `redirects: { '/funding': '/' }`
block. In `output: 'static'`, Astro renders that as a `<meta
http-equiv="refresh">` HTML page, which is a weaker SEO signal than a
server-side 301 and adds a parse-and-redirect round-trip for the user.
Also removed the now-dead `!page.includes('/funding/')` sitemap filter.

**`netlify.toml`** — added a `[[redirects]]` block for `/funding` →
`/` with `status = 301` and `force = true`. Netlify's redirect engine
matches both `/funding` and `/funding/` from a single rule.

**`src/pages/404.astro`** — dropped the "Funding" quickLink. It pointed
at `/funding/` which now 301s to `/` — the same destination as the
"R3 Home" quickLink already in the list, so it was redundant.

**Verified:**

- `pnpm test`  — 129/129 pass
- `pnpm check` — 0/0/0 (43 files)
- `pnpm build` — 28 pages (was 27; the sitemap entry for /funding/ no
  longer needs filtering because the route no longer exists). The
  `dist/funding/` directory is no longer emitted.
- `check-links --external` — **0 CRITICAL, 0 WARNING, 0 NOTICE.**
  Full site is link-clean.

---

## v1.0.7 — 2026-05-24

Follow-up to v1.0.6: relocate Language Access Plan (LAP) content from
the deleted `/translate/` page onto `/contact/`, and clean up the dead
sitemap filter.

**`src/pages/contact.astro`** — added a "Need language assistance?"
section to the existing contact card, parallel in structure to the R3
Q&A section above it. New copy is tightened from the original
`/translate/` LAP text:

- LAP commitment paragraph (Title VI / federal LEP guidance — required
  for federally-funded programs)
- Mailto for `LAPRequests@illinois.gov`

The Google Translate explainer from the old page is intentionally
dropped — onsite translation will return when an Illinois DoIT-licensed
solution (WeGlot) is in place; for now, language assistance is
request-based via the email above.

**`astro.config.ts`** — removed the now-dead
`!page.includes('/translate/')` sitemap filter (translate page was
deleted in v1.0.6).

**Audit follow-up:** the user also cleaned up 5 of 6 Strapi-side
`youtube.com` URLs to add the `www.` prefix during this round.
Remaining 3 WARNING items are all Strapi-side and CMS-editable:
- 1 × `youtube.com/watch?v=gvqOC2JCCJI` (missing `www.`)
- 1 × `sam.gov/content/home` (page removed by SAM)
- 1 × IRS EIN URL (IRS renamed the page)

**Verified:**

- `pnpm test`  — 129/129 pass
- `pnpm check` — 0/0/0 (43 files)
- `pnpm build` — 27 pages
- `check-links --external` — 0 CRITICAL, 3 WARNING (all Strapi), 0 NOTICE

---

## v1.0.6 — 2026-05-24

Fix all 4 source-side link errors flagged by the new
`scripts/check-links.mjs` audit. Drops CRITICAL from 7 → 0 and WARNING
from 10 → 8 (remaining 8 are Strapi-side redirects, not in this repo).

**1. /translate page deleted.** The page generated 5 dead links to
`translate.google.com/translate?u=...` — a URL pattern Google removed
in 2019 (the website-proxy translation feature is gone). Modern browsers
(Chrome, Safari, Edge, Firefox) auto-detect non-English pages and offer
in-browser translation, so the dedicated page no longer adds value.
Also removed the "Translate" link from `SiteFooter.astro`.

> **Note for follow-up:** the deleted page also carried Language Access
> Plan (LAP) compliance text and the `LAPRequests@illinois.gov` contact
> for translation requests — Title VI / federal LEP guidance for
> federally-funded programs. If that content needs to live on the site,
> the natural home is `/contact/` or `/privacy/`. Currently no other
> page references it.

**2. GitHub repo links converted to plain text.** The repo
(`github.com/ICJIA/icjia-r3-astro-2026`) is private, so GitHub returns
404 to unauthenticated visitors — including link checkers and the
public visitors who clicked these. Changed both occurrences in
`/documentation/accessibility/` from `<a href="…">…</a>` to `<code>` /
plain-text spans. The repo is still credited; visitors no longer get a
404 page.

**3. `www2.illinois.gov` → `gov.illinois.gov`.** The Governor's page
moved when Illinois consolidated its `www2.illinois.gov` subdomain.
Direct fix in `SiteFooter.astro:80`. Was 307-redirecting to
`www.illinois.gov` (the state homepage, not the Governor's office) —
now points at the current Governor's office URL directly.

**4. DHS IITAA link → DoIT.** Illinois moved IITAA documentation from
`www.dhs.state.il.us/page.aspx?item=32765` to
`doit.illinois.gov/initiatives/accessibility/iitaa.html`. Updated the
reference in `/documentation/accessibility/index.astro`.

**Tooling:** added `scripts/check-links.mjs` (run with `--external`
to HEAD-check off-domain URLs). Categorizes findings into CRITICAL /
WARNING / NOTICE buckets matching Siteimprove's severity model.

**Verified:**

- `pnpm test`  — 129/129 pass
- `pnpm check` — 0/0/0 (43 files)
- `pnpm build` — 27 pages (was 28; translate removed)
- `node scripts/check-links.mjs --external` — 0 CRITICAL, 8 WARNING (all Strapi), 0 NOTICE

---

## v1.0.5 — 2026-05-24

Remove AmpliFund links from the homepage. Both NOFOs are closed, so
sending users to AmpliFund (where they can't apply) was a worse UX than
just describing the past opportunity.

**`src/lib/manualPages.ts`** — dropped `externalURL` from both
`HOMEPAGE_SPLASH` entries. The card titles, taglines, and "EXPIRED"
date stay so the cards remain informational.

**`src/components/HomeSplashCard.astro`** — replaced the always-`<a>`
wrapper with a dynamic-tag pattern: `const Tag = externalURL ? 'a' :
'div'`. When `externalURL` is absent the wrapper renders as a plain
`<div>` instead of an `<a href="#">` dead link (which would scroll-to-top
on click and trip WCAG 2.4.4 / 2.4.9 indirectly). Added a
`.splash-card--static` modifier that drops `cursor: pointer`, the
hover-translate, the hover box-shadow, and the image hover-zoom so the
card no longer signals clickability.

Note: the `/resources/single-page/` route still contains an
"AmpliFund Portal Guide and Tip Sheet" section with PDFs from Strapi.
That content is CMS-managed (not in source) — remove it from Strapi if
the guides should also come down.

**Verified:**

- `pnpm test`  — 129/129 pass
- `pnpm check` — 0/0/0
- `pnpm build` — 28 pages; both splash cards now render
  `<div class="splash-card splash-card--static">` wrappers with no href

---

## v1.0.4 — 2026-05-24

Image-delivery wins on the homepage + a build-time WebP pipeline for
Strapi body images. Targets the `image-delivery-insight` Lighthouse
finding that was draining the mobile Perf score down to 97.

**Director portrait (homepage).** `<img src="/DirectorAdamsResized.jpg">`
was a 87 KB static JPG, 1000×1043 source, served for a 140×140 display.
Now an Astro `<Image>` (`src/assets/director-adams.jpg`, `widths={[140,
280, 420]}`, `format="webp"`, `sizes="140px"`) emits three properly-sized
WebP variants per build. Also removed the unused 1.14 MB
`public/DirectorAdams.jpg` original.

**Body-image WebP pipeline.** Implements [checklist §5 tier 2](
https://github.com/ICJIA/adult-redeploy-client-next/blob/master/docs/astro-conversion-checklist.md):

- `scripts/fetch-cms-images.mjs` — runs as `prebuild`. Hits Strapi v4
  GraphQL for `pages` / `posts` / `resources` / `weeklyFaqs` `body`
  fields, regexes out every `r3.icjia-api.cloud/uploads/...` URL,
  downloads each unique URL once, runs Sharp to emit WebP variants at
  `[640, 960, 1280]` widths (capped at source width), writes the
  manifest to `src/lib/cmsImageManifest.json`. Buffers cached under
  `.cache/cms-img/<sha1>` so re-builds skip the network. Pipeline
  failures (Strapi outage, bad URL) are logged but never fail the
  build — the markdown hook falls back to the original Strapi URL
  when a lookup misses.
- `src/lib/cmsImage.ts` — `getCmsImage(url)` lookup helper.
- `src/lib/markdown.ts` — new DOMPurify `afterSanitizeAttributes` hook
  rewrites `<img src>` to the manifest entry, adds `srcset`, and fills
  in intrinsic dimensions. **Aspect-ratio-aware**: if the author set
  `width="750"` on a 1188×1188 source, the hook computes `height="750"`
  (proportional) rather than stamping the source intrinsic 1188 (which
  would produce a letterboxed box). Naive "intrinsic-only" code would
  blow up CLS on every author-constrained image.
- Manifest committed; `public/_cms-img/` WebPs and `.cache/cms-img/`
  buffers gitignored. Current state: 1 entry (the 287 KB news-page PNG
  → 3 WebP variants), pipeline ready to scale as authors add more.

**Tests.** `tests/unit/cmsImage.test.ts` for the helper (null on miss,
shape contract on hit). `tests/unit/markdown.test.ts` adds the
no-op-on-miss case AND the aspect-ratio computation case. Suite now
**129/129 pass**.

**Other.** Fixed `start-dev-server.sh` line 39 — `${*}` errored under
`set -u` when invoked with no args. Now uses `${*:+ }${*:-}` so the
empty case is safe.

**Verification:**

- `pnpm test`  — 129/129 pass
- `pnpm check` — 0/0/0 (43 files)
- `pnpm build` — 28 pages, prebuild emits manifest, Astro emits 3
  director-adams WebP variants

---

## v1.0.3 — 2026-05-24

Switch Netlify build from yarn to pnpm so local dev and CI use the same
package manager. Removes the dual-lockfile drift risk and aligns with the
all-Astro-projects-use-pnpm preference.

**Build pipeline (`netlify.toml`):**

- `command = "yarn build"` → `"pnpm build"`
- env: `YARN_VERSION = "1.22.22"` → `PNPM_VERSION = "10.33.0"`

**Package metadata (`astro/package.json`):**

- Bumped `packageManager` to `"pnpm@10.33.0"` (Corepack now uses pnpm
  locally and on Netlify).
- **Declared two previously-phantom transitive deps explicitly.** yarn 1's
  flat `node_modules` was hoisting these automatically; pnpm's strict
  isolation refuses to expose them as phantoms, so we declare:
  - `zod ^4.4.3` — used directly via `import { z } from 'zod/v4'` in
    `src/content.config.ts` (collection schemas) and
    `src/__mocks__/astro-content.ts` (test mock).
  - `sharp ^0.34.5` — Astro's image-processing engine, called by
    `<Image>` to emit WebP variants at build time.
- Added `pnpm.onlyBuiltDependencies = ["esbuild", "sharp"]` so pnpm 10's
  build-script gate auto-approves the native binaries we need (otherwise
  CI would silently skip post-install for both and the build would die
  on `Could not find Sharp`).

**Lockfile:**

- Removed `astro/yarn.lock`, committed `astro/pnpm-lock.yaml`.

**Repo hygiene:**

- Removed the stale 694 MB root-level `/node_modules` (Nuxt-era leftover).
  TypeScript was walking up the directory tree from `astro/src/...` and
  resolving `zod` from the old root install, then failing to reconcile
  it with `astro/node_modules/.pnpm/zod@4.4.3/...` — 101 `_zod.version.minor`
  mismatch errors. Deleting the stale tree resolves it.

**Verification:**

- `pnpm test` — 124/124 pass
- `pnpm check` — 0 errors, 0 warnings, 0 hints
- `pnpm build` — 28 pages, sitemap-index.xml emitted, all images
  optimized via sharp

---

## v1.0.2 — 2026-05-24

Apply three patterns from the ICJIA Astro conversion checklist
(`github.com/ICJIA/adult-redeploy-client-next/blob/master/docs/astro-conversion-checklist.md`).

**1. CSP cleanup (`netlify.toml`).** Verified zero references in
`astro/src/`, then dropped:

- `style-src`: `https://fonts.googleapis.com` — fonts self-hosted via
  `@fontsource` since v0.10.0
- `font-src`: `https://fonts.gstatic.com` and `https://fonts.googleapis.com`
  — same reason
- `script-src`: `https://cdn.jsdelivr.net` and
  `https://siteimproveanalytics.com` — legacy Nuxt-era entries

Added `Permissions-Policy: camera=(), microphone=(), geolocation=()` since
none of those APIs are used on the site. Smaller CSP surface, no cross-origin
whitelisting for things we don't actually load.

**2. Plausible script variant** (`BaseLayout.astro`). Swapped
`/js/script.js` → `/js/script.file-downloads.outbound-links.js`. Two extra
events now fire automatically with no per-link instrumentation:

- `Outbound Link: Click` — any `<a>` to an off-domain host
- `File Download` — any `<a>` ending in `.pdf`/`.docx`/`.xlsx`/`.csv`/etc.

These slice cleanly in the Plausible dashboard under Goals. Useful for the
PDF-heavy `/resources/` and `/documentation/` sections, where outbound
clicks and downloads were previously invisible. Same defer attribute, same
CSP origin, +~2 KB.

**3. Markdown body `<img>` perf attributes** (`astro/src/lib/markdown.ts`).
Added a DOMPurify `afterSanitizeAttributes` hook that injects
`loading="lazy"` and `decoding="async"` on any body `<img>` that doesn't
already carry them. Strapi authors don't set perf attributes by default,
so long body pages were eager-fetching every below-the-fold image.
Explicit author values are preserved — an LCP candidate in markdown that
opts into `loading="eager"` keeps it. Four new tests bring the suite to
**124/124 pass**.

**Local dev: pnpm.** Removed `"packageManager": "yarn@1.22.22"` from
`astro/package.json` so Corepack stops blocking `pnpm` locally. Netlify
build still uses yarn (production deployment pipeline unchanged; switching
CI to pnpm is a separate change). Added `start-dev-server.sh` at the repo
root for a one-command `pnpm dev` boot.

---

## v1.0.1 — 2026-05-23

Fix homepage `p-as-heading` (axe DevTools, WCAG 1.3.1 A — flagged
experimental in axe so the standard `wcag2*` tag set didn't catch it).

axe DevTools export (`r3.illinois.gov-2026-05-23.json`, extension
4.129.1, axe-core 4.11.4, experimental rules enabled) reported
**3 serious violations** on `/`:

| Element | Rule |
|---|---|
| `.photo-box__title` ("Eligibility") | `p-as-heading` |
| `.photo-box__title` ("Collaboratives") | `p-as-heading` |
| `.photo-box__title` ("Resources") | `p-as-heading` |

The `HomePhotoBoxes` titles were rendered as `<p class="photo-box__title">`
but styled as headings (bold, 26px, bordered underline). Promoted them
to `<h3>` — semantically correct (the parent section is
`<h2>Applicant Tools</h2>`, so `h3` keeps heading order intact) and
appears in SR heading-navigation lists. Scoped CSS keeps the visual
identical (Astro's `[data-astro-cid-…]` selector outranks the global
`.markdown-body h3` margin rule on specificity).

Note for the future: the standard a11y sweep
(`a11y-sweep.spec.ts` / `generate-a11y-report.mjs`) audits with
`tags: ['wcag2a','wcag2aa','wcag21a','wcag21aa']` only — it does NOT
include axe-core's `experimental` ruleset, which is where
`p-as-heading` lives. axe DevTools enables it by default. Could be
added to our tag list as a follow-up if we want this caught
automatically going forward.

---

## v1.0.0 — 2026-05-23

First post-cutover release. Marks the Astro rebuild as the production
site (no more "migration" framing) and rolls up the post-cutover
verification sweep.

### Production audit — all 26 sitemap routes

**axe-core sweep (Playwright + axe-core 4.11.4, all viewports)**

| | |
|---|---:|
| Pages tested | 26 |
| Viewports | desktop / tablet / mobile (78 scans) |
| **Total violations** | **0** |
| Total passes | 1772 |
| Pages passing | 26 / 26 |
| Skip-link coverage | 78 / 78 |

Single violation surfaced during the first pass — `scrollable-region-focusable`
(WCAG 2.1.1 A) on the `/documentation/accessibility/` results table wrapper
itself (overflow-x with no keyboard focus). Fixed by adding
`role="region"`, `aria-labelledby="results"`, and `tabindex="0"` to
the wrap in `scripts/generate-a11y-report.mjs` and the live page; re-run
came back clean.

**Lighthouse mobile, all 26 sitemap routes (live r3.illinois.gov)**

24 routes at Perf 98–100. Two outliers:

| Route | Perf | Note |
|---|---:|---|
| `/news/icjia-awards…/` | 94 | LCP 3.1s; remote Strapi-hosted body image. ~204 KiB unoptimized. |
| `/research/` | 86 | LCP 4.1s; 4× Research Hub splash images served at ~819 KiB total. Hub-side asset, outside this repo. |

Astro A11y / BP / SEO = 100 across all 26 routes (modulo the pre-existing
`/eligibility/` BP=96 ArcGIS-iframe inspector warning, carried over from
the Nuxt baseline; and `/resources/single-page/` SEO=66, intentionally
`noindex` — the printable view).

**axe-core via `axecap` (desktop, AA, 12 representative routes)** — 0
violations on every route audited.

### Aggregate vs. the Nuxt baseline

| Metric | Nuxt P0 | Astro v1.0.0 |
|---|---:|---:|
| Mobile Perf avg | ≈ 79 | **≈ 98** |
| Mobile Perf min | 52 (`/eligibility/`) | **86** (`/research/`) |
| Routes ≥ 95 mobile | 4 / 25 | **24 / 26** |
| axe-core violations | 3 (best-practice, `/404`) | **0** |
| Lighthouse a11y avg | 100 | 100 |

### Misc

- `package.json` bumped 0.10.0 → 1.0.0.
- Public `/documentation/accessibility/` report regenerated with today's
  snapshot (1772 passes, 0 violations).
- Migration is complete; "migration" terminology retired from this file
  going forward.

---

## 2026-05-23 — `font-display: optional` on Lato / Roboto / Raleway → kill `/eligibility/` mobile CLS

The earlier iframe-inline-style fix made the markup correct but **did not move
CLS**. The post-deploy lightcap re-run still showed CLS 0.20 on every warm-iframe
run. Extracting `layout-shifts` from the Lighthouse JSON pinned the culprit:

```
selector: div.page-layout > div.page-content > article.markdown-body > p
score:    0.199
```

A paragraph inside the Strapi-rendered body — not the iframe. Classic
font-swap reflow: first paint uses the fallback (Arial / system-ui),
then Lato/Roboto/Raleway arrive late under Lighthouse's 3G simulation
and the paragraph reflows. The iframe loading at roughly the same
moment was just coincident, not causal.

Fix: replace the fontsource `@import` lines in `global.css` (which
hard-code `font-display: swap`) with manual `@font-face` declarations
pointing at the same fontsource `.woff2` files but pinning
**`font-display: optional`**. Latin subset only — 6 files
(Roboto-Variable, Raleway-Variable, Lato 300/400/400-italic/700),
totalling ~150 kB.

Trade-off: a first-time visitor on a slow connection won't see the
custom font on first paint (the browser sticks with the fallback if
the .woff2 isn't ready within ~100 ms). On a return visit the .woff2
is cached and renders immediately. No FOUT, no reflow, no CLS.

Verification: `astro check` 0/0/0, vitest 120/120, build clean, dist
includes the 6 `latin-*.woff2` files. CSS has `font-display: optional`
and no `font-display: swap`. Awaiting deploy to re-run the
`/eligibility/` mobile audit.

---

## 2026-05-23 — About dropdown: section headings are now clickable

User report: clicking the "About the R3 Program" or "Applicant Tools"
text in the desktop / mobile drawer dropdown did nothing — they were
rendered as non-interactive `<li class="...-dd-section">` labels, faithfully
porting the Nuxt original. Any item that looks like a menu entry must
actually navigate; otherwise the cursor / focus shift on hover is a lie.

- `navConfig.ts`: `NavSection` now carries optional `href` + `external`.
  `About the R3 Program` is wired to the ArcGIS StoryMap (the same target
  the duplicate inner link below it pointed at — that inner link is removed
  to avoid the doubled entry). `Applicant Tools` is wired to `/resources/`
  (the page where the applicant toolset actually lives).
- `SiteNav.astro`: both desktop dropdown and mobile drawer render the
  section's text inside an `<a>` when `href` is set. Existing
  `(opens in new window)` and `sr-only` patterns reused for external targets.
- CSS: new `.site-nav__dd-section-link` and `.site-nav__drawer-section-link`
  classes inherit the parent section's heading look (bold Roboto-900, gray,
  uppercase on mobile) and `text-decoration: none` by default. Hover /
  `:focus-visible` adds the underline and primary-color shift so keyboard
  and pointer users get a clear affordance — the section still *reads* as
  a heading at rest. Mobile-drawer link fills the full 44px tap row.
- TypeScript narrowing fixed in `dropdownActive(children)` so the optional
  `NavSection.href` doesn't get passed as `string | undefined` to `isActive`.
  `astro check` back to 0/0/0; vitest 120/120; build 28 pages clean.

---

## 2026-05-23 — `/eligibility/` mobile perf fixes

Post-cutover live re-audit found `/eligibility/` mobile Perf sitting at
**~66 (median of 5 runs)** vs. desktop **96**, with **LCP ~10s** and
**CLS 0.20** — both dominated by the ArcGIS StoryMap iframe loading
cross-origin on a cold Lighthouse 3G simulation. The local-preview
measurement during Phase 7 read 99 because the iframe was warm-cached.

Two targeted fixes, no UX change:

- **Conditional `<link rel="preconnect" href="https://storymaps.arcgis.com" crossorigin>`** on `/eligibility/` only (`preconnectOrigins` prop on `BaseLayout`, passed from `[...slug].astro` when `data.slug === 'eligibility'`). Warms DNS + TLS before the iframe is parsed; other routes don't pay the connection-slot cost.
- **Strip the invalid `px` unit from iframe `height`/`width` attributes** in `markdown.ts`. Strapi authors the embed as `height="1500px"`, which is invalid per HTML5 (the iframe attribute is a non-negative integer, not a CSS length). Stripping the unit makes the attribute parse as an integer. Post-deploy lightcap re-run showed the attribute alone wasn't enough — modern browsers tolerate the bad unit but the iframe still doesn't bind a CSS box, so on the runs where the iframe rendered within Lighthouse's measurement window, CLS held at 0.20.
- **Promote iframe dimensions to inline `style`** (same DOMPurify hook). `style="width: 100%; max-width: 100%; height: 1500px"` is authoritative — browsers honor it at parse time, before the iframe's cross-origin content arrives, killing the layout shift at source. Falls back to `aspect-ratio: 4 / 3` when the iframe has no explicit pixel height. New `markdown.test.ts` cases (`strips invalid CSS units…`, `leaves bare-integer…`, `promotes iframe dimensions to inline style…`, `falls back to aspect-ratio…`) guard the behavior.

Verification: `astro check` 0/0/0, vitest 118/118, build clean, dist
inspection confirms preconnect emits on `/eligibility/` only and
`<iframe … height="1500" …>` (no `px`).

---

## 2026-05-23 — Production cutover

The Astro rebuild is live on `main` and deployed to
[r3.illinois.gov](https://r3.illinois.gov). The Nuxt 4 + Vuetify 3 era is
over; the repository is Astro-only going forward.

### What shipped

- `main` force-replaced with the `migration/astro-full` tip (`c663ffc`).
  Tagged **`v0.10.0`** at the cutover commit.
- **`pre-astro-cutover`** tag preserves the final Nuxt 4 `main` state
  (`00da1b2`) as a recoverable safety net. The Nuxt source also remains
  on the historical `feat/nuxt4-migration` branch.
- Netlify production project (`illinois-r3`) rebuilt automatically from
  the new `main`; `netlify.toml` `base = "astro"` was already in place.
- 22 stale dependabot PRs against Nuxt-era dependencies (axios,
  basic-ftp, h3, defu, devalue, rollup, simple-git, dompurify,
  node-forge, fast-xml-parser, lodash, happy-dom, etc.) closed with an
  explanatory comment.
- `migration/astro-full` branch deleted from `origin` (now redundant
  with `main`).

### Production verification

| Check | Result |
|---|---|
| `<meta name="generator" content="Astro …">` | present |
| Astro scoped-style markers (`data-astro-cid-*`) | present |
| `/_astro/*.webp` build-pipeline images | present |
| Vuetify / `v-app` / `v-container` references | **0** |
| About → R3 Program StoryMap URL | `8607e513363e49f5b02a6e7d8a82432a` ✓ (matches the May 11 Nuxt update) |

### Mobile Lighthouse parity vs. previous Nuxt production

Re-measured on cutover day against a side-by-side run of the live
Nuxt site (just before push) and the local Astro preview (`yarn
preview`) on identical viewports.

| Route | Nuxt P0 | Astro now | Δ |
|---|---:|---:|---:|
| `/` | 63 (LCP 6.8s) | **100** (LCP 1.7s) | **+37** |
| `/eligibility/` | 59 (LCP 14.1s) | **90** | **+31** |
| `/collaboratives/` | 68 | **98** | **+30** |

A11y, Best Practices, and SEO all remain 100 on the routes audited
during cutover — matching the Nuxt baseline at those categories.

### Two pre-cutover commits intentionally discarded from main

The Nuxt-era `main` tip carried two commits that did not need to be
preserved through the force-replace:

| Commit | Reason discarded |
|---|---|
| `00da1b2 fix: meta` | Accidentally committed Astro `.astro/` build artifacts + `playwright-report/` + `test-results/` — all generated files, all `.gitignore`d in the Astro tree. |
| `54f6627 chore: update About → About the R3 Program StoryMap link` | Already incorporated in the Astro tree (verified `navConfig.ts` carries the new StoryMap ID `8607…32a`). |

Both remain recoverable via the `pre-astro-cutover` tag.

---

## v0.10.0 — 2026-05-15

### Public-facing accessibility audit report

A live audit report is now published at `/documentation/accessibility/`
(modeled on `dvfr.illinois.gov/docs/accessibility/`) showing the latest
axe-core sweep across desktop / tablet / mobile viewports for every URL
in the sitemap. Current snapshot: 25 pages × 3 viewports = 75 scans,
**0 violations**, 1770 axe-rule passes, skip-link coverage 75/75.

- New script: `astro/scripts/generate-a11y-report.mjs` — Playwright +
  axe-core 4.11.4 + `@axe-core/playwright`. Reads `dist/sitemap-0.xml`,
  audits each URL × 3 viewports against `http://localhost:4321/`
  (configurable via `A11Y_BASE_URL`), and emits the styled HTML report.
- Report page: `src/pages/documentation/accessibility/index.astro`
  (initially shipped as a static `public/` file, then refactored to a
  routed Astro page so both `/documentation/accessibility/` and
  `/documentation/accessibility/index.html` resolve in dev and prod —
  Astro dev's static-file handler doesn't directory-index `public/`).
- Cloud `ultrareview` across the full `migration/astro-full → main` diff
  returned zero findings.

---

## v0.9.0 — 2026-05-15

### Phase 9 — Exhaustive accessibility audit + parity polish

**Comprehensive 4-tool a11y sweep across all 25 sitemap pages.** The site
is verified 100% WCAG 2.1 AA via four independent tools — axe-core (via
both `axecap` and the existing Playwright e2e sweep), Lighthouse `lightcap`
(desktop + mobile), and `contrastcap` pixel-sampling for text-over-image
regions. Results: 0 violations, 100/100 every route, lowest pixel-sampled
contrast ratio 6.11:1. README accessibility section refreshed with the
new four-tool table.

**`HomePhotoBoxes` description text contrast (WCAG 1.4.3 AA).**
`contrastcap` pixel-sampling against the actual photos flagged the FAQs
and Collaboratives photo-box description text as failing — white over
~#8a8c8d (3.38:1) and ~#858786 (3.62:1) respectively, where 4.5:1 is
required. axe-core cannot sample pixels over images and only marks these
as "needs review," which is why the failure had been latent. Strengthened
the `.photo-box__overlay` gradient endpoint from `rgba(0,0,0,0.1)` to
`rgba(0,0,0,0.5)`, keeping the gradient character but raising all
over-image text to ≥6.11:1 worst case (re-measured: FAQs description
6.11, Collaboratives 6.24, Eligibility 11.47, Resources 9.80).

**`/eligibility/` ArcGIS embed full-bleed.** The live r3.illinois.gov
`/eligibility/` renders its catch-all body inside a `<v-container fluid>`,
so the ArcGIS StoryMap embed (and the body text) stretch the full viewport
width with a 16px inset — not capped at 1080px like the other catch-all
pages on the original. The Astro version had been capped. Added an
`isFluid` flag in `[...slug].astro` (`data.slug === 'eligibility'`) that
drops the `max-width` on the page layout; the existing `1rem` (16px) side
padding already matched the original's container inset. Verified at 1440px
viewport the iframe now renders at **1393px @ left:16**, byte-for-byte
the same width/position as the live site.

**`trailingSlash: 'ignore'`.** Astro's `'always'` mode 404s the no-slash
form of every route during `astro dev` — a "Did you mean…?" hint that's
helpful for one wrong click but confusing when typing URLs by hand.
Switched to `'ignore'`: dev now serves both `/eligibility` and
`/eligibility/` with 200. Production behavior is unchanged — Netlify
Pretty URLs still 301s non-slash → slash for SEO (verified on the branch
deploy: `GET /eligibility` → 200, final URL `/eligibility/`); the sitemap
integration now uses a `serialize` hook to pin every `<loc>` to
`/`-suffixed canonical form; the BaseLayout `<link rel="canonical">`
continues to use `data.path` from `content.config.ts`
(`ensureTrailingSlash`-normalized); and `trailing-slash.spec.ts` continues
to enforce slash-suffixed internal links independent of this config.

**Netlify branch deploy.** Bundled the three fixes above into one
`netlify deploy --alias=migration-astro-full` ship. Live at
<https://migration-astro-full--illinois-r3.netlify.app>.

---

## v0.8.0 — 2026-05-14

### Phase 8 — CI gate + "invisible migration" parity pass + Astro-only branch

**CI gate**

- `astro/scripts/check-all.sh` — single-command pre-push verification
  (astro check → vitest → build → Playwright e2e).

**Invisible-migration parity pass.** The Phase 4 page ports were rebuilt to
match the live r3.illinois.gov site exactly:

- **Top nav** rebuilt from the live `app.config.js` navMenu: a 4-item bar
  (`Home` / `About ▾` / `Eligibility` / `Contact`) + Search icon, with a
  real "About" dropdown (sections, divider, external StoryMap link) and a
  left-sliding mobile drawer. Replaces the migration's flattened 10-item bar.
- **Footer** brought to exact parity — `#11568e` upper band / `#0e4474`
  legal bar, Governor URL corrected, underlined links.
- **`/funding/`** is now a meta-refresh redirect to `/` (the live site has
  no funding content page); dropped from the nav and the sitemap; `/apply`
  repointed to `/`.
- **`/contact/`** ported as a real custom page — the "Have R3 questions"
  card + a working contact form (`ContactForm.vue` island, posts to the
  same two endpoints as live). It was previously a bare Strapi-body stub
  served by the catch-all.
- **Breadcrumb bar removed** site-wide — the live app keeps
  `TheBreadcrumbBar` commented out.
- **`/resources/`** + **`/research/`** rebuilt as image-card grids
  (cover/splash thumbnails, "Find out more »" / "Read Article (Web) »").
  `resources` collection now queries Strapi `cover` + `ranking`.
- **`/news/`** list restyled as `#fafafa` cards with "Read more »";
  heading "News and Updates".
- **Catch-all pages** gained the "Navigation" TOC sidebar when
  `showTableOfContents` is set, plus the `/board/` "last updated" line.
- **`/eligibility/`** — removed the duplicate injected `MapEmbed`; the
  ArcGIS map renders from the Strapi body markdown at the correct position,
  as on live.
- **`/404/`** enriched with the "Oops" headline + quick-link button row.
- **`/translate/`** buttons stack in a single centred column.
- **`a11y-sweep.spec.ts`** is now sitemap-driven — it audits every URL in
  the built `sitemap.xml` (+ `/404/`): 26 routes × 3 viewports = 78
  axe-core scans, **0 WCAG 2.1 A/AA violations**. Results recorded in the
  root `README.md`.
- `astro check` now excludes `playwright-report/` / `test-results/` /
  `coverage/` (test artifacts were tripping 200+ spurious hints).
- Internal links now honor `trailingSlash: 'always'` — `HomePhotoBoxes`
  hrefs fixed and `markdown.ts` normalizes Strapi-body content links (a
  non-slash internal link 404s on `astro dev` and forces a 301 hop in
  production). Guarded by `tests/e2e/trailing-slash.spec.ts`.

**Astro-only branch**

- The Nuxt 4 + Vuetify source (app.vue, pages/, components/, creators/,
  nuxt.config.js, root package.json, etc. — 230+ files) was deleted from
  `migration/astro-full`; it remains recoverable in git history and on
  `main`. Root `README.md` rewritten for the Astro era.

Full Playwright e2e suite green against a production build: 195 tests.

---

## v0.7.0 — 2026-05-14

### Phase 7 — Performance polish

- Mobile Lighthouse baseline (lightcap MCP, Lighthouse v13) found every
  route already ≥ 95 except the homepage, which was unstable at 93–96
  with LCP climbing 2.8s → 3.2s — raw `<img>` tags re-fetching full-size
  Strapi JPEGs cross-origin on every load.
- `HomeSplashCard` + `HomePhotoBoxes` converted from raw `<img>` to Astro
  `<Image>` (`inferSize` + responsive `widths`/`sizes`); `r3.icjia-api.cloud`
  authorized in `astro.config.ts` `image.domains`. Homepage images are now
  build-time responsive webp served from `/_astro/` — the LCP image went
  100 kB JPEG → 21 kB webp (400w mobile variant). Homepage `/` perf
  93–96 → stable **97–98**, LCP → 2.3–2.5s.
- The stale `preloadImages` prop (pointed at the now-unused Strapi URL)
  was dropped; `<Image loading="eager" fetchpriority="high">` carries LCP
  priority. `home.spec.ts`'s preload assertion rewritten to test intent —
  eager, high-priority, locally-optimized.
- **Final: mobile Perf ≥ 95 on every route, average ≈ 99.2** (Nuxt P0
  average ≈ 79). A11y = 100 and SEO = 100 every route; BP = 100 every
  route except `/eligibility/` = 96 — the pre-existing ArcGIS storymap
  iframe Issues-panel warning, carried over verbatim from the Nuxt
  baseline.
- Known headroom (render-blocking `BaseLayout` CSS; director-photo
  image-delivery) documented in `MIGRATION.md` — not blocking; Phase 7
  exit criteria met.

---

## v0.6.0 — 2026-05-14

### Phase 6 — Accessibility polish

- `tests/e2e/a11y-sweep.spec.ts` — site-wide axe-core AA sweep
  (`wcag2a` / `wcag2aa` / `wcag21a` / `wcag21aa`) across 18 routes ×
  3 viewports = 54 scans. **0 violations.**
- Lighthouse a11y = 100 on every route (lightcap MCP, mobile preset).
  The first-pass run surfaced two issues axe's tag filter doesn't cover:
  - `label-content-name-mismatch` (WCAG 2.5.3, Level A) on `/` —
    `HomeSplashCard` carried an `aria-label` that omitted the visible date
    text. Dropped it; the link's visible text (title + tagline + date) is
    now its accessible name.
  - `heading-order` on `/news/` — `NewsCard` gained a `headingLevel` prop
    (default `h3`, correct on the homepage under the `h2` "News & Updates"
    section). `/news/` index passes `h2` so card titles follow its `h1`
    without skipping a level.
- Keyboard focus-order verification (static source inspection + live
  Tab-key walk via Chrome DevTools) uncovered and fixed a **serious
  site-wide regression**: `Dialog.vue`'s `<Teleport to="body">`
  mishydrated under Astro's `client:idle` island boundary and destroyed
  the skip-links `<nav>` on every page (WCAG 2.4.1 Bypass Blocks, Level
  A). axe-core and Lighthouse missed it because they run before
  `client:idle` fires. Removed the Teleport — a native `<dialog>` opened
  with `showModal()` is top-layer-promoted and never needed it; modal
  display, `::backdrop`, and the native focus trap all still verified.
- `tests/e2e/skip-links.spec.ts` — regression guard that explicitly waits
  past `client:idle` hydration before asserting both skip links survive
  and stay `<body>`'s first child.
- Full Playwright e2e suite green throughout — 162 tests
  (was 147 before the skip-links guard).

---

## v0.5.0 — 2026-05-14

### Phase 5 — Sitemap + JSON-LD + AI readiness + Plausible guard

- `src/lib/schemas.ts` centralizes WebSite, WebPage, NewsArticle,
  BreadcrumbList JSON-LD builders; BaseLayout + `/news/[slug]` now source
  their JSON-LD from it (Task 5.1, committed 2026-05-08)
- `astro/public/robots.txt`, `astro/public/llms.txt` ported (Task 5.2,
  committed 2026-05-08)
- All static assets ported from `public/` to `astro/public/` — favicon,
  og-image, hero photos, `downloads/`, `hub-images/`, table JSON (Task 5.3,
  committed 2026-05-08)
- `@astrojs/sitemap` integration verified against e2e
  (`tests/e2e/sitemap.spec.ts`): index resolves, every URL is
  trailing-slash canonical, `/sandbox/` `/preview/` `/translate/` `/404/`
  stay excluded
- Plausible regression e2e (`tests/e2e/plausible.spec.ts`) confirms the
  `<script>` tag fires on every sample route — preconnect + script tag +
  network hit — guarding against the silent-analytics bug i2i currently has
- `astro check` cleared to 0 errors / 0 warnings / 0 hints: explicit
  `is:inline` directive added to the two JSON-LD `<script>` tags

---

## v0.4.0 — 2026-05-08

### Phase 4 — Page ports (all 25 routes)

- `[...slug].astro` catch-all serving 8 single Strapi page rows: /contact/,
  /privacy/, /board/, /collaboratives/, /funding/, /meetings/, /eligibility/,
  /faqs/. Conditional MapEmbed on /eligibility/ (lazy-loaded ArcGIS storymap
  with skip-link).
- `/news/` list (sorted postDate desc) + 8 `/news/<slug>/` detail pages with
  NewsArticle JSON-LD.
- `/resources/` list (sorted alpha) + 4 `/resources/<slug>/` detail + 1
  `/resources/single-page/` (all-on-one printable view, noIndex).
- `/research/` Hub article feed (12 articles, external links to icjia.illinois.gov/researchhub).
- `/search/` Vue 3 island (Search.vue) consuming /searchIndex.json (33 rows
  across 5 collections); filter chips by content type. `/searchIndex.json`
  emitted at build time from all collections via Astro endpoint.
- `/translate/` Google Translate language buttons (5 languages: Spanish,
  Polish, Chinese, Tagalog, Arabic — external links matching legacy site).
- `/` real homepage — splash row (HomeSplashCard ×2 with per-card color
  wash), Director Adams letter section, "Applicant Tools" photo grid
  (HomePhotoBoxes ×4: Eligibility / FAQs / Collaboratives / Resources),
  latest 2 news cards, news-archive link. LCP preload on first splash.
- `/404.astro` — minimal 404 with home link, noIndex.
- `astro/public/_redirects` — `/downloads/** → /`, `/apply → /funding/`,
  FAQ alias preserved.

### Phase 4 reframings (justified deviations from the plan)

- **Funding.astro removed** — the plan called for tables driven by R3_site_table_*.json,
  but those JSON files are census tract eligibility data, not grant
  recipient tables. The legacy `Funding.vue` actually shows a NOFO hero;
  the catch-all already serves the Strapi `funding` body. Tables would be
  wrong content. JSON files retained in `astro/public/` for future use.
- **FaqAccordion + /faqs/<slug>/ removed** — Phase 2 found the
  `weeklyFaqs` collection has 0 published rows, and the legacy /faqs/ uses
  the Strapi `pages.faqs` body (single page) for FAQ Q&A. The catch-all
  already serves /faqs/ correctly; no individual FAQ slugs to route.
- **Translate page** — actual Nuxt `pages/translate.vue` uses 5 external
  Google Translate links (not the embedded widget the plan template
  assumed). Faithfully ported the link-based approach.
- **Hub article URLs** — actual Hub URL pattern is
  `https://icjia.illinois.gov/researchhub/articles/<slug>` (not
  `researchhub.illinois.gov`); verified against legacy `pages/research/index.vue`.

### Test coverage

- Vitest unit: 114 tests across 10 files
- Playwright e2e: 23 routes covered with 70+ test runs across mobile/tablet/desktop
- Type-check: 0 errors / 0 warnings / 2 pre-existing hints (BaseLayout
  inline LD+JSON, news slug — non-blocking)

---

## v0.3.0 — 2026-05-08

### Phase 3 — Layout shell + global components

- `src/styles/global.css` — Tailwind 4 + brand `@theme` (8 colors, 3 font
  tokens), `.markdown-body` h1-h6 + ul/ol/p/a/table restorations, `.sr-only`
  utility, prefers-reduced-motion default, html/body baseline. Lato uses
  static-weight imports (no variable-axis published on npm).
- `SkipLinks.astro` — direct port of app.vue lines 152-216 (focus-visible
  clip-path reveal pattern, AAA contrast)
- `SiteNav.astro` + `navConfig.ts` — fixed 90px white app-bar, mobile
  hamburger via native `<details>` (zero JS), 44px tap targets, NAV_ITEMS
  ported from app.config.js navMenu (10 items: Funding/Eligibility/News/
  Meetings/Resources/FAQs/Research/Collaboratives/Board/Contact). The Nuxt
  "About" dropdown header was correctly NOT promoted to a link (no /about/
  page exists).
- `SiteFooter.astro` — two-band layout matching the actual Nuxt
  TheContextFooter + TheFooter (uppercase Raleway nav strip + State of
  Illinois legal bar). AAA-contrast white-on-slate, 44px tap targets.
- `Breadcrumb.astro` — URL-derived trail, hidden on `/`, `/sandbox/`,
  `/faqs/` (matches app.vue HIDE_ON logic), schema.org-ready
- `Dialog.vue` — Vue 3 SFC island via native `<dialog>` + showModal();
  hydrates `client:idle`. Custom-event API (`r3-dialog:open`) for
  Astro→Vue island communication.
- `Attachments.astro` — markdown-body helper for download lists (reusable;
  R3's Strapi types don't currently expose attachments but the helper is
  ready for any future row shape that does)
- `BaseLayout.astro` — composes all 5 components + Plausible <script>
  in head (full script tag, NOT just preconnect — guards against the i2i
  silent-analytics regression), JSON-LD WebSite schema, scroll-to-top
  vanilla button, external-link interceptor (whitelists icjia.illinois.gov
  / illinois.gov / arcgis.com)
- Phase 3 smoke (live `mcp lightcap run_a11y --preset mobile`):
  **Lighthouse Accessibility = 100/100** on `/smoke/` exercising every
  component + dialog interception
- Cross-collection note: NAV_ITEMS includes /research/ even though the
  research page lands in Phase 4e (Hub article feed); link 404s until
  Phase 4e ships, which is expected for a forward-looking entry.

### Vitest infrastructure addition

- `astro/src/__mocks__/astro-content.ts` shim from Task 2.6 enables
  vitest unit testing of `astro:content` schema validation (Astro's
  virtual module isn't accessible from vitest's module resolution).

### Notable plan deviations (all justified, all documented in MIGRATION.md)

- App's "About" dropdown header was treated as non-routable (correct per
  app.config.js `navMenu` — it has children but no `link:` field)
- SiteFooter has no mailing address (the spec template's "300 W. Adams"
  was i2i-era; R3's actual footer doesn't carry address copy)
- Smoke page can't use `__smoke__.astro` filename (Astro 6's router skips
  files starting with `_`); used `smoke.astro` instead

---

## v0.2.0 — 2026-05-08

### Phase 2 — Content collections

- Live-introspected R3 Strapi (v4) and Research Hub (Strapi v3) GraphQL
  schemas; documented in `MIGRATION.md` "Strapi schema discovery"
- `src/lib/strapi.ts` (TDD, 22 tests) — `strapiQuery` (v4 shape),
  `hubQuery` (v3 shape), `absoluteMediaURL`, `rawText`, with 30s
  AbortController timeout to prevent build hangs
- `src/lib/markdown.ts` (TDD, 16 tests) — markdown-it + DOMPurify with
  ArcGIS-only iframe whitelist preserving the March 2026 audit posture
- `src/lib/dateFormat.ts`, `src/lib/slug.ts` (TDD, 26 tests) — UTC
  date formatting + path normalization helpers
- `src/lib/manualPages.ts` (port of `app.config.js` splash array, 2 entries)
- `src/lib/tags.ts` (port of `src/tags.json`, 3 hub tags)
- `src/content.config.ts` — 5 content collections defined live:
  - `pages` (Strapi `pages`, v4) — 11 tests
  - `news` (Strapi `posts`, v4 — discovered alias) — 12 tests, with
    `dateOverride` schema-level rejection of unparseable strings and
    `dateOverride → publishedAt → createdAt → 'MISSING_DATE'` fallback
  - `faqs` (Strapi `weeklyFaqs`, v4 — discovered alias) — 8 tests
  - `resources` (Strapi `resources`, v4) — 7 tests
  - `hubArticles` (Hub `articles`, **v3**) — 11 tests, separate
    `hubLoader` factory for v3 response shape (flat array, `_id`,
    `where:` filter, `limit:` pagination, JSON-scalar `authors`)
- Vitest infrastructure: `astro:content` shim mock for unit-test access
  to schema validation (Task 2.6)
- `astro/scripts/smoke-collections.ts` — live build-time verifier; prints
  row counts per collection. Smoke run at v0.2.0 close: pages=9,
  news=8, faqs=0 (expected empty per discovery), resources=4,
  hubArticles=12
- Removed `astro/scripts/strapi-introspect.sh` (no longer needed; smoke
  is the regression path going forward)

### Cross-collection live-API findings (corrects plan template assumptions)

- R3 Strapi `Page` type: no `mediaTitle`, no `media` (relational fields
  the plan listed don't exist on this type)
- R3 Strapi `Post` type: scalar-only — no `media`, no `splash`, no
  `attachments`. Has `section` ENUM (newly discovered)
- R3 Strapi `WeeklyFaq` type: no `category`/`question`/`answer` (the
  schema-suggesting names from i2i don't exist on R3); has `week` ENUM,
  `attachmentHeading`, `dateOverride`
- R3 Strapi `Resource` type: standard scalars + `searchMeta` +
  `hideFromSearch` (intentionally omitted: `ranking` Int — Phase 4b
  sorts by title; can re-add if Strapi-driven order is needed)
- Hub `Article` type (v3): no `publishedAt`; `splash`/`thumbnail` are
  String scalars (not relational); `authors` is JSON scalar

---

## v0.1.0 — 2026-05-08

### Phase 0 — Baseline capture

- Captured P0 mobile Lighthouse scores for all 25 routes of the current
  Nuxt prod build (see `MIGRATION.md` for the table). Mobile Perf range
  52–93, average ~79. A11y/SEO = 100 across all routes; BP = 100 on
  24/25 routes (96 on `/eligibility/` due to the ArcGIS storymap iframe).
- Captured P0 axe-core baseline: 84 test runs (28 pages × 3 viewports),
  7,588 individual checks, **3 violations** (all `page-has-heading-one`
  on `/404`, best-practice tag — NOT WCAG AA). 27/28 pages pass with
  0 AA violations. The /404 finding is auto-fixed by Phase 4h.1.

### Phase 1 — Foundation

- Scaffolded Astro 6.3.1 project under `astro/` subfolder; pinned
  Node 22.22.2 LTS via `.nvmrc`; named the package `icjia-r3-astro`;
  switched scaffold's npm output to yarn with regenerated `yarn.lock`
- Installed core deps: Astro integrations (`@astrojs/sitemap`,
  `@astrojs/vue`), Tailwind 4 via `@tailwindcss/vite` (NOT the legacy
  `@astrojs/tailwind`), Vue 3, markdown stack (`markdown-it` + plugins,
  `dompurify`, `slugify`, `fuse.js`), self-hosted variable fonts
  (`@fontsource-variable/roboto` + `raleway`; `@fontsource/lato` —
  Lato is not published as variable-axis on npm), and test stack
  (vitest 4, Playwright, `@axe-core/playwright`, happy-dom)
- Moved `@astrojs/check` to `devDependencies` (it's a CLI type-checker,
  not a runtime dep)
- Added `packageManager: "yarn@1.22.22"` field for corepack enforcement
- Configured `astro.config.ts` with: `site` URL, `output: 'static'`,
  `trailingSlash: 'always'`, `inlineStylesheets: 'auto'`, Tailwind 4
  Vite plugin, Vue + sitemap integrations, sitemap filter excluding
  `/sandbox/` `/preview/` `/translate/` `/404/`, and a 5-entry env
  schema for Strapi/Hub/site/Plausible URLs (4 with `url: true`
  validation; PUBLIC_PLAUSIBLE_DOMAIN intentionally bare hostname)
- Created `astro/.env.sample` documenting the env vars and the
  staging-deploy override gotcha for `PUBLIC_PLAUSIBLE_DOMAIN`
- Configured `tsconfig.json` with strict + `~/*` path alias mapping
  to `src/*` and explicit `tests/**/*` include
- `.gitignore` covers `dist/`, `.astro/`, `node_modules/`, env (`.env`,
  `.env.production`, `.env.local`, `.env.*.local`), test artifacts
  (`test-results/`, `playwright-report/`, `playwright/.cache/`,
  `coverage/`), and OS/editor patterns
- Documented Strapi (`r3.icjia-api.cloud`) and Research Hub
  (`researchhub.icjia-api.cloud`) endpoints in `astro/.env.sample`
  and `astro/astro.config.ts` env schema
- Vitest configured with `happy-dom` environment; sanity test passes
- Playwright configured with chromium-mobile, chromium-tablet, chromium-desktop
  projects; sanity e2e passes across all three; webServer auto-builds and
  previews via `yarn build && yarn preview --host 127.0.0.1 --port 4321`,
  with all hostnames pinned to `127.0.0.1` to avoid IPv6 `localhost` hangs
- Root `netlify.toml` rewritten to `base = "astro"`; Content-Security-Policy
  and 4 other security headers (X-Frame-Options, X-XSS-Protection,
  Referrer-Policy, X-Content-Type-Options) preserved verbatim from the
  Nuxt-era; new `/_astro/*` immutable
  cache and `/searchIndex.json` revalidate-on-each-request rules added
- Phase 1 close verification: `yarn run check`, `yarn test`, `yarn build`,
  `yarn test:e2e` all green at Phase 1 close

### Cross-site policy notes

- **Trailing slash uniform:** all internal links and emitted URLs end
  with `/`. Netlify Pretty URLs handles 301 redirect from non-slash
  variants at the CDN edge.
- **Plausible regression guard:** Phase 5 e2e test will assert the
  `<script>` tag fires on every route — this is the regression test
  against the same bug currently affecting i2i's deployed Astro build.
