import type * as D3 from "d3";
import type OpenSeadragonNs from "openseadragon";
import type * as TopoJSONClient from "topojson-client";
import type * as TopoJSON from "topojson-specification";

export {};

declare global {
  const d3: typeof D3;
  const topojson: typeof TopoJSONClient;
  const OpenSeadragon: typeof OpenSeadragonNs;

  type GeoProjection = D3.GeoProjection;
  type GeoPath = D3.GeoPath<unknown, D3.GeoPermissibleObjects>;
  type D3GeoObject = D3.GeoPermissibleObjects;
  type ZoomTransform = D3.ZoomTransform;
  type OsdViewer = OpenSeadragonNs.Viewer;
  type CountriesTopology = TopoJSON.Topology<{
    countries: TopoJSON.GeometryCollection<CountryProps>;
  }>;

  interface GoatCounter {
    count: (opts: { path: string; title: string; event: boolean }) => void;
  }

  interface PostHog {
    init: (key: string, options: Record<string, unknown>) => void;
    capture: (event: string, props?: Record<string, unknown>) => void;
  }

  interface Window {
    EQUAL_EARTH_SITE?: SiteConfig;
    EQUAL_EARTH_VERSION?: SiteVersion;
    goatcounter?: GoatCounter;
    posthog?: PostHog;
  }
}
