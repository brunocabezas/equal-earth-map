type WallLayer = "political" | "physical";
type ProjectionName = "equalEarth" | "mercator";
type CompareMode = "hover" | "always" | "off";
type ZoomAction = "in" | "out" | "home";
type LayerName = "countries" | "lakes" | "rivers" | "cities" | "labels" | "graticule";
type AtlasCenterName = "africa" | "americas" | "pacific";
type AtlasLocaleId = "en" | "es" | "fr" | "pt" | "ar" | "zh" | "ru";

type LayerFlags = { [K in LayerName]: boolean };
type ProjectionFlags = { [K in ProjectionName]: boolean };

interface AtlasState {
  projections: ProjectionFlags;
  center: number;
  layers: LayerFlags;
  compareMode: CompareMode;
  selected: string | null;
  about: boolean;
  lang: AtlasLocaleId;
}

interface AtlasUrlView {
  country: string | null;
  compareMode: CompareMode;
  center: number;
  layers: LayerFlags;
  about: boolean;
  lang: AtlasLocaleId | null;
}

interface AtlasLocaleMeta {
  id: AtlasLocaleId;
  bcp47: string;
  ogLocale: string;
  dir: "ltr" | "rtl";
  nativeName: string;
  shortLabel: string;
}

interface AtlasFaqItem {
  name: string;
  text: string;
}

interface AtlasMessages {
  metaTitle: string;
  metaDescription: string;
  ogImageAlt: string;
  selectedTitle: string;
  jsonLdAppDescription: string;
  jsonLdKeywords: string;
  skipToSearch: string;
  brandHome: string;
  tagline: string;
  language: string;
  languageMenu: string;
  mercatorSize: string;
  mercatorShort: string;
  mercatorCompact: string;
  mercatorOff: string;
  mercatorOffShort: string;
  mercatorOffCompact: string;
  mercatorMenu: string;
  mercatorAria: string;
  mercatorAriaHidden: string;
  compareAlways: string;
  compareHover: string;
  compareTap: string;
  compareHide: string;
  hintAlways: string;
  hintHover: string;
  hintTap: string;
  hintOff: string;
  search: string;
  searchCountryOrCity: string;
  searchPlaceholder: string;
  searchResults: string;
  searchEmpty: string;
  layers: string;
  closeLayers: string;
  mapLayers: string;
  layerCountries: string;
  layerLakes: string;
  layerRivers: string;
  layerCities: string;
  layerLabels: string;
  layerGraticule: string;
  layerMore: string;
  moreMapLayers: string;
  centerMap: string;
  countriesAlwaysOn: string;
  about: string;
  atlasView: string;
  loading: string;
  loadError: string;
  canvasFail: string;
  tryAgain: string;
  clearSelection: string;
  zoomIn: string;
  zoomOut: string;
  resetView: string;
  mapCenter: string;
  centerAfrica: string;
  centerAmericas: string;
  centerPacific: string;
  centerAfricaTitle: string;
  centerAmericasTitle: string;
  centerPacificTitle: string;
  legendEqualEarth: string;
  legendEqualEarthShort: string;
  legendMercator: string;
  legendMercatorShort: string;
  legendLead: string;
  legendLeadCompact: string;
  legendRestoreStatus: string;
  legendRestoreAction: string;
  attribFull: string;
  attribCredit: string;
  close: string;
  politicalMap: string;
  physicalMap: string;
  aboutTitle: string;
  aboutP1: string;
  aboutP2: string;
  aboutP3: string;
  aboutP4: string;
  aboutVote: string;
  voteInFavor: string;
  voteAgainst: string;
  voteAbstained: string;
  voteAgainstWho: string;
  voteAbstainedWho: string;
  aboutP5: string;
  aboutVoteRecord: string;
  aboutVoteLink: string;
  aboutP6: string;
  aboutP7: string;
  aboutCredit: string;
  versionLocal: string;
  versionLabel: string;
  equatorBarely: string;
  compactOutline: string;
  equatorNoOutline: string;
  equalEarthTrue: string;
  wouldAppear: string;
  equatorAgree: string;
  trueArea: string;
  looksMercator: string;
  difference: string;
  largerMercator: string;
  smallerMercator: string;
  largerMercatorLabel: string;
  smallerMercatorLabel: string;
  capital: string;
  city: string;
  country: string;
  cityMetaCapital: string;
  popMillion: string;
  popThousand: string;
  stageAriaAlways: string;
  stageAriaTap: string;
  stageAriaHover: string;
  stageAriaPlain: string;
  stageCenterCountry: string;
  searchKindCountry: string;
  faq: AtlasFaqItem[];
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
  language: { lang: AtlasLocaleId };
};

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends (...args: never[]) => unknown
      ? T[P]
      : DeepReadonly<T[P]>
    : T[P];
};

type AssertEqual<T, U> = [T] extends [U] ? ([U] extends [T] ? true : false) : false;
