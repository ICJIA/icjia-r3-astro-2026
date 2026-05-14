import { describe, it, expect } from 'vitest';
import { renderMarkdown } from '~/lib/markdown';

describe('renderMarkdown', () => {
  it('renders headings to <h1>', () => {
    const html = renderMarkdown('# Hello');
    expect(html).toContain('<h1');
    expect(html).toContain('Hello');
  });

  it('renders heading anchors via markdown-it-anchor', () => {
    const html = renderMarkdown('## Section Title');
    expect(html).toMatch(/id="section-title"/);
  });

  it('renders paragraphs', () => {
    const html = renderMarkdown('Hello world.');
    expect(html).toContain('<p>Hello world.</p>');
  });

  it('renders links', () => {
    const html = renderMarkdown('[link](https://example.com)');
    expect(html).toContain('href="https://example.com"');
  });

  it('adds a trailing slash to internal route links (trailingSlash: always)', () => {
    expect(renderMarkdown('[x](/eligibility)')).toContain('href="/eligibility/"');
    expect(
      renderMarkdown('[x](/resources/spanish-language-materials)'),
    ).toContain('href="/resources/spanish-language-materials/"');
  });

  it('leaves slashed / root / external / file / anchor links alone', () => {
    expect(renderMarkdown('[x](/eligibility/)')).toContain('href="/eligibility/"');
    expect(renderMarkdown('[x](/eligibility/)')).not.toContain('href="/eligibility//"');
    expect(renderMarkdown('[home](/)')).toContain('href="/"');
    expect(renderMarkdown('[ext](https://example.com)')).toContain(
      'href="https://example.com"',
    );
    expect(renderMarkdown('[pdf](/docs/file.pdf)')).toContain('href="/docs/file.pdf"');
  });

  it('renders bold and italic', () => {
    const html = renderMarkdown('**bold** and _italic_');
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('<em>italic</em>');
  });

  it('renders fenced code blocks', () => {
    const html = renderMarkdown('```\nyarn build\n```');
    expect(html).toContain('<pre>');
    expect(html).toContain('yarn build');
  });

  it('strips disallowed inline scripts via DOMPurify', () => {
    const html = renderMarkdown('Hi <script>alert(1)</script> there');
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('alert(1)');
    expect(html).toContain('Hi');
    expect(html).toContain('there');
  });

  it('strips javascript: URLs in href', () => {
    const html = renderMarkdown('[click](javascript:alert(1))');
    expect(html).not.toMatch(/href="javascript:/);
  });

  it('preserves whitelisted ArcGIS storymaps iframes', () => {
    const html = renderMarkdown(
      '<iframe src="https://storymaps.arcgis.com/stories/abc"></iframe>',
    );
    expect(html).toContain('storymaps.arcgis.com');
    expect(html).toContain('<iframe');
  });

  it('preserves whitelisted general arcgis.com iframes', () => {
    const html = renderMarkdown(
      '<iframe src="https://arcgis.com/apps/webappviewer/index.html"></iframe>',
    );
    expect(html).toContain('arcgis.com');
    expect(html).toContain('<iframe');
  });

  it('preserves arcgis subdomain iframes', () => {
    const html = renderMarkdown(
      '<iframe src="https://services.arcgis.com/foo"></iframe>',
    );
    expect(html).toContain('services.arcgis.com');
  });

  it('strips iframes pointing at non-whitelisted hosts', () => {
    const html = renderMarkdown('<iframe src="https://evil.example.com"></iframe>');
    expect(html).not.toContain('evil.example.com');
    expect(html).not.toContain('<iframe');
  });

  it('strips iframes with no src attribute', () => {
    const html = renderMarkdown('<iframe></iframe>');
    expect(html).not.toContain('<iframe');
  });

  it('preserves common iframe attributes (allow, allowfullscreen, loading, title)', () => {
    const html = renderMarkdown(
      '<iframe src="https://storymaps.arcgis.com/foo" allow="geolocation" allowfullscreen loading="lazy" title="Map"></iframe>',
    );
    expect(html).toContain('allow="geolocation"');
    expect(html).toContain('allowfullscreen');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('title="Map"');
  });

  it('applies attrs plugin — curly-brace class syntax', () => {
    const html = renderMarkdown('## Section {.highlight}');
    expect(html).toMatch(/class="highlight"/);
  });

  it('handles empty input', () => {
    expect(renderMarkdown('')).toBe('');
  });
});
