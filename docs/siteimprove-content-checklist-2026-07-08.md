# SiteImprove content-author checklist — R3 (2026-07-08)

For whoever manages content in **Strapi** (`r3.icjia-api.cloud`). These are the
SiteImprove SEO/QA findings that **can't be fixed in code** — they live in the
content itself. The code-fixable items (title lengths, the search description,
and the oversized resource-cover images) were handled in **v1.0.11** and are
already done.

Context worth keeping in mind: the live site already scores **Lighthouse
SEO 100 / Accessibility 100 / Performance 96**, and **axe-core reports 0
violations**. SiteImprove's sub-100 score is its own *editorial* rollup (it
grades things like reading level and word count that aren't WCAG or Lighthouse
requirements). So treat this as polish, not defect-fixing — and don't let it
push you into changes that hurt the accessibility work already in place (see
"Do NOT change" at the bottom).

Strapi field → what SiteImprove sees:
- **`title`** → the page `<title>` and `og:title`
- **`summary`** → the meta description
- **`body`** (markdown) → the page content (word count, readability, images)

---

## 1. Meta descriptions too short — highest-value content fix

SiteImprove wants a meta description of roughly **70–160 characters**. These
pages have a `summary` that's too short (or empty, so the site falls back to a
generic default). Write a one- to two-sentence `summary` in Strapi for each:

| Page | Strapi type | Current length | Target |
|---|---|---|---|
| `/meetings/` | pages | 11 | 70–160 |
| `/resources/video-resources/` | resources | 18 | 70–160 |
| `/resources/prequalification-steps/` | resources | 25 | 70–160 |
| `/resources/spanish-language-materials/` | resources | 26 | 70–160 |
| `/resources/ampli-fund-portal-guide-and-tip-sheet/` | resources | 35 | 70–160 |
| `/faqs/` | pages | 36 | 70–160 |
| `/news/lend-us-your-expertise-become-a-grant-application-reviewer/` | posts | 42 | 70–160 |
| `/board/` | pages | 44 | 70–160 |

Write for a human searcher: say what the page is and why they'd click. Include
"R3" and a keyword or two naturally. Skip `/resources/single-page/` — it's a
deliberately `noindex` printable view, so its description doesn't matter.

## 2. Page titles too long — trim the worst news headlines

With v1.0.11 every title now clears the 30-char minimum, and titles that would
run long automatically use a short ` | R3` suffix. What's left is a handful of
**news `title` fields that are long sentences on their own**:

| Page | Approx. title length | Note |
|---|---|---|
| `/news/2021-01-21-release/` | ~167 chars | **Shorten this one.** It's a full paragraph as a title. |
| `/news/2022-06-23-r3-grants-list/` | ~76 chars | Trim if convenient |
| `/news/icjia-awards-35-million-in-restore-reinvest-and-renew-r3-program-grants/` | ~76 chars | Trim if convenient |

Aim for **under ~60 characters** in the Strapi `title`. Long news headlines are
common and not a real problem for readers — only the 167-char one is worth
fixing for certain. (Google truncates the display around 60 chars but still
reads the whole thing for ranking.)

## 3. Low word count / "thin" pages

SiteImprove flags pages with little text (this also drives the "low
text-to-code ratio" finding — more real content fixes both at once). Main-content
word counts from the current build:

**Worth expanding (real content pages):**
- `/meetings/` — 20 words
- `/faqs/` — 28 words *(is the FAQ content actually in the body? 28 words is
  surprisingly low for an FAQ page — check that the questions/answers live in
  the Strapi `body` and aren't getting dropped)*
- `/resources/spanish-language-materials/` — 16 words
- `/resources/ampli-fund-portal-guide-and-tip-sheet/` — 45 words
- `/resources/prequalification-steps/` — 76 words
- `/collaboratives/` — 281 words (add a bit more context if natural)

**Leave thin — padding these would hurt, not help:**
- `/search/`, `/resources/`, `/news/` — these are search/index pages; they're
  *supposed* to be mostly links and cards, not prose. Ignore the flag.

Add genuinely useful content (what the resource is, who it's for, how to use
it). Don't pad with filler — SiteImprove's readability check (below) will
penalize that.

## 4. Readability (Flesch-Kincaid) & long sentences

SiteImprove flags pages that read at a high grade level or have long sentences.
The text-heavy pages are the candidates:
- `/privacy/` (1256 words), `/board/` (886), `/eligibility/`, `/research/`

How to improve the score without dumbing content down:
- Break long sentences into two. Aim for **under ~20 words** per sentence.
- Prefer plain words over jargon where the meaning survives.
- Use short paragraphs, bullet lists, and subheadings to break up walls of text.
- Paste a page's text into a free readability checker (e.g. Hemingway Editor) to
  see which sentences it flags, then split those.

Note: legal/policy text (`/privacy/`) is inherently formal — a lower reading
score there is expected and fine. Focus readability effort on the pages meant
for the general public (program info, resources, FAQs).

## 5. Future image uploads (> 1 MB)

The code side is fixed (resource covers no longer ship a full-res fallback).
Going forward, when you upload an image to Strapi:
- **Resize before uploading** — ~1600px on the long edge is plenty for the web.
  A 7000px, 6 MB camera/stock original is far larger than any spot on the site
  displays.
- The build auto-generates optimized WebP variants, so you don't need to convert
  formats — just don't upload giant originals, since the raw file still sits on
  the CDN and SiteImprove will flag it.
- Body images embedded in markdown: **always include alt text** —
  `![a short description of the image](url)`, not `![](url)`.

---

## Do NOT change (these are correct, and "fixing" them makes the site worse)

- **The empty `alt=""` on the home splash cards, photo boxes, and resource/
  research card thumbnails.** These are *intentionally* decorative — the link's
  visible title is the accessible name, and the empty alt tells screen readers
  to skip the redundant image. SiteImprove's SEO module flags them, but adding
  alt text there would create double announcements for screen-reader users and
  regress the WCAG work. A full build scan confirmed **every** content image
  already has proper alt text; the only empty ones are these decorative cards.
- **`/resources/single-page/` being `noindex`.** It's a printable convenience
  view; keeping it out of search results is deliberate.

## When someone asks "why isn't SiteImprove 100?"

Point them at the accessibility portal FAQ: *"Why does SiteImprove (or another
scanner) show 98% when axe-core shows 100%?"* on accessibility.icjia.app. Short
version: SiteImprove blends WCAG A/AA/AAA **plus** its own editorial heuristics
(reading level, word count, title length) into one number. ADA Title II and
IITAA 2.1 require **WCAG 2.1 AA**, and on that measure the site is at 100.
