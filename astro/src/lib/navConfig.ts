// astro/src/lib/navConfig.ts
//
// Single source of truth for the top nav menu. Update labels/URLs here,
// and SiteNav.astro renders them on every page. Order is presentation order.
//
// SOURCE: Derived from app.config.js `navMenu` array (Nuxt source of truth).
//
// Structure note: The Nuxt nav has four top-level entries:
//   - Home (link: /)
//   - About (dropdown with 9 children: News, Meetings, Board, Research,
//     an external ArcGIS story-map, FAQs, Collaboratives, Resources)
//   - Eligibility (link: /eligibility)
//   - Contact (link: /contact)
//
// The "About" dropdown is flattened here. All children that had their own
// top-level presence in the Nuxt footer menu (News, Meetings, Board,
// Research, FAQs, Collaboratives, Resources) are promoted to top-level nav
// items. The external ArcGIS story-map link is omitted — it is a deep-link
// to a third-party resource and would be awkward as a persistent nav item.
// A `children` field is left reserved in the interface for future dropdown
// support if needed.

export interface NavItem {
  label: string;
  href: string; // must end with / per site's trailingSlash: 'always' policy
  external?: boolean; // true → opens in new tab, rel="noopener noreferrer"
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'About',          href: '/about/' },
  { label: 'Eligibility',    href: '/eligibility/' },
  { label: 'News',           href: '/news/' },
  { label: 'Meetings',       href: '/meetings/' },
  { label: 'Resources',      href: '/resources/' },
  { label: 'FAQs',           href: '/faqs/' },
  { label: 'Research',       href: '/research/' },
  { label: 'Collaboratives', href: '/collaboratives/' },
  { label: 'Board',          href: '/board/' },
  { label: 'Contact',        href: '/contact/' },
];
