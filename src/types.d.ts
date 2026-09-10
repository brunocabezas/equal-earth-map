type ViewMode = "atlas" | "wall";
type WallLayer = "political" | "physical";
type ProjectionName = "equalEarth" | "mercator";
type CompareMode = "hover" | "always";
type ZoomAction = "in" | "out" | "home";
type LayerName = "countries" | "lakes" | "rivers" | "cities" | "labels" | "graticule";

type LayerFlags = { [K in LayerName]: boolean };
type ProjectionFlags = { [K in ProjectionName]: boolean };

interface AtlasState {
  mode: ViewMode;
  wallLayer: WallLayer;
  projections: ProjectionFlags;
  center: number;
  layers: LayerFlags;
  compareMode: CompareMode;
  selected: string | null;
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

interface MeasureRow {
  label: string;
  value: string;
}

interface CountryCacheItem {
  feature: CountryFeature;
  name: string;
  color: string;
  path2d: Path2D;
}

interface RiverPath {
  rank: number;
  path2d: Path2D;
}

type AnalyticsEvents = {
  wall_layer: { layer: WallLayer };
  select_country: { name: string };
  projection: { equalEarth: boolean; mercator: boolean };
  compare_mode: { mode: CompareMode };
  mode: { mode: ViewMode };
};

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends (...args: never[]) => unknown
      ? T[P]
      : DeepReadonly<T[P]>
    : T[P];
};

type AssertEqual<T, U> = [T] extends [U] ? ([U] extends [T] ? true : false) : false;
