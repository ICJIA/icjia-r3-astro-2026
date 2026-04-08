/**
 * Client-side plugin to normalize URLs with trailing slashes.
 * Uses replaceState after navigation to update the browser URL bar without
 * triggering a re-render. This ensures Plausible analytics sees consistent
 * URLs matching Netlify's Pretty URLs format.
 */
export default defineNuxtPlugin(() => {
  const router = useRouter();

  router.afterEach((to) => {
    if (to.path !== "/" && !to.path.endsWith("/")) {
      const normalized = to.path + "/" + (to.hash || "");
      const search = window.location.search || "";
      window.history.replaceState(window.history.state, "", normalized + search);
    }
  });
});
