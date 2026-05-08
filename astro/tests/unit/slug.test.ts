import { describe, it, expect } from 'vitest';
import { ensureTrailingSlash, joinSlug } from '~/lib/slug';

describe('ensureTrailingSlash', () => {
  it('appends slash when missing', () => {
    expect(ensureTrailingSlash('/foo')).toBe('/foo/');
  });

  it('leaves slash alone when present', () => {
    expect(ensureTrailingSlash('/foo/')).toBe('/foo/');
  });

  it('root stays as /', () => {
    expect(ensureTrailingSlash('/')).toBe('/');
  });

  it('handles nested paths', () => {
    expect(ensureTrailingSlash('/news/article-title')).toBe('/news/article-title/');
  });

  it('handles empty string by returning /', () => {
    expect(ensureTrailingSlash('')).toBe('/');
  });
});

describe('joinSlug', () => {
  it('joins parts with single slashes and trailing slash', () => {
    expect(joinSlug('news', 'my-post')).toBe('/news/my-post/');
  });

  it('handles preceding slashes in inputs', () => {
    expect(joinSlug('/news/', '/my-post/')).toBe('/news/my-post/');
  });

  it('handles trailing slashes in inputs', () => {
    expect(joinSlug('news/', 'my-post/')).toBe('/news/my-post/');
  });

  it('skips empty parts', () => {
    expect(joinSlug('news', '', 'my-post')).toBe('/news/my-post/');
  });

  it('returns / for no parts', () => {
    expect(joinSlug()).toBe('/');
  });

  it('handles a single part', () => {
    expect(joinSlug('contact')).toBe('/contact/');
  });

  it('handles three parts', () => {
    expect(joinSlug('faqs', 'category', 'eligibility')).toBe('/faqs/category/eligibility/');
  });

  it('skips whitespace-only parts', () => {
    expect(joinSlug('news', '   ', 'post')).toBe('/news/post/');
  });
});
