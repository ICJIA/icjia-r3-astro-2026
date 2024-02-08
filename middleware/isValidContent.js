import appRoutes from "assets/json/appRoutes.json";

export default defineNuxtRouteMiddleware((to, from) => {
  const router = useRouter();

  if (appRoutes.indexOf(to.path) > -1) {
    console.log("Route: good: ", to.path);
  } else {
    console.log("Route: bad: ", to.path);
    const URIEncodedFromPath = encodeURIComponent(from.path);
    const URIEncodedToPath = encodeURIComponent(to.path);
    return router.push({
      name: `404`,
      query: { referrer: URIEncodedFromPath, destination: URIEncodedToPath },
    });
  }
});
