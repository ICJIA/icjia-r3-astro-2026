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

useHead({
  title: data.value?.title || "Frequently Asked Questions",
  meta: [
    {
      hid: "description",
      name: "description",
      content: data.value?.summary || "R3 Frequently Asked Questions",
    },
  ],
});
</script>
