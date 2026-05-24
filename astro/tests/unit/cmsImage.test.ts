import { describe, it, expect } from 'vitest';
import { getCmsImage } from '~/lib/cmsImage';
import manifest from '~/lib/cmsImageManifest.json';

describe('getCmsImage', () => {
  it('returns null for a URL not in the manifest', () => {
    expect(getCmsImage('https://example.com/missing.png')).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(getCmsImage('')).toBeNull();
  });

  // Shape contract: when the manifest does have an entry, the helper
  // returns the four fields the markdown rewrite hook expects. We sniff
  // whatever URL is currently first in the manifest so this test stays
  // green as the body-image set grows. If the manifest is empty (Strapi
  // unreachable at prebuild), this is a no-op — the same fallback the
  // renderer takes.
  it('returns entries with src, srcset, width, height when present', () => {
    const firstKey = Object.keys(manifest as Record<string, unknown>)[0];
    if (!firstKey) return;
    const entry = getCmsImage(firstKey);
    expect(entry).not.toBeNull();
    expect(typeof entry?.src).toBe('string');
    expect(typeof entry?.srcset).toBe('string');
    expect(typeof entry?.width).toBe('number');
    expect(typeof entry?.height).toBe('number');
    expect(entry?.srcset).toMatch(/\s\d+w/);
  });
});
