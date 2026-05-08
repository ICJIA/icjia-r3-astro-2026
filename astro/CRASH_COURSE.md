# Astro crash course (for a Vue/Nuxt dev)

A practical introduction to Astro 6.3 for someone who's been building with Vue 3 and Nuxt 4. Targets the i2i project specifically — examples and references match what's actually in this repo.

---

## The mental model in one sentence

**Astro is a Markdown-Generator framework with optional islands.** You write pages in `.astro` files (HTML + a frontmatter block of build-time JS) and Astro renders them to plain HTML at build time. Anything interactive lives in an "island" — a component you opt into with a directive like `client:load` / `client:visible`.

The big shift from Nuxt: **by default, no JavaScript ships to the browser.** Pages are just HTML and CSS. You add JS deliberately, per island, and Astro only loads the runtime for the framework that island actually uses.

---

## File-by-file equivalence with Nuxt

| Nuxt concept | Astro equivalent |
| --- | --- |
| `pages/*.vue` | `src/pages/*.astro` (or `.md`/`.mdx`) — same file-based router |
| `pages/[slug].vue` | `src/pages/[slug].astro` with `getStaticPaths()` returning the slugs |
| `nuxt.config.js` | `astro.config.ts` |
| `app.vue` (root layout) | `src/layouts/BaseLayout.astro` (you compose it explicitly) |
| `useAsyncData()` | top-of-file frontmatter — runs at build time, plain async/await |
| `useFetch()` | plain `fetch()` in frontmatter — Astro doesn't wrap it |
| `definePageMeta` | `Astro.props` + the layout's `<head>` |
| `useSeoMeta` | `<meta>` in the layout's `<head>` |
| `<NuxtLink>` | plain `<a href="...">` — no client router by default |
| `<NuxtPage>` | not needed — file-based routing handles it |
| `useRoute()` | `Astro.url`, `Astro.params` |
| `@nuxt/content` | Content Collections (`src/content.config.ts` + `getCollection()`) |
| `<ClientOnly>` | `<MyComponent client:only="vue" />` |
| `useAppConfig()` | a plain TS module you `import` |
| `useState()` | for static sites, you usually don't need it |

---

## The anatomy of a `.astro` file

```astro
---
// ── 1. FRONTMATTER (server / build-time only) ───
//     Plain JS/TS. Runs once at build time. Can `import`, `await`, do anything Node can.
import BaseLayout from '~/layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

const bios = await getCollection('biographies');     // <-- async at build
const sorted = bios.sort((a, b) => …);
---

<!-- ── 2. TEMPLATE (HTML output) ─── -->
<BaseLayout title="Meet the Team">
  <h1>Meet the Team</h1>
  <ul>
    {sorted.map((b) => (
      <li><a href={`/biographies/${b.data.slug}/`}>{b.data.title}</a></li>
    ))}
  </ul>
</BaseLayout>

<!-- ── 3. SCOPED CSS (optional) ─── -->
<style>
  h1 { font-weight: 900; }
</style>

<!-- ── 4. CLIENT-SIDE JS (optional, only ships if present) ─── -->
<script>
  // This block becomes a real <script type="module"> in the output.
  // No framework runtime — plain TS/JS.
  console.log('hello from the browser');
</script>
```

The frontmatter is exactly like a Nuxt `<script setup>` **except**:

- It runs at **build time on the server**, not in the browser.
- Top-level `await` is fine.
- You can't have reactivity (`ref()`, `reactive()`) — there's no client runtime to react.
- For interactivity, use `<script>` at the bottom (or an island, see below).

---

## Where does the content come from?

In our project, **content is fetched from the Strapi GraphQL API at build time**, not stored on disk.

The single file that does this is `astro/src/content.config.ts`. It defines six collections (biographies, pages, announcements, spotlights, graduations, cohorts), each with:

1. A **loader** — a small async function that calls the GraphQL endpoint and returns rows.
2. A **schema** — a `zod` validator that types the data and computes derived fields like `headshotURL`, `path`, `rawText`.

Pages then call `await getCollection('biographies')` (or whichever) in their frontmatter to get a typed array of entries. Astro caches the result in `.astro/` between builds for speed.

```ts
// In any .astro page:
const bios = await getCollection('biographies');
//      ^? Array<{ id, data: { title, position, headshotURL, ... } }>
```

This replaces the entire `/creators/` Nuxt prebuild pipeline. There are no markdown fixtures on disk anymore — Strapi → GraphQL → memory → HTML output.

**Why this works in Astro but didn't in Nuxt 3 + `@nuxt/content` 2.x:** Nuxt Content 2 reads filesystem markdown — it can't ingest GraphQL directly. `/creators` existed purely as a translation layer (Strapi → markdown files → Nuxt Content store). Astro 6's [content loader API](https://docs.astro.build/en/reference/content-loader-reference/) accepts any source — REST, GraphQL, DB — at build time, so the translation step disappears.

---

## Where is the content stored?

**Nowhere persistent — only in build memory and the resulting HTML.** The flow is:

1. Strapi (`https://i2i.icjia-api.cloud/graphql`) is the source of truth.
2. `astro build` calls each collection's `loader` → gets fresh JSON.
3. Each `.astro` page that uses the collection runs its frontmatter, producing HTML.
4. The HTML files are written to `astro/dist/`.
5. Netlify serves `astro/dist/` as static files.

The Strapi data is "stored" only in `.astro/` (a build-time cache, gitignored) and in the prerendered HTML files in `dist/`. There is no runtime database, no Nuxt Content store, no Strapi calls when a user visits the site.

---

## When are pages built?

Three triggers:

1. **`yarn dev`** — Astro starts a Vite dev server; pages render on every request, hot-reload on file change. (Only the pages you visit get rendered.)
2. **`yarn build`** — Pre-renders every route in one pass to `dist/`. This is what Netlify runs.
3. **`yarn preview`** — Serves the built `dist/` for testing.

For this project:

- `astro build` enumerates routes from `src/pages/*` and from `getStaticPaths()` returns.
- Calls each collection's loader once.
- Renders all 36 pages in ~1.5–3 seconds.
- Writes HTML, CSS, sitemap, search index to `dist/`.

When content changes in Strapi, you re-run `yarn build`. There's no "incremental" rebuild for static output — but the build is so fast it doesn't matter. Netlify rebuilds on every push to `migration/astro-full` and the full deploy completes in ~17 seconds (vs. several minutes for the Nuxt build).

---

## What are islands?

An **island** is a component with interactivity — a piece of the page that needs JS to do something useful. The rest of the page is static HTML.

Astro's pitch: **interactivity is opt-in.** You write the island as a plain Vue/React/Svelte component (or, in our case, an `.astro` component with a `<script>` block) and add a `client:*` directive to tell Astro when to hydrate it.

```astro
---
// Server-rendered, no JS shipped:
import StaticCard from '~/components/StaticCard.astro';

// Becomes an island, JS ships:
import SearchBox from '~/components/SearchBox.vue';
---

<StaticCard title="Hello" />          <!-- HTML only, 0 KB JS -->
<SearchBox client:visible />           <!-- ships Vue runtime + this component when scrolled into view -->
```

The `client:*` directives:

- `client:load` — hydrate as soon as the page loads
- `client:idle` — wait for `requestIdleCallback`
- `client:visible` — wait until the component scrolls into view (often the right call)
- `client:media="(max-width: 768px)"` — only on certain breakpoints
- `client:only="vue"` — render entirely on the client, no server HTML at all

In our project we have only **a few islands**, all written in vanilla TS to keep the JS budget small:

- `/search` — Fuse.js fuzzy search (~26 KB on that one page only)
- `MediaSlider.astro` — the photo gallery (~2 KB inline script, only on detail pages with galleries)
- `TableOfContents.astro` — auto-discovered H2 sidebar (~1 KB inline script, only on pages that opt in)

Every other page ships **zero JS**. That's what gets us 100/100/100/100 Lighthouse on most routes.

---

## How does this apply to "I want to add a Vue/React component"?

Add the integration to `astro.config.ts`:

```ts
import vue from '@astrojs/vue';
export default defineConfig({ integrations: [vue()] });
```

Then drop your `.vue` file under `src/components/` and use it as an island:

```astro
---
import MyVueWidget from '~/components/MyVueWidget.vue';
---
<MyVueWidget client:visible some-prop="hello" />
```

Astro server-renders the Vue component to static HTML (so the page has valid content even before JS loads), then hydrates it client-side based on the `client:*` directive.

The Vue runtime (~70 KB) is shared across all Vue islands on the page — it loads once.

---

## How is this different from Nuxt's "static generation" mode?

Surface similarity is high — `nuxt generate` and `astro build` both write static HTML. The differences:

1. **JS budget by default**

   - Nuxt: ships the Vue runtime + Nuxt runtime + hydration data on every page (118 JS files in our v0.5.x build, ~26 KB CSS bundle on every route).
   - Astro: ships nothing unless you ask for it. CSS is per-page, scoped, deduplicated.

2. **Hydration model**

   - Nuxt: every page is a single Vue app that fully hydrates on load. SSG output is HTML + JS bundle that re-creates the Vue tree.
   - Astro: page is HTML; islands are isolated mini-apps that only hydrate themselves. No top-level "app".

3. **Routing**

   - Nuxt: client-side router by default; navigations don't refresh the page.
   - Astro: native browser navigation by default. There's an opt-in `<ViewTransitions />` for smooth transitions, but most static sites don't need it.

4. **Data fetching**

   - Nuxt: `useAsyncData` works in both build and runtime, with a payload that hydrates client-side.
   - Astro: build-time-only `await` in the frontmatter. No payload to hydrate.

5. **Build speed**

   - Nuxt 4: ~22 s for 107 routes in this project (with `/creators` prebuild).
   - Astro: ~1.5 s for 36 routes, ~3 s for 100+ routes typically.

6. **Mental load**

   - Nuxt: Vue + Nuxt + Nitro + Vite + Vuetify + the entire SPA-vs-SSG/SSR matrix.
   - Astro: HTML-first. You only learn islands when you actually need interactivity.

---

## Things that surprised me coming from Vue/Nuxt

- **No `ref()`, no reactivity.** Frontmatter runs once at build time. Anything dynamic happens in `<script>` at the bottom or in an island.
- **`{expression}` in templates uses JSX-style braces**, not Vue's mustaches. `{user.name}`, not `{{ user.name }}`.
- **Conditional rendering uses `&&` / ternaries**, not `v-if`. `{showTOC && <TOC />}`.
- **List rendering uses `.map()`**, not `v-for`. `{items.map((i) => <li>{i.title}</li>)}`.
- **Class binding is regular HTML.** `class="foo"` or `class:list={['foo', condition && 'bar']}`.
- **Slots are HTML's `<slot />`.** Same as Vue, drop-in.
- **Scoped styles work the same.** `<style>` in a component is automatically scoped via class hashing.
- **`Astro.props`** is the equivalent of `defineProps()`, but plain — no `defineProps()` macro, just destructure.

---

## The shape of this specific project

```
astro/
├── astro.config.ts         ← integrations (sitemap), env schema, Vite plugins
├── src/
│   ├── pages/              ← file-based routes
│   │   ├── index.astro                  → /
│   │   ├── biographies/index.astro      → /biographies/
│   │   ├── biographies/[slug].astro     → /biographies/<slug>/  (one per bio)
│   │   ├── searchIndex.json.ts          → /searchIndex.json     (build-time-emitted JSON)
│   │   ├── sitemap.xml.ts               → /sitemap.xml
│   │   └── ...
│   ├── content.config.ts   ← Strapi → collections (the heart of the migration)
│   ├── layouts/BaseLayout.astro    ← <head>, nav, footer wrapper
│   ├── components/         ← reusable .astro pieces (SiteNav, MediaSlider, TableOfContents)
│   ├── lib/                ← plain TS helpers (markdown.ts, dateFormat.ts, etc.)
│   └── styles/global.css   ← Tailwind 4 + brand theme
├── public/                 ← static assets, served at the URL root
├── tests/
│   ├── unit/               ← vitest
│   └── e2e/                ← playwright
└── dist/                   ← build output (gitignored)
```

A request lifecycle for, say, `/biographies/clair-daney/`:

1. **Build time:**
   - `content.config.ts` loader fetches biographies from Strapi.
   - `src/pages/biographies/[slug].astro`'s `getStaticPaths()` returns one entry per bio.
   - Each instance renders the bio detail HTML.
   - Astro writes `dist/biographies/clair-daney/index.html`.
2. **User visits:**
   - Netlify serves the static HTML.
   - Browser parses, downloads the one shared CSS file, paints.
   - No JS runs (this page has no islands).

That's it. No runtime, no API, no hydration.

---

## Why builds and deploys are so much faster than Nuxt

| Factor | Nuxt 4 | Astro 6.3 |
|---|---|---|
| **JS runtime bundling** | Vue + Nuxt + Nitro + hydration data on every route | Zero JS by default; only islands ship runtime |
| **Dependency tree** | ~120 packages incl. Vue ecosystem + Nuxt UI + Reka UI + Tailwind + plugins | ~25 packages — Astro core + Tailwind + minimal integrations |
| **`yarn install` time** | ~30–45 s (lots of transitive deps) | ~10–15 s (much smaller) |
| **Pre-build step** | `yarn scripts` runs 8 Node scripts to fetch Strapi → write JSON/markdown fixtures | None — Content Collections fetch Strapi directly during the main build |
| **Build pipeline** | Vite → Nuxt → Nitro: render Vue components, generate hydration payload, bundle JS, optimize CSS, generate server routes | Vite → Astro: render `.astro` to HTML, scope CSS, emit static files |
| **Per-route output** | HTML + JSON payload + chunked JS bundles + per-route CSS chunks | One HTML file + (occasionally) small island JS |
| **Total dist size** | ~119 MB (107 routes, large vendor chunk) | ~44 KB for the migrated routes |
| **Upload to Netlify CDN** | Uploading 100+ MB of bundles takes a meaningful chunk of time | Tiny upload, near-instant |

Compounding savings produce the Netlify deploy gap: Nuxt ~2–3 minutes vs. Astro ~17 seconds.

---

## Recommended next-step reading

When you have time:

- The Astro docs' [Islands Architecture](https://docs.astro.build/en/concepts/islands/) page — explains the `client:*` directives properly.
- The [Content Collections Reference](https://docs.astro.build/en/guides/content-collections/) — for the loader/schema patterns we use.
- [Astro Components](https://docs.astro.build/en/basics/astro-components/) — the `.astro` syntax in detail.

For a Vue dev specifically, the **mental shift** is:

- From "I'm building an app that renders pages" → "I'm building pages that occasionally have apps in them".
- From "everything is reactive by default" → "everything is static by default; opt into reactivity when you need it".

That's the whole framework, really.
