// astro/src/lib/navConfig.ts
//
// Single source of truth for the top nav menu — a faithful port of the live
// r3.illinois.gov nav (Nuxt `app.config.js` → `navMenu`). SiteNav.astro renders
// it on every page.
//
// Structure (matches live exactly):
//   Home  |  About ▾  |  Eligibility  |  Contact      + Search icon
//
// The "About" entry is a dropdown. Its children mirror the Nuxt navMenu's
// `About.children` array — section headers, a divider, internal links, and one
// external ArcGIS StoryMap link. The StoryMap URL is the CURRENT one (updated
// on `main` in commit 54f6627 — the branch predates that commit, so it is
// applied here directly).
//
// Trailing slashes: internal hrefs end with `/` per the site's
// `trailingSlash: 'always'` policy.

/** A navigable link (internal or external). */
export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

/** A non-interactive section header inside a dropdown. */
export interface NavSection {
  section: string;
}

/** A horizontal divider inside a dropdown. */
export interface NavDivider {
  divider: true;
}

export type NavChild = NavLink | NavSection | NavDivider;

/** A top-level nav entry: either a plain link (`href`) or a dropdown (`children`). */
export interface NavItem {
  label: string;
  href?: string;
  children?: NavChild[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    children: [
      { section: 'About the R3 Program' },
      { label: 'R3 news', href: '/news/' },
      { label: 'Meetings', href: '/meetings/' },
      { label: 'R3 Program Board', href: '/board/' },
      { label: 'Research', href: '/research/' },
      {
        label: 'About the R3 Program',
        href: 'https://storymaps.arcgis.com/stories/8607e513363e49f5b02a6e7d8a82432a',
        external: true,
      },
      { divider: true },
      { section: 'Applicant Tools' },
      { label: 'FAQs', href: '/faqs/' },
      { label: 'Collaboratives', href: '/collaboratives/' },
      { label: 'Resources', href: '/resources/' },
    ],
  },
  { label: 'Eligibility', href: '/eligibility/' },
  { label: 'Contact', href: '/contact/' },
];

/** Type guards for rendering dropdown children. */
export const isNavSection = (c: NavChild): c is NavSection => 'section' in c;
export const isNavDivider = (c: NavChild): c is NavDivider => 'divider' in c;
export const isNavLink = (c: NavChild): c is NavLink => 'href' in c;
