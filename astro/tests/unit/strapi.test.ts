import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { absoluteMediaURL, rawText } from '~/lib/strapi';

describe('absoluteMediaURL', () => {
  it('returns undefined for undefined input', () => {
    expect(absoluteMediaURL(undefined)).toBeUndefined();
  });

  it('returns absolute URLs unchanged', () => {
    expect(absoluteMediaURL('https://r3.icjia-api.cloud/uploads/foo.jpg'))
      .toBe('https://r3.icjia-api.cloud/uploads/foo.jpg');
  });

  it('returns http URLs unchanged', () => {
    expect(absoluteMediaURL('http://example.com/foo.jpg'))
      .toBe('http://example.com/foo.jpg');
  });

  it('prepends Strapi origin to relative URLs', () => {
    expect(absoluteMediaURL('/uploads/foo.jpg'))
      .toBe('https://r3.icjia-api.cloud/uploads/foo.jpg');
  });

  it('handles relative URLs without leading slash', () => {
    expect(absoluteMediaURL('uploads/foo.jpg'))
      .toBe('https://r3.icjia-api.cloud/uploads/foo.jpg');
  });

  it('upgrades protocol-relative URLs to https://', () => {
    expect(absoluteMediaURL('//cdn.example.com/foo.jpg'))
      .toBe('https://cdn.example.com/foo.jpg');
  });
});

describe('rawText', () => {
  it('returns empty string for null/undefined', () => {
    expect(rawText(null)).toBe('');
    expect(rawText(undefined)).toBe('');
  });

  it('strips Markdown headings', () => {
    expect(rawText('# Title\n\nText.')).toBe('Title Text.');
  });

  it('strips bold and italic', () => {
    expect(rawText('**Bold** and _italic_ and *also* and __strong__.'))
      .toBe('Bold and italic and also and strong.');
  });

  it('strips inline code', () => {
    expect(rawText('Run `yarn build` first.')).toBe('Run yarn build first.');
  });

  it('strips Markdown links to their text', () => {
    expect(rawText('See [the docs](https://example.com).'))
      .toBe('See the docs.');
  });

  it('strips Markdown images', () => {
    expect(rawText('Look ![alt](image.png) at this'))
      .toBe('Look at this');
  });

  it('strips bullet markers', () => {
    expect(rawText('- one\n- two\n- three')).toBe('one two three');
  });

  it('strips HTML tags', () => {
    expect(rawText('<p>Hello <strong>world</strong></p>'))
      .toBe('Hello world');
  });
});

describe('strapiQuery (v4 — R3 Strapi shape)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });
  afterEach(() => vi.unstubAllGlobals());

  it('throws on non-200 response', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response('boom', { status: 500, statusText: 'Internal Server Error' }),
    );
    const { strapiQuery } = await import('~/lib/strapi');
    await expect(strapiQuery('pages', 'query{}')).rejects.toThrow(/500/);
  });

  it('throws when GraphQL response contains errors[]', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(JSON.stringify({ errors: [{ message: 'bad query' }] }), {
        status: 200, headers: { 'content-type': 'application/json' },
      }),
    );
    const { strapiQuery } = await import('~/lib/strapi');
    await expect(strapiQuery('pages', 'query{}')).rejects.toThrow(/bad query/);
  });

  it('throws when response missing the named collection', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(JSON.stringify({ data: { somethingElse: { data: [] } } }), {
        status: 200, headers: { 'content-type': 'application/json' },
      }),
    );
    const { strapiQuery } = await import('~/lib/strapi');
    await expect(strapiQuery('pages', 'query{}')).rejects.toThrow(/pages/);
  });

  it('returns the rows array when response is healthy (v4 shape: data[name].data)', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(
        JSON.stringify({ data: { pages: { data: [{ id: '1', attributes: { title: 'X' } }] } } }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ),
    );
    const { strapiQuery } = await import('~/lib/strapi');
    const rows = await strapiQuery<{ id: string }>('pages', 'query{}');
    expect(rows).toHaveLength(1);
    expect(rows[0].id).toBe('1');
  });
});

describe('hubQuery (v3 — Hub Strapi shape)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });
  afterEach(() => vi.unstubAllGlobals());

  it('throws on non-200 response', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response('boom', { status: 503, statusText: 'Service Unavailable' }),
    );
    const { hubQuery } = await import('~/lib/strapi');
    await expect(hubQuery('articles', 'query{}')).rejects.toThrow(/503/);
  });

  it('throws on errors[] in response', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(JSON.stringify({ errors: [{ message: 'invalid filter' }] }), {
        status: 200, headers: { 'content-type': 'application/json' },
      }),
    );
    const { hubQuery } = await import('~/lib/strapi');
    await expect(hubQuery('articles', 'query{}')).rejects.toThrow(/invalid filter/);
  });

  it('throws when response missing the named collection', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(JSON.stringify({ data: { somethingElse: [] } }), {
        status: 200, headers: { 'content-type': 'application/json' },
      }),
    );
    const { hubQuery } = await import('~/lib/strapi');
    await expect(hubQuery('articles', 'query{}')).rejects.toThrow(/articles/);
  });

  it('returns the rows array when response is healthy (v3 shape: flat array under data[name])', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(
        JSON.stringify({ data: { articles: [{ _id: 'abc123', title: 'X' }] } }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ),
    );
    const { hubQuery } = await import('~/lib/strapi');
    const rows = await hubQuery<{ _id: string }>('articles', 'query{}');
    expect(rows).toHaveLength(1);
    expect(rows[0]._id).toBe('abc123');
  });
});
