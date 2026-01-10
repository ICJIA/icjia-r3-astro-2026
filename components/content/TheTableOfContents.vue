<template>
  <div>
    <v-card
      elevation="0"
      class="toc px-5 py-5 markdown-body"
      style="border-left: 0px solid #eee; background: #fafafa"
    >
      <div
        id="navigation"
        ref="navigation"
        class="hover pb-4 navigation-anchor"
        style="border: 0px; font-size: 20px; font-weight: bold"
        @click="scrollToTop"
      >
        {{ props.title }}
      </div>
      <div v-for="(item, index) in props.data.links" :key="index" class="pl-3">
        <div
          :id="`toc-${item.id}`"
          class="mb-4 hover tocItem"
          @click="scrollTo(item.id)"
        >
          {{ item.text }}
        </div>
      </div>
      <br /><br />
      <!-- Debug:<br />
      {{ props.data }} -->
    </v-card>
  </div>
</template>

<script setup>
/**
 * @fileoverview Table of contents component for the ICJIA R3 Nuxt 3 application.
 *
 * This component automatically generates a table of contents from H2 headings
 * on the page and provides smooth scrolling navigation. It includes scroll
 * position tracking to highlight the current section and provides a "back to top" anchor.
 *
 * @component TheTableOfContents
 * @example
 * ```vue
 * <template>
 *   <TheTableOfContents
 *     :data="tocData"
 *     title="Page Contents"
 *   />
 * </template>
 * ```
 *
 * @since 1.0.0
 */

/**
 * Reference to the navigation element for DOM manipulation.
 * Used to control visibility and styling of the navigation anchor.
 *
 * @type {Ref<HTMLElement|null>}
 */
const navigation = ref(null);

/**
 * Component props definition.
 *
 * @typedef {Object} Props
 * @property {Object|null} data - Optional data object for table of contents content
 * @property {string} title - Title displayed in the table of contents header
 */
const props = defineProps({
  /**
   * Optional data object for table of contents content.
   * Can be used to provide custom TOC structure instead of auto-generation.
   *
   * @type {Object|null}
   * @default null
   */
  data: {
    type: Object,
    default: null,
  },
  /**
   * Title displayed in the table of contents header.
   * Provides context for the navigation section.
   *
   * @type {string}
   * @default "Navigation"
   */
  title: {
    type: String,
    default: "Navigation",
  },
});

/**
 * Scrolls smoothly to a specific element by ID.
 * Calculates the proper scroll position with offset compensation for fixed headers.
 *
 * @param {string} id - The ID of the target element to scroll to
 *
 * @example
 * ```javascript
 * // Scroll to a section with ID "introduction"
 * scrollTo("introduction");
 * ```
 */
const scrollTo = (id) => {
  // console.log("scrolling to", id);
  const el = document.querySelector(`#${id}`);
  // console.log("el: ", el);
  window.scrollTo({
    behavior: "smooth",
    top:
      el.getBoundingClientRect().top -
      document.body.getBoundingClientRect().top -
      80,
  });
};

/**
 * Scrolls smoothly to the top of the page.
 * Provides a "back to top" functionality for long content pages.
 *
 * @example
 * ```javascript
 * // Called when "Back to Top" link is clicked
 * scrollToTop();
 * ```
 */
const scrollToTop = () => {
  window.scrollTo({
    behavior: "smooth",
    top: 0,
  });
};

/**
 * Component lifecycle hook that runs after the component is mounted.
 * Sets up the table of contents by scanning for H2 headings and configures
 * scroll event listeners for active section highlighting.
 */
onMounted(() => {
  /**
   * Scroll offset for calculating active section positions.
   * Accounts for fixed header height and provides visual buffer.
   *
   * @type {number}
   */
  const scrollOffset = 100;

  /**
   * Array to store table of contents items.
   * Built from H2 headings found in the document.
   *
   * @type {Array<Object>}
   */
  const toc = [];

  /**
   * All H2 heading elements found in the document.
   * These form the basis of the table of contents structure.
   *
   * @type {Array<HTMLElement>}
   */
  const sections = Array.from(document.querySelectorAll("h2"));

  /**
   * Build table of contents from H2 headings.
   * Extracts text content and ID from each heading for navigation.
   */
  sections.forEach((section) => {
    const obj = {};
    obj.text = section.innerText;
    obj.id = section.id;
    toc.push(obj);
  });

  /**
   * Scroll event handler for active section highlighting.
   * Updates the visual state of TOC items based on scroll position
   * and manages the visibility of the navigation anchor.
   */
  window.onscroll = () => {
    let scrollPosition =
      document.documentElement.scrollTop || document.body.scrollTop;
    scrollPosition = scrollPosition + scrollOffset + 35;
    const tocItems = document.querySelectorAll(".tocItem");

    // Show/hide navigation anchor based on scroll position
    if (scrollPosition < 150) {
      tocItems.forEach((toc) => {
        toc.classList.remove("visible");
      });
      navigation.value.classList.add("visible-anchor");
    } else {
      navigation.value.classList.remove("visible-anchor");
    }

    // Highlight the current section in the TOC
    sections.forEach((section) => {
      if (section.offsetTop <= scrollPosition) {
        if (tocItems) {
          tocItems.forEach((toc) => {
            toc.classList.remove("visible");
          });
        }
        const sectionItem = document.getElementById(`toc-${section.id}`);
        sectionItem.classList.add("visible");
      }
    });
  };
});

/**
 * Alternative implementation using Intersection Observer API (commented out).
 * This approach could be used instead of scroll events for better performance,
 * but the current scroll-based implementation provides more precise control.
 *
 * @todo Consider implementing Intersection Observer for better performance
 * @deprecated Currently using scroll events instead
 */
// const observerOptions = {
//   rootMargin: "10px",
//   threshold: 1.0,
// };

// const observer = new IntersectionObserver(observerCallback, observerOptions);

// function observerCallback(entries, observer) {
//   entries.forEach((entry) => {
//     if (entry.isIntersecting) {
//       console.log("entry: ", entry.target, entry.isIntersecting);
//     }
//   });
// }
// const target = "H2";
// document.querySelectorAll(target).forEach((i) => {
//   if (i) {
//     observer.observe(i);
//   }
// });

/**
 * Component lifecycle hook that runs before the component is unmounted.
 * Cleans up the scroll event listener to prevent memory leaks.
 */
onUnmounted(() => {
  window.onscroll = null;
});
</script>

<style>
/* TOC Styles */

.divider {
  border-left: 1px solid #ccc;
}

.visible {
  color: rgb(34, 18, 104);
  font-weight: 900;
  margin-left: 2px;
  border-left: 5px solid #aaa;
  padding-left: 10px;
  transition:
    visibility 0s,
    opacity 0.5s linear;
}

.anchor {
  padding: 2px 5px 2px 5px;
}

.visible-anchor {
  color: rgb(34, 18, 104);
  font-weight: 900;
}

.navigation-anchor:hover {
  text-decoration: underline;
}

.anchor:hover {
  color: #0d4474;
  background: #eee;
}

.shaded {
  background: #eee;
  padding: 15px;
  margin-bottom: 25px;
}

.toc {
  position: -webkit-sticky !important;
  position: sticky !important;
  top: 115px !important;
  font-size: 14px !important;
}

.tocItem {
  margin-bottom: 3px;
  font-size: 14px;
}

.tocItem:hover {
  text-decoration: underline;
}

/* ul.toc-list {
  list-style-type: none;
}

ul.toc-list li {
  color: #333;
  padding: 2px 5px 2px 5px;
  cursor: pointer;
  margin-bottom: 3px;
  font-size: 14px;
}

ul.toc-list li:hover {
  color: #aaa;
  background: #eee;
}

.tocListItem {
  margin-left: -20px !important;
} */

/* .tocItem {
} */
</style>
