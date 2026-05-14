import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';

// Static-first, zero-JS-by-default build for r3.illinois.gov.
//
// `@astrojs/sitemap` auto-generates sitemap-index.xml + sitemap-0.xml from
// emitted routes, replacing the old creators/createSiteRoutes.js pipeline.
//
// Tailwind 4 uses the first-party Vite plugin; the legacy @astrojs/tailwind
// integration is for Tailwind 3 only.
//
// `@astrojs/vue` enables `.vue` islands for the Search and Dialog components
// (the only interactive surfaces on the site). All other components are pure
// .astro and ship zero JS.
export default defineConfig({
  site: 'https://r3.illinois.gov',
  output: 'static',
  trailingSlash: 'always',
  image: {
    // Authorize the Strapi media host so <Image> can pull the homepage
    // splash + photo-box images at build time and emit optimized,
    // locally-served files. This removes the runtime cross-origin round-trip
    // to r3.icjia-api.cloud that made the homepage LCP swing 2.8–3.2s.
    domains: ['r3.icjia-api.cloud'],
  },
  build: {
    // Inline small CSS chunks; externalize larger ones — keeps render-blocking
    // CSS minimal on small pages without bloating large bundles.
    inlineStylesheets: 'auto',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    vue(),
    sitemap({
      filter: (page) =>
        !page.includes('/sandbox/') &&
        !page.includes('/preview/') &&
        !page.includes('/translate/') &&
        !page.includes('/404/'),
      changefreq: 'weekly',
      priority: 0.5,
    }),
  ],
  env: {
    schema: {
      PUBLIC_API_BASE_URL: envField.string({
        context: 'client',
        access: 'public',
        url: true,
        default: 'https://r3.icjia-api.cloud',
      }),
      PUBLIC_HUB_API_BASE_URL: envField.string({
        context: 'client',
        access: 'public',
        url: true,
        default: 'https://researchhub.icjia-api.cloud',
      }),
      PUBLIC_BASE_URL: envField.string({
        context: 'client',
        access: 'public',
        url: true,
        default: 'https://r3.illinois.gov',
      }),
      PUBLIC_PLAUSIBLE_HOST: envField.string({
        context: 'client',
        access: 'public',
        url: true,
        default: 'https://plausible.icjia.cloud',
      }),
      // IMPORTANT: When PUBLIC_BASE_URL is overridden for a staging or branch
      // deploy, PUBLIC_PLAUSIBLE_DOMAIN MUST also be overridden — otherwise
      // staging traffic fires against the production r3.illinois.gov Plausible
      // bucket. Set this to the staging hostname for non-prod deploys.
      // NOTE: This is a bare hostname (not a URL), so url: true is intentionally absent.
      PUBLIC_PLAUSIBLE_DOMAIN: envField.string({
        context: 'client',
        access: 'public',
        default: 'r3.illinois.gov',
      }),
    },
  },
});
