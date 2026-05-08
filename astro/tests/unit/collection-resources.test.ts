import { describe, it, expect } from 'vitest';
import { collections } from '~/content.config';

describe('collection: resources', () => {
  it('is registered', () => {
    expect(collections.resources).toBeDefined();
  });

  it('schema accepts a representative valid row', () => {
    const valid = {
      id: '1',
      title: 'Spanish materials',
      slug: 'spanish-language-materials',
      summary: 'Translated guides',
      body: 'Body markdown',
    };
    const result = collections.resources.schema?.safeParse(valid);
    expect(result?.success).toBe(true);
  });

  it('schema rejects rows missing slug', () => {
    const invalid = { id: '1', title: 'X' };
    const result = collections.resources.schema?.safeParse(invalid);
    expect(result?.success).toBe(false);
  });

  it('transform computes path: /resources/<slug>/', () => {
    const result = collections.resources.schema?.safeParse({
      id: '1',
      title: 'Spanish materials',
      slug: 'spanish-language-materials',
    }) as { success: true; data: { path: string } };
    expect(result.success).toBe(true);
    expect(result.data.path).toBe('/resources/spanish-language-materials/');
  });

  it('transform computes rawText from body', () => {
    const result = collections.resources.schema?.safeParse({
      id: '1',
      title: 'X',
      slug: 'x',
      body: '## Hello\n\n**bold**.',
    }) as { success: true; data: { rawText: string } };
    expect(result.success).toBe(true);
    expect(result.data.rawText).toBe('Hello bold.');
  });

  it('transform handles missing body', () => {
    const result = collections.resources.schema?.safeParse({
      id: '1',
      title: 'X',
      slug: 'x',
    }) as { success: true; data: { rawText: string } };
    expect(result.success).toBe(true);
    expect(result.data.rawText).toBe('');
  });

  it('schema rejects rows missing title', () => {
    const invalid = { id: '1', slug: 'x' };
    const result = collections.resources.schema?.safeParse(invalid);
    expect(result?.success).toBe(false);
  });
});
