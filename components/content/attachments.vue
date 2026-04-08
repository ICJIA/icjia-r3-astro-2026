<template>
  <div class="pl-2">
    <!-- <div>Props</div>
    <div>{{ props.attachments }}</div>
    <div>links:</div>
    <div>{{ props.links }}</div> -->

    <div v-if="props.showTableDisplay">
      <h3 class="mt-10">{{ props.attachmentHeading }}</h3>
      <v-table
        class="markdown-body dataTable mt-3"
        density="compact"
        style="border: 1px solid #eee"
      >
        <thead>
          <tr>
            <th class="text-left" style="font-weight: 900">Filename</th>
            <th class="text-left" style="font-weight: 900">Last Updated</th>
            <th class="text-left" style="font-weight: 900">Size</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="attachment in props.attachments"
            :key="attachment.attributes.url"
          >
            <td>
              <a
                :href="'https://r3.icjia-api.cloud' + attachment.attributes.url"
                target="_blank"
              >
                {{ attachment.attributes.name.replace(/\.[^/.]+$/, "")
                }}{{ attachment.attributes.ext }}
              </a>
            </td>
            <td>
              {{ formatDate(attachment.attributes.updatedAt) }}
            </td>
            <td>
              {{ niceBytes(attachment.attributes.size) }}
            </td>
          </tr>
        </tbody>
      </v-table>
      <div v-if="props.links.length">
        <strong>{{ props.linkHeading }}</strong>

        <ul class="mt-2">
          <li v-for="link in props.links" :key="link.url">
            <a :href="link.url" target="_blank">
              {{ link.title }}
            </a>
            <div v-if="link.summary">{{ link.summary }}</div>
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <div v-if="props.attachments && props.attachments.length > 0">
        <strong v-if="attachmentHeading">{{ attachmentHeading }}</strong>
        <ul class="mt-2">
          <li
            v-for="attachment in props.attachments"
            :key="attachment.attributes.url"
          >
            <a
              :href="'https://r3.icjia-api.cloud' + attachment.attributes.url"
              target="_blank"
            >
              {{ attachment.attributes.name }}
            </a>
          </li>
        </ul>
      </div>
      <div v-if="props.links.length">
        <strong>{{ props.linkHeading }}</strong>

        <ul class="mt-2">
          <li v-for="link in props.links" :key="link.url">
            <a :href="link.url" target="_blank"> {{ link.title }} </a>
            <div v-if="link.summary">{{ link.summary }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * @fileoverview Attachments and external links component for the ICJIA R3 Nuxt 3 application.
 *
 * This component displays downloadable attachments and external links in a structured format.
 * It supports both table and list display modes, file size formatting, and date formatting.
 * Commonly used for displaying documents, resources, and related links on content pages.
 *
 * @component attachments
 * @example
 * ```vue
 * <template>
 *   <attachments
 *     :attachments="documentList"
 *     :links="externalLinks"
 *     attachmentHeading="Downloads"
 *     :showTableDisplay="true"
 *   />
 * </template>
 * ```
 *
 * @since 1.0.0
 */

/**
 * Reference to the navigation element for DOM manipulation.
 * Used for potential scroll or focus management.
 *
 * @type {Ref<HTMLElement|null>}
 */
const navigation = ref(null);

/**
 * Component props definition.
 *
 * @typedef {Object} Props
 * @property {Array} attachments - Array of attachment objects with file information
 * @property {Array} links - Array of external link objects
 * @property {string} attachmentHeading - Heading text for the attachments section
 * @property {string} linkHeading - Heading text for the external links section
 * @property {boolean} showTableDisplay - Whether to display attachments in table format
 */
const props = defineProps({
  /**
   * Array of attachment objects containing file information.
   * Each attachment should include properties like name, url, size, and date.
   *
   * @type {Array<Object>}
   * @default []
   */
  attachments: {
    type: Array,
    default: () => [],
  },
  /**
   * Array of external link objects.
   * Each link should include properties like title, url, and description.
   *
   * @type {Array<Object>}
   * @default []
   */
  links: {
    type: Array,
    default: () => [],
  },
  /**
   * Heading text displayed above the attachments section.
   * Provides context for the downloadable files.
   *
   * @type {string}
   * @default "ATTACHMENTS"
   */
  attachmentHeading: {
    type: String,
    default: "ATTACHMENTS",
  },
  /**
   * Heading text displayed above the external links section.
   * Provides context for the external resources.
   *
   * @type {string}
   * @default "External Links:"
   */
  linkHeading: {
    type: String,
    default: "External Links:",
  },
  /**
   * Whether to display attachments in a table format.
   * When false, attachments are displayed in a simpler list format.
   *
   * @type {boolean}
   * @default true
   */
  showTableDisplay: {
    type: Boolean,
    default: true,
  },
});

// const sorted = _.orderBy(props.attachments, ["category"]);
// console.table(sorted);

/**
 * Converts bytes to a human-readable format with appropriate units.
 * Supports both binary (1024) and decimal (1000) unit systems.
 *
 * @param {number} bytes - The number of bytes to format
 * @param {boolean} [si=false] - Whether to use decimal (SI) units instead of binary
 * @param {number} [dp=1] - Number of decimal places to display
 * @returns {string} Formatted string with size and unit (e.g., "1.5 MB", "2.3 KiB")
 *
 * @example
 * ```javascript
 * niceBytes(1024); // "1.0 KiB"
 * niceBytes(1000, true); // "1.0 kB"
 * niceBytes(1536, false, 2); // "1.50 KiB"
 * niceBytes(500); // "500 B"
 * ```
 */
const niceBytes = (bytes, si = false, dp = 1) => {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
};

/**
 * Formats a date string into a human-readable format.
 * Uses the browser's locale settings for appropriate date formatting.
 *
 * @param {string} dateString - ISO date string or any valid date string
 * @returns {string} Formatted date string (e.g., "January 15, 2024")
 *
 * @example
 * ```javascript
 * formatDate("2024-01-15"); // "January 15, 2024"
 * formatDate("2024-12-25T10:30:00Z"); // "December 25, 2024"
 * ```
 */
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};
</script>

<style>
.markdown-body.dataTable {
  width: 100%;
  font-size: 14px;
}

.markdown-body .dataTable th {
  font-weight: 700;
  text-align: left;
  font-size: 0.8rem;
}

.markdown-body.dataTable td {
  font-weight: 700;
  text-align: left;
  font-size: 0.65rem;
}
</style>
