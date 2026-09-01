// astro/src/lib/homeHero.ts
//
// Shared build config for the homepage hero background photo.
//
// Two places have to agree on how this image is emitted: the <Image> inside
// HomeHero.astro, and the <link rel="preload"> that index.astro puts in the
// <head> to warm the LCP paint. If their widths/format ever drifted apart,
// Astro would emit two different sets of files and the browser would download
// the hero twice — once for the preload, once for the <img>. Keeping the
// options here makes that drift impossible.

import homeHeroBackground from '../assets/home-hero-background.png';

export const HOME_HERO_IMAGE = homeHeroBackground;

// Full-bleed band, so candidate widths track viewport widths rather than a
// column measure. The source is 2000px wide; anything larger would just be an
// upscale, so 2000 is the top rung. The rungs are deliberately closely spaced
// around the common device widths (768 phone/small tablet, 1440 laptop) —
// widely spaced rungs made Lighthouse's image-delivery insight flag ~76 KiB of
// over-fetch, because a viewport just past a rung jumps to the next one up.
export const HOME_HERO_WIDTHS = [640, 768, 960, 1280, 1440, 1600, 2000];

export const HOME_HERO_SIZES = '100vw';

export const HOME_HERO_FORMAT = 'webp' as const;
