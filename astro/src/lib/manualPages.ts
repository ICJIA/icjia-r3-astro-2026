// astro/src/lib/manualPages.ts
//
// Hand-curated, non-Strapi page data: the homepage splash cards (NOFO
// announcement banners) and any other content the team prefers to keep in
// version control rather than the CMS. Replaces the splash array in
// app.config.js (Nuxt era) and creators/createManualPages.js.

export interface SplashCard {
  src: string;        // primary image (remote URL or path under public/)
  lazySrc?: string;   // lqip / thumbnail placeholder
  title: string;
  tagline: string;
  externalURL?: string;
  applicationDate?: string; // descriptive text under the tagline (e.g. "EXPIRED")
}

export const HOMEPAGE_SPLASH: SplashCard[] = [
  {
    externalURL:
      'https://il.amplifund.com/Public/Opportunities/Details/025c7e5e-0584-4bab-b2ce-c6528f5c132e',
    src: 'https://r3.icjia-api.cloud/uploads/r32025_1_08392baf96.jpg',
    lazySrc: 'https://r3.icjia-api.cloud/uploads/r32025_1_08392baf96.jpg',
    tagline:
      '$35M in funding available for service delivery projects proposed to address one or more of the R3 priorities of reentry, economic development,  and civil legal aid.  ',
    title: 'Notice of Funding Opportunity',
  },
  {
    externalURL:
      'https://il.amplifund.com/Public/Opportunities/Details/41c400bd-795c-444a-a8db-9bad138127be',
    src: 'https://r3.icjia-api.cloud/uploads/large_getty_images_Br_GGMIVO_9r_U_unsplash_f4b0e5293b.jpg',
    lazySrc:
      'https://r3.icjia-api.cloud/uploads/thumbnail_getty_images_Br_GGMIVO_9r_U_unsplash_f4b0e5293b.jpg',
    title: 'Notice of Funding Opportunity',
    tagline:
      '$15M in funding available for service delivery projects proposed to address one or more of the R3 priorities of youth development and violence prevention.',
  },
];
