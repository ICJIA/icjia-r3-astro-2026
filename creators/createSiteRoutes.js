const { v4: uuidv4 } = require("uuid");
const jsonfile = require("jsonfile");
const pageRoutes = require("../public/routesPages.json");
const newsRoutes = require("../public/routesNews.json");
const faqRoutes = require("../public/routesFaqs.json");
const resourceRoutes = require("../public/routesResources.json");
const myManualRoutes = require("../public/routesManual.json");
const dotenv = require("dotenv");

dotenv.config();

const appRoutes = Array.from(
  new Set([
    ...pageRoutes,
    ...newsRoutes,
    ...faqRoutes,
    ...resourceRoutes,
    ...myManualRoutes,
  ])
);

jsonfile.writeFileSync(`public/appRoutes.json`, appRoutes, function (err) {
  if (err) {
    console.error(err);
  }
});

jsonfile.writeFileSync(`assets/json/appRoutes.json`, appRoutes, function (err) {
  if (err) {
    console.error(err);
  }
});

console.log("public/appRoutes.json created:\n", appRoutes);
