export default defineAppConfig({
  title: "R3 (R3)",
  description: "R3 description.",
  api: "https://r3.icjia-api.cloud",
  root: "https://r3.illinois.gov",
  underConstruction: true,

  splash: [
    {
      externalURL: "https://icjia.illinois.gov",
      src: "https://r3.icjia-api.cloud/uploads/large_new_splash_03_9b9975cfc5.jpg",
      lazySrc:
        "https://r3.icjia-api.cloud/uploads/thumbnail_new_splash_03_9b9975cfc5.jpg",
      tagline:
        "Grants to provide services to repair the harm caused by economic disinvestment, violence, and the war on drugs. Organizations may apply for grant funds in R3 communities statewide.",
      title: "2025 SERVICE DELIVERY GRANT OPPORTUNITIES NOW AVAILABLE",
    },
    // {
    //   externalURL:
    //     "https://icjia.illinois.gov/grants/funding/restore-reinvest-and-renew-r3-program-r3-service-delivery/",
    //   src: "https://r3.icjia-api.cloud/uploads/large_new_splash_03_9b9975cfc5.jpg?updated_at=2022-12-16T00:42:02.049Z",
    //   lazySrc:
    //     "https://r3.icjia-api.cloud/uploads/thumbnail_new_splash_03_9b9975cfc5.jpg?updated_at=2022-12-16T00:42:02.049Z",
    //   title: "SERVICE AND DELIVERY",
    //   tagline:
    //     "Grants to provide services to repair the harm caused by economic disinvestment, violence, and the war on drugs",
    // },
  ],
  tools: [
    {
      title: "Eligibility",
      tagline: "Find out if you're eligible to apply for funding",
      link: "/eligibility",
    },
    {
      title: "FAQs",
      tagline: "Frequently asked questions about R3 funding",
      link: "/faqs",
    },
    {
      title: "Collaboratives",
      tagline:
        "Groups of two or more organization that apply for funding for a single cooperative program under one application",
      link: "/collaboratives",
    },
    {
      title: "Resources",
      tagline: "R3 resources and analysis",
      link: "/resources",
    },
  ],
  navMenu: [
    {
      main: "Home",
      link: "/",
      nudgeLeft: "78px",
    },
    {
      main: "About",
      nudgeLeft: "57px",
      children: [
        {
          section: "About the R3 Program",
        },
        {
          title: "R3 news",
          link: "/news",
        },
        {
          title: "Meetings",
          link: "/meetings",
        },
        {
          title: "R3 Program Board",
          link: "/board",
        },
        {
          title: "Research",
          link: "/research",
        },

        {
          divider: true,
        },
        {
          section: "Applicant Tools",
        },
        {
          title: "Eligibility",
          link: "/eligibility",
        },
        {
          title: "FAQs",
          link: "/faqs",
        },
        {
          title: "Collaboratives",
          link: "/collaboratives",
        },
        {
          title: "Resources",
          link: "/resources",
        },
      ],
    },

    {
      main: "Funding",
      link: "/funding",
      nudgeLeft: "78px",
    },
    {
      main: "Contact",
      link: "/contact",
      nudgeLeft: "78px",
    },
  ],
  footerMenu: [
    {
      main: "Home",
      link: "/",
    },

    {
      main: "FAQs",
      link: "/faqs",
    },
    {
      main: "News",
      link: "/news",
    },
    {
      main: "Board",
      link: "/board",
    },
    {
      main: "Contact",
      link: "/contact",
    },
    {
      main: "Meetings",
      link: "/meetings",
    },
    {
      main: "Eligibility",
      link: "/eligibility",
    },
    {
      main: "Collaboratives",
      link: "/collaboratives",
    },
    {
      main: "Funding Opportunities",
      link: "/funding",
    },
    {
      main: "Research",
      link: "/research",
    },
    {
      main: "Resources",
      link: "/resources",
    },
    {
      main: "Search",
      link: "/search",
    },
  ],
});
