(() => {
  const PALETTE = [
    "#f3d3a2", "#e4b48a", "#d7c48b", "#c4d3a3", "#e8c3b0",
    "#f0c98d", "#c9b48a", "#d9d0a8", "#efd3b6", "#cbb89a",
    "#e2c7a0", "#d4c392", "#f1d8b0", "#cfc09a", "#e6b996"
  ];

  const WALL_CAPTIONS = {
    political:
      "Patterson political wall map, Oceania centering (150°E). Drag, scroll, pinch, or double-click to explore.",
    physical:
      "BMZ physical Equal Earth map with terrain, vegetation, and ocean floor. Drag, scroll, pinch, or double-click to explore."
  };

  const state = {
    mode: "atlas",
    wallLayer: "political",
    projectionName: "equalEarth",
    center: 0,
    layers: {
      countries: true,
      lakes: true,
      rivers: true,
      cities: true,
      labels: true,
      graticule: true
    },
    selected: null
  };

  let viewer = null;
  let atlasReady = false;
  let atlas = null;

  const wallView = document.getElementById("wall-view");
  const atlasView = document.getElementById("atlas-view");
  const about = document.getElementById("about");

  function colorFor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i += 1) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return PALETTE[Math.abs(hash) % PALETTE.length];
  }

  function formatPop(n) {
    if (!n) return "";
    if (n >= 1e6) return `${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1)} million`;
    if (n >= 1e3) return `${Math.round(n / 1e3)} thousand`;
    return String(n);
  }

  function km2(feature) {
    return d3.geoArea(feature) * 6371.0088 * 6371.0088;
  }

  function track(event, props) {
    if (typeof window.goatcounter === "object" && typeof window.goatcounter.count === "function") {
      window.goatcounter.count({
        path: `event/${event}`,
        title: event,
        event: true
      });
    }
    if (window.posthog && typeof window.posthog.capture === "function") {
      window.posthog.capture(event, props);
    }
  }

  function initWall() {
    viewer = OpenSeadragon({
      id: "osd",
      prefixUrl: "",
      showNavigator: true,
      navigatorPosition: "BOTTOM_LEFT",
      showNavigationControl: false,
      visibilityRatio: 0.85,
      minZoomImageRatio: 0.6,
      maxZoomPixelRatio: 2.4,
      homeFillsViewer: true,
      animationTime: 0.08,
      springStiffness: 24,
      zoomPerScroll: 1.6,
      zoomPerClick: 2,
      gestureSettingsMouse: {
        clickToZoom: false,
        dblClickToZoom: true,
        flickEnabled: true,
        zoomToRefPoint: true
      },
      tileSources: {
        type: "image",
        url: `maps/${state.wallLayer}.jpg`
      }
    });

    document.getElementById("wall-zoom").addEventListener("click", (event) => {
      const action = event.target.dataset.zoom;
      if (!action || !viewer) return;
      if (action === "in") viewer.viewport.zoomBy(2, null, true);
      if (action === "out") viewer.viewport.zoomBy(0.5, null, true);
      if (action === "home") viewer.viewport.goHome(true);
      viewer.viewport.applyConstraints();
    });

    document.querySelectorAll("[data-wall]").forEach((button) => {
      button.addEventListener("click", () => {
        const layer = button.dataset.wall;
        if (layer === state.wallLayer || !viewer) return;
        const bounds = viewer.viewport.getBounds();
        state.wallLayer = layer;
        document.querySelectorAll("[data-wall]").forEach((node) => {
          node.classList.toggle("is-active", node === button);
        });
        document.getElementById("wall-caption").textContent = WALL_CAPTIONS[layer];
        viewer.addOnceHandler("open", () => {
          viewer.viewport.fitBounds(bounds, true);
        });
        viewer.open({ type: "image", url: `maps/${layer}.jpg` });
        track("wall_layer", { layer });
      });
    });
  }

  function makeProjection(name, width, height) {
    const pad = 18;
    const rotate = [-state.center, 0];
    const sphere = { type: "Sphere" };
    let projection;
    if (name === "mercator") {
      projection = d3.geoMercator().rotate(rotate).clipExtent([[pad, pad], [width - pad, height - pad]]);
      projection.fitExtent([[pad, pad], [width - pad, height - pad]], {
        type: "Polygon",
        coordinates: [[
          [-180, -75], [180, -75], [180, 75], [-180, 75], [-180, -75]
        ]]
      });
    } else {
      projection = d3.geoEqualEarth().rotate(rotate);
      projection.fitExtent([[pad, pad], [width - pad, height - pad]], sphere);
    }
    return projection;
  }

  async function initAtlas() {
    if (atlasReady) {
      atlas.resize();
      return;
    }
    atlasReady = true;

    const svg = d3.select("#atlas");
    const tooltip = document.getElementById("tooltip");
    const info = document.getElementById("place-info");
    const searchInput = document.getElementById("search");
    const results = document.getElementById("search-results");

    const [countriesTopo, lakesGeo, riversGeo, places] = await Promise.all([
      d3.json("data/countries-50m.json"),
      d3.json("data/lakes-50m.geojson"),
      d3.json("data/rivers-50m.geojson"),
      d3.json("data/places.json")
    ]);

    const countries = topojson.feature(countriesTopo, countriesTopo.objects.countries);
    const g = svg.append("g");
    const spherePath = g.append("path").attr("class", "sphere");
    const graticulePath = g.append("path").attr("class", "graticule");
    const countryLayer = g.append("g").attr("class", "countries");
    const lakeLayer = g.append("g").attr("class", "lakes");
    const riverLayer = g.append("g").attr("class", "rivers");
    const cityLayer = g.append("g").attr("class", "cities");
    const labelLayer = g.append("g").attr("class", "labels");

    const zoom = d3.zoom()
      .scaleExtent([0.8, 28])
      .wheelDelta((event) => {
        const unit = event.deltaMode === 1 ? 0.12 : event.deltaMode ? 1 : 0.006;
        return -event.deltaY * unit * (event.ctrlKey ? 8 : 1);
      })
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        applyDetail(event.transform.k);
      });

    svg.call(zoom);

    let projection;
    let path;

    function applyDetail(k) {
      riverLayer.selectAll("path").style("display", (d) => {
        if (!state.layers.rivers) return "none";
        if (k < 1.8) return d.properties.scalerank <= 3 ? null : "none";
        return d.properties.scalerank <= 6 ? null : "none";
      });
      cityLayer.selectAll("circle")
        .attr("r", (d) => (d.capital ? 3.2 : 2.1) / k)
        .attr("stroke-width", 0.7 / k)
        .style("display", (d) => {
          if (!state.layers.cities) return "none";
          if (k < 1.5) return d.capital ? null : "none";
          if (k < 3.2) return d.capital || d.rank <= 2 || d.pop > 3e6 ? null : "none";
          return null;
        });
      labelLayer.selectAll("text")
        .attr("transform", (d) => `translate(${d.x},${d.y}) scale(${1 / k})`)
        .style("display", k > 2 && state.layers.labels ? null : "none");
    }

    function viewLonLat(width, height, transform) {
      if (!projection || !transform || !transform.k) return null;
      const cx = (width / 2 - transform.x) / transform.k;
      const cy = (height / 2 - transform.y) / transform.k;
      const lonlat = projection.invert([cx, cy]);
      if (!lonlat || !Number.isFinite(lonlat[0]) || !Number.isFinite(lonlat[1])) return null;
      return lonlat;
    }

    function layout({ reset = false } = {}) {
      const node = svg.node();
      const width = node.clientWidth || node.parentElement.clientWidth;
      const height = node.clientHeight || node.parentElement.clientHeight;
      const prev = d3.zoomTransform(svg.node());
      const lonlat = reset ? null : viewLonLat(width, height, prev);
      const keepScale = !reset && prev.k ? prev.k : 1;
      svg.attr("viewBox", `0 0 ${width} ${height}`);
      projection = makeProjection(state.projectionName, width, height);
      path = d3.geoPath(projection);
      draw();
      if (lonlat) {
        const xy = projection(lonlat);
        if (xy && Number.isFinite(xy[0]) && Number.isFinite(xy[1])) {
          svg.call(
            zoom.transform,
            d3.zoomIdentity.translate(width / 2, height / 2).scale(keepScale).translate(-xy[0], -xy[1])
          );
          return;
        }
      }
      svg.call(zoom.transform, reset || !prev.k ? d3.zoomIdentity : prev);
    }

    function draw() {
      spherePath.datum({ type: "Sphere" }).attr("d", path);
      graticulePath.datum(d3.geoGraticule10()).attr("d", path)
        .style("display", state.layers.graticule ? null : "none");

      countryLayer.selectAll("path")
        .data(countries.features, (d) => d.properties.name)
        .join("path")
        .attr("class", "country")
        .attr("fill", (d) => colorFor(d.properties.name))
        .attr("d", path)
        .classed("is-selected", (d) => state.selected && d.properties.name === state.selected)
        .style("display", state.layers.countries ? null : "none")
        .on("pointermove", (event, d) => showTip(event, d.properties.name))
        .on("pointerleave", hideTip)
        .on("click", (event, d) => {
          event.stopPropagation();
          selectCountry(d);
        });

      lakeLayer.selectAll("path")
        .data(lakesGeo.features.filter((d) => d.properties.scalerank <= 2))
        .join("path")
        .attr("class", "lakes")
        .attr("d", path)
        .style("display", state.layers.lakes ? null : "none");

      riverLayer.selectAll("path")
        .data(riversGeo.features.filter((d) => d.properties.featurecla !== "Lake Centerline"))
        .join("path")
        .attr("d", path)
        .style("display", state.layers.rivers ? null : "none");

      const projectedPlaces = places
        .filter((place) => place.capital || place.rank <= 3 || place.pop >= 1e6)
        .map((place) => {
          const xy = projection([place.lon, place.lat]);
          return xy ? { ...place, x: xy[0], y: xy[1] } : null;
        })
        .filter(Boolean);

      cityLayer.selectAll("circle")
        .data(projectedPlaces, (d) => `${d.name}-${d.lon}`)
        .join("circle")
        .attr("class", (d) => d.capital ? "city is-capital" : "city")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .on("pointermove", (event, d) => showTip(event, `${d.name}${d.country ? ` · ${d.country}` : ""}`))
        .on("pointerleave", hideTip)
        .on("click", (event, d) => {
          event.stopPropagation();
          showPlace(d);
          zoomToPoint(d.x, d.y, 8);
        });

      const labeled = projectedPlaces.filter((d) => d.capital || d.rank <= 1 || d.pop > 5e6);
      labelLayer.selectAll("text")
        .data(labeled, (d) => d.name)
        .join("text")
        .attr("class", "label")
        .attr("x", 6)
        .attr("y", 4)
        .text((d) => d.name);

      applyDetail(d3.zoomTransform(svg.node()).k);
    }

    function showTip(event, text) {
      const [x, y] = d3.pointer(event, atlasView);
      tooltip.hidden = false;
      tooltip.textContent = text;
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
    }

    function hideTip() {
      tooltip.hidden = true;
    }

    function showPlace(place) {
      info.hidden = false;
      document.getElementById("info-kicker").textContent = place.capital ? "Capital" : "City";
      document.getElementById("info-title").textContent = place.name;
      document.getElementById("info-meta").textContent = [place.country, formatPop(place.pop)].filter(Boolean).join(" · ");
      document.getElementById("info-area").textContent = "";
    }

    function selectCountry(feature) {
      state.selected = feature.properties.name;
      countryLayer.selectAll("path").classed("is-selected", (d) => d.properties.name === feature.properties.name);
      const area = km2(feature);
      info.hidden = false;
      document.getElementById("info-kicker").textContent = "Country";
      document.getElementById("info-title").textContent = feature.properties.name;
      document.getElementById("info-meta").textContent = "Natural Earth 1:50 million · Equal Earth keeps this area true to scale.";
      document.getElementById("info-area").textContent = `Approximate mapped area: ${Math.round(area).toLocaleString()} km²`;
      zoomToFeature(feature);
      track("select_country", { name: feature.properties.name });
    }

    function zoomToFeature(feature) {
      const bounds = path.bounds(feature);
      const dx = Math.max(bounds[1][0] - bounds[0][0], 1);
      const dy = Math.max(bounds[1][1] - bounds[0][1], 1);
      const x = (bounds[0][0] + bounds[1][0]) / 2;
      const y = (bounds[0][1] + bounds[1][1]) / 2;
      const node = svg.node();
      const width = node.clientWidth;
      const height = node.clientHeight;
      const scale = Math.max(1.2, Math.min(16, 0.72 / Math.max(dx / width, dy / height)));
      svg.call(
        zoom.transform,
        d3.zoomIdentity.translate(width / 2, height / 2).scale(scale).translate(-x, -y)
      );
    }

    function zoomToPoint(x, y, scale) {
      const node = svg.node();
      svg.call(
        zoom.transform,
        d3.zoomIdentity.translate(node.clientWidth / 2, node.clientHeight / 2).scale(scale).translate(-x, -y)
      );
    }

    function search(query) {
      const q = query.trim().toLowerCase();
      if (q.length < 1) {
        results.hidden = true;
        results.innerHTML = "";
        return;
      }
      const countryHits = countries.features
        .filter((d) => d.properties.name.toLowerCase().includes(q))
        .slice(0, 6)
        .map((d) => ({ kind: "country", name: d.properties.name, feature: d }));
      const cityHits = places
        .filter((d) => d.name.toLowerCase().includes(q))
        .slice(0, 6)
        .map((d) => ({ kind: "city", ...d }));
      const hits = [...countryHits, ...cityHits].slice(0, 8);
      results.hidden = hits.length === 0;
      results.innerHTML = hits.map((hit, index) => `
        <li>
          <button type="button" data-i="${index}">
            ${hit.name}
            <small>${hit.kind === "country" ? "Country" : `${hit.country || "City"}${hit.capital ? " · capital" : ""}`}</small>
          </button>
        </li>
      `).join("");
      results.querySelectorAll("button").forEach((button, index) => {
        button.addEventListener("click", () => {
          const hit = hits[index];
          results.hidden = true;
          searchInput.value = hit.name;
          if (hit.kind === "country") selectCountry(hit.feature);
          else {
            const xy = projection([hit.lon, hit.lat]);
            if (xy) {
              showPlace(hit);
              zoomToPoint(xy[0], xy[1], 8);
            }
          }
        });
      });
    }

    svg.on("click", () => {
      state.selected = null;
      countryLayer.selectAll("path").classed("is-selected", false);
    });

    searchInput.addEventListener("input", () => search(searchInput.value));

    document.querySelectorAll("[data-proj]").forEach((button) => {
      button.addEventListener("click", () => {
        state.projectionName = button.dataset.proj;
        document.querySelectorAll("[data-proj]").forEach((node) => node.classList.toggle("is-active", node === button));
        layout();
        track("projection", { projection: state.projectionName });
      });
    });

    document.querySelectorAll("[data-center]").forEach((button) => {
      button.addEventListener("click", () => {
        state.center = Number(button.dataset.center);
        document.querySelectorAll("[data-center]").forEach((node) => node.classList.toggle("is-active", node === button));
        layout();
      });
    });

    document.querySelectorAll("[data-layer]").forEach((input) => {
      input.addEventListener("change", () => {
        state.layers[input.dataset.layer] = input.checked;
        draw();
      });
    });

    document.getElementById("atlas-zoom").addEventListener("click", (event) => {
      const action = event.target.dataset.zoom;
      if (!action) return;
      if (action === "home") {
        layout({ reset: true });
        return;
      }
      const factor = action === "in" ? 2 : 0.5;
      svg.call(zoom.scaleBy, factor);
    });

    window.addEventListener("resize", () => {
      if (state.mode === "atlas") layout();
    });

    atlas = { resize: () => layout(), zoom };
    layout({ reset: true });
  }

  function setMode(mode) {
    state.mode = mode;
    document.querySelectorAll(".mode-btn").forEach((button) => {
      const active = button.dataset.mode === mode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    wallView.classList.toggle("is-visible", mode === "wall");
    atlasView.classList.toggle("is-visible", mode === "atlas");
    wallView.hidden = mode !== "wall";
    atlasView.hidden = mode !== "atlas";
    if (mode === "atlas") initAtlas();
    if (mode === "wall") {
      if (!viewer) initWall();
      else viewer.viewport.resize();
    }
    track("mode", { mode });
  }

  document.querySelectorAll(".mode-btn").forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });

  document.getElementById("about-open").addEventListener("click", () => about.showModal());
  document.getElementById("about-close").addEventListener("click", () => about.close());

  window.addEventListener("keydown", (event) => {
    if (event.target.matches("input, textarea")) return;
    const zoomRoot = state.mode === "wall" ? document.getElementById("wall-zoom") : document.getElementById("atlas-zoom");
    if (event.key === "+" || event.key === "=") zoomRoot.querySelector("[data-zoom=in]").click();
    if (event.key === "-" || event.key === "_") zoomRoot.querySelector("[data-zoom=out]").click();
    if (event.key === "0") zoomRoot.querySelector("[data-zoom=home]").click();
    if (event.key === "Escape") about.close();
  });

  setMode("atlas");
})();
