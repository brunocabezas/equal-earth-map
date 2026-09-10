(() => {
  function requireElement<T extends HTMLElement>(id: string): T {
    const el = document.getElementById(id);
    if (!el) throw new Error(`Missing #${id}`);
    return el as T;
  }

  function isViewMode(value: string | undefined): value is ViewMode {
    return value === "atlas" || value === "wall";
  }

  function isWallLayer(value: string | undefined): value is WallLayer {
    return value === "political" || value === "physical";
  }

  function isLayerName(value: string | undefined): value is LayerName {
    return value === "countries" || value === "lakes" || value === "rivers"
      || value === "cities" || value === "labels" || value === "graticule";
  }

  function isZoomAction(value: string | undefined): value is ZoomAction {
    return value === "in" || value === "out" || value === "home";
  }

  function hasPath<T extends { path2d: Path2D | null }>(item: T): item is T & { path2d: Path2D } {
    return item.path2d !== null;
  }

  function isPlaceList(value: unknown): value is Place[] {
    return Array.isArray(value);
  }

  const PALETTE = [
    "#ffddd2", "#f3cfc0", "#e8c4b4", "#f5d4c8",
    "#d4e8ea", "#c5ddd6", "#b8d4cc", "#cfe0dc",
    "#e8d0c4", "#dcc8bc", "#c9d8d2", "#e4ddd4",
    "#ffd8cc", "#d0ddd8", "#ecd4c8"
  ] as const;
  const OVERLAY_HOVER_MIN_FACTOR = 1.5;
  const MAP = {
    ocean: "#b9d2df",
    lake: "#8fb8cc",
    river: "#6a9bb0",
    sphere: "#7f9aa8",
    countryStroke: "rgba(5,74,82,0.28)",
    hover: "#054a52",
    hoverFill: "rgba(5,74,82,0.07)",
    selected: "#032f34",
    mercFill: "rgba(194,97,72,0.4)",
    mercStroke: "#c26148",
    mercMuteFill: "rgba(77,115,120,0.2)",
    mercMuteStroke: "rgba(77,115,120,0.55)",
    capital: "#e29578",
    city: "#032f34",
    label: "#054a52",
    labelHalo: "rgba(237,246,249,0.9)",
    graticule: "rgba(237,246,249,0.35)"
  } as const satisfies DeepReadonly<Record<string, string>>;

  const WALL_CAPTIONS: Record<WallLayer, string> = {
    political:
      "Patterson political wall map, Oceania centering (150°E). Drag, scroll, pinch, or double-click to explore.",
    physical:
      "BMZ physical Equal Earth map with terrain, vegetation, and ocean floor. Drag, scroll, pinch, or double-click to explore."
  };

  const state: AtlasState = {
    mode: "atlas",
    wallLayer: "political",
    projections: {
      equalEarth: true,
      mercator: true
    },
    center: 0,
    layers: {
      countries: true,
      lakes: true,
      rivers: true,
      cities: true,
      labels: true,
      graticule: true
    },
    compareMode: "always",
    selected: null
  };

  function overlayMode() {
    return state.projections.equalEarth && state.projections.mercator;
  }

  function baseProjectionName(): ProjectionName {
    return state.projections.equalEarth ? "equalEarth" : "mercator";
  }

  let viewer: OsdViewer | null = null;
  let atlasReady = false;
  let atlas: { resize: () => void } | null = null;

  const wallView = requireElement("wall-view");
  const atlasView = requireElement("atlas-view");
  const about = requireElement<HTMLDialogElement>("about");

  function isCompactView() {
    return window.matchMedia("(max-width: 720px)").matches;
  }

  function placePriority(place: Place) {
    if (place.capital && (place.rank <= 1 || place.pop > 5e6)) return 4;
    if (place.capital) return 3;
    if (place.pop > 5e6) return 2;
    if (place.rank <= 1) return 1;
    return 0;
  }

  function showCityDot(place: Place, k: number, compact: boolean) {
    if (!state.layers.cities) return false;
    if (compact) {
      if (k < 2.4) return false;
      if (k < 4.5) return Boolean(place.capital && (place.rank <= 1 || place.pop > 3e6));
      if (k < 6.5) return Boolean(place.capital || place.rank <= 2 || place.pop > 3e6);
      return true;
    }
    return k >= 3.2 || Boolean(place.capital) || (k >= 1.5 && (place.rank <= 2 || place.pop > 3e6)) || (k < 1.5 && Boolean(place.capital));
  }

  function showPlaceLabel(place: Place, k: number, compact: boolean) {
    if (!state.layers.labels) return false;
    if (compact) {
      if (k < 6) return false;
      if (k < 9) return Boolean(place.capital && (place.rank <= 1 || place.pop > 2e6));
      return Boolean(place.capital || place.rank <= 1 || place.pop > 3e6);
    }
    return k > 2 && Boolean(place.capital || place.rank <= 1 || place.pop > 5e6);
  }

  function boxesOverlap(a: LabelBox, b: LabelBox) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function colorFor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i += 1) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return PALETTE[Math.abs(hash) % PALETTE.length];
  }

  function formatPop(n: number) {
    if (!n) return "";
    if (n >= 1e6) return `${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1)} million`;
    if (n >= 1e3) return `${Math.round(n / 1e3)} thousand`;
    return String(n);
  }

  function km2(feature: CountryFeature) {
    return d3.geoArea(feature) * 6371.0088 * 6371.0088;
  }

  function formatAreaKm2(area: number, { approx = false }: { approx?: boolean } = {}) {
    if (!Number.isFinite(area) || area <= 0) return "—";
    const rounded = Math.round(area);
    const text = `${rounded.toLocaleString()} km²`;
    return approx ? `~${text}` : text;
  }

  function formatFactor(n: number) {
    if (n >= 40) return String(Math.round(n));
    if (n >= 10) return n.toFixed(0);
    if (n >= 2) return n.toFixed(1);
    return n.toFixed(2);
  }

  function formatInflation(ratio: number | null | undefined) {
    if (ratio == null || !Number.isFinite(ratio) || ratio <= 0) return null;
    if (ratio > 1) return `${formatFactor(ratio)}× larger`;
    if (ratio < 1) return `${formatFactor(1 / ratio)}× smaller`;
    return "1.00×";
  }

  function equatorAnchor(projection: GeoProjection, lon0: number) {
    const origin = projection([lon0, 0]);
    const east = projection([lon0 + 1, 0]);
    if (!origin || !east) return null;
    return {
      origin,
      pxPerDeg: Math.hypot(east[0] - origin[0], east[1] - origin[1])
    };
  }

  function alignProjectionTo(source: GeoProjection, target: GeoProjection, width: number, height: number, lon0: number) {
    const desired = equatorAnchor(target, lon0);
    if (!desired) return source;
    source.translate([width / 2, height / 2]);
    const first = equatorAnchor(source, lon0);
    if (!first || first.pxPerDeg <= 0) return source;
    source.scale(source.scale() * desired.pxPerDeg / first.pxPerDeg);
    const origin = source([lon0, 0]);
    if (origin) {
      const t = source.translate();
      source.translate([t[0] + desired.origin[0] - origin[0], t[1] + desired.origin[1] - origin[1]]);
    }
    const extra = Math.max(width, height) * 4;
    source.clipExtent([[-extra, -extra], [width + extra, height + extra]]);
    return source;
  }

  function makeMeasurePair() {
    const ee = d3.geoEqualEarth().fitExtent([[20, 20], [420, 420]], { type: "Sphere" });
    const merc = d3.geoMercator().fitExtent([[20, 20], [420, 420]], mercatorWorld());
    alignProjectionTo(merc, ee, 440, 440, 0);
    return { ee, merc };
  }

  function track<K extends keyof AnalyticsEvents>(event: K, props: AnalyticsEvents[K]) {
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

    requireElement("wall-zoom").addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const action = target.closest("[data-zoom]")?.getAttribute("data-zoom") ?? undefined;
      if (!isZoomAction(action) || !viewer) return;
      if (action === "in") viewer.viewport.zoomBy(2, undefined, true);
      if (action === "out") viewer.viewport.zoomBy(0.5, undefined, true);
      if (action === "home") viewer.viewport.goHome(true);
      viewer.viewport.applyConstraints();
    });

    document.querySelectorAll<HTMLElement>("[data-wall]").forEach((button) => {
      button.addEventListener("click", () => {
        const layer = button.dataset.wall;
        if (!isWallLayer(layer) || layer === state.wallLayer || !viewer) return;
        const bounds = viewer.viewport.getBounds();
        state.wallLayer = layer;
        document.querySelectorAll<HTMLElement>("[data-wall]").forEach((node) => {
          node.classList.toggle("is-active", node === button);
        });
        requireElement("wall-caption").textContent = WALL_CAPTIONS[layer];
        viewer.addOnceHandler("open", () => {
          viewer.viewport.fitBounds(bounds, true);
        });
        viewer.open({ type: "image", url: `maps/${layer}.jpg` });
        track("wall_layer", { layer });
      });
    });
  }

  const MERCATOR_MAX_LAT = 87;

  function mercatorWorld(): GeoJSON.Polygon {
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

  function projectionExtent(width: number, height: number): [[number, number], [number, number]] {
    const pad = 18;
    const extent: [[number, number], [number, number]] = [[pad, pad], [width - pad, height - pad]];
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

  function makeProjection(name: ProjectionName, width: number, height: number) {
    const rotate: [number, number] = [-state.center, 0];
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
      atlas?.resize();
      return;
    }

    const stage = requireElement("atlas-stage");
    const mapCanvas = requireElement<HTMLCanvasElement>("atlas-map");
    const overlayCanvas = requireElement<HTMLCanvasElement>("atlas-overlay");
    const mapCtxMaybe = mapCanvas.getContext("2d", { alpha: false });
    const overCtxMaybe = overlayCanvas.getContext("2d");
    if (!mapCtxMaybe || !overCtxMaybe) return;
    const mapCtx = mapCtxMaybe;
    const overCtx = overCtxMaybe;
    const hideCanvas = document.createElement("canvas");
    const hideCtxMaybe = hideCanvas.getContext("2d", { willReadFrequently: true });
    if (!hideCtxMaybe) return;
    const hideCtx = hideCtxMaybe;
    const tooltip = requireElement("tooltip");
    const info = requireElement("place-info");
    const searchInput = requireElement<HTMLInputElement>("search");
    const results = requireElement("search-results");

    const status = document.getElementById("atlas-status");
    const setStatus = (message: string, isError = false) => {
      if (!status) return;
      if (!message) {
        status.hidden = true;
        status.textContent = "";
        status.classList.remove("is-error");
        return;
      }
      status.hidden = false;
      status.textContent = message;
      status.classList.toggle("is-error", isError);
    };

    let countriesTopo: CountriesTopology | undefined;
    let lakesGeo: LakeCollection | undefined;
    let riversGeo: RiverCollection | undefined;
    let places: Place[] | undefined;
    try {
      [countriesTopo, lakesGeo, riversGeo, places] = await Promise.all([
        d3.json<CountriesTopology>("data/countries-50m.json"),
        d3.json<LakeCollection>("data/lakes-50m.geojson"),
        d3.json<RiverCollection>("data/rivers-50m.geojson"),
        d3.json<Place[]>("data/places.json")
      ]);
    } catch {
      setStatus("Could not load map data. Refresh the page to try again.", true);
      return;
    }
    if (!countriesTopo || !lakesGeo || !riversGeo || !isPlaceList(places) || !countriesTopo.objects.countries) {
      setStatus("Could not load map data. Refresh the page to try again.", true);
      return;
    }
    atlasReady = true;
    setStatus("");

    const countries = topojson.feature(countriesTopo, countriesTopo.objects.countries) as CountryCollection;
    const lakes = lakesGeo.features.filter((d: LakeFeature) => d.properties.scalerank <= 2);
    const rivers = riversGeo.features.filter((d: RiverFeature) => d.properties.featurecla !== "Lake Centerline");
    const placeList = places;
    const citySource = placeList.filter((place) => place.capital || place.rank <= 3 || place.pop >= 1e6);
    const graticule = d3.geoGraticule10();

    let width = 0;
    let height = 0;
    let dpr = 1;
    let projection: GeoProjection;
    let path: GeoPath;
    let baked: ZoomTransform = d3.zoomIdentity;
    let currentTransform: ZoomTransform = d3.zoomIdentity;
    let hoverName: string | null = null;
    let countryCache: CountryCacheItem[] = [];
    const countryByName = new Map<string, CountryCacheItem>();
    let overlayGhosts: CountryCacheItem[] = [];
    let overlayHoverGhosts: OverlayGhost[] = [];
    let clipToSphere = false;
    let overlayFrame = 0;
    let pendingPointer: { vx: number; vy: number; sx: number; sy: number } | null = null;
    let hideGhosts: OverlayGhost[] = [];
    let hideGhostsKey = "";
    let hideMask: Uint8ClampedArray | null = null;
    let hideMaskW = 0;
    let hideMaskH = 0;
    let lakePath: Path2D | null;
    let riverPaths: RiverPath[] = [];
    let spherePath: Path2D | null;
    let graticulePath: Path2D | null;
    let interacting = false;
    const sizeIndex = new Map<string, SizeStats>();
    {
      const pair = makeMeasurePair();
      const eePath = d3.geoPath(pair.ee);
      const mercPath = d3.geoPath(pair.merc);
      for (const feature of countries.features) {
        const trueKm2 = km2(feature);
        const eeArea = Math.abs(eePath.area(feature));
        const mercArea = Math.abs(mercPath.area(feature));
        const ratio = eeArea > 1 ? mercArea / eeArea : null;
        sizeIndex.set(feature.properties.name, {
          trueKm2,
          ratio: Number.isFinite(ratio) && ratio !== null && ratio > 0 ? ratio : null
        });
      }
    }

    const zoom = d3.zoom<HTMLElement, unknown>()
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

    function applyCss(t: ZoomTransform) {
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

    function asPath2D(generator: GeoPath, object: D3GeoObject) {
      const d = generator(object);
      return d ? new Path2D(d) : null;
    }

    function validPoint(xy: [number, number] | null | undefined): xy is [number, number] {
      return Array.isArray(xy) && Number.isFinite(xy[0]) && Number.isFinite(xy[1]);
    }

    function rebuildPaths() {
      path = d3.geoPath(projection);
      const baseName = baseProjectionName();
      clipToSphere = baseName !== "mercator";
      spherePath = asPath2D(path, baseName === "mercator" ? mercatorWorld() : { type: "Sphere" });
      graticulePath = asPath2D(path, graticule);
      const overlayOn = overlayMode();
      countryCache = countries.features.flatMap((feature) => {
        const path2d = asPath2D(path, feature);
        if (!path2d) return [];
        const centroid = path.centroid(feature);
        const bounds = path.bounds(feature);
        const center: [number, number] = validPoint(centroid)
          ? centroid
          : [(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2];
        const name = feature.properties.name;
        return [{
          feature,
          name,
          color: colorFor(name),
          path2d,
          bounds,
          centroid: center,
          apparent: overlayOn ? scaleForName(name) : 0
        }];
      });
      countryByName.clear();
      for (const item of countryCache) countryByName.set(item.name, item);
      overlayGhosts = countryCache.filter((item) => item.apparent > 0);
      overlayGhosts.sort((a, b) => b.apparent - a.apparent);
      overlayHoverGhosts = overlayGhosts.flatMap((item) => {
        if (mercatorFactor(item.name) < OVERLAY_HOVER_MIN_FACTOR) return [];
        const ghost = ghostHideData(item);
        return ghost ? [ghost] : [];
      });
      hideGhostsKey = "";
      lakePath = asPath2D(path, { type: "FeatureCollection", features: lakes });
      riverPaths = rivers.map((feature) => ({
        rank: feature.properties.scalerank,
        path2d: asPath2D(path, feature)
      })).filter(hasPath);
    }

    function scaleForName(name: string) {
      const stats = sizeIndex.get(name);
      if (stats?.ratio == null || stats.ratio <= 0) return 0;
      const scale = Math.sqrt(stats.ratio);
      return name === "Antarctica" ? Math.min(scale, 4) : scale;
    }

    function mercatorFactor(name: string) {
      const ratio = sizeIndex.get(name)?.ratio;
      if (ratio == null || ratio <= 0) return 1;
      return ratio >= 1 ? ratio : 1 / ratio;
    }

    function apparentScaleFor(name: string) {
      return countryByName.get(name)?.apparent ?? 0;
    }

    function itemCentroid(item: CountryCacheItem) {
      if (validPoint(item.centroid)) return item.centroid;
      const b = item.bounds;
      const mid: [number, number] = [(b[0][0] + b[1][0]) / 2, (b[0][1] + b[1][1]) / 2];
      return validPoint(mid) ? mid : null;
    }

    function pointInPath2d(path2d: Path2D, xy: [number, number]) {
      return mapCtx.isPointInPath(path2d, xy[0] * dpr, xy[1] * dpr, "evenodd");
    }

    function ghostHideData(item: CountryCacheItem): OverlayGhost | null {
      const scale = item.apparent;
      const centroid = itemCentroid(item);
      if (!scale || !validPoint(centroid)) return null;
      const [[x0, y0], [x1, y1]] = item.bounds;
      const sx0 = centroid[0] + (x0 - centroid[0]) * scale;
      const sy0 = centroid[1] + (y0 - centroid[1]) * scale;
      const sx1 = centroid[0] + (x1 - centroid[0]) * scale;
      const sy1 = centroid[1] + (y1 - centroid[1]) * scale;
      return {
        item,
        scale,
        centroid,
        x0: Math.min(sx0, sx1),
        y0: Math.min(sy0, sy1),
        x1: Math.max(sx0, sx1),
        y1: Math.max(sy0, sy1)
      };
    }

    function activeGhosts() {
      if (!overlayMode() || !state.layers.countries) return [];
      if (state.compareMode === "always") return apparentItemsToBake();
      const name = hoverName || state.selected;
      if (!name) return [];
      const item = countryByName.get(name);
      return item && item.apparent > 0 ? [item] : [];
    }

    function rebuildHideMask(ghosts: OverlayGhost[]) {
      const w = Math.max(1, width | 0);
      const h = Math.max(1, height | 0);
      if (hideCanvas.width !== w || hideCanvas.height !== h) {
        hideCanvas.width = w;
        hideCanvas.height = h;
      }
      hideCtx.setTransform(1, 0, 0, 1, 0, 0);
      hideCtx.clearRect(0, 0, w, h);
      hideCtx.fillStyle = "#fff";
      for (const ghost of ghosts) {
        hideCtx.save();
        hideCtx.translate(ghost.centroid[0], ghost.centroid[1]);
        hideCtx.scale(ghost.scale, ghost.scale);
        hideCtx.translate(-ghost.centroid[0], -ghost.centroid[1]);
        hideCtx.fill(ghost.item.path2d);
        hideCtx.restore();
      }
      hideCtx.globalCompositeOperation = "destination-out";
      for (const ghost of ghosts) hideCtx.fill(ghost.item.path2d);
      hideCtx.globalCompositeOperation = "source-over";
      hideMask = hideCtx.getImageData(0, 0, w, h).data;
      hideMaskW = w;
      hideMaskH = h;
    }

    function currentHideGhosts() {
      const key = overlayMode() && state.layers.countries
        ? (state.compareMode === "always" ? "always" : `h:${hoverName || state.selected || ""}`)
        : "";
      if (key === hideGhostsKey) return hideGhosts;
      hideGhostsKey = key;
      hideGhosts = key
        ? activeGhosts().flatMap((item) => {
            const ghost = ghostHideData(item);
            return ghost ? [ghost] : [];
          })
        : [];
      if (hideGhosts.length > 2) rebuildHideMask(hideGhosts);
      else hideMask = null;
      return hideGhosts;
    }

    function hiddenBySizeOverlay(xy: [number, number] | null | undefined) {
      if (!validPoint(xy)) return false;
      const ghosts = currentHideGhosts();
      if (!ghosts.length) return false;
      if (hideMask) {
        const x = xy[0] | 0;
        const y = xy[1] | 0;
        if (x < 0 || y < 0 || x >= hideMaskW || y >= hideMaskH) return false;
        return hideMask[(y * hideMaskW + x) * 4 + 3] !== 0;
      }
      for (const ghost of ghosts) {
        if (xy[0] < ghost.x0 || xy[0] > ghost.x1 || xy[1] < ghost.y0 || xy[1] > ghost.y1) continue;
        const local: [number, number] = [
          ghost.centroid[0] + (xy[0] - ghost.centroid[0]) / ghost.scale,
          ghost.centroid[1] + (xy[1] - ghost.centroid[1]) / ghost.scale
        ];
        if (pointInPath2d(ghost.item.path2d, local) && !pointInPath2d(ghost.item.path2d, xy)) return true;
      }
      return false;
    }

    function drawWater(ctx: CanvasRenderingContext2D, zoomK: number, clipPath?: Path2D | null) {
      if (!state.layers.lakes && !state.layers.rivers) return;
      ctx.save();
      if (clipPath) ctx.clip(clipPath, "evenodd");
      if (state.layers.lakes && lakePath) {
        ctx.fillStyle = MAP.lake;
        ctx.fill(lakePath);
      }
      if (state.layers.rivers) {
        ctx.strokeStyle = MAP.river;
        ctx.lineCap = "round";
        for (const river of riverPaths) {
          if ((zoomK < 1.8 && river.rank > 3) || river.rank > 6) continue;
          ctx.lineWidth = (river.rank <= 2 ? 1.15 : 0.65) / zoomK;
          ctx.stroke(river.path2d);
        }
      }
      ctx.restore();
    }

    function alwaysRatioFloor() {
      const k = currentTransform.k;
      if (k < 1.45) return 2.4;
      if (k < 2.8) return 1.35;
      return 1.08;
    }

    function apparentItemsToBake() {
      if (!overlayMode() || !state.layers.countries) return [];
      if (state.compareMode === "always") {
        const floor = alwaysRatioFloor();
        return overlayGhosts.filter((item) => {
          const stats = sizeIndex.get(item.name);
          return Boolean(stats && stats.ratio != null && stats.ratio >= floor);
        });
      }
      const selectedItem = state.selected ? countryByName.get(state.selected) : undefined;
      return selectedItem && selectedItem.apparent > 0 ? [selectedItem] : [];
    }

    function withApparentTransform(
      ctx: CanvasRenderingContext2D,
      item: CountryCacheItem,
      fn: (apparent: number) => void,
      { clip = false }: { clip?: boolean } = {}
    ) {
      const apparent = item.apparent;
      const centroid = itemCentroid(item);
      if (!apparent || !validPoint(centroid)) return 0;
      ctx.save();
      if (clip && clipToSphere && spherePath) ctx.clip(spherePath);
      ctx.translate(centroid[0], centroid[1]);
      ctx.scale(apparent, apparent);
      ctx.translate(-centroid[0], -centroid[1]);
      fn(apparent);
      ctx.restore();
      return apparent;
    }

    function strokeApparent(
      ctx: CanvasRenderingContext2D,
      item: CountryCacheItem,
      zoomK: number,
      { muted = false }: { muted?: boolean } = {}
    ) {
      return withApparentTransform(ctx, item, (apparent) => {
        ctx.strokeStyle = muted ? MAP.mercMuteStroke : MAP.mercStroke;
        ctx.lineWidth = 2.4 / (zoomK * apparent);
        ctx.stroke(item.path2d);
      }) > 0;
    }

    function drawApparentFill(
      ctx: CanvasRenderingContext2D,
      item: CountryCacheItem,
      zoomK: number,
      { muted = false }: { muted?: boolean } = {}
    ) {
      return withApparentTransform(ctx, item, (apparent) => {
        if (apparent > 1) {
          ctx.fillStyle = muted ? MAP.mercMuteFill : MAP.mercFill;
          ctx.fill(item.path2d);
        }
      }, { clip: true }) > 0;
    }

    function paintCountries(ctx: CanvasRenderingContext2D, zoomK: number) {
      if (!state.layers.countries) return;
      ctx.strokeStyle = MAP.countryStroke;
      ctx.lineWidth = 0.6 / zoomK;
      for (const item of countryCache) {
        ctx.fillStyle = item.color;
        ctx.fill(item.path2d);
        ctx.stroke(item.path2d);
      }
    }

    function paintCountry(ctx: CanvasRenderingContext2D, item: CountryCacheItem, zoomK: number) {
      ctx.fillStyle = item.color;
      ctx.fill(item.path2d);
      ctx.strokeStyle = MAP.countryStroke;
      ctx.lineWidth = 0.6 / zoomK;
      ctx.stroke(item.path2d);
    }

    function drawCenteredGhost(ctx: CanvasRenderingContext2D, item: CountryCacheItem, zoomK: number) {
      if (!item.apparent) return;
      drawApparentFill(ctx, item, zoomK);
      paintCountry(ctx, item, zoomK);
      strokeApparent(ctx, item, zoomK);
    }

    function coverOutsideSphere(t: ZoomTransform) {
      if (!clipToSphere || !spherePath) return;
      const outside = new Path2D();
      outside.rect(0, 0, width, height);
      outside.addPath(spherePath, { a: t.k, b: 0, c: 0, d: t.k, e: t.x, f: t.y });
      mapCtx.fillStyle = MAP.ocean;
      mapCtx.fill(outside, "evenodd");
      mapCtx.save();
      mapCtx.translate(t.x, t.y);
      mapCtx.scale(t.k, t.k);
      mapCtx.strokeStyle = MAP.sphere;
      mapCtx.lineWidth = 1 / t.k;
      mapCtx.stroke(spherePath);
      mapCtx.restore();
    }

    function clipOverlayToSphere(t: ZoomTransform) {
      if (!clipToSphere || !spherePath) return;
      overCtx.save();
      overCtx.globalCompositeOperation = "destination-in";
      overCtx.translate(t.x, t.y);
      overCtx.scale(t.k, t.k);
      overCtx.fillStyle = "#fff";
      overCtx.fill(spherePath);
      overCtx.restore();
      overCtx.globalCompositeOperation = "source-over";
    }

    function bake(t: ZoomTransform) {
      baked = t;
      mapCanvas.style.transform = "none";
      mapCtx.fillStyle = MAP.ocean;
      mapCtx.fillRect(0, 0, width, height);
      mapCtx.save();
      mapCtx.translate(t.x, t.y);
      mapCtx.scale(t.k, t.k);
      mapCtx.fillStyle = MAP.ocean;
      if (spherePath) mapCtx.fill(spherePath);
      if (clipToSphere && spherePath) {
        mapCtx.strokeStyle = MAP.sphere;
        mapCtx.lineWidth = 1 / t.k;
        mapCtx.stroke(spherePath);
      }
      if (state.layers.graticule && graticulePath) {
        mapCtx.strokeStyle = MAP.graticule;
        mapCtx.lineWidth = 0.7 / t.k;
        mapCtx.stroke(graticulePath);
      }
      const ghosts = apparentItemsToBake();
      const always = state.compareMode === "always" && ghosts.length > 0;
      if (always) {
        for (const item of ghosts) drawApparentFill(mapCtx, item, t.k, { muted: true });
      }
      paintCountries(mapCtx, t.k);
      if (!always) {
        for (const item of ghosts) drawCenteredGhost(mapCtx, item, t.k);
      }
      drawWater(mapCtx, t.k);
      if (always) {
        for (const item of ghosts) strokeApparent(mapCtx, item, t.k, { muted: true });
      }
      mapCtx.restore();
      if (ghosts.length) coverOutsideSphere(t);
    }

    function scheduleOverlay() {
      if (overlayFrame) return;
      overlayFrame = requestAnimationFrame(() => {
        overlayFrame = 0;
        const pending = pendingPointer;
        pendingPointer = null;
        if (pending) applyPointer(pending.vx, pending.vy, pending.sx, pending.sy);
        else drawOverlay();
      });
    }

    function applyPointer(vx: number, vy: number, sx: number, sy: number) {
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
      const hit = countryHitAt(sx, sy);
      const next = hit ? hit.name : null;
      if (next !== hoverName) {
        hoverName = next;
        drawOverlay();
      }
      if (hit) {
        const stats = sizeIndex.get(hit.name);
        const inflation = overlayMode() || state.projections.mercator
          ? formatInflation(stats?.ratio)
          : null;
        const tip = inflation
          ? `${hit.name} · Mercator ${inflation}`
          : hit.name;
        showTip(vx, vy, tip);
        stage.style.cursor = "pointer";
      } else {
        hideTip();
        stage.style.cursor = "grab";
      }
    }

    function drawOverlay() {
      overCtx.clearRect(0, 0, width, height);
      const t = currentTransform;
      const highlight = hoverName || state.selected;
      overCtx.save();
      overCtx.translate(t.x, t.y);
      overCtx.scale(t.k, t.k);
      if (highlight) {
        const item = countryByName.get(highlight);
        if (item && state.compareMode === "hover" && item.name !== state.selected) {
          drawApparentFill(overCtx, item, t.k);
        }
        if (item && state.compareMode === "always" && hoverName === item.name) {
          drawApparentFill(overCtx, item, t.k);
        }
        if (item) {
          const hovering = hoverName === item.name;
          overCtx.fillStyle = item.color;
          overCtx.fill(item.path2d);
          if (hovering) {
            overCtx.fillStyle = MAP.hoverFill;
            overCtx.fill(item.path2d);
          }
          overCtx.strokeStyle = hovering ? MAP.hover : MAP.selected;
          overCtx.lineWidth = (hovering ? 1.85 : 1.7) / t.k;
          overCtx.stroke(item.path2d);
          drawWater(overCtx, t.k, item.path2d);
          if (overlayMode()) strokeApparent(overCtx, item, t.k);
        }
      }
      overCtx.restore();
      clipOverlayToSphere(t);
      if (!state.layers.cities && !state.layers.labels) return;
      const compact = isCompactView();
      const hideGhostsNow = currentHideGhosts();
      overCtx.save();
      overCtx.font = "600 12px 'Source Sans 3', 'Segoe UI', sans-serif";
      overCtx.textBaseline = "middle";
      const labelCandidates: { place: Place; x: number; y: number }[] = [];
      for (const place of citySource) {
        const xy = projection([place.lon, place.lat]);
        if (!xy) continue;
        if (hideGhostsNow.length && hiddenBySizeOverlay(xy)) continue;
        const [x, y] = t.apply(xy);
        if (x < -40 || y < -20 || x > width + 40 || y > height + 20) continue;
        if (showCityDot(place, t.k, compact)) {
          overCtx.beginPath();
          overCtx.fillStyle = place.capital ? MAP.capital : MAP.city;
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
      const placed: LabelBox[] = [];
      overCtx.strokeStyle = MAP.labelHalo;
      overCtx.lineWidth = 3;
      overCtx.lineJoin = "round";
      overCtx.fillStyle = MAP.label;
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

    function viewLonLat(transform: ZoomTransform) {
      if (!projection || !transform || !transform.k) return null;
      const invert = projection.invert;
      if (!invert) return null;
      const lonlat = invert.call(projection, [(width / 2 - transform.x) / transform.k, (height / 2 - transform.y) / transform.k]);
      if (!lonlat || !Number.isFinite(lonlat[0]) || !Number.isFinite(lonlat[1])) return null;
      return lonlat;
    }

    function layout({ reset = false }: { reset?: boolean } = {}) {
      width = stage.clientWidth || atlasView.clientWidth;
      height = stage.clientHeight || atlasView.clientHeight;
      const prev = currentTransform;
      const lonlat = reset ? null : viewLonLat(prev);
      const keepScale = !reset && prev.k ? prev.k : 1;
      projection = makeProjection(baseProjectionName(), width, height);
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

    function countryAt(screenX: number, screenY: number) {
      const [x, y] = currentTransform.invert([screenX, screenY]);
      for (let i = countryCache.length - 1; i >= 0; i -= 1) {
        const item = countryCache[i];
        if (!item) continue;
        const [[x0, y0], [x1, y1]] = item.bounds;
        if (x < x0 || y < y0 || x > x1 || y > y1) continue;
        if (mapCtx.isPointInPath(item.path2d, x * dpr, y * dpr, "evenodd")) return item;
      }
      return null;
    }

    function overlayAt(screenX: number, screenY: number) {
      if (state.compareMode !== "always" || !overlayHoverGhosts.length) return null;
      const xy = currentTransform.invert([screenX, screenY]);
      if (!validPoint(xy)) return null;
      const [x, y] = xy;
      for (let i = overlayHoverGhosts.length - 1; i >= 0; i -= 1) {
        const ghost = overlayHoverGhosts[i];
        if (x < ghost.x0 || x > ghost.x1 || y < ghost.y0 || y > ghost.y1) continue;
        const local: [number, number] = [
          ghost.centroid[0] + (x - ghost.centroid[0]) / ghost.scale,
          ghost.centroid[1] + (y - ghost.centroid[1]) / ghost.scale
        ];
        if (pointInPath2d(ghost.item.path2d, local)) return ghost.item;
      }
      return null;
    }

    function countryHitAt(screenX: number, screenY: number) {
      return countryAt(screenX, screenY) ?? overlayAt(screenX, screenY);
    }

    function cityAt(screenX: number, screenY: number) {
      if (!state.layers.cities) return null;
      const hide = currentHideGhosts().length > 0;
      for (const place of citySource) {
        const xy = projection([place.lon, place.lat]);
        if (!xy) continue;
        const [x, y] = currentTransform.apply(xy);
        const r = place.capital ? 6 : 4;
        if ((screenX - x) ** 2 + (screenY - y) ** 2 > r * r) continue;
        if (hide && hiddenBySizeOverlay(xy)) continue;
        return place;
      }
      return null;
    }

    function showTip(x: number, y: number, text: string) {
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
      const measures = document.getElementById("info-measures");
      if (measures) {
        measures.replaceChildren();
        measures.hidden = true;
      }
      bake(currentTransform);
    }

    function renderMeasures(rows: MeasureRow[]) {
      const dl = document.getElementById("info-measures");
      if (!dl) return;
      dl.replaceChildren();
      if (!rows.length) {
        dl.hidden = true;
        return;
      }
      dl.hidden = false;
      for (const row of rows) {
        const wrap = document.createElement("div");
        const dt = document.createElement("dt");
        const dd = document.createElement("dd");
        dt.textContent = row.label;
        dd.textContent = row.value;
        wrap.append(dt, dd);
        dl.append(wrap);
      }
    }

    function selectedFeature() {
      if (!state.selected) return null;
      return countries.features.find((d) => d.properties.name === state.selected) || null;
    }

    function updateCountryInfo(feature: CountryFeature) {
      const stats = sizeIndex.get(feature.properties.name) || { trueKm2: km2(feature), ratio: null };
      info.hidden = false;
      requireElement("info-title").textContent = feature.properties.name;
      const comparing = overlayMode();
      const mercOn = state.projections.mercator;
      if (comparing) {
        requireElement("info-meta").textContent = apparentScaleFor(feature.properties.name) > 0
          ? "Country · Natural Earth 1:50 million. Red outline is Mercator’s apparent size."
          : "Country · Natural Earth 1:50 million. Mercator barely changes this country’s size.";
      } else if (mercOn) {
        requireElement("info-meta").textContent = "Country · Natural Earth 1:50 million. Mercator inflates land toward the poles.";
      } else {
        requireElement("info-meta").textContent = "Country · Natural Earth 1:50 million. Equal Earth keeps relative area true.";
      }

      const rows = [{ label: "True area", value: formatAreaKm2(stats.trueKm2) }];
      const inflation = formatInflation(stats.ratio);
      if (inflation && stats.ratio) {
        rows.push({ label: "Looks like on Mercator", value: formatAreaKm2(stats.trueKm2 * stats.ratio, { approx: true }) });
        rows.push({ label: "Difference", value: inflation });
      }
      renderMeasures(rows);

      const area = requireElement("info-area");
      if (comparing && apparentScaleFor(feature.properties.name) > 0) {
        area.textContent = "The red outline is the same country scaled to Mercator's apparent size.";
      } else if (comparing) {
        area.textContent = "Near the equator the two projections agree closely on size, so there is no extra outline.";
      } else if (mercOn && inflation) {
        area.textContent = `This land appears ${inflation} than its true size on Mercator.`;
      } else if (!mercOn) {
        area.textContent = "On Equal Earth this area stays true to scale relative to other countries.";
      } else {
        area.textContent = "Near the equator Mercator and Equal Earth agree on size.";
      }
    }

    function showPlace(place: Place) {
      info.hidden = false;
      const kind = place.capital ? "Capital" : "City";
      requireElement("info-title").textContent = place.name;
      requireElement("info-meta").textContent = [kind, place.country, formatPop(place.pop)].filter((part): part is string => Boolean(part)).join(" · ");
      renderMeasures([]);
      requireElement("info-area").textContent = "";
    }

    function selectCountry(feature: CountryFeature) {
      state.selected = feature.properties.name;
      updateCountryInfo(feature);
      bake(currentTransform);
      zoomToFeature(feature);
      drawOverlay();
      track("select_country", { name: feature.properties.name });
    }

    function zoomToFeature(feature: CountryFeature) {
      const bounds = path.bounds(feature);
      const centroid = path.centroid(feature);
      const origin = validPoint(centroid)
        ? centroid
        : [(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2];
      let inflate = 1;
      if (overlayMode()) {
        const stats = sizeIndex.get(feature.properties.name);
        if (stats && stats.ratio != null && stats.ratio > 1.12) inflate = Math.sqrt(stats.ratio);
      }
      const x0 = origin[0] + (bounds[0][0] - origin[0]) * inflate;
      const y0 = origin[1] + (bounds[0][1] - origin[1]) * inflate;
      const x1 = origin[0] + (bounds[1][0] - origin[0]) * inflate;
      const y1 = origin[1] + (bounds[1][1] - origin[1]) * inflate;
      const dx = Math.max(x1 - x0, 1);
      const dy = Math.max(y1 - y0, 1);
      const scale = Math.max(1.05, Math.min(16, 0.78 / Math.max(dx / width, dy / height)));
      d3.select(stage).call(
        zoom.transform,
        d3.zoomIdentity.translate(width / 2, height / 2).scale(scale).translate(-origin[0], -origin[1])
      );
    }

    function zoomToPoint(x: number, y: number, scale: number) {
      d3.select(stage).call(
        zoom.transform,
        d3.zoomIdentity.translate(width / 2, height / 2).scale(scale).translate(-x, -y)
      );
    }

    function search(query: string) {
      const q = query.trim().toLowerCase();
      if (q.length < 1) {
        results.hidden = true;
        results.replaceChildren();
        return;
      }
      const countryHits: CountryHit[] = countries.features
        .filter((d) => d.properties.name.toLowerCase().includes(q))
        .slice(0, 6)
        .map((d) => ({ kind: "country", name: d.properties.name, feature: d }));
      const cityHits: CityHit[] = placeList
        .filter((d) => d.name.toLowerCase().includes(q))
        .slice(0, 6)
        .map((d) => ({ kind: "city", ...d }));
      const hits: SearchHit[] = [...countryHits, ...cityHits].slice(0, 8);
      results.replaceChildren();
      results.hidden = false;
      if (hits.length === 0) {
        const empty = document.createElement("li");
        empty.className = "search-empty";
        empty.textContent = `No places match “${query.trim()}”`;
        results.append(empty);
        return;
      }
      hits.forEach((hit) => {
        const item = document.createElement("li");
        const button = document.createElement("button");
        button.type = "button";
        const name = document.createTextNode(hit.name);
        const meta = document.createElement("small");
        meta.textContent = hit.kind === "country"
          ? "Country"
          : `${hit.country || "City"}${hit.capital ? " · capital" : ""}`;
        button.append(name, meta);
        button.addEventListener("click", () => {
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
        item.append(button);
        results.append(item);
      });
    }

    stage.addEventListener("pointermove", (event) => {
      if (interacting) return;
      const [vx, vy] = d3.pointer(event, atlasView);
      const [sx, sy] = d3.pointer(event, stage);
      pendingPointer = { vx, vy, sx, sy };
      scheduleOverlay();
    });

    stage.addEventListener("pointerleave", () => {
      pendingPointer = null;
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
      const hit = countryHitAt(sx, sy);
      if (hit) {
        closeSheets();
        selectCountry(hit.feature);
      } else {
        hidePlace();
        drawOverlay();
      }
    });

    searchInput.addEventListener("input", () => search(searchInput.value));
    searchInput.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      results.hidden = true;
      results.replaceChildren();
      if (searchInput.value) searchInput.value = "";
      else searchInput.blur();
      event.stopPropagation();
    });

    function syncProjectionUI() {
      const overlay = overlayMode();
      const compareBtn = document.getElementById("mercator-size");
      if (compareBtn) {
        compareBtn.classList.toggle("is-active", overlay);
        compareBtn.setAttribute("aria-pressed", String(overlay));
      }
      const legend = document.getElementById("overlay-legend");
      if (legend) legend.hidden = !overlay;
      stage.setAttribute(
        "aria-label",
        overlay
          ? "Equal Earth map with Mercator size outlines. Click a country for the numbers."
          : "Equal Earth world map with countries, lakes, rivers, and cities"
      );
    }

    requireElement("mercator-size").addEventListener("click", () => {
      state.projections.equalEarth = true;
      state.projections.mercator = !state.projections.mercator;
      if (state.projections.mercator) state.compareMode = "always";
      hideGhostsKey = "";
      syncProjectionUI();
      layout();
      const selected = selectedFeature();
      if (selected) updateCountryInfo(selected);
      track("projection", {
        equalEarth: state.projections.equalEarth,
        mercator: state.projections.mercator
      });
    });

    document.querySelectorAll<HTMLElement>("[data-center]").forEach((button) => {
      button.addEventListener("click", () => {
        state.center = Number(button.dataset.center);
        document.querySelectorAll<HTMLElement>("[data-center]").forEach((node) => node.classList.toggle("is-active", node === button));
        layout();
      });
    });

    document.querySelectorAll<HTMLInputElement>("[data-layer]").forEach((input) => {
      input.addEventListener("change", () => {
        const layer = input.dataset.layer;
        if (!isLayerName(layer)) return;
        state.layers[layer] = input.checked;
        bake(currentTransform);
        drawOverlay();
      });
      input.addEventListener("click", (event) => event.stopPropagation());
    });

    const controls = requireElement("atlas-controls");
    controls.addEventListener("click", (event) => event.stopPropagation());
    controls.addEventListener("pointerdown", (event) => event.stopPropagation());

    requireElement("atlas-zoom").addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const action = target.closest("[data-zoom]")?.getAttribute("data-zoom") ?? undefined;
      if (!isZoomAction(action)) return;
      if (action === "home") {
        layout({ reset: true });
        return;
      }
      d3.select(stage).call(zoom.scaleBy, action === "in" ? 2 : 0.5);
    });

    requireElement("info-close").addEventListener("click", (event) => {
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

    atlas = { resize: () => layout() };
    syncProjectionUI();
    layout({ reset: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => drawOverlay());
    }
  }

  function setMode(mode: ViewMode) {
    state.mode = mode;
    document.querySelectorAll<HTMLElement>(".mode-btn").forEach((button) => {
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

  function toggleSheet(id: string) {
    const sheet = requireElement(id);
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

  requireElement("atlas-controls-toggle").addEventListener("click", (event) => {
    event.stopPropagation();
    toggleSheet("atlas-controls");
  });
  document.querySelectorAll(".sheet-close").forEach((button) => {
    button.addEventListener("click", closeSheets);
  });
  requireElement("sheet-backdrop").addEventListener("click", closeSheets);

  document.querySelectorAll<HTMLElement>(".mode-btn").forEach((button) => {
    button.addEventListener("click", () => {
      if (isViewMode(button.dataset.mode)) setMode(button.dataset.mode);
    });
  });

  function githubRepo() {
    return (window.EQUAL_EARTH_SITE && window.EQUAL_EARTH_SITE.githubRepo) || "brunocabezas/equal-earth-map";
  }

  function renderAboutVersion() {
    const el = document.getElementById("about-version");
    if (!el) return;
    const version = window.EQUAL_EARTH_VERSION;
    const sha = version?.commit;
    const short = version?.short || (sha ? sha.slice(0, 7) : "");
    if (!sha || short === "local") {
      el.textContent = "Version local";
      return;
    }
    const date = version?.builtAt ? String(version.builtAt).slice(0, 10) : "";
    const link = document.createElement("a");
    link.className = "rev";
    link.href = `https://github.com/${githubRepo()}/commit/${sha}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.tabIndex = -1;
    link.textContent = short;
    el.replaceChildren("Version ", link, date ? ` · ${date}` : "");
  }

  document.getElementById("about-open")?.addEventListener("click", () => {
    about.showModal();
    requireElement("about-close").focus();
  });
  requireElement("about-close").addEventListener("click", () => about.close());
  about.addEventListener("click", (event) => {
    if (event.target === about) about.close();
  });
  renderAboutVersion();

  window.addEventListener("resize", () => {
    if (state.mode === "wall" && viewer) viewer.viewport.resize();
  });

  window.addEventListener("keydown", (event) => {
    if (event.target instanceof HTMLElement && event.target.matches("input, textarea")) return;
    const zoomRoot = state.mode === "wall" ? document.getElementById("wall-zoom") : document.getElementById("atlas-zoom");
    if (!zoomRoot) return;
    if (event.key === "+" || event.key === "=") zoomRoot.querySelector<HTMLElement>("[data-zoom=in]")?.click();
    if (event.key === "-" || event.key === "_") zoomRoot.querySelector<HTMLElement>("[data-zoom=out]")?.click();
    if (event.key === "0") zoomRoot.querySelector<HTMLElement>("[data-zoom=home]")?.click();
    if (event.key === "Escape") {
      closeSheets();
      about.close();
    }
  });

  setMode("atlas");
})();
