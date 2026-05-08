import { describe, it, expect } from 'vitest';
import { collections } from '~/content.config';

describe('collection: news', () => {
  it('is registered', () => {
    expect(collections.news).toBeDefined();
  });

  it('schema accepts a representative valid row', () => {
    const valid = {
      id: '1',
      title: 'Annual report',
      slug: '2026-annual-report',
      summary: 'Summary',
      body: 'Body markdown',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
      publishedAt: '2026-01-01T00:00:00Z',
    };
    const result = collections.news.schema?.safeParse(valid);
    expect(result?.success).toBe(true);
  });

  it('schema rejects rows missing slug', () => {
    const invalid = { id: '1', title: 'X' };
    const result = collections.news.schema?.safeParse(invalid);
    expect(result?.success).toBe(false);
  });

  it('schema rejects rows missing title', () => {
    const invalid = { id: '1', slug: 'x' };
    const result = collections.news.schema?.safeParse(invalid);
    expect(result?.success).toBe(false);
  });

  it('transform computes path: /news/<slug>/', () => {
    const result = collections.news.schema?.safeParse({
      id: '1',
      title: 'X',
      slug: 'r3-2022-annual-report',
    }) as { success: true; data: { path: string } };
    expect(result.success).toBe(true);
    expect(result.data.path).toBe('/news/r3-2022-annual-report/');
  });

  it('transform falls back to publishedAt for postDate when dateOverride absent', () => {
    const result = collections.news.schema?.safeParse({
      id: '1',
      title: 'X',
      slug: 'foo',
      publishedAt: '2026-03-09T00:00:00Z',
    }) as { success: true; data: { postDate: string } };
    expect(result.success).toBe(true);
    expect(result.data.postDate).toBe('2026-03-09T00:00:00.000Z');
  });

  it('transform prefers dateOverride over publishedAt for postDate', () => {
    const result = collections.news.schema?.safeParse({
      id: '1',
      title: 'X',
      slug: 'foo',
      dateOverride: '2026-06-01T00:00:00Z',
      publishedAt: '2026-03-09T00:00:00Z',
    }) as { success: true; data: { postDate: string } };
    expect(result.success).toBe(true);
    expect(result.data.postDate).toBe('2026-06-01T00:00:00.000Z');
  });

  it('transform computes rawText from body', () => {
    const result = collections.news.schema?.safeParse({
      id: '1',
      title: 'X',
      slug: 'foo',
      body: '## Hello\n\n**bold**.',
    }) as { success: true; data: { rawText: string } };
    expect(result.success).toBe(true);
    expect(result.data.rawText).toBe('Hello bold.');
  });

  it('transform handles missing body', () => {
    const result = collections.news.schema?.safeParse({
      id: '1',
      title: 'X',
      slug: 'foo',
    }) as { success: true; data: { rawText: string } };
    expect(result.success).toBe(true);
    expect(result.data.rawText).toBe('');
  });

  it('preserves hideFromSearch through the transform', () => {
    const result = collections.news.schema?.safeParse({
      id: '1',
      title: 'X',
      slug: 'foo',
      hideFromSearch: true,
    }) as { success: true; data: { hideFromSearch?: boolean } };
    expect(result.success).toBe(true);
    expect(result.data.hideFromSearch).toBe(true);
  });

  it('schema rejects unparseable dateOverride strings', () => {
    const result = collections.news.schema?.safeParse({
      id: '1',
      title: 'X',
      slug: 'foo',
      dateOverride: 'not-a-date',
    });
    expect(result?.success).toBe(false);
  });

  it('transform falls back to createdAt when both dateOverride and publishedAt absent', () => {
    const result = collections.news.schema?.safeParse({
      id: '1',
      title: 'X',
      slug: 'foo',
      createdAt: '2025-01-01T00:00:00Z',
    }) as { success: true; data: { postDate: string } };
    expect(result.success).toBe(true);
    expect(result.data.postDate).toBe('2025-01-01T00:00:00.000Z');
  });
});
