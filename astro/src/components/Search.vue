<!-- astro/src/components/Search.vue -->
<!--
  Vue 3 SFC island. Loads /searchIndex.json on mount, builds a Fuse instance,
  renders matched results as the user types. Supports filter chips by
  collection type. ~26 KB total when minified+gzipped (Vue runtime + Fuse +
  this component code).

  Mounted at /search/ with `client:idle`.
-->
<template>
  <div class="search">
    <label class="search__label" for="search-input">Search R3</label>
    <input
      id="search-input"
      v-model="query"
      type="search"
      placeholder="Search the R3 site"
      autocomplete="off"
      class="search__input"
    />

    <fieldset class="search__filters" v-if="rows.length">
      <legend class="sr-only">Filter by content type</legend>
      <button
        v-for="t in types"
        :key="t.key"
        type="button"
        class="search__chip"
        :class="{ 'is-active': activeType === t.key }"
        :aria-pressed="activeType === t.key"
        @click="setType(t.key)"
      >
        {{ t.label }} ({{ countByType(t.key) }})
      </button>
    </fieldset>

    <p class="search__count" aria-live="polite">
      <template v-if="!loaded">Loading index…</template>
      <template v-else-if="!query">{{ rows.length }} indexed pages</template>
      <template v-else>{{ results.length }} match{{ results.length === 1 ? '' : 'es' }}</template>
    </p>

    <ul v-if="loaded && query && results.length" class="search__results" role="list">
      <li v-for="r in results.slice(0, 50)" :key="r.id">
        <a :href="r.path">
          <span class="search__type">{{ typeLabel(r.type) }}</span>
          <strong>{{ r.title }}</strong>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Fuse from 'fuse.js';

interface Row {
  type: 'pages' | 'news' | 'faqs' | 'resources' | 'hubArticles';
  id: string;
  title: string;
  path: string;
  rawText: string;
  postDate?: string;
}

const rows = ref<Row[]>([]);
const fuse = ref<Fuse<Row> | null>(null);
const query = ref('');
const loaded = ref(false);
const activeType = ref<Row['type'] | 'all'>('all');

const types = [
  { key: 'all',         label: 'All' },
  { key: 'pages',       label: 'Pages' },
  { key: 'news',        label: 'News' },
  { key: 'faqs',        label: 'FAQs' },
  { key: 'resources',   label: 'Resources' },
  { key: 'hubArticles', label: 'Research' },
] as const;

function typeLabel(t: Row['type']): string {
  const found = types.find((x) => x.key === t);
  return found ? found.label : t;
}

function countByType(t: typeof activeType.value): number {
  if (t === 'all') return rows.value.length;
  return rows.value.filter((r) => r.type === t).length;
}

function setType(t: typeof activeType.value): void {
  activeType.value = t;
}

const results = computed<Row[]>(() => {
  if (!fuse.value || !query.value.trim()) return [];
  const matched = fuse.value.search(query.value).map((m) => m.item);
  return activeType.value === 'all'
    ? matched
    : matched.filter((r) => r.type === activeType.value);
});

onMounted(async () => {
  const res = await fetch('/searchIndex.json');
  if (!res.ok) {
    console.error('search index fetch failed', res.status);
    return;
  }
  rows.value = (await res.json()) as Row[];
  fuse.value = new Fuse(rows.value, {
    keys: ['title', 'rawText'],
    threshold: 0.3,
    ignoreLocation: true,
    minMatchCharLength: 2,
  });
  loaded.value = true;
});
</script>

<style scoped>
.search { max-width: 720px; margin: 0 auto; }
.search__label { font-weight: 600; display: block; margin-bottom: 0.5rem; }
.search__input {
  width: 100%;
  font-size: 1.1rem;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-r3-primary);
  border-radius: 4px;
  min-height: 44px;
}
.search__input:focus-visible {
  outline: 3px solid var(--color-r3-primary);
  outline-offset: 2px;
}
.search__filters {
  border: none;
  padding: 0;
  margin: 1rem 0;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.search__chip {
  background: #fff;
  border: 1px solid var(--color-r3-primary);
  color: var(--color-r3-primary);
  padding: 0.4rem 0.75rem;
  border-radius: 9999px;
  cursor: pointer;
  min-height: 44px;
  font-weight: 600;
}
.search__chip.is-active {
  background: var(--color-r3-primary);
  color: #fff;
}
.search__chip:focus-visible {
  outline: 3px solid var(--color-r3-primary);
  outline-offset: 2px;
}
.search__count { color: var(--color-r3-text-muted); margin: 1rem 0; }
.search__results { list-style: none; padding: 0; margin: 0; }
.search__results li { margin: 0.5rem 0; }
.search__results a {
  display: block;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-r3-card-border);
  border-radius: 4px;
  background: #fff;
  text-decoration: none;
  color: inherit;
  min-height: 44px;
}
.search__results a:hover,
.search__results a:focus-visible {
  background: rgba(13, 68, 116, 0.05);
}
.search__results a:focus-visible {
  outline: 2px solid var(--color-r3-primary);
  outline-offset: 2px;
}
.search__type {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--color-r3-text-muted);
  display: block;
  margin-bottom: 0.25rem;
}
</style>
