type _ViewMode = AssertEqual<ViewMode, "atlas" | "wall">;
type _SearchHit = AssertEqual<SearchHit["kind"], "country" | "city">;
type _Layers = AssertEqual<keyof LayerFlags, LayerName>;
type _Analytics = AssertEqual<keyof AnalyticsEvents, "wall_layer" | "select_country" | "projection" | "compare_mode" | "mode">;
