/**
 * Client-side plugin to normalize URLs with trailing slashes.
 * Uses beforeResolve so the URL is corrected BEFORE Plausible's afterEach
 * hook fires, ensuring analytics always sees trailing-slash URLs matching
 * Netlify's Pretty URLs.
 */
export default defineNuxtPlugin(() => {
  const router = useRouter();

  router.beforeResolve((to) => {
    if (to.path !== "/" && !to.path.endsWith("/")) {
      return { path: to.path + "/", query: to.query, hash: to.hash };
    }
  });
});
