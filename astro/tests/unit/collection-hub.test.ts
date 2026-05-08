import { describe, it, expect } from 'vitest';
import { collections } from '~/content.config';

describe('collection: hubArticles', () => {
  it('is registered', () => {
    expect(collections.hubArticles).toBeDefined();
  });

  it('schema accepts a representative valid row', () => {
    const valid = {
      _id: '5da0c0dd3bb01c36d66f6891',
      title: 'R3 Cohort One Scale and Reach',
      slug: 'r3-cohort-one-scale-and-reach',
      abstract: 'This report details findings...',
      date: '2026-03-20T00:00:00Z',
      tags: ['r3', 'evaluation'],
      authors: [{ title: 'Alice Example', description: 'Senior Research' }],
    };
    const result = collections.hubArticles.schema?.safeParse(valid);
    expect(result?.success).toBe(true);
  });

  it('schema rejects rows missing slug', () => {
    const invalid = { _id: 'x', title: 'X' };
    const result = collections.hubArticles.schema?.safeParse(invalid);
    expect(result?.success).toBe(false);
  });

  it('schema rejects rows missing title', () => {
    const invalid = { _id: 'x', slug: 'x' };
    const result = collections.hubArticles.schema?.safeParse(invalid);
    expect(result?.success).toBe(false);
  });

  it('transform computes path: /research/<slug>/', () => {
    const result = collections.hubArticles.schema?.safeParse({
      _id: 'x',
      title: 'X',
      slug: 'foo',
    }) as { success: true; data: { path: string } };
    expect(result.success).toBe(true);
    expect(result.data.path).toBe('/research/foo/');
  });

  it('transform computes homePage true when tags include r3', () => {
    const result = collections.hubArticles.schema?.safeParse({
      _id: 'x',
      title: 'X',
      slug: 'x',
      tags: ['evaluation', 'r3'],
    }) as { success: true; data: { homePage: boolean } };
    expect(result.success).toBe(true);
    expect(result.data.homePage).toBe(true);
  });

  it('transform computes homePage false when tags lack r3', () => {
    const result = collections.hubArticles.schema?.safeParse({
      _id: 'x',
      title: 'X',
      slug: 'x',
      tags: ['evaluation'],
    }) as { success: true; data: { homePage: boolean } };
    expect(result.success).toBe(true);
    expect(result.data.homePage).toBe(false);
  });

  it('transform handles missing tags by defaulting homePage to false', () => {
    const result = collections.hubArticles.schema?.safeParse({
      _id: 'x',
      title: 'X',
      slug: 'x',
    }) as { success: true; data: { homePage: boolean } };
    expect(result.success).toBe(true);
    expect(result.data.homePage).toBe(false);
  });

  it('transform computes rawText from title + abstract', () => {
    const result = collections.hubArticles.schema?.safeParse({
      _id: 'x',
      title: 'My Article',
      slug: 'x',
      abstract: 'A very interesting **abstract** here.',
    }) as { success: true; data: { rawText: string } };
    expect(result.success).toBe(true);
    expect(result.data.rawText).toContain('My Article');
    expect(result.data.rawText).toContain('abstract');
  });
});
