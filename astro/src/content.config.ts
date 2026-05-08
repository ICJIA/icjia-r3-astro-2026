// astro/src/content.config.ts
//
// Astro 6 Content Collections, sourced live from the R3 Strapi GraphQL API
// at https://r3.icjia-api.cloud/graphql at build time. Per-task discovery
// (Task 2.1) confirmed:
//   - R3 Strapi runs Strapi v4 (data[name].data response shape)
//   - `pages` GraphQL field name matches collection name
//
// THIS FILE REPLACES THE ENTIRE /creators DIRECTORY. No prebuild step.
// No markdown fixtures on disk. Build is one process: `astro build`.

import { defineCollection } from 'astro:content';
import { type LoaderContext } from 'astro/loaders';
import { z } from 'zod/v4';
import { strapiQuery, rawText } from '~/lib/strapi';
import { ensureTrailingSlash } from '~/lib/slug';

// ─── Loader factory (Strapi v4) ─────────────────────────────────────────

interface StrapiV4Item {
  id: string;
  attributes: Record<string, unknown> & { slug?: string };
}

function strapiLoader(collectionName: string, query: string) {
  return {
    name: `strapi-${collectionName}`,
    load: async ({ store, parseData, logger }: LoaderContext) => {
      const items = await strapiQuery<StrapiV4Item>(collectionName, query);
      store.clear();
      for (const item of items) {
        const slug = item.attributes.slug;
        if (!slug) continue;
        const rawData = { id: item.id, ...item.attributes } as Record<string, unknown>;
        const data = await parseData({ id: slug, data: rawData });
        store.set({ id: slug, data });
      }
      logger.info(`Loaded ${items.length} ${collectionName} from Strapi.`);
    },
  };
}

// ─── 1. pages ──────────────────────────────────────────────────────────

const pages = defineCollection({
  loader: strapiLoader(
    'pages',
    `query {
      pages {
        data {
          id
          attributes {
            title slug section summary body
            hideFromSitemap showTableOfContents searchMeta
            createdAt updatedAt publishedAt
          }
        }
      }
    }`,
  ),
  schema: z
    .object({
      id: z.string(),
      title: z.string(),
      slug: z.string(),
      section: z.string().nullable().optional(),
      summary: z.string().nullable().optional(),
      body: z.string().nullable().optional(),
      hideFromSitemap: z.boolean().optional(),
      showTableOfContents: z.boolean().optional(),
      searchMeta: z.string().nullable().optional(),
      createdAt: z.string().optional(),
      updatedAt: z.string().optional(),
      publishedAt: z.string().optional(),
    })
    .transform((data) => ({
      ...data,
      rawText: rawText(data.body ?? ''),
      // Strip the section prefix when computing path; mirrors createMarkdownPages.js logic.
      path:
        data.slug === 'index'
          ? '/'
          : data.section && data.section !== 'root'
            ? ensureTrailingSlash(`/${data.section.toLowerCase()}/${data.slug}`)
            : ensureTrailingSlash(`/${data.slug}`),
    })),
});

// ─── 2. news ───────────────────────────────────────────────────────────
//
// Strapi GraphQL field is `posts` (NOT `news`); local collection name is
// `news` to match the URL path /news/<slug>/. See MIGRATION.md "Strapi
// schema discovery" for the discovery results.
//
// Live introspection of the `Post` type (2026-05-08) confirmed these fields
// exist on the Strapi API: title, slug, summary, body, searchMeta,
// showTableOfContents, section, hideFromSitemap, hideFromSearch, dateOverride,
// createdAt, updatedAt, publishedAt.
//
// The following plan-listed fields do NOT exist on `Post` and are omitted:
//   - mediaTitle  (GRAPHQL_VALIDATION_FAILED: "Cannot query field")
//   - media       (GRAPHQL_VALIDATION_FAILED: "Cannot query field")
//   - splash      (GRAPHQL_VALIDATION_FAILED: "Cannot query field")
//   - attachments (GRAPHQL_VALIDATION_FAILED: "Cannot query field")

const news = defineCollection({
  loader: strapiLoader(
    'posts', // GraphQL field name; not 'news'
    `query {
      posts {
        data {
          id
          attributes {
            title slug dateOverride summary body searchMeta
            hideFromSitemap hideFromSearch showTableOfContents
            section
            createdAt updatedAt publishedAt
          }
        }
      }
    }`,
  ),
  schema: z
    .object({
      id: z.string(),
      title: z.string(),
      slug: z.string(),
      dateOverride: z
        .string()
        .nullable()
        .optional()
        .refine(
          (v) => v == null || v === '' || !Number.isNaN(new Date(v).getTime()),
          { message: 'dateOverride must be a parseable date string' },
        ),
      summary: z.string().nullable().optional(),
      body: z.string().nullable().optional(),
      searchMeta: z.string().nullable().optional(),
      hideFromSitemap: z.boolean().optional(),
      hideFromSearch: z.boolean().optional(),
      showTableOfContents: z.boolean().optional(),
      section: z.string().nullable().optional(),
      createdAt: z.string().optional(),
      updatedAt: z.string().optional(),
      publishedAt: z.string().optional(),
    })
    .transform((data) => ({
      ...data,
      postDate: data.dateOverride
        ? new Date(data.dateOverride).toISOString()
        : data.publishedAt
          ? new Date(data.publishedAt).toISOString()
          : data.createdAt
            ? new Date(data.createdAt).toISOString()
            : 'MISSING_DATE',
      rawText: rawText(data.body ?? ''),
      path: ensureTrailingSlash(`/news/${data.slug}`),
    })),
});

// ─── 3. faqs ───────────────────────────────────────────────────────────
//
// GraphQL field is `weeklyFaqs` (NOT `faqs`); local collection name is `faqs`
// to match the URL path /faqs/<slug>/. Task 2.1 discovery: `faqs` returns 0
// rows; `weeklyFaqs` is the correct field.
//
// Live introspection of `WeeklyFaq` type (2026-05-08) confirmed these fields
// exist: title, slug, summary, body, week (ENUM_WEEKLYFAQ_WEEK), dateOverride
// (Date scalar), attachmentHeading, createdAt, updatedAt, publishedAt.
//
// The following plan-listed fields do NOT exist on `WeeklyFaq` and are omitted:
//   - category        (GRAPHQL_VALIDATION_FAILED: "Cannot query field")
//   - question        (GRAPHQL_VALIDATION_FAILED: "Cannot query field")
//   - answer          (GRAPHQL_VALIDATION_FAILED: "Cannot query field")
//   - searchMeta      (GRAPHQL_VALIDATION_FAILED: "Cannot query field")
//   - hideFromSitemap (GRAPHQL_VALIDATION_FAILED: "Cannot query field")
//   - showTableOfContents (GRAPHQL_VALIDATION_FAILED: "Cannot query field")
//
// `question` and `answer` are kept as optional schema fields to support the
// rawText transform without breaking on undefined. They will always be absent
// at runtime; the body field carries all searchable content.
//
// `dateOverride` exists and is a Date scalar — `.refine()` applied to reject
// unparseable date strings (matching news collection).
//
// `weeklyFaqs` returned 0 rows during Task 2.1 discovery and Task 2.8
// verification; Strapi has no published WeeklyFaq entries at this time.
// `astro sync` will report "Loaded 0 weeklyFaqs from Strapi" — expected.

const faqs = defineCollection({
  loader: strapiLoader(
    'weeklyFaqs', // GraphQL field name; local collection name is 'faqs'
    `query {
      weeklyFaqs {
        data {
          id
          attributes {
            title slug summary body week dateOverride attachmentHeading
            createdAt updatedAt publishedAt
          }
        }
      }
    }`,
  ),
  schema: z
    .object({
      id: z.string(),
      title: z.string(),
      slug: z.string(),
      summary: z.string().nullable().optional(),
      body: z.string().nullable().optional(),
      week: z.string().nullable().optional(),
      dateOverride: z
        .string()
        .nullable()
        .optional()
        .refine(
          (v) => v == null || v === '' || !Number.isNaN(new Date(v).getTime()),
          { message: 'dateOverride must be a parseable date string' },
        ),
      attachmentHeading: z.string().nullable().optional(),
      // question and answer are absent on the live API but kept optional here
      // so the rawText transform can safely concatenate them when present.
      question: z.string().nullable().optional(),
      answer: z.string().nullable().optional(),
      createdAt: z.string().optional(),
      updatedAt: z.string().optional(),
      publishedAt: z.string().optional(),
    })
    .transform((data) => ({
      ...data,
      rawText: rawText(
        `${data.question ?? ''} ${data.answer ?? ''} ${data.body ?? ''}`,
      ),
      path: ensureTrailingSlash(`/faqs/${data.slug}`),
    })),
});

// ─── 4. resources ──────────────────────────────────────────────────────
//
// GraphQL field is `resources` — matches the local collection name.
//
// Live introspection of `Resource` type (2026-05-08) confirmed these fields
// exist: title, slug, summary, body, searchMeta, ranking (Int), cover
// (UploadFileEntityResponse — relational, omitted), showTableOfContents,
// hideFromSitemap, hideFromSearch, createdAt, updatedAt, publishedAt.
//
// The following plan-listed fields do NOT exist on `Resource` and are omitted:
//   - mediaTitle  (GRAPHQL_VALIDATION_FAILED: "Cannot query field")
//   - media       (relational field not present on this type)
//   - attachments (GRAPHQL_VALIDATION_FAILED: "Cannot query field")

const resources = defineCollection({
  loader: strapiLoader(
    'resources',
    `query {
      resources {
        data {
          id
          attributes {
            title slug summary body searchMeta
            hideFromSitemap hideFromSearch showTableOfContents
            createdAt updatedAt publishedAt
          }
        }
      }
    }`,
  ),
  schema: z
    .object({
      id: z.string(),
      title: z.string(),
      slug: z.string(),
      summary: z.string().nullable().optional(),
      body: z.string().nullable().optional(),
      searchMeta: z.string().nullable().optional(),
      hideFromSitemap: z.boolean().optional(),
      hideFromSearch: z.boolean().optional(),
      showTableOfContents: z.boolean().optional(),
      createdAt: z.string().optional(),
      updatedAt: z.string().optional(),
      publishedAt: z.string().optional(),
    })
    .transform((data) => ({
      ...data,
      rawText: rawText(data.body ?? ''),
      path: ensureTrailingSlash(`/resources/${data.slug}`),
    })),
});

export const collections = {
  pages,
  news,
  faqs,
  resources,
};
