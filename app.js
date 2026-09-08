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

  function isCompactView() {
    return window.matchMedia("(max-width: 720px)").matches;
  }

  function placePriority(place) {
    if (place.capital && (place.rank <= 1 || place.pop > 5e6)) return 4;
    if (place.capital) return 3;
    if (place.pop > 5e6) return 2;
    if (place.rank <= 1) return 1;
    return 0;
  }

  function showCityDot(place, k, compact) {
    if (!state.layers.cities) return false;
    if (compact) {
      if (k < 2.4) return false;
      if (k < 4.5) return place.capital && (place.rank <= 1 || place.pop > 3e6);
      if (k < 6.5) return place.capital || place.rank <= 2 || place.pop > 3e6;
      return true;
    }
    return k >= 3.2 || place.capital || (k >= 1.5 && (place.rank <= 2 || place.pop > 3e6)) || (k < 1.5 && place.capital);
  }

  function showPlaceLabel(place, k, compact) {
    if (!state.layers.labels) return false;
    if (compact) {
      if (k < 6) return false;
      if (k < 9) return place.capital && (place.rank <= 1 || place.pop > 2e6);
      return place.capital || place.rank <= 1 || place.pop > 3e6;
    }
    return k > 2 && (place.capital || place.rank <= 1 || place.pop > 5e6);
  }

  function boxesOverlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

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

  const MERCATOR_MAX_LAT = 87;

  function mercatorWorld() {
    return {
      type: "Polygon",
      coordinates: [[
        [-180, -MERCATOR_MAX_LAT],
        [180, -MERCATOR_MAX_LAT],
        [180, MERCATOR_MAX_LAT],
        [-180, MERCATOR_MAX_LAT],
        [-180, -MERCATOR_MAX_LAT]
      ]]
    };
  }

  function projectionExtent(width, height) {
    const pad = 18;
    const extent = [[pad, pad], [width - pad, height - pad]];
    const view = atlasView.getBoundingClientRect();
    if (!view.width) return extent;
    const left = document.querySelector("#atlas-view .map-chrome.left");
    if (left) {
      const box = left.getBoundingClientRect();
      if (box.width > view.width * 0.55) {
        extent[0][1] = Math.max(pad, Math.round(box.bottom - view.top + 16));
      }
    }
    return extent;
  }

  function makeProjection(name, width, height) {
    const rotate = [-state.center, 0];
    const extent = projectionExtent(width, height);
    if (name === "mercator") {
      const projection = d3.geoMercator().rotate(rotate);
      projection.fitExtent(extent, mercatorWorld());
      const extra = Math.max(width, height) * 2;
      projection.clipExtent([
        [extent[0][0] - extra, extent[0][1] - extra],
        [extent[1][0] + extra, extent[1][1] + extra]
      ]);
      return projection;
    }
    return d3.geoEqualEarth().rotate(rotate).fitExtent(extent, { type: "Sphere" });
  }

  async function initAtlas() {
    if (atlasReady) {
      atlas.resize();
      return;
    }
    atlasReady = true;

    const stage = document.getElementById("atlas-stage");
    const mapCanvas = document.getElementById("atlas-map");
    const overlayCanvas = document.getElementById("atlas-overlay");
    const mapCtx = mapCanvas.getContext("2d", { alpha: false });
    const overCtx = overlayCanvas.getContext("2d");
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
    const lakes = lakesGeo.features.filter((d) => d.properties.scalerank <= 2);
    const rivers = riversGeo.features.filter((d) => d.properties.featurecla !== "Lake Centerline");
    const citySource = places.filter((place) => place.capital || place.rank <= 3 || place.pop >= 1e6);
    const graticule = d3.geoGraticule10();

    let width = 0;
    let height = 0;
    let dpr = 1;
    let projection;
    let path;
    let baked = d3.zoomIdentity;
    let currentTransform = d3.zoomIdentity;
    let hoverName = null;
    let countryCache = [];
    let lakePath;
    let riverPaths = [];
    let spherePath;
    let graticulePath;
    let interacting = false;

    const zoom = d3.zoom()
      .scaleExtent([0.8, 28])
      .duration(0)
      .wheelDelta((event) => {
        const unit = event.deltaMode === 1 ? 0.12 : event.deltaMode ? 1 : 0.006;
        return -event.deltaY * unit * (event.ctrlKey ? 8 : 1);
      })
      .on("start", (event) => {
        if (!event.sourceEvent) return;
        interacting = true;
        stage.classList.add("is-zooming");
      })
      .on("zoom", (event) => {
        currentTransform = event.transform;
        applyCss(event.transform);
      })
      .on("end", (event) => {
        currentTransform = event.transform;
        interacting = false;
        bake(event.transform);
        stage.classList.remove("is-zooming");
        drawOverlay();
      });

    d3.select(stage).call(zoom);

    function applyCss(t) {
      const s = t.k / baked.k;
      mapCanvas.style.transform = `translate(${t.x - baked.x * s}px, ${t.y - baked.y * s}px) scale(${s})`;
    }

    function sizeCanvases() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(width * dpr);
      const h = Math.round(height * dpr);
      if (mapCanvas.width === w && mapCanvas.height === h) {
        mapCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        overCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return;
      }
      for (const canvas of [mapCanvas, overlayCanvas]) {
        canvas.width = w;
        canvas.height = h;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
      mapCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      overCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function rebuildPaths() {
      path = d3.geoPath(projection);
      spherePath = new Path2D(path(state.projectionName === "mercator" ? mercatorWorld() : { type: "Sphere" }));
      graticulePath = new Path2D(path(graticule));
      countryCache = countries.features.map((feature) => ({
        feature,
        name: feature.properties.name,
        color: colorFor(feature.properties.name),
        path2d: new Path2D(path(feature))
      }));
      lakePath = new Path2D(path({ type: "FeatureCollection", features: lakes }));
      riverPaths = rivers.map((feature) => ({
        rank: feature.properties.scalerank,
        path2d: new Path2D(path(feature))
      }));
    }

    function bake(t) {
      baked = t;
      mapCanvas.style.transform = "none";
      mapCtx.fillStyle = "#b9d2df";
      mapCtx.fillRect(0, 0, width, height);
      mapCtx.save();
      mapCtx.translate(t.x, t.y);
      mapCtx.scale(t.k, t.k);
      mapCtx.fillStyle = "#b9d2df";
      mapCtx.fill(spherePath);
      if (state.projectionName !== "mercator") {
        mapCtx.strokeStyle = "#7f9aa8";
        mapCtx.lineWidth = 1 / t.k;
        mapCtx.stroke(spherePath);
      }
      if (state.layers.graticule) {
        mapCtx.strokeStyle = "rgba(255,255,255,0.28)";
        mapCtx.lineWidth = 0.7 / t.k;
        mapCtx.stroke(graticulePath);
      }
      if (state.layers.countries) {
        mapCtx.strokeStyle = "rgba(60,48,32,0.35)";
        mapCtx.lineWidth = 0.6 / t.k;
        for (const item of countryCache) {
          mapCtx.fillStyle = item.color;
          mapCtx.fill(item.path2d);
          mapCtx.stroke(item.path2d);
        }
      }
      if (state.layers.lakes) {
        mapCtx.fillStyle = "#8fb8cc";
        mapCtx.fill(lakePath);
      }
      if (state.layers.rivers) {
        mapCtx.strokeStyle = "#6a9bb0";
        mapCtx.lineCap = "round";
        for (const river of riverPaths) {
          if ((t.k < 1.8 && river.rank > 3) || river.rank > 6) continue;
          mapCtx.lineWidth = (river.rank <= 2 ? 1.15 : 0.65) / t.k;
          mapCtx.stroke(river.path2d);
        }
      }
      mapCtx.restore();
    }

    function drawOverlay() {
      overCtx.clearRect(0, 0, width, height);
      const t = currentTransform;
      const highlight = hoverName || state.selected;
      if (highlight) {
        const item = countryCache.find((entry) => entry.name === highlight);
        if (item) {
          overCtx.save();
          overCtx.translate(t.x, t.y);
          overCtx.scale(t.k, t.k);
          overCtx.filter = hoverName === item.name ? "brightness(1.14) saturate(1.2)" : "none";
          overCtx.fillStyle = item.color;
          overCtx.fill(item.path2d);
          overCtx.filter = "none";
          overCtx.strokeStyle = hoverName === item.name ? "#9a4032" : "#141b23";
          overCtx.lineWidth = (hoverName === item.name ? 2 : 1.6) / t.k;
          overCtx.stroke(item.path2d);
          overCtx.restore();
        }
      }
      if (!state.layers.cities && !state.layers.labels) return;
      const compact = isCompactView();
      overCtx.save();
      overCtx.font = compact ? "600 10px 'Segoe UI', sans-serif" : "600 11px 'Segoe UI', sans-serif";
      overCtx.textBaseline = "middle";
      const labelCandidates = [];
      for (const place of citySource) {
        const xy = projection([place.lon, place.lat]);
        if (!xy) continue;
        const [x, y] = t.apply(xy);
        if (x < -40 || y < -20 || x > width + 40 || y > height + 20) continue;
        if (showCityDot(place, t.k, compact)) {
          overCtx.beginPath();
          overCtx.fillStyle = place.capital ? "#c45c4a" : "#141b23";
          overCtx.arc(x, y, place.capital ? 3.2 : 2.1, 0, Math.PI * 2);
          overCtx.fill();
          overCtx.strokeStyle = "#fff";
          overCtx.lineWidth = 1;
          overCtx.stroke();
        }
        if (showPlaceLabel(place, t.k, compact)) {
          labelCandidates.push({ place, x, y });
        }
      }
      labelCandidates.sort((a, b) => placePriority(b.place) - placePriority(a.place));
      const placed = [];
      overCtx.strokeStyle = "rgba(250,247,240,0.9)";
      overCtx.lineWidth = 3;
      overCtx.lineJoin = "round";
      overCtx.fillStyle = "#243040";
      for (const item of labelCandidates) {
        const w = overCtx.measureText(item.place.name).width;
        const box = { x: item.x + 4, y: item.y - 7, w: w + 8, h: 14 };
        if (placed.some((other) => boxesOverlap(box, other))) continue;
        placed.push(box);
        overCtx.strokeText(item.place.name, item.x + 6, item.y);
        overCtx.fillText(item.place.name, item.x + 6, item.y);
      }
      overCtx.restore();
    }

    function viewLonLat(transform) {
      if (!projection || !transform || !transform.k) return null;
      const lonlat = projection.invert([(width / 2 - transform.x) / transform.k, (height / 2 - transform.y) / transform.k]);
      if (!lonlat || !Number.isFinite(lonlat[0]) || !Number.isFinite(lonlat[1])) return null;
      return lonlat;
    }

    function layout({ reset = false } = {}) {
      width = stage.clientWidth || atlasView.clientWidth;
      height = stage.clientHeight || atlasView.clientHeight;
      const prev = currentTransform;
      const lonlat = reset ? null : viewLonLat(prev);
      const keepScale = !reset && prev.k ? prev.k : 1;
      projection = makeProjection(state.projectionName, width, height);
      rebuildPaths();
      sizeCanvases();
      let next = d3.zoomIdentity;
      if (lonlat) {
        const xy = projection(lonlat);
        if (xy && Number.isFinite(xy[0]) && Number.isFinite(xy[1])) {
          next = d3.zoomIdentity.translate(width / 2, height / 2).scale(keepScale).translate(-xy[0], -xy[1]);
        }
      } else if (!reset && prev.k) {
        next = prev;
      }
      currentTransform = next;
      baked = next;
      mapCanvas.style.transform = "none";
      d3.select(stage).call(zoom.transform, next);
      bake(next);
      drawOverlay();
    }

    function countryAt(screenX, screenY) {
      const [x, y] = currentTransform.invert([screenX, screenY]);
      for (let i = countryCache.length - 1; i >= 0; i -= 1) {
        if (mapCtx.isPointInPath(countryCache[i].path2d, x * dpr, y * dpr, "evenodd")) {
          return countryCache[i];
        }
      }
      return null;
    }

    function cityAt(screenX, screenY) {
      if (!state.layers.cities) return null;
      for (const place of citySource) {
        const xy = projection([place.lon, place.lat]);
        if (!xy) continue;
        const [x, y] = currentTransform.apply(xy);
        const r = place.capital ? 6 : 4;
        if ((screenX - x) ** 2 + (screenY - y) ** 2 <= r * r) return place;
      }
      return null;
    }

    function showTip(x, y, text) {
      tooltip.hidden = false;
      tooltip.textContent = text;
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
    }

    function hideTip() {
      tooltip.hidden = true;
    }

    function hidePlace() {
      state.selected = null;
      info.hidden = true;
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
      const area = km2(feature);
      info.hidden = false;
      document.getElementById("info-kicker").textContent = "Country";
      document.getElementById("info-title").textContent = feature.properties.name;
      document.getElementById("info-meta").textContent = "Natural Earth 1:50 million · Equal Earth keeps this area true to scale.";
      document.getElementById("info-area").textContent = `Approximate mapped area: ${Math.round(area).toLocaleString()} km²`;
      zoomToFeature(feature);
      drawOverlay();
      track("select_country", { name: feature.properties.name });
    }

    function zoomToFeature(feature) {
      const bounds = path.bounds(feature);
      const dx = Math.max(bounds[1][0] - bounds[0][0], 1);
      const dy = Math.max(bounds[1][1] - bounds[0][1], 1);
      const x = (bounds[0][0] + bounds[1][0]) / 2;
      const y = (bounds[0][1] + bounds[1][1]) / 2;
      const scale = Math.max(1.2, Math.min(16, 0.72 / Math.max(dx / width, dy / height)));
      d3.select(stage).call(
        zoom.transform,
        d3.zoomIdentity.translate(width / 2, height / 2).scale(scale).translate(-x, -y)
      );
    }

    function zoomToPoint(x, y, scale) {
      d3.select(stage).call(
        zoom.transform,
        d3.zoomIdentity.translate(width / 2, height / 2).scale(scale).translate(-x, -y)
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
      results.innerHTML = hits.map((hit) => `
        <li>
          <button type="button">
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
          closeSheets();
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

    stage.addEventListener("pointermove", (event) => {
      if (interacting) return;
      const [vx, vy] = d3.pointer(event, atlasView);
      const [sx, sy] = d3.pointer(event, stage);
      const city = cityAt(sx, sy);
      if (city) {
        if (hoverName !== null) {
          hoverName = null;
          drawOverlay();
        }
        showTip(vx, vy, `${city.name}${city.country ? ` · ${city.country}` : ""}`);
        stage.style.cursor = "pointer";
        return;
      }
      const hit = countryAt(sx, sy);
      const next = hit ? hit.name : null;
      if (next !== hoverName) {
        hoverName = next;
        drawOverlay();
      }
      if (hit) {
        showTip(vx, vy, hit.name);
        stage.style.cursor = "pointer";
      } else {
        hideTip();
        stage.style.cursor = "grab";
      }
    });

    stage.addEventListener("pointerleave", () => {
      hoverName = null;
      hideTip();
      drawOverlay();
    });

    stage.addEventListener("click", (event) => {
      const [sx, sy] = d3.pointer(event, stage);
      const city = cityAt(sx, sy);
      if (city) {
        closeSheets();
        showPlace(city);
        const xy = projection([city.lon, city.lat]);
        if (xy) zoomToPoint(xy[0], xy[1], 8);
        return;
      }
      const hit = countryAt(sx, sy);
      if (hit) {
        closeSheets();
        selectCountry(hit.feature);
      } else {
        hidePlace();
        drawOverlay();
      }
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
        bake(currentTransform);
        drawOverlay();
      });
      input.addEventListener("click", (event) => event.stopPropagation());
    });

    const controls = document.getElementById("atlas-controls");
    controls.addEventListener("click", (event) => event.stopPropagation());
    controls.addEventListener("pointerdown", (event) => event.stopPropagation());

    document.getElementById("atlas-zoom").addEventListener("click", (event) => {
      const action = event.target.dataset.zoom;
      if (!action) return;
      if (action === "home") {
        layout({ reset: true });
        return;
      }
      d3.select(stage).call(zoom.scaleBy, action === "in" ? 2 : 0.5);
    });

    document.getElementById("info-close").addEventListener("click", (event) => {
      event.stopPropagation();
      hidePlace();
      drawOverlay();
    });

    window.addEventListener("resize", onViewportChange);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", onViewportChange);
    }

    function onViewportChange() {
      if (state.mode === "atlas") layout();
    }

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
    closeSheets();
    if (mode === "atlas") initAtlas();
    if (mode === "wall") {
      if (!viewer) initWall();
      else viewer.viewport.resize();
    }
    track("mode", { mode });
  }

  function closeSheets() {
    document.querySelectorAll(".sheet.is-open").forEach((sheet) => sheet.classList.remove("is-open"));
    document.querySelectorAll(".sheet-toggle").forEach((button) => button.setAttribute("aria-expanded", "false"));
    document.body.classList.remove("sheet-open");
  }

  function toggleSheet(id) {
    const sheet = document.getElementById(id);
    const button = document.querySelector(`[aria-controls="${id}"]`);
    const open = !sheet.classList.contains("is-open");
    closeSheets();
    if (open) {
      const results = document.getElementById("search-results");
      if (results) results.hidden = true;
      sheet.classList.add("is-open");
      if (button) button.setAttribute("aria-expanded", "true");
      document.body.classList.add("sheet-open");
    }
  }

  document.getElementById("atlas-controls-toggle").addEventListener("click", (event) => {
    event.stopPropagation();
    toggleSheet("atlas-controls");
  });
  document.querySelectorAll(".sheet-close").forEach((button) => {
    button.addEventListener("click", closeSheets);
  });
  document.getElementById("sheet-backdrop").addEventListener("click", closeSheets);

  document.querySelectorAll(".mode-btn").forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });

  function githubRepo() {
    return (window.EQUAL_EARTH_SITE && window.EQUAL_EARTH_SITE.githubRepo) || "brunocabezas/equal-earth-map";
  }

  function isLocalHost() {
    return location.protocol === "file:" || location.hostname === "localhost" || location.hostname === "127.0.0.1";
  }

  function renderAboutVersion(sha, dateIso) {
    const el = document.getElementById("about-version");
    if (!el || !sha) return;
    const short = sha.slice(0, 7);
    const date = dateIso ? dateIso.slice(0, 10) : "";
    const link = document.createElement("a");
    link.href = `https://github.com/${githubRepo()}/commit/${sha}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.tabIndex = -1;
    link.textContent = short;
    el.replaceChildren("Version ", link, date ? ` · ${date}` : "");
  }

  async function loadAboutVersion() {
    const el = document.getElementById("about-version");
    if (!el || el.dataset.loaded === "true") return;
    el.dataset.loaded = "true";

    try {
      const cacheKey = "equal-earth-version";
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        renderAboutVersion(parsed.sha, parsed.date);
        return;
      }

      const res = await fetch(`https://api.github.com/repos/${githubRepo()}/commits/master`, {
        headers: { Accept: "application/vnd.github+json" }
      });
      if (!res.ok) throw new Error("version fetch failed");
      const data = await res.json();
      const payload = { sha: data.sha, date: data.commit && data.commit.committer && data.commit.committer.date };
      sessionStorage.setItem(cacheKey, JSON.stringify(payload));
      renderAboutVersion(payload.sha, payload.date);
    } catch {
      el.textContent = isLocalHost() ? "Version local" : "Version unavailable";
    }
  }

  document.getElementById("about-open").addEventListener("click", () => {
    about.showModal();
    loadAboutVersion();
  });
  document.getElementById("about-close").addEventListener("click", () => about.close());

  window.addEventListener("resize", () => {
    if (state.mode === "wall" && viewer) viewer.viewport.resize();
  });

  window.addEventListener("keydown", (event) => {
    if (event.target.matches("input, textarea")) return;
    const zoomRoot = state.mode === "wall" ? document.getElementById("wall-zoom") : document.getElementById("atlas-zoom");
    if (event.key === "+" || event.key === "=") zoomRoot.querySelector("[data-zoom=in]").click();
    if (event.key === "-" || event.key === "_") zoomRoot.querySelector("[data-zoom=out]").click();
    if (event.key === "0") zoomRoot.querySelector("[data-zoom=home]").click();
    if (event.key === "Escape") {
      closeSheets();
      about.close();
    }
  });

  setMode("atlas");
})();
