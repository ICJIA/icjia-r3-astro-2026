// astro/src/__mocks__/astro-content.ts
//
// Vitest shim for the `astro:content` virtual module. Astro resolves this at
// build time via its Vite plugin; Vitest needs a concrete file to import.
//
// We use the real astro/content/config `defineCollection` implementation at
// runtime (so schema validation is identical to what runs at build time), but
// expose a narrower TypeScript signature that strips the
// `(context: SchemaContext) => S` function variant from the `schema` property.
// This lets tests call `collection.schema?.safeParse(...)` without a type error,
// since we always pass concrete zod schemas (never schema factory functions).
//
// `z` is re-exported from zod/v4 directly — the same underlying library that
// Astro 6 uses — avoiding the `astro/zod` deprecation warning.

import {
  defineCollection as _defineCollection,
  type CollectionConfig,
} from 'astro/content/config';
import type { Loader } from 'astro/loaders';
export { z } from 'zod/v4';

type BaseSchema = import('zod/v4/core').$ZodType;

// Narrowed return type: `schema` is always the concrete schema object S, never
// the `(context: SchemaContext) => S` factory function form. This matches how
// content.config.ts always uses defineCollection (plain schema object, not a
// factory), and allows tests to call schema.safeParse() without type errors.
type NarrowedCollectionConfig<S extends BaseSchema> = Omit<CollectionConfig<S>, 'schema'> & {
  schema?: S;
};

export function defineCollection<S extends BaseSchema>(
  config: { loader: Loader; schema?: S } | { type?: 'content' | 'data'; schema?: S },
): NarrowedCollectionConfig<S> {
  return _defineCollection(config as CollectionConfig<S>) as NarrowedCollectionConfig<S>;
}
