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

// AmpliFund externalURLs were removed 2026-05-24 (v1.0.5) because both
// NOFOs have closed — sending users to AmpliFund where they can't apply is
// a worse experience than just describing the past opportunity. Cards stay
// as informational blocks; `applicationDate` defaults to "EXPIRED" in
// HomeSplashCard.astro and HomeSplashCard renders a non-link wrapper when
// `externalURL` is absent.
export const HOMEPAGE_SPLASH: SplashCard[] = [
  {
    src: 'https://r3.icjia-api.cloud/uploads/r32025_1_08392baf96.jpg',
    lazySrc: 'https://r3.icjia-api.cloud/uploads/r32025_1_08392baf96.jpg',
    tagline:
      '$35M in funding available for service delivery projects proposed to address one or more of the R3 priorities of reentry, economic development,  and civil legal aid.  ',
    title: 'Notice of Funding Opportunity',
  },
  {
    src: 'https://r3.icjia-api.cloud/uploads/large_getty_images_Br_GGMIVO_9r_U_unsplash_f4b0e5293b.jpg',
    lazySrc:
      'https://r3.icjia-api.cloud/uploads/thumbnail_getty_images_Br_GGMIVO_9r_U_unsplash_f4b0e5293b.jpg',
    title: 'Notice of Funding Opportunity',
    tagline:
      '$15M in funding available for service delivery projects proposed to address one or more of the R3 priorities of youth development and violence prevention.',
  },
];
