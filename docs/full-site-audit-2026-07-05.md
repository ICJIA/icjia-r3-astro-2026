# R3 Full Site Audit — r3.illinois.gov

**Date:** 2026-07-05 · **Target:** production (`https://r3.illinois.gov`)
**Scope:** all 26 pages in `sitemap.xml`, mobile + desktop
**Tools:** lightcap 0.1.7 (Lighthouse 13.4.0) · axecap 0.1.2 (axe-core 4.12.1, WCAG A+AA) · contrastcap 0.1.5 (WCAG AA)

---

## Executive summary

| Suite | Runs | Result |
|---|---|---|
| **axecap** (WCAG 2 A+AA) | 52 (26 pages × 2 viewports) | **0 violations — fully clean** |
| **contrastcap** (WCAG AA) | 26 pages, 1,770 elements | **0 failures** · 12 advisory warnings (home page, all passing ratios) |
| **lightcap** (Lighthouse ×4 categories) | 52 (26 pages × 2 viewports) | **A11y 100 and SEO 100 everywhere*** · Perf/BP 100 except 3 pages below |

\* except `/resources/single-page/` SEO 66, which is a deliberately `noindex`'d printable view — see Finding 2.

**Only 3 pages have any non-100 Lighthouse score.** Everything else is 100/100/100/100 on both viewports.

> **Update (same day):** Findings 1 and 2 were fixed in v1.0.10 (commit
> `c54be95`) and re-verified on production — see
> [Remediation & re-audit](#remediation--re-audit-v1010-same-day) below.

| Page | Viewport | Perf | A11y | BP | SEO |
|---|---|---|---|---|---|
| `/research/` | mobile | **87** | 100 | 100 | 100 |
| `/eligibility/` | both | **98** | 100 | **96** | 100 |
| `/news/icjia-awards-35-million…/` | mobile | **99** | 100 | 100 | 100 |
| `/resources/single-page/` | both | 100 | 100 | 100 | **66** |

---

## Findings & recommendations (priority order)

### 1. `/research/` — mobile Perf 87, LCP 4.1 s (first-party, actionable)

The research-card grid serves full-resolution `*-splash.jpeg` files from `astro/public/hub-images/` as small card thumbnails. Worst case: `69bc57d4035ff60e84b7d86a-splash.jpeg` is **5743×3828 px / 443 KiB** rendered as a card image. Lighthouse estimates **~2.2 MB** wasted on desktop and **~819 KiB** on mobile; mobile LCP lands at 4.1 s (target ≤ 2.5 s).

Notably, **`-thumbnail.jpeg` variants (500×500, ~4 KiB) already exist alongside every splash image** in `public/hub-images/`, but `src/pages/research/index.astro:44-45` selects the `-splash.jpeg`. Recommend serving a card-sized image (the existing thumbnails, or regenerate at the card's actual aspect ratio), ideally in WebP/AVIF. This is the single highest-impact fix on the site.

### 2. `/resources/single-page/` — SEO 66: noindex page listed in sitemap

The page is intentionally `noindex` (per the comment in `src/pages/resources/single-page.astro:6` — "a printable convenience view"), so SEO 66 itself is by design. However the sitemap filter in `astro/astro.config.ts:52-55` only excludes `/sandbox/`, `/preview/`, `/404/` — so this noindex URL ships in `sitemap.xml`. Search Console treats "sitemap contains noindex URL" as a soft error. Recommend adding `!page.includes('/resources/single-page/')` to the filter (keep the noindex).

### 3. `/eligibility/` — Perf 98 / BP 96 (third-party embed; largely not actionable)

All issues trace to the embedded **ArcGIS StoryMap iframe** (`storymaps.arcgis.com/stories/954c5f9b…`) and the YouTube embed inside it:

- BP 96: third-party **cookie issue** logged by Chrome DevTools (storymaps.arcgis.com)
- bf-cache failures: ArcGIS SharedWorker + YouTube iframe (Lighthouse marks both "Not actionable")
- ~735 KiB short-TTL caching + ~679 KiB oversized images, all on `cdn.arcgis.com` (5-min TTL is Esri's choice)

Nothing in-repo to fix short of lazy-loading the iframe behind a click-to-load facade. Scores of 98/96 are reasonable to accept as the cost of the embed.

### 4. `/news/icjia-awards-35-million…/` — mobile Perf 99 (trivial)

One in-article image (`article.news-detail .markdown-body img`) could save ~20–33 KiB; mobile LCP 2.0 s. Optimize opportunistically or ignore.

### 5. Home page — 12 contrast *warnings*, zero failures (no action needed)

All 12 are text-over-image cases (splash cards + photo boxes) where contrastcap pixel-sampled the actual background. **Every measured ratio passes AA with headroom**: range 6.11–11.73:1 vs required 3:1 (large text) / 4.5:1 (normal text). Worst case is the FAQs photo-box description at 6.11:1 — 36% above threshold. Flagged only because image backgrounds can vary by position. The existing scrim/overlay treatment is doing its job.

---

## Full Lighthouse matrix (Perf / A11y / BP / SEO)

| Page | Desktop | Mobile |
|---|---|---|
| `/` | 100/100/100/100 | 100/100/100/100 |
| `/board/` | 100/100/100/100 | 100/100/100/100 |
| `/collaboratives/` | 100/100/100/100 | 100/100/100/100 |
| `/contact/` | 100/100/100/100 | 100/100/100/100 |
| `/documentation/accessibility/` | 100/100/100/100 | 100/100/100/100 |
| `/eligibility/` | 98/100/96/100 | 98/100/96/100 |
| `/faqs/` | 100/100/100/100 | 100/100/100/100 |
| `/meetings/` | 100/100/100/100 | 100/100/100/100 |
| `/news/` | 100/100/100/100 | 100/100/100/100 |
| `/news/2021-01-21-release/` | 100/100/100/100 | 100/100/100/100 |
| `/news/2022-06-23-r3-grants-list/` | 100/100/100/100 | 100/100/100/100 |
| `/news/2023-04-06-annual-report-2023/` | 100/100/100/100 | 100/100/100/100 |
| `/news/icjia-awards-35-million…/` | 100/100/100/100 | 99/100/100/100 |
| `/news/lend-us-your-expertise…/` | 100/100/100/100 | 100/100/100/100 |
| `/news/r3-2021-annual-report/` | 100/100/100/100 | 100/100/100/100 |
| `/news/r3-2022-annual-report/` | 100/100/100/100 | 100/100/100/100 |
| `/news/restore-reinvest-renew…apply-now/` | 100/100/100/100 | 100/100/100/100 |
| `/privacy/` | 100/100/100/100 | 100/100/100/100 |
| `/research/` | 100/100/100/100 | 87/100/100/100 |
| `/resources/` | 100/100/100/100 | 100/100/100/100 |
| `/resources/ampli-fund-portal-guide…/` | 100/100/100/100 | 100/100/100/100 |
| `/resources/prequalification-steps/` | 100/100/100/100 | 100/100/100/100 |
| `/resources/single-page/` | 100/100/100/66 | 100/100/100/66 |
| `/resources/spanish-language-materials/` | 100/100/100/100 | 100/100/100/100 |
| `/resources/video-resources/` | 100/100/100/100 | 100/100/100/100 |
| `/search/` | 100/100/100/100 | 100/100/100/100 |

## axecap detail

26 pages × desktop + mobile = 52 audits at WCAG level AA (A + AA cumulative rules), axe-core 4.12.1. **Zero violations in every run.** Full JSON for each run saved (see Evidence).

## contrastcap detail

26 pages, WCAG AA, 1,770 elements checked: **1,758 pass · 0 fail · 12 warnings** (all on `/`, itemized in Finding 5). Note: contrastcap audits at its default (desktop) viewport only — the tool has no viewport parameter. Given axe-core's color-contrast rules also passed on mobile in all 26 axecap mobile runs, mobile contrast is covered by proxy.

## Remediation & re-audit (v1.0.10, same day)

Findings 1 and 2 were fixed in commit `c54be95` (v1.0.10, 2026-07-05) and
re-verified against production after the Netlify deploy went live:

| Finding | Before | After (production re-audit) |
|---|---|---|
| `/research/` mobile | Perf **87**, LCP 4.1 s | Perf **99**, LCP **1.9 s** |
| `/research/` desktop | Perf 100, ~2.2 MB image waste | Perf 100, 143 KiB residual |
| Sitemap | 26 URLs incl. noindex single-page | **25 URLs**, single-page excluded (page still renders, keeps `noindex`) |
| axecap `/research/` (markup changed) | 0 violations | still 0 violations, both viewports |

What shipped: `scripts/build-hub-card-images.mjs` (prebuild WebP variants
640/960/1280 of the hub splash images → gitignored `public/_hub-card/`,
served by the research cards via `srcset`+`sizes`, worst image 443 KiB →
26.6 KiB), the sitemap filter exclusion + e2e assertion, and a
`playwright.config.ts` `yarn`→`pnpm` webServer fix. Findings 3–5 remain
accepted as documented above (third-party embed / srcset granularity /
passing contrast advisories). Full details in `astro/CHANGELOG.md`
(v1.0.10).

Pre-push verification: `astro check` 0 errors / 0 warnings / 0 hints,
vitest 129/129, playwright sitemap + resources specs 18/18, visual parity
of the research grid confirmed against a local preview build.

## Evidence

Raw per-run artifacts (52 Lighthouse HTML reports, 52 axe-core JSON
results, score CSV, contrast summaries) were produced in the audit
session's temporary scratchpad and are not retained in-repo. The score
matrix above is the complete Lighthouse dataset; re-running any tool
against production reproduces the per-run detail.

Measurement notes: audits ran against live production; Lighthouse runs executed max 2 concurrent (same page's two viewports) on a 10-core machine to avoid CPU contention skewing performance scores; a11y/contrast runs were parallelized freely since they are not timing-sensitive.
