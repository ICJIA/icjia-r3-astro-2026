// astro/src/lib/tags.ts
//
// Static list of tags used to filter Research Hub articles to R3-relevant
// content at build time. Replaces src/tags.json. Update this list when the
// program scope changes.

export const HUB_TAGS = ['all research', 'r3', 'cannabis'] as const;

export type HubTag = (typeof HUB_TAGS)[number];
