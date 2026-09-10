# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Curious general public. They arrive because a Mercator map (often Google Maps) made Africa look small and Greenland look huge, and they want to see the true size relationship for themselves.

## Product Purpose

Equal Earth Map is a free interactive atlas that shows countries at their true relative sizes. Success is two-part: a first-visit aha that Mercator distorts area, then a working atlas they can search, pan, zoom, and compare.

## Positioning

The default view is the Equal Earth projection, an equal-area map with more familiar continent shapes than Gall–Peters. Mercator is available only as a comparison, not as the home view.

## Operating Context

Used in a browser on phone or desktop, often after looking at a conventional web map. Two modes: an interactive Natural Earth atlas, and zoomable original wall maps (Patterson political, BMZ physical).

## Capabilities and Constraints

- Interactive atlas: pan, zoom, search countries and cities, toggle layers, switch Equal Earth / Mercator, recentre at 0°, 90°W, or 150°E.
- Wall maps: Patterson political and BMZ physical sheets, zoomable as images.
- Public name is Equal Earth / Equal Earth Map. trueearthmap.com is the URL, not the product name.
- Free: no account, no paywall.
- Visit counting uses GoatCounter with no cookies. Do not introduce cookie-based analytics for that job.
- Currently a static HTML/CSS/JS site on GitHub Pages. A backend was not ruled out.
- Whether source credits (Šavrič / Patterson / Jenny, Natural Earth, wall-map publishers) must stay visible was not locked; the shipped site currently credits them.

## Brand Commitments

Equal Earth / Equal Earth Map. Equal Earth is the default projection.

## Evidence on Hand

- Equal Earth projection by Bojan Šavrič, Tom Patterson, and Bernhard Jenny
- Natural Earth 1:50 million vectors (`data/`)
- Patterson political wall map, public domain (`maps/political.jpg`)
- BMZ physical Equal Earth map (`maps/physical.jpg`)
- Live site: https://trueearthmap.com/
- No testimonials, press quotes, or usage metrics are in the repo; do not invent them

## Product Principles

- Default to Equal Earth; Mercator exists to compare, not to replace.
- First visit should make the size distortion obvious; later visits should work as an atlas.
- Stay free and accountless.
- Do not use cookies to count visits.
