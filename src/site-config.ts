(() => {
  const site = {
    siteUrl: "https://trueearthmap.com/",
    githubRepo: "brunocabezas/equal-earth-map",
    goatCounter: "equal-earth-map",
    posthogKey: "",
    posthogHost: "https://us.i.posthog.com"
  } as const satisfies SiteConfig;

  window.EQUAL_EARTH_SITE = site;
})();
