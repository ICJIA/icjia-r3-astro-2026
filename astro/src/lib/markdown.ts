// astro/src/lib/markdown.ts
//
// Build-time Markdown → HTML for Strapi body fields. Mirrors the markdown-it
// config from the old Nuxt build (anchorLinks + attrs), then runs DOMPurify
// to enforce the same iframe whitelist the Nuxt site enforced (March 2026
// red-team mitigation: only ArcGIS hosts allowed in iframe src).

// Note: with `html: true`, markdown-it passes raw HTML through verbatim but
// does NOT process Markdown inside HTML block elements. `<div>**bold**</div>`
// renders literally — the `**` is not converted. Strapi content authors
// should pick one syntax per region, not mix.

import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import attrs from 'markdown-it-attrs';
import createDOMPurify from 'dompurify';
import { Window } from 'happy-dom';

const md = new MarkdownIt({ html: true, linkify: true, typographer: false })
  .use(attrs)
  .use(anchor, { permalink: false });

const window = new Window();
// happy-dom 20.x's Window type doesn't structurally satisfy DOMPurify's
// `WindowLike`. Double cast is the canonical workaround; reassess when
// happy-dom's types converge.
const DOMPurify = createDOMPurify(window as unknown as Window & typeof globalThis);

// Path anchor `\/` is intentional — bare `https://arcgis.com` (no path) is
// rejected because a valid embed URL always has a path component.
const ARCGIS_PATTERN = /^https:\/\/(?:[a-z0-9-]+\.)?arcgis\.com\//i;
const ARCGIS_STORYMAPS_PATTERN = /^https:\/\/storymaps\.arcgis\.com\//i;

DOMPurify.addHook('uponSanitizeAttribute', (_node, data) => {
  if (data.attrName === 'src' && _node.nodeName === 'IFRAME') {
    const src = data.attrValue ?? '';
    if (!ARCGIS_PATTERN.test(src) && !ARCGIS_STORYMAPS_PATTERN.test(src)) {
      data.keepAttr = false;
    }
  }
});

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.nodeName === 'IFRAME' && !(node as Element).getAttribute('src')) {
    node.parentNode?.removeChild(node);
  }
});

// The HTML iframe width/height attributes accept a non-negative integer only,
// not a CSS length. Strapi-authored markup carries `height="1500px"`, which
// browsers don't reliably honor as a layout reservation pre-CSS — causing
// CLS ~0.20 on mobile cold loads. Strip the unit so the attribute parses as
// an integer and the iframe box is reserved at parse time.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.nodeName !== 'IFRAME') return;
  const el = node as Element;
  for (const attr of ['width', 'height']) {
    const v = el.getAttribute(attr);
    if (v && /^\d+px$/i.test(v)) el.setAttribute(attr, v.replace(/px$/i, ''));
  }
});

// Normalize internal route links to a trailing slash so Strapi-body content
// honours the site's `trailingSlash: 'always'` policy — a non-slash internal
// link 404s on `astro dev` and forces a 301 hop in production. Only clean
// route paths are touched; `/`, `//host` (protocol-relative), query strings,
// fragments, file links (e.g. `/x.pdf`), and already-slashed paths are left
// untouched.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.nodeName !== 'A') return;
  const el = node as Element;
  const href = el.getAttribute('href');
  if (href && /^\/[a-z0-9][a-z0-9/_-]*$/i.test(href) && !href.endsWith('/')) {
    el.setAttribute('href', `${href}/`);
  }
});

/** Convert Markdown to safe HTML. Strapi-body content goes through here.
 * Iframes are restricted to ArcGIS hosts (storymaps.arcgis.com or any
 * subdomain of arcgis.com). All other iframes are stripped. */
export function renderMarkdown(input: string): string {
  if (!input) return '';
  const rendered = md.render(input);
  return DOMPurify.sanitize(rendered, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'loading', 'title'],
  });
}
