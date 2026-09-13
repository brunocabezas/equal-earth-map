const ATLAS_LAYER_ORDER: LayerName[] = [
  "countries",
  "lakes",
  "rivers",
  "cities",
  "labels",
  "graticule"
];

const ATLAS_CENTER_LON: Record<AtlasCenterName, number> = {
  africa: 0,
  americas: -90,
  pacific: 150
};

function defaultAtlasLayers(): LayerFlags {
  return {
    countries: true,
    lakes: true,
    rivers: true,
    cities: true,
    labels: true,
    graticule: true
  };
}

function defaultAtlasCompareMode(): CompareMode {
  return "always";
}

function defaultAtlasCenter(): number {
  return ATLAS_CENTER_LON.africa;
}

function isAtlasLayerName(value: string): value is LayerName {
  return (ATLAS_LAYER_ORDER as string[]).includes(value);
}

function isAtlasCenterName(value: string): value is AtlasCenterName {
  return value === "africa" || value === "americas" || value === "pacific";
}

function isAtlasCompareMode(value: string): value is CompareMode {
  return value === "hover" || value === "always";
}

function slugifyPlaceName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function atlasCenterName(lon: number): AtlasCenterName | null {
  const entry = (Object.entries(ATLAS_CENTER_LON) as [AtlasCenterName, number][])
    .find(([, value]) => value === lon);
  return entry ? entry[0] : null;
}

function matchPlaceName(names: Iterable<string>, raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const slug = slugifyPlaceName(trimmed);
  const lower = trimmed.toLowerCase();
  let fallback: string | null = null;
  for (const name of names) {
    if (slug && slugifyPlaceName(name) === slug) return name;
    if (!fallback && name.toLowerCase() === lower) fallback = name;
  }
  return fallback;
}

function parseAtlasUrl(search: string): AtlasUrlView {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const layers = defaultAtlasLayers();
  const off = params.get("off");
  if (off) {
    for (const token of off.split(",")) {
      const name = token.trim();
      if (isAtlasLayerName(name)) layers[name] = false;
    }
  }
  const compare = params.get("compare");
  const center = params.get("center");
  let centerLon = defaultAtlasCenter();
  if (center && isAtlasCenterName(center)) centerLon = ATLAS_CENTER_LON[center];
  else if (center === "0" || center === "-90" || center === "150") centerLon = Number(center);
  return {
    country: params.get("country"),
    compareMode: compare && isAtlasCompareMode(compare) ? compare : defaultAtlasCompareMode(),
    center: centerLon,
    layers
  };
}

function formatAtlasSearch(state: Pick<AtlasState, "selected" | "compareMode" | "center" | "layers">): string {
  const params = new URLSearchParams();
  if (state.selected) params.set("country", slugifyPlaceName(state.selected));
  if (state.compareMode !== defaultAtlasCompareMode()) params.set("compare", state.compareMode);
  const center = atlasCenterName(state.center);
  if (center && center !== "africa") params.set("center", center);
  const off = ATLAS_LAYER_ORDER.filter((name) => !state.layers[name]);
  if (off.length) params.set("off", off.join(","));
  return params.toString();
}
