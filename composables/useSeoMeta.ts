/**
 * @fileoverview SEO Meta composable for managing dynamic SEO metadata across the R3 application.
 *
 * This composable provides a centralized way to manage SEO metadata including:
 * - Page titles with dynamic templates
 * - Meta descriptions
 * - Open Graph tags for social media
 * - Twitter Card tags
 * - Canonical URLs
 * - Robots directives
 *
 * @since 1.0.0
 * @example
 * ```typescript
 * // In a page component
 * usePageSeo({
 *   title: 'About R3 Program',
 *   description: 'Learn about the Restore, Reinvest, and Renew program',
 *   path: '/about'
 * })
 * ```
 */

/**
 * Interface for page SEO metadata configuration
 */
export interface PageSeoConfig {
  /** Page title (will be formatted with site name) */
  title?: string;
  /** Meta description for search engines */
  description?: string;
  /** Current page path for canonical URL */
  path?: string;
  /** Open Graph image URL (defaults to site logo) */
  image?: string;
  /** Open Graph type (defaults to 'website') */
  type?: "website" | "article";
  /** Article-specific metadata */
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  /** Whether to index this page (defaults to true) */
  index?: boolean;
  /** Additional keywords for meta tags */
  keywords?: string[];
}

/**
 * Composable for setting comprehensive page SEO metadata
 *
 * @param config - SEO configuration for the page
 */
export function usePageSeo(config: PageSeoConfig) {
  const appConfig = useAppConfig();
  const route = useRoute();

  // Build the full URL for canonical and og:url
  const baseUrl = appConfig.root || "https://r3.illinois.gov";
  const rawPath = config.path || route.path;
  // Normalize trailing slash to match Netlify's Pretty URLs and prevent duplicate analytics entries
  const fullPath =
    rawPath !== "/" && !rawPath.endsWith("/") ? rawPath + "/" : rawPath;
  const canonicalUrl = `${baseUrl}${fullPath}`;

  // Default values
  const defaultImage = `${baseUrl}/og-image.png`;
  const siteTitle = "R3 | Restore. Reinvest. Renew.";
  const defaultDescription =
    appConfig.description ||
    "The R3 program invests in communities most affected by systemic racism and disinvestment.";

  // Format title with site name
  const pageTitle = config.title ? `${config.title} | ${siteTitle}` : siteTitle;

  const description = config.description || defaultDescription;
  const image = config.image || defaultImage;
  const type = config.type || "website";

  // Use Nuxt's useSeoMeta for type-safe meta tags
  useSeoMeta({
    title: pageTitle,
    description: description,

    // Open Graph tags
    ogTitle: config.title || siteTitle,
    ogDescription: description,
    ogImage: image,
    ogImageWidth: "1200",
    ogImageHeight: "630",
    ogUrl: canonicalUrl,
    ogType: type,
    ogSiteName: "R3 Illinois",
    ogLocale: "en_US",

    // OG image alt text for accessibility
    ogImageAlt: `${config.title || siteTitle} - R3 Illinois`,

    // Twitter Card tags
    twitterCard: "summary_large_image",
    twitterTitle: config.title || siteTitle,
    twitterDescription: description,
    twitterImage: image,
    twitterImageAlt: `${config.title || siteTitle} - R3 Illinois`,
    twitterSite: "@ICJIAIllinois",

    // Additional SEO tags
    robots: "index, follow",
    googlebot: "index, follow",

    // Article-specific tags (if applicable)
    ...(config.article && {
      articlePublishedTime: config.article.publishedTime,
      articleModifiedTime: config.article.modifiedTime,
      articleAuthor: config.article.author,
      articleSection: config.article.section,
      articleTag: config.article.tags,
    }),
  });

  // Use useHead for canonical URL and other head tags
  useHead({
    link: [
      {
        rel: "canonical",
        href: canonicalUrl,
      },
    ],
    meta: config.keywords
      ? [
          {
            name: "keywords",
            content: config.keywords.join(", "),
          },
        ]
      : [],
  });
}

/**
 * Composable for setting default site-wide SEO metadata
 * Should be called in app.vue or layout
 */
export function useSiteSeo() {
  const appConfig = useAppConfig();
  const baseUrl = appConfig.root || "https://r3.illinois.gov";

  useSeoMeta({
    ogSiteName: "R3 Illinois",
    ogLocale: "en_US",
    twitterSite: "@ICJIAIllinois",
    applicationName: "R3 - Restore, Reinvest, Renew",
    robots: "index, follow",

    // Verification tags (if needed)
    // googleSiteVerification: 'your-verification-code',
  });

  useHead({
    titleTemplate: (titleChunk) => {
      return titleChunk ? `${titleChunk}` : "R3 | Restore. Reinvest. Renew.";
    },
    htmlAttrs: {
      lang: "en",
      prefix: "og: https://ogp.me/ns#",
    },
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/favicon.ico",
      },
      // Preconnect to external domains for performance
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossorigin: "anonymous",
      },
      {
        rel: "dns-prefetch",
        href: "https://r3.icjia-api.cloud",
      },
    ],
  });
}

/**
 * Helper to generate article schema for news/blog posts
 */
export function useArticleSchema(config: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: string;
}) {
  const appConfig = useAppConfig();
  const route = useRoute();
  const baseUrl = appConfig.root || "https://r3.illinois.gov";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: config.headline,
    description: config.description,
    image: config.image,
    datePublished: config.datePublished,
    dateModified: config.dateModified || config.datePublished,
    author: {
      "@type": "Organization",
      name: config.author,
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Illinois Criminal Justice Information Authority",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/icjia-logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}${route.path.endsWith("/") || route.path === "/" ? route.path : route.path + "/"}`,
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
 * Helper to generate organization schema
 */
export function useOrganizationSchema() {
  const appConfig = useAppConfig();
  const baseUrl = appConfig.root || "https://r3.illinois.gov";

  const schema = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name: "Illinois Criminal Justice Information Authority - R3 Program",
    alternateName: "R3 Program",
    url: baseUrl,
    logo: `${baseUrl}/icjia-logo.png`,
    description:
      "The R3 (Restore, Reinvest, and Renew) program invests in communities most affected by systemic racism and disinvestment.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
      addressRegion: "IL",
      addressLocality: "Chicago",
    },
    sameAs: [
      "https://twitter.com/ICJIAIllinois",
      "https://www.facebook.com/ICJIA",
    ],
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
 * Helper to generate breadcrumb schema
 */
export function useBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
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
 * Helper to generate FAQ schema
 */
export function useFaqSchema(
  faqs: Array<{ question: string; answer: string }>,
) {
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
