import { describe, it, expect } from 'vitest';
import { formatDate, isoDateOnly } from '~/lib/dateFormat';

describe('formatDate', () => {
  it('formats ISO to "MMM DD, YYYY" (UTC)', () => {
    expect(formatDate('2026-03-09T00:00:00Z')).toBe('Mar 09, 2026');
  });

  it('formats with single-digit month padded', () => {
    expect(formatDate('2026-01-05T00:00:00Z')).toBe('Jan 05, 2026');
  });

  it('formats with double-digit day', () => {
    expect(formatDate('2026-12-31T23:59:59Z')).toBe('Dec 31, 2026');
  });

  it('returns "" for null', () => {
    expect(formatDate(null)).toBe('');
  });

  it('returns "" for undefined', () => {
    expect(formatDate(undefined)).toBe('');
  });

  it('returns "" for invalid date string', () => {
    expect(formatDate('not-a-date')).toBe('');
  });

  it('formats UTC consistently regardless of host timezone', () => {
    // 2026-03-09T23:30:00Z is March 9 in UTC, March 10 in some local TZs
    // Output must use UTC date to match Nuxt site's moment.utc(...).format(...)
    expect(formatDate('2026-03-09T23:30:00Z')).toBe('Mar 09, 2026');
  });
});

describe('isoDateOnly', () => {
  it('strips time portion from full ISO', () => {
    expect(isoDateOnly('2026-03-09T14:30:00.123Z')).toBe('2026-03-09');
  });

  it('returns input unchanged when no T separator', () => {
    expect(isoDateOnly('2026-03-09')).toBe('2026-03-09');
  });

  it('returns "" for undefined', () => {
    expect(isoDateOnly(undefined)).toBe('');
  });

  it('returns "" for null', () => {
    expect(isoDateOnly(null)).toBe('');
  });

  it('returns "" for empty string', () => {
    expect(isoDateOnly('')).toBe('');
  });
});
