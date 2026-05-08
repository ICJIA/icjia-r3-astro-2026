import { describe, it, expect } from 'vitest';
import { collections } from '~/content.config';

describe('collection: faqs', () => {
  it('is registered', () => {
    expect(collections.faqs).toBeDefined();
  });

  it('schema accepts a representative valid row', () => {
    const valid = {
      id: '1',
      title: 'Eligibility',
      slug: 'eligibility',
    };
    const result = collections.faqs.schema?.safeParse(valid);
    expect(result?.success).toBe(true);
  });

  it('schema rejects rows missing slug', () => {
    const invalid = { id: '1', title: 'X' };
    const result = collections.faqs.schema?.safeParse(invalid);
    expect(result?.success).toBe(false);
  });

  it('transform computes path: /faqs/<slug>/', () => {
    const result = collections.faqs.schema?.safeParse({
      id: '1',
      title: 'Eligibility',
      slug: 'eligibility',
    }) as { success: true; data: { path: string } };
    expect(result.success).toBe(true);
    expect(result.data.path).toBe('/faqs/eligibility/');
  });

  it('transform computes rawText from question + answer + body', () => {
    const result = collections.faqs.schema?.safeParse({
      id: '1',
      title: 'X',
      slug: 'x',
      question: 'Who is eligible?',
      answer: '**Anyone** in the listed areas.',
      body: 'Additional context.',
    }) as { success: true; data: { rawText: string } };
    expect(result.success).toBe(true);
    expect(result.data.rawText).toContain('Who is eligible');
    expect(result.data.rawText).toContain('Anyone');
    expect(result.data.rawText).toContain('Additional context');
  });

  it('transform handles missing question/answer/body without throwing', () => {
    const result = collections.faqs.schema?.safeParse({
      id: '1',
      title: 'X',
      slug: 'x',
    }) as { success: true; data: { rawText: string } };
    expect(result.success).toBe(true);
    expect(typeof result.data.rawText).toBe('string');
  });
});
