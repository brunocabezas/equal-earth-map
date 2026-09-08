# Equal Earth Map

Interactive, zoomable Equal Earth world map. Countries and continents keep their true relative sizes, unlike Mercator web maps.

Live site: https://trueearthmap.com/

## What you can do

- **Interactive atlas** — Natural Earth 1:50 million vectors in the Equal Earth projection, with pan/zoom, search, layers, and a Mercator comparison.
- **Wall maps** — original Patterson political map and BMZ physical map, zoomable like a photograph.

## Run locally

```bash
python3 -m http.server 8765
```

Then open http://127.0.0.1:8765/

## Version in About

The About dialog reads `version.js`, which is shipped with the site. That way the hash you see is from the files that are actually running, not from a live GitHub lookup.

After each commit, a git hook writes the new hash into `version.js` and amends so it stays one commit. Install the hook once in this clone:

```bash
cp .githooks/post-commit .git/hooks/post-commit
```

The hook does not run during rebase or merge.

## Data

- Equal Earth projection by Bojan Šavrič, Tom Patterson, and Bernhard Jenny
- Political wall map by Tom Patterson (public domain)
- Physical wall map: BMZ German edition
- Vectors: [Natural Earth](https://www.naturalearthdata.com/)

## Analytics

Visit counts use [GoatCounter](https://www.goatcounter.com/) (no cookies). Create a site named `equal-earth-map`, then open https://equal-earth-map.goatcounter.com/ to see visitors.

Optional PostHog: set `posthogKey` in `site-config.js`.
