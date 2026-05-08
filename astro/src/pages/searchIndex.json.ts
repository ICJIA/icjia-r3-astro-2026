// astro/src/pages/searchIndex.json.ts
//
// Build-time JSON endpoint at /searchIndex.json. Walks all 5 content
// collections and emits a Fuse-friendly index. The /search/ page fetches
// this and feeds it to fuse.js client-side.

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

interface IndexedRow {
  type: 'pages' | 'news' | 'faqs' | 'resources' | 'hubArticles';
  id: string;
  title: string;
  path: string;
  rawText: string;
  postDate?: string;
}

export const GET: APIRoute = async () => {
  const [pages, news, faqs, resources, hub] = await Promise.all([
    getCollection('pages'),
    getCollection('news'),
    getCollection('faqs'),
    getCollection('resources'),
    getCollection('hubArticles'),
  ]);

  const rows: IndexedRow[] = [
    ...pages.map((e) => ({
      type: 'pages' as const,
      id: e.id,
      title: e.data.title,
      path: e.data.path,
      rawText: e.data.rawText ?? '',
    })),
    ...news.map((e) => ({
      type: 'news' as const,
      id: e.id,
      title: e.data.title,
      path: e.data.path,
      rawText: e.data.rawText ?? '',
      postDate: e.data.postDate,
    })),
    ...faqs.map((e) => ({
      type: 'faqs' as const,
      id: e.id,
      title: e.data.title,
      path: e.data.path,
      rawText: e.data.rawText ?? '',
    })),
    ...resources.map((e) => ({
      type: 'resources' as const,
      id: e.id,
      title: e.data.title,
      path: e.data.path,
      rawText: e.data.rawText ?? '',
    })),
    ...hub.map((e) => ({
      type: 'hubArticles' as const,
      id: e.id,
      title: e.data.title,
      path: e.data.path,
      rawText: e.data.rawText ?? '',
    })),
  ];

  return new Response(JSON.stringify(rows), {
    headers: { 'content-type': 'application/json' },
  });
};
