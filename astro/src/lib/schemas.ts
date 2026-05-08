// astro/src/lib/schemas.ts
//
// Centralized JSON-LD schema builders used by BaseLayout and individual
// pages. Each function returns a plain object you `JSON.stringify()` into a
// `<script type="application/ld+json">`.

const ORG = {
  '@type': 'GovernmentOrganization',
  name: 'Illinois Criminal Justice Information Authority',
  url: 'https://icjia.illinois.gov',
} as const;

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'R3 — Restore, Reinvest, Renew',
    url: 'https://r3.illinois.gov',
    description:
      'The R3 (Restore, Reinvest, and Renew) program invests in communities most affected by systemic racism and disinvestment.',
    inLanguage: 'en',
    publisher: ORG,
  };
}

export function webPageSchema(opts: {
  name: string;
  description: string;
  canonicalURL: string;
  datePublished?: string;
  dateModified?: string;
}) {
  const out: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: opts.name,
    description: opts.description,
    url: opts.canonicalURL,
    inLanguage: 'en',
    publisher: ORG,
  };
  if (opts.datePublished) out['datePublished'] = opts.datePublished;
  if (opts.dateModified) out['dateModified'] = opts.dateModified;
  return out;
}

export function newsArticleSchema(opts: {
  title: string;
  description: string;
  canonicalURL: string;
  datePublished: string;
  dateModified: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: opts.title,
    description: opts.description,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    author: ORG,
    publisher: ORG,
    mainEntityOfPage: { '@type': 'WebPage', '@id': opts.canonicalURL },
  };
}

export function breadcrumbSchema(crumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}
