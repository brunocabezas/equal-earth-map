(() => {
  const config = window.EQUAL_EARTH_SITE;
  const goat = config?.goatCounter;
  if (goat) {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://gc.zgo.at/count.js";
    script.dataset.goatcounter = `https://${goat}.goatcounter.com/count`;
    document.head.appendChild(script);
  }

  const key = config?.posthogKey;
  if (key) {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://us.i.posthog.com/static/array.js";
    script.onload = () => {
      if (!window.posthog) return;
      window.posthog.init(key, {
        api_host: config?.posthogHost || "https://us.i.posthog.com",
        persistence: "memory",
        capture_pageview: true
      });
    };
    document.head.appendChild(script);
  }
})();
