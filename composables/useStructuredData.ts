/**
 * @fileoverview Structured Data (JSON-LD) composables for enhanced SEO
 *
 * This module provides composables for adding structured data (Schema.org JSON-LD)
 * to pages, enabling rich snippets in search results. Structured data helps search
 * engines understand page content and can improve visibility with enhanced displays.
 *
 * Supported schemas:
 * - WebSite (for homepage)
 * - SearchAction (for search functionality)
 * - GovernmentOrganization
 * - Article/NewsArticle
 * - FAQPage
 * - BreadcrumbList
 * - WebPage
 *
 * @since 1.0.0
 */

/**
 * Add WebSite structured data with search action
 * This should be used on the homepage
 *
 * @example
 * ```typescript
 * // In pages/index.vue
 * useWebsiteSchema()
 * ```
 */
export function useWebsiteSchema() {
  const appConfig = useAppConfig();
  const baseUrl = appConfig.root || "https://r3.illinois.gov";

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "R3 - Restore, Reinvest, Renew",
    alternateName: "R3 Illinois",
    url: baseUrl,
    description:
      "The R3 (Restore, Reinvest, and Renew) program invests in communities most affected by systemic racism and disinvestment.",
    publisher: {
      "@type": "GovernmentOrganization",
      name: "Illinois Criminal Justice Information Authority",
      url: "https://icjia.illinois.gov",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  useHead({
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify(schema),
      },
    ],
  });
}

/**
 * Add GovernmentOrganization structured data
 *
 * @example
 * ```typescript
 * // In app.vue or pages/about.vue
 * useGovernmentOrganizationSchema()
 * ```
 */
export function useGovernmentOrganizationSchema() {
  const appConfig = useAppConfig();
  const baseUrl = appConfig.root || "https://r3.illinois.gov";

  const schema = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    "@id": `${baseUrl}/#organization`,
    name: "Illinois Criminal Justice Information Authority - R3 Program",
    alternateName: "R3 Program",
    legalName: "Illinois Criminal Justice Information Authority",
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/icjia-logo.png`,
      width: 1200,
      height: 630,
    },
    image: `${baseUrl}/icjia-logo.png`,
    description:
      "The R3 (Restore, Reinvest, and Renew) program invests in communities most affected by systemic racism and disinvestment through economic development, violence prevention, reentry, and civil legal aid services.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
      addressRegion: "IL",
      addressLocality: "Chicago",
      postalCode: "60603",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "CJA.R3grants@illinois.gov",
      availableLanguage: ["en", "es"],
    },
    sameAs: [
      "https://twitter.com/ICJIAIllinois",
      "https://www.facebook.com/ICJIA",
      "https://www.linkedin.com/company/icjia",
    ],
    parentOrganization: {
      "@type": "GovernmentOrganization",
      name: "State of Illinois",
      url: "https://illinois.gov",
    },
  };

  useHead({
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify(schema),
      },
    ],
  });
}

/**
 * Interface for News Article structured data
 */
export interface NewsArticleConfig {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  section?: string;
}

/**
 * Add NewsArticle structured data for news posts
 *
 * @param config - Article configuration
 * @example
 * ```typescript
 * // In pages/news/[slug].vue
 * useNewsArticleSchema({
 *   headline: article.title,
 *   description: article.summary,
 *   datePublished: article.publishedAt,
 *   dateModified: article.updatedAt,
 * })
 * ```
 */
export function useNewsArticleSchema(config: NewsArticleConfig) {
  const appConfig = useAppConfig();
  const route = useRoute();
  const baseUrl = appConfig.root || "https://r3.illinois.gov";
  const fullUrl = `${baseUrl}${route.path}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${fullUrl}#article`,
    headline: config.headline,
    description: config.description,
    image: config.image || `${baseUrl}/r3-social.png`,
    datePublished: config.datePublished,
    dateModified: config.dateModified || config.datePublished,
    author: {
      "@type": "Organization",
      name: config.author || "Illinois Criminal Justice Information Authority",
      url: "https://icjia.illinois.gov",
    },
    publisher: {
      "@type": "GovernmentOrganization",
      name: "Illinois Criminal Justice Information Authority",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/icjia-logo.png`,
        width: 1200,
        height: 630,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": fullUrl,
    },
    articleSection: config.section || "News",
    inLanguage: "en-US",
  };

  useHead({
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify(schema),
      },
    ],
  });
}

/**
 * Interface for FAQ items
 */
export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Add FAQPage structured data
 *
 * @param faqs - Array of FAQ items
 * @example
 * ```typescript
 * // In pages/faqs/index.vue
 * useFaqPageSchema([
 *   {
 *     question: 'What is the R3 program?',
 *     answer: 'The R3 program provides funding for communities...'
 *   }
 * ])
 * ```
 */
export function useFaqPageSchema(faqs: FaqItem[]) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  useHead({
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify(schema),
      },
    ],
  });
}

/**
 * Interface for breadcrumb items
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Add BreadcrumbList structured data
 *
 * @param items - Array of breadcrumb items
 * @example
 * ```typescript
 * // In any page with breadcrumbs
 * useBreadcrumbListSchema([
 *   { name: 'Home', url: '/' },
 *   { name: 'News', url: '/news' },
 *   { name: 'Article Title', url: '/news/article-slug' }
 * ])
 * ```
 */
export function useBreadcrumbListSchema(items: BreadcrumbItem[]) {
  const appConfig = useAppConfig();
  const baseUrl = appConfig.root || "https://r3.illinois.gov";

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
    })),
  };

  useHead({
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify(schema),
      },
    ],
  });
}

/**
 * Add WebPage structured data for standard pages
 *
 * @param config - Page configuration
 * @example
 * ```typescript
 * // In any content page
 * useWebPageSchema({
 *   name: 'About R3',
 *   description: 'Learn about the R3 program'
 * })
 * ```
 */
export function useWebPageSchema(config: {
  name: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
}) {
  const appConfig = useAppConfig();
  const route = useRoute();
  const baseUrl = appConfig.root || "https://r3.illinois.gov";
  const fullUrl = `${baseUrl}${route.path}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": fullUrl,
    url: fullUrl,
    name: config.name,
    description: config.description,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      url: baseUrl,
      name: "R3 - Restore, Reinvest, Renew",
    },
    ...(config.datePublished && {
      datePublished: config.datePublished,
    }),
    ...(config.dateModified && {
      dateModified: config.dateModified,
    }),
    publisher: {
      "@type": "GovernmentOrganization",
      "@id": `${baseUrl}/#organization`,
      name: "Illinois Criminal Justice Information Authority",
    },
  };

  useHead({
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify(schema),
      },
    ],
  });
}

/**
 * Add ContactPage structured data
 *
 * @example
 * ```typescript
 * // In pages/contact.vue
 * useContactPageSchema()
 * ```
 */
export function useContactPageSchema() {
  const appConfig = useAppConfig();
  const baseUrl = appConfig.root || "https://r3.illinois.gov";

  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${baseUrl}/contact#contactpage`,
    url: `${baseUrl}/contact`,
    name: "Contact R3",
    description: "Get in touch with the R3 program team",
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
    },
    mainEntity: {
      "@type": "GovernmentOrganization",
      "@id": `${baseUrl}/#organization`,
    },
  };

  useHead({
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify(schema),
      },
    ],
  });
}
