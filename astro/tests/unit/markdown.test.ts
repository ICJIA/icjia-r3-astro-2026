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

  it('strips invalid CSS units from iframe height/width attributes', () => {
    // The HTML width/height attributes accept a non-negative integer only,
    // not a CSS length. Strapi-authored markup carries `height="1500px"`,
    // which browsers don't reliably honor as a layout reservation pre-CSS —
    // causing CLS ~0.20 on mobile cold loads. The sanitizer strips the unit
    // so the attribute parses as an integer and the box is reserved at
    // parse time.
    const html = renderMarkdown(
      '<iframe src="https://storymaps.arcgis.com/foo" width="100%" height="1500px"></iframe>',
    );
    expect(html).toContain('height="1500"');
    expect(html).not.toContain('height="1500px"');
    // Percentage widths are valid on the HTML attribute and must survive untouched.
    expect(html).toContain('width="100%"');
  });

  it('leaves bare-integer iframe dimensions untouched', () => {
    const html = renderMarkdown(
      '<iframe src="https://storymaps.arcgis.com/foo" height="800"></iframe>',
    );
    expect(html).toContain('height="800"');
  });

  it('promotes iframe dimensions to inline style so CSS reserves the box pre-load', () => {
    // The HTML attribute alone doesn't reliably reserve a CSS box; the iframe
    // can still reflow when its content loads, producing CLS. Inline style is
    // authoritative — browsers honor it at parse time, before the iframe's
    // cross-origin content arrives.
    const html = renderMarkdown(
      '<iframe src="https://storymaps.arcgis.com/foo" width="100%" height="1500px"></iframe>',
    );
    expect(html).toMatch(/<iframe[^>]*style="[^"]*height:\s*1500px[^"]*"/);
    expect(html).toMatch(/<iframe[^>]*style="[^"]*width:\s*100%[^"]*"/);
  });

  it('falls back to aspect-ratio when iframe has no explicit pixel height', () => {
    const html = renderMarkdown(
      '<iframe src="https://storymaps.arcgis.com/foo" width="100%"></iframe>',
    );
    expect(html).toMatch(/<iframe[^>]*style="[^"]*aspect-ratio:\s*4\s*\/\s*3[^"]*"/);
  });

  it('applies attrs plugin — curly-brace class syntax', () => {
    const html = renderMarkdown('## Section {.highlight}');
    expect(html).toMatch(/class="highlight"/);
  });

  // Body-image perf attributes — Strapi authors don't set them; the sanitizer
  // injects sensible defaults so long body pages don't eager-fetch every
  // below-the-fold image. Explicit author values must win.
  it('adds loading="lazy" to body <img> without an explicit loading value', () => {
    const html = renderMarkdown('![alt](https://example.com/x.jpg)');
    expect(html).toMatch(/<img[^>]*loading="lazy"/);
  });

  it('adds decoding="async" to body <img> without an explicit decoding value', () => {
    const html = renderMarkdown('![alt](https://example.com/x.jpg)');
    expect(html).toMatch(/<img[^>]*decoding="async"/);
  });

  it('preserves explicit loading="eager" on body <img> (LCP override)', () => {
    const html = renderMarkdown(
      '<img src="https://example.com/lcp.jpg" loading="eager" alt="">',
    );
    expect(html).toContain('loading="eager"');
    expect(html).not.toContain('loading="lazy"');
  });

  it('preserves explicit decoding value on body <img>', () => {
    const html = renderMarkdown(
      '<img src="https://example.com/x.jpg" decoding="sync" alt="">',
    );
    expect(html).toContain('decoding="sync"');
    expect(html).not.toContain('decoding="async"');
  });

  // CMS image rewrite — when a body <img> points at a Strapi URL that's in
  // the build-time manifest (populated by scripts/fetch-cms-images.mjs),
  // the sanitizer swaps src/srcset/intrinsic-dims to the optimized variants.
  // Unknown URLs fall through unchanged so a brand-new image added to
  // Strapi after the last prebuild still renders, just without WebP.
  it('leaves the src untouched for a URL not in the cms-image manifest', () => {
    const html = renderMarkdown(
      '<img src="https://r3.icjia-api.cloud/uploads/never-seen-this-one.png" alt="">',
    );
    expect(html).toContain('src="https://r3.icjia-api.cloud/uploads/never-seen-this-one.png"');
    expect(html).not.toContain('srcset=');
    expect(html).not.toContain('/_cms-img/');
  });

  // When the manifest IS hit, computed height/width must honor the author's
  // explicit display dimension instead of defaulting to the source intrinsic.
  // Bug pattern this guards: author sets width="750" on a 1188×1188 square
  // source; naive code stamps height="1188" (the source intrinsic) and the
  // browser draws a 750×1188 letterbox. Correct behavior: compute height
  // from the manifest aspect (1188/1188 = 1) × 750 = 750.
  it('computes proportional height when author overrode width on a manifest-hit image', async () => {
    const manifest = (await import('~/lib/cmsImageManifest.json')).default as
      Record<string, { width: number; height: number }>;
    const sampleUrl = Object.keys(manifest)[0];
    if (!sampleUrl) return; // empty manifest → no-op, same fallback as renderer
    const meta = manifest[sampleUrl];
    const authorWidth = Math.max(1, Math.round(meta.width / 2));
    const expectedHeight = Math.round((meta.height / meta.width) * authorWidth);
    const html = renderMarkdown(
      `<img src="${sampleUrl}" alt="x" width="${authorWidth}">`,
    );
    expect(html).toContain(`width="${authorWidth}"`);
    expect(html).toContain(`height="${expectedHeight}"`);
    expect(html).toContain('srcset=');
    expect(html).toContain('/_cms-img/');
  });

  it('handles empty input', () => {
    expect(renderMarkdown('')).toBe('');
  });
});
