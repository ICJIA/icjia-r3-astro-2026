import { describe, it, expect } from 'vitest';
import { collections } from '~/content.config';

describe('collection: pages', () => {
  it('is registered', () => {
    expect(collections.pages).toBeDefined();
  });

  it('schema accepts a representative valid row', () => {
    const valid = {
      id: '1',
      title: 'Funding',
      slug: 'funding',
      section: 'root',
      summary: 'How to apply',
      body: '# Heading\n\nText.',
      hideFromSitemap: false,
      showTableOfContents: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
      publishedAt: '2024-01-01T00:00:00Z',
    };
    const result = collections.pages.schema?.safeParse(valid);
    expect(result?.success).toBe(true);
  });

  it('schema rejects rows missing slug', () => {
    const invalid = { id: '1', title: 'X' };
    const result = collections.pages.schema?.safeParse(invalid);
    expect(result?.success).toBe(false);
  });

  it('schema rejects rows missing title', () => {
    const invalid = { id: '1', slug: 'x' };
    const result = collections.pages.schema?.safeParse(invalid);
    expect(result?.success).toBe(false);
  });

  it('transform computes path: /<slug>/ for root section', () => {
    const result = collections.pages.schema?.safeParse({
      id: '1',
      title: 'Privacy',
      slug: 'privacy',
      section: 'root',
    }) as { success: true; data: { path: string } };
    expect(result.success).toBe(true);
    expect(result.data.path).toBe('/privacy/');
  });

  it('transform computes / for slug index', () => {
    const result = collections.pages.schema?.safeParse({
      id: '1',
      title: 'Home',
      slug: 'index',
      section: 'root',
    }) as { success: true; data: { path: string } };
    expect(result.success).toBe(true);
    expect(result.data.path).toBe('/');
  });

  it('transform handles non-root section by including it in path', () => {
    const result = collections.pages.schema?.safeParse({
      id: '1',
      title: 'Sub',
      slug: 'sub',
      section: 'about',
    }) as { success: true; data: { path: string } };
    expect(result.success).toBe(true);
    expect(result.data.path).toBe('/about/sub/');
  });

  it('transform computes rawText from body', () => {
    const result = collections.pages.schema?.safeParse({
      id: '1',
      title: 'X',
      slug: 'x',
      body: '# Hello\n\n**bold** text.',
    }) as { success: true; data: { rawText: string } };
    expect(result.success).toBe(true);
    expect(result.data.rawText).toBe('Hello bold text.');
  });

  it('transform handles missing body without throwing', () => {
    const result = collections.pages.schema?.safeParse({
      id: '1',
      title: 'X',
      slug: 'x',
    }) as { success: true; data: { rawText: string } };
    expect(result.success).toBe(true);
    expect(result.data.rawText).toBe('');
  });

  it('transform handles null section by falling back to /<slug>/', () => {
    const result = collections.pages.schema?.safeParse({
      id: '1',
      title: 'Terms',
      slug: 'terms',
      section: null,
    }) as { success: true; data: { path: string } };
    expect(result.success).toBe(true);
    expect(result.data.path).toBe('/terms/');
  });

  it('transform handles missing section by falling back to /<slug>/', () => {
    const result = collections.pages.schema?.safeParse({
      id: '1',
      title: 'Terms',
      slug: 'terms',
    }) as { success: true; data: { path: string } };
    expect(result.success).toBe(true);
    expect(result.data.path).toBe('/terms/');
  });
});
