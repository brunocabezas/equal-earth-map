type WallLayer = "political" | "physical";
type ProjectionName = "equalEarth" | "mercator";
type CompareMode = "hover" | "always";
type ZoomAction = "in" | "out" | "home";
type LayerName = "countries" | "lakes" | "rivers" | "cities" | "labels" | "graticule";
type AtlasCenterName = "africa" | "americas" | "pacific";

type LayerFlags = { [K in LayerName]: boolean };
type ProjectionFlags = { [K in ProjectionName]: boolean };

interface AtlasState {
  projections: ProjectionFlags;
  center: number;
  layers: LayerFlags;
  compareMode: CompareMode;
  selected: string | null;
}

interface AtlasUrlView {
  country: string | null;
  compareMode: CompareMode;
  center: number;
  layers: LayerFlags;
}

interface SiteConfig {
  siteUrl: string;
  githubRepo: string;
  goatCounter: string;
  posthogKey: string;
  posthogHost: string;
}

interface SiteVersion {
  commit: string;
  short: string;
  builtAt: string;
}

interface Place {
  name: string;
  country: string;
  lat: number;
  lon: number;
  pop: number;
  capital: number;
  rank: number;
}

interface CountryProps {
  name: string;
}

interface LakeProps {
  scalerank: number;
}

interface RiverProps {
  scalerank: number;
  featurecla: string;
}

type CountryFeature = GeoJSON.Feature<GeoJSON.Geometry, CountryProps> & { properties: CountryProps };
type LakeFeature = GeoJSON.Feature<GeoJSON.Geometry, LakeProps> & { properties: LakeProps };
type RiverFeature = GeoJSON.Feature<GeoJSON.Geometry, RiverProps> & { properties: RiverProps };
type CountryCollection = GeoJSON.FeatureCollection<GeoJSON.Geometry, CountryProps> & { features: CountryFeature[] };
type LakeCollection = GeoJSON.FeatureCollection<GeoJSON.Geometry, LakeProps> & { features: LakeFeature[] };
type RiverCollection = GeoJSON.FeatureCollection<GeoJSON.Geometry, RiverProps> & { features: RiverFeature[] };

type CountryHit = {
  kind: "country";
  name: string;
  feature: CountryFeature;
};

type CityHit = Place & {
  kind: "city";
};

type SearchHit = CountryHit | CityHit;

interface SizeStats {
  trueKm2: number;
  ratio: number | null;
}

interface LabelBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

type MeasureKind = "true" | "mercator" | "ratio";

interface MeasureRow {
  kind: MeasureKind;
  label: string;
  value: string;
  fill?: string;
}

interface CountryCacheItem {
  feature: CountryFeature;
  name: string;
  color: string;
  path2d: Path2D;
  centroid: [number, number];
  bounds: [[number, number], [number, number]];
  apparent: number;
}

interface OverlayGhost {
  item: CountryCacheItem;
  scale: number;
  centroid: [number, number];
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

interface RiverPath {
  rank: number;
  path2d: Path2D;
}

type AnalyticsEvents = {
  download_map: { layer: WallLayer };
  select_country: { name: string };
  projection: { equalEarth: boolean; mercator: boolean };
  compare_mode: { mode: CompareMode };
};

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends (...args: never[]) => unknown
      ? T[P]
      : DeepReadonly<T[P]>
    : T[P];
};

type AssertEqual<T, U> = [T] extends [U] ? ([U] extends [T] ? true : false) : false;
