type _SearchHit = AssertEqual<SearchHit["kind"], "country" | "city">;
type _Layers = AssertEqual<keyof LayerFlags, LayerName>;
type _Analytics = AssertEqual<keyof AnalyticsEvents, "download_map" | "select_country" | "projection" | "compare_mode">;
type _UrlView = AssertEqual<AtlasUrlView["compareMode"], CompareMode>;
type _CenterName = AssertEqual<AtlasCenterName, "africa" | "americas" | "pacific">;
