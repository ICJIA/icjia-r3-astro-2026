// astro/src/lib/dateFormat.ts
//
// UTC-only date formatting helpers. Output matches the current Nuxt site's
// `moment.utc(...).format("MMM DD, YYYY")` so the migration is invisible
// to users comparing news date strings before/after the cutover.

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] as const;

/** Format an ISO date string as "MMM DD, YYYY" in UTC (e.g. "Mar 09, 2026").
 * Returns empty string for null / undefined / unparseable inputs. */
export function formatDate(input: string | null | undefined): string {
  if (!input) return '';
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getUTCFullYear();
  const m = MONTHS[d.getUTCMonth()];
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${m} ${day}, ${y}`;
}

/** Strip the time portion from an ISO datetime, returning only YYYY-MM-DD.
 * Returns empty string for null / undefined / empty inputs. */
export function isoDateOnly(input: string | null | undefined): string {
  if (!input) return '';
  const idx = input.indexOf('T');
  return idx > 0 ? input.slice(0, idx) : input;
}
