// astro/src/lib/markdown.ts
//
// Build-time Markdown → HTML for Strapi body fields. Mirrors the markdown-it
// config from the old Nuxt build (anchorLinks + attrs), then runs DOMPurify
// to enforce the same iframe whitelist the Nuxt site enforced (March 2026
// red-team mitigation: only ArcGIS hosts allowed in iframe src).

import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import attrs from 'markdown-it-attrs';
import createDOMPurify from 'dompurify';
import { Window } from 'happy-dom';

const md = new MarkdownIt({ html: true, linkify: true, typographer: false })
  .use(attrs)
  .use(anchor, { permalink: false });

const window = new Window();
const DOMPurify = createDOMPurify(window as unknown as Window & typeof globalThis);

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
