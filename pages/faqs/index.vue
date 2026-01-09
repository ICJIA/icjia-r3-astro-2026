<template>
  <div>
    <TheBreadcrumbBar></TheBreadcrumbBar>
    <v-container>
      <v-row>
        <v-col cols="12">
          <div v-if="data" class="mt-6">
            <h1>{{ data.title }}</h1>
            <ContentDoc
              :key="data?.title"
              :value="data"
              class="markdown-body"
            >
              <template #empty>Document not found</template>
              <template #not-found>Document not found</template>
            </ContentDoc>
          </div>
          <div v-else>
            <the-page-loader></the-page-loader>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
/**
 * FAQs index page component
 * Displays the FAQ content from /content/faqs.md which is generated
 * from Strapi via the createMarkdownPages.js creator script.
 */

const path = '/faqs';

// Fetch the FAQs page content
const { data } = await useAsyncData(`content-${path}`, async () => {
  const page = await queryContent().where({ _path: path }).findOne();
  return page;
});

// SEO Configuration for FAQs page
usePageSeo({
  title: data.value?.title || 'Frequently Asked Questions',
  description: data.value?.summary || 'Find answers to frequently asked questions about the R3 (Restore, Reinvest, Renew) program, including eligibility, funding, application process, and more.',
  path: '/faqs',
  keywords: ['R3 FAQs', 'frequently asked questions', 'R3 eligibility', 'grant questions', 'application help'],
})

// Add WebPage structured data
useWebPageSchema({
  name: data.value?.title || 'R3 Frequently Asked Questions',
  description: data.value?.summary || 'Find answers to common questions about the R3 program',
})

// Add breadcrumb schema
useBreadcrumbListSchema([
  { name: 'Home', url: '/' },
  { name: 'FAQs', url: '/faqs' }
])
</script>
