const ATLAS_LOCALE_ORDER: AtlasLocaleId[] = ["en", "es", "fr", "pt", "ar", "zh", "ru"];
const ATLAS_LANG_STORAGE = "equal-earth-lang";

const ATLAS_LOCALE_META: Record<AtlasLocaleId, AtlasLocaleMeta> = {
  en: { id: "en", bcp47: "en", ogLocale: "en_US", dir: "ltr", nativeName: "English", shortLabel: "EN" },
  es: { id: "es", bcp47: "es", ogLocale: "es_ES", dir: "ltr", nativeName: "Español", shortLabel: "ES" },
  fr: { id: "fr", bcp47: "fr", ogLocale: "fr_FR", dir: "ltr", nativeName: "Français", shortLabel: "FR" },
  pt: { id: "pt", bcp47: "pt", ogLocale: "pt_BR", dir: "ltr", nativeName: "Português", shortLabel: "PT" },
  ar: { id: "ar", bcp47: "ar", ogLocale: "ar_AR", dir: "rtl", nativeName: "العربية", shortLabel: "AR" },
  zh: { id: "zh", bcp47: "zh-Hans", ogLocale: "zh_CN", dir: "ltr", nativeName: "中文", shortLabel: "ZH" },
  ru: { id: "ru", bcp47: "ru", ogLocale: "ru_RU", dir: "ltr", nativeName: "Русский", shortLabel: "RU" }
};

const EN: AtlasMessages = {
  metaTitle: "Equal Earth Projection — Interactive True-Size World Atlas",
  metaDescription: "Interactive Equal Earth projection atlas. An equal-area world map with true country sizes, unlike Mercator. Search the map and download wall maps.",
  ogImageAlt: "Equal Earth projection political world map centered on the Pacific",
  selectedTitle: "{name} — Equal Earth Map",
  jsonLdAppDescription: "Interactive world atlas using the Equal Earth projection. Equal-area map with true relative country sizes, unlike Mercator, plus Natural Earth vectors and downloadable wall maps.",
  jsonLdKeywords: "Equal Earth projection, equal-area projection, Mercator projection, true size world map, interactive world atlas, Africa true size",
  skipToSearch: "Skip to map",
  brandHome: "Equal Earth home",
  tagline: "Equal Earth projection, not Mercator",
  language: "Language",
  languageMenu: "Language",
  mercatorSize: "How Mercator stretches",
  mercatorShort: "Mercator stretch",
  mercatorMenu: "When to show Mercator stretch",
  mercatorAria: "How Mercator stretches countries",
  mercatorAriaHidden: "How Mercator stretches countries (outlines hidden)",
  compareAlways: "Every country",
  compareHover: "When I point",
  compareTap: "When I tap",
  compareHide: "Hide comparison",
  hintAlways: "Outlines show how large countries look on Mercator.",
  hintHover: "Point at a country to see Mercator’s apparent size.",
  hintTap: "Tap a country to see Mercator’s apparent size.",
  hintOff: "Equal Earth only. Mercator outlines are hidden.",
  search: "Search",
  searchCountryOrCity: "Search a country or city",
  searchPlaceholder: "Greenland, Africa…",
  searchResults: "Search results",
  searchEmpty: "No places match “{query}”. Try another spelling, or pan the map.",
  layers: "Layers",
  closeLayers: "Close layers",
  mapLayers: "Map layers",
  layerCountries: "Countries",
  layerLakes: "Lakes",
  layerRivers: "Rivers",
  layerCities: "Cities",
  layerLabels: "Labels",
  layerGraticule: "Lat/long grid",
  layerMore: "More layers",
  moreMapLayers: "More map layers",
  centerMap: "Center map",
  countriesAlwaysOn: "Land stays on so the globe has countries",
  about: "About",
  atlasView: "Interactive Equal Earth atlas",
  loading: "Loading Natural Earth data…",
  loadError: "Could not load map data. Try again.",
  canvasFail: "This browser cannot draw the map. Try again.",
  tryAgain: "Try again",
  clearSelection: "Clear selection",
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  resetView: "Reset view",
  mapCenter: "Map center",
  centerAfrica: "Africa",
  centerAmericas: "Americas",
  centerPacific: "Pacific",
  centerAfricaTitle: "Center on Africa",
  centerAmericasTitle: "Center on the Americas",
  centerPacificTitle: "Center on the Pacific",
  legendEqualEarth: "This map: Equal Earth",
  legendEqualEarthShort: "Equal Earth",
  legendMercator: "Looks this size on Mercator",
  legendMercatorShort: "Mercator",
  legendLead: "Filled countries are true size. Outlines are how they look on Mercator.",
  legendLeadCompact: "Filled land is true size. Outlines are Mercator.",
  legendRestoreStatus: "True size only.",
  legendRestoreAction: "Show Mercator outlines",
  attribFull: "Equal Earth projection by Šavrič, Patterson & Jenny · Wall maps by Tom Patterson / BMZ · Vectors from Natural Earth",
  attribShort: "Equal Earth · Natural Earth",
  close: "Close",
  politicalMap: "Political map",
  physicalMap: "Physical map",
  aboutTitle: "An interactive Equal Earth projection atlas",
  aboutP1: "This is an interactive atlas. You can pan, zoom, and search. The map uses the Equal Earth projection, not Mercator.",
  aboutP2: "Mercator is the usual web map method from 1569. It stretches land near the poles so compass directions stay straight. Greenland looks similar in size to Africa on those maps. Africa is about 14 times larger.",
  aboutP3: "An equal-area projection is a flat map that keeps true relative size. No flat map can show the Earth without a trade. Mercator keeps compass direction and loses size. Gall–Peters keeps size and stretches continent shapes. Equal Earth keeps true size with more familiar shapes.",
  aboutP4: "In September 2026, the UN General Assembly adopted Correct the Map. The resolution is a request, not a law. Togo and the African Union led the campaign. It asks schools, governments, and tech companies to use equal-area maps such as Equal Earth.",
  aboutVote: "General Assembly vote",
  voteInFavor: "In favor",
  voteAgainst: "Against",
  voteAbstained: "Abstained",
  voteAgainstWho: "United States",
  voteAbstainedWho: "Estonia, Georgia, Lithuania, Moldova, Serbia, and Ukraine",
  aboutP5: "Ukraine and Serbia said they support true continent size. They objected to how some Equal Earth political maps draw disputed land. The resolution does not set borders.",
  aboutVoteRecord: "Recorded vote on 4 September 2026.",
  aboutVoteLink: "UN News report on the vote",
  aboutP6: "Muted outlines show how large those countries look on Mercator. The outlines turn coral when you point at one. Click a country for the numbers.",
  aboutP7: "The globe is Natural Earth 1:50 million vectors drawn in Equal Earth. The original wall maps are available as downloads:",
  aboutCredit: "Political map: Tom Patterson, public domain. Physical map: BMZ German edition based on Equal Earth / Natural Earth. This site does not use cookies for visit counts.",
  versionLocal: "Version local",
  versionLabel: "Version",
  outlineMuted: "The outline is Mercator’s apparent size — muted at rest, full coral when you point at it.",
  outlineScaled: "The outline is this country scaled to how large it looks on Mercator.",
  equatorBarely: "Mercator barely changes this country’s size.",
  compactOutline: "The outline is how large this looks on Mercator.",
  equatorNoOutline: "Near the equator the two projections agree closely on size, so there is no extra outline.",
  equalEarthTrue: "Equal Earth keeps relative area true.",
  wouldAppear: "This land would appear {note} than its true size.",
  equatorAgree: "Near the equator Mercator and Equal Earth agree on size.",
  trueArea: "True area",
  looksMercator: "Looks this size on Mercator",
  difference: "Difference",
  largerMercator: "{n}× larger in Mercator",
  smallerMercator: "{n}× smaller in Mercator",
  largerMercatorLabel: "Larger in Mercator",
  smallerMercatorLabel: "Smaller in Mercator",
  capital: "Capital",
  city: "City",
  country: "Country",
  cityMetaCapital: "capital",
  popMillion: "{n} million",
  popThousand: "{n} thousand",
  stageAriaAlways: "Equal Earth map with Mercator size outlines. Arrow keys pan, Enter selects the country in the center, plus and minus zoom, Escape clears the selection.",
  stageAriaTap: "Equal Earth map. Tap a country for Mercator size. Arrow keys pan, Enter selects the country in the center, plus and minus zoom, Escape clears the selection.",
  stageAriaHover: "Equal Earth map. Hover a country for Mercator size. Arrow keys pan, Enter selects the country in the center, plus and minus zoom, Escape clears the selection.",
  stageAriaPlain: "Equal Earth world map. Arrow keys pan, Enter selects the country in the center, plus and minus zoom, Escape clears the selection.",
  searchKindCountry: "Country",
  faq: [
    {
      name: "What is the Equal Earth projection?",
      text: "Equal Earth is an equal-area pseudocylindrical map projection. Continents and countries keep their true relative sizes, with more familiar shapes than Gall–Peters."
    },
    {
      name: "Why does Africa look larger than on Google Maps?",
      text: "Google Maps uses the Mercator projection, which inflates land near the poles. Africa is about 14 times larger than Greenland. The Equal Earth projection shows that true size relationship."
    },
    {
      name: "Did the United Nations replace the world map?",
      text: "No. In September 2026 the UN General Assembly adopted Correct the Map, a request to use equal-area map projections such as Equal Earth when country size is compared. The vote was 164 in favor, 1 against (United States), and 6 abstentions (Estonia, Georgia, Lithuania, Moldova, Serbia, and Ukraine). The resolution does not ban Mercator or set borders."
    },
    {
      name: "What is an equal-area projection?",
      text: "An equal-area projection is a flat map that keeps true relative size. Land that is twice as large on Earth takes about twice the space on the map. Mercator is not equal-area. Equal Earth is."
    },
    {
      name: "How does the Equal Earth projection differ from Mercator?",
      text: "Mercator keeps compass direction and stretches land near the poles. Equal Earth is an equal-area projection: countries keep true relative size, with more familiar continent shapes than Gall–Peters. This atlas uses Equal Earth and shows Mercator size as a comparison overlay."
    },
    {
      name: "How big is Africa compared with Greenland?",
      text: "Africa is about 14 times larger than Greenland. On a Mercator web map they can look similar in size because Mercator inflates land near the poles. The Equal Earth projection keeps that 14-to-1 relationship."
    },
    {
      name: "What data does this atlas use?",
      text: "The interactive atlas uses Natural Earth 1:50 million vectors. The Patterson political and BMZ physical Equal Earth wall maps are available as downloads."
    }
  ]
};

const ES: AtlasMessages = {
  metaTitle: "Proyección Equal Earth — Atlas mundial interactivo a tamaño real",
  metaDescription: "Atlas interactivo en proyección Equal Earth. Un mapa de áreas equivalentes con el tamaño real de los países, a diferencia de Mercator. Busca en el mapa y descarga mapas de pared.",
  ogImageAlt: "Mapa político mundial en proyección Equal Earth centrado en el Pacífico",
  selectedTitle: "{name} — Equal Earth Map",
  jsonLdAppDescription: "Atlas mundial interactivo con la proyección Equal Earth. Mapa de áreas equivalentes con tamaños relativos reales, a diferencia de Mercator, más vectores de Natural Earth y mapas de pared descargables.",
  jsonLdKeywords: "proyección Equal Earth, proyección equivalente, proyección Mercator, mapa mundial a tamaño real, atlas mundial interactivo, África tamaño real",
  skipToSearch: "Ir al mapa",
  brandHome: "Inicio de Equal Earth",
  tagline: "Proyección Equal Earth, no Mercator",
  language: "Idioma",
  languageMenu: "Idioma",
  mercatorSize: "Cómo Mercator distorsiona",
  mercatorShort: "Distorsión Mercator",
  mercatorMenu: "Cuándo mostrar la distorsión Mercator",
  mercatorAria: "Cómo Mercator distorsiona los países",
  mercatorAriaHidden: "Cómo Mercator distorsiona los países (contornos ocultos)",
  compareAlways: "Todos los países",
  compareHover: "Cuando señalo",
  compareTap: "Cuando pulso",
  compareHide: "Ocultar comparación",
  hintAlways: "Los contornos muestran lo grandes que se ven los países en Mercator.",
  hintHover: "Señala un país para ver su tamaño aparente en Mercator.",
  hintTap: "Pulsa un país para ver su tamaño aparente en Mercator.",
  hintOff: "Solo Equal Earth. Los contornos Mercator están ocultos.",
  search: "Buscar",
  searchCountryOrCity: "Busca un país o una ciudad",
  searchPlaceholder: "Groenlandia, África…",
  searchResults: "Resultados de búsqueda",
  searchEmpty: "Ningún lugar coincide con “{query}”. Prueba otra grafía, o recorre el mapa.",
  layers: "Capas",
  closeLayers: "Cerrar capas",
  mapLayers: "Capas del mapa",
  layerCountries: "Países",
  layerLakes: "Lagos",
  layerRivers: "Ríos",
  layerCities: "Ciudades",
  layerLabels: "Etiquetas",
  layerGraticule: "Rejilla lat/long",
  layerMore: "Más capas",
  moreMapLayers: "Más capas del mapa",
  centerMap: "Centrar mapa",
  countriesAlwaysOn: "Los países quedan siempre visibles para que el globo tenga tierras",
  about: "Acerca de",
  atlasView: "Atlas interactivo Equal Earth",
  loading: "Cargando datos de Natural Earth…",
  loadError: "No se pudieron cargar los datos del mapa. Inténtalo de nuevo.",
  canvasFail: "Este navegador no puede dibujar el mapa. Inténtalo de nuevo.",
  tryAgain: "Reintentar",
  clearSelection: "Quitar selección",
  zoomIn: "Acercar",
  zoomOut: "Alejar",
  resetView: "Restablecer vista",
  mapCenter: "Centro del mapa",
  centerAfrica: "África",
  centerAmericas: "Américas",
  centerPacific: "Pacífico",
  centerAfricaTitle: "Centrar en África",
  centerAmericasTitle: "Centrar en las Américas",
  centerPacificTitle: "Centrar en el Pacífico",
  legendEqualEarth: "Este mapa: Equal Earth",
  legendEqualEarthShort: "Equal Earth",
  legendMercator: "Así se ve en Mercator",
  legendMercatorShort: "Mercator",
  legendLead: "Los países rellenos son el tamaño real. Los contornos son cómo se ven en Mercator.",
  legendLeadCompact: "La tierra rellena es tamaño real. Los contornos son Mercator.",
  legendRestoreStatus: "Solo tamaño real.",
  legendRestoreAction: "Mostrar contornos Mercator",
  attribFull: "Proyección Equal Earth de Šavrič, Patterson y Jenny · Mapas de pared de Tom Patterson / BMZ · Vectores de Natural Earth",
  attribShort: "Equal Earth · Natural Earth",
  close: "Cerrar",
  politicalMap: "Mapa político",
  physicalMap: "Mapa físico",
  aboutTitle: "Un atlas interactivo en proyección Equal Earth",
  aboutP1: "Este es un atlas interactivo. Puedes desplazarte, acercar y buscar. El mapa usa la proyección Equal Earth, no Mercator.",
  aboutP2: "Mercator es el método habitual de los mapas web, de 1569. Estira la tierra cerca de los polos para que las direcciones de la brújula queden rectas. En esos mapas Groenlandia parece similar en tamaño a África. África es unas 14 veces más grande.",
  aboutP3: "Una proyección de áreas equivalentes es un mapa plano que conserva el tamaño relativo real. Ningún mapa plano muestra la Tierra sin un intercambio. Mercator conserva la dirección de la brújula y pierde el tamaño. Gall–Peters conserva el tamaño y estira las formas de los continentes. Equal Earth conserva el tamaño real con formas más familiares.",
  aboutP4: "En septiembre de 2026, la Asamblea General de la ONU adoptó Correct the Map. La resolución es una petición, no una ley. Togo y la Unión Africana lideraron la campaña. Pide a escuelas, gobiernos y empresas tecnológicas que usen mapas de áreas equivalentes como Equal Earth.",
  aboutVote: "Votación de la Asamblea General",
  voteInFavor: "A favor",
  voteAgainst: "En contra",
  voteAbstained: "Abstenciones",
  voteAgainstWho: "Estados Unidos",
  voteAbstainedWho: "Estonia, Georgia, Lituania, Moldavia, Serbia y Ucrania",
  aboutP5: "Ucrania y Serbia dijeron que apoyan el tamaño real de los continentes. Objetaron cómo algunos mapas políticos Equal Earth dibujan tierras en disputa. La resolución no fija fronteras.",
  aboutVoteRecord: "Votación registrada el 4 de septiembre de 2026.",
  aboutVoteLink: "Informe de UN News sobre la votación",
  aboutP6: "Los contornos tenues muestran lo grandes que se ven esos países en Mercator. Se vuelven coral al señalarlos. Haz clic en un país para ver las cifras.",
  aboutP7: "El globo son vectores Natural Earth 1:50 millones dibujados en Equal Earth. Los mapas de pared originales están disponibles para descargar:",
  aboutCredit: "Mapa político: Tom Patterson, dominio público. Mapa físico: edición alemana del BMZ basada en Equal Earth / Natural Earth. Este sitio no usa cookies para contar visitas.",
  versionLocal: "Versión local",
  versionLabel: "Versión",
  outlineMuted: "El contorno es el tamaño aparente en Mercator: tenue en reposo, coral al señalarlo.",
  outlineScaled: "El contorno es este país a la escala de lo grande que se ve en Mercator.",
  equatorBarely: "Mercator casi no cambia el tamaño de este país.",
  compactOutline: "El contorno es lo grande que se ve en Mercator.",
  equatorNoOutline: "Cerca del ecuador las dos proyecciones coinciden en el tamaño, así que no hay contorno extra.",
  equalEarthTrue: "Equal Earth conserva el área relativa real.",
  wouldAppear: "Esta tierra aparecería {note} que su tamaño real.",
  equatorAgree: "Cerca del ecuador Mercator y Equal Earth coinciden en el tamaño.",
  trueArea: "Área real",
  looksMercator: "Así se ve en Mercator",
  difference: "Diferencia",
  largerMercator: "{n}× más grande en Mercator",
  smallerMercator: "{n}× más pequeño en Mercator",
  largerMercatorLabel: "Más grande en Mercator",
  smallerMercatorLabel: "Más pequeño en Mercator",
  capital: "Capital",
  city: "Ciudad",
  country: "País",
  cityMetaCapital: "capital",
  popMillion: "{n} millones",
  popThousand: "{n} mil",
  stageAriaAlways: "Mapa Equal Earth con contornos de tamaño Mercator. Las flechas desplazan, Intro selecciona el país del centro, más y menos acercan, Escape quita la selección.",
  stageAriaTap: "Mapa Equal Earth. Pulsa un país para el tamaño Mercator. Las flechas desplazan, Intro selecciona el país del centro, más y menos acercan, Escape quita la selección.",
  stageAriaHover: "Mapa Equal Earth. Señala un país para el tamaño Mercator. Las flechas desplazan, Intro selecciona el país del centro, más y menos acercan, Escape quita la selección.",
  stageAriaPlain: "Mapa mundial Equal Earth. Las flechas desplazan, Intro selecciona el país del centro, más y menos acercan, Escape quita la selección.",
  searchKindCountry: "País",
  faq: [
    {
      name: "¿Qué es la proyección Equal Earth?",
      text: "Equal Earth es una proyección cartográfica cilíndrica equivalente. Continentes y países conservan su tamaño relativo real, con formas más familiares que Gall–Peters."
    },
    {
      name: "¿Por qué África se ve más grande que en Google Maps?",
      text: "Google Maps usa la proyección Mercator, que infla la tierra cerca de los polos. África es unas 14 veces más grande que Groenlandia. La proyección Equal Earth muestra esa relación de tamaño real."
    },
    {
      name: "¿Las Naciones Unidas sustituyeron el mapa mundial?",
      text: "No. En septiembre de 2026 la Asamblea General de la ONU adoptó Correct the Map, una petición de usar proyecciones de áreas equivalentes como Equal Earth al comparar el tamaño de los países. La votación fue 164 a favor, 1 en contra (Estados Unidos) y 6 abstenciones (Estonia, Georgia, Lituania, Moldavia, Serbia y Ucrania). La resolución no prohíbe Mercator ni fija fronteras."
    },
    {
      name: "¿Qué es una proyección de áreas equivalentes?",
      text: "Una proyección de áreas equivalentes es un mapa plano que conserva el tamaño relativo real. Una tierra el doble de grande en la Tierra ocupa el doble de espacio en el mapa. Mercator no es equivalente. Equal Earth sí."
    },
    {
      name: "¿En qué se diferencia Equal Earth de Mercator?",
      text: "Mercator conserva la dirección de la brújula y estira la tierra cerca de los polos. Equal Earth es equivalente: los países conservan su tamaño relativo real, con formas continentales más familiares que Gall–Peters. Este atlas usa Equal Earth y muestra el tamaño Mercator como una superposición de comparación."
    },
    {
      name: "¿Cuánto más grande es África que Groenlandia?",
      text: "África es unas 14 veces más grande que Groenlandia. En un mapa web Mercator pueden parecer similares porque Mercator infla la tierra cerca de los polos. Equal Earth mantiene esa relación de 14 a 1."
    },
    {
      name: "¿Qué datos usa este atlas?",
      text: "El atlas interactivo usa vectores Natural Earth 1:50 millones. Los mapas de pared políticos de Patterson y físicos del BMZ en Equal Earth están disponibles para descargar."
    }
  ]
};

const FR: AtlasMessages = {
  metaTitle: "Projection Equal Earth — Atlas mondial interactif à taille réelle",
  metaDescription: "Atlas interactif en projection Equal Earth. Une carte équivalente avec la taille réelle des pays, contrairement à Mercator. Cherchez sur la carte et téléchargez des cartes murales.",
  ogImageAlt: "Carte politique mondiale en projection Equal Earth centrée sur le Pacifique",
  selectedTitle: "{name} — Equal Earth Map",
  jsonLdAppDescription: "Atlas mondial interactif en projection Equal Earth. Carte équivalente aux tailles relatives réelles, contrairement à Mercator, plus les vecteurs Natural Earth et des cartes murales téléchargeables.",
  jsonLdKeywords: "projection Equal Earth, projection équivalente, projection de Mercator, carte mondiale à taille réelle, atlas mondial interactif, Afrique taille réelle",
  skipToSearch: "Aller à la carte",
  brandHome: "Accueil Equal Earth",
  tagline: "Projection Equal Earth, pas Mercator",
  language: "Langue",
  languageMenu: "Langue",
  mercatorSize: "Comment Mercator étire",
  mercatorShort: "Étirement Mercator",
  mercatorMenu: "Quand montrer l’étirement Mercator",
  mercatorAria: "Comment Mercator étire les pays",
  mercatorAriaHidden: "Comment Mercator étire les pays (contours masqués)",
  compareAlways: "Tous les pays",
  compareHover: "Quand je pointe",
  compareTap: "Quand je tape",
  compareHide: "Masquer la comparaison",
  hintAlways: "Les contours montrent la taille apparente des pays sur Mercator.",
  hintHover: "Pointez un pays pour voir sa taille apparente sur Mercator.",
  hintTap: "Touchez un pays pour voir sa taille apparente sur Mercator.",
  hintOff: "Equal Earth seulement. Les contours Mercator sont masqués.",
  search: "Rechercher",
  searchCountryOrCity: "Rechercher un pays ou une ville",
  searchPlaceholder: "Groenland, Afrique…",
  searchResults: "Résultats de recherche",
  searchEmpty: "Aucun lieu ne correspond à « {query} ». Essayez une autre graphie, ou déplacez la carte.",
  layers: "Couches",
  closeLayers: "Fermer les couches",
  mapLayers: "Couches de la carte",
  layerCountries: "Pays",
  layerLakes: "Lacs",
  layerRivers: "Fleuves",
  layerCities: "Villes",
  layerLabels: "Étiquettes",
  layerGraticule: "Grille lat/long",
  layerMore: "Plus de couches",
  moreMapLayers: "Autres couches de la carte",
  centerMap: "Centrer la carte",
  countriesAlwaysOn: "Les pays restent affichés pour que le globe ait des terres",
  about: "À propos",
  atlasView: "Atlas interactif Equal Earth",
  loading: "Chargement des données Natural Earth…",
  loadError: "Impossible de charger la carte. Réessayez.",
  canvasFail: "Ce navigateur ne peut pas dessiner la carte. Réessayez.",
  tryAgain: "Réessayer",
  clearSelection: "Effacer la sélection",
  zoomIn: "Zoom avant",
  zoomOut: "Zoom arrière",
  resetView: "Réinitialiser la vue",
  mapCenter: "Centre de la carte",
  centerAfrica: "Afrique",
  centerAmericas: "Amériques",
  centerPacific: "Pacifique",
  centerAfricaTitle: "Centrer sur l’Afrique",
  centerAmericasTitle: "Centrer sur les Amériques",
  centerPacificTitle: "Centrer sur le Pacifique",
  legendEqualEarth: "Cette carte : Equal Earth",
  legendEqualEarthShort: "Equal Earth",
  legendMercator: "Taille apparente sur Mercator",
  legendMercatorShort: "Mercator",
  legendLead: "Les pays colorés sont à taille réelle. Les contours sont leur apparence sur Mercator.",
  legendLeadCompact: "Les terres colorées sont à taille réelle. Les contours sont Mercator.",
  legendRestoreStatus: "Taille réelle seulement.",
  legendRestoreAction: "Afficher les contours Mercator",
  attribFull: "Projection Equal Earth par Šavrič, Patterson et Jenny · Cartes murales par Tom Patterson / BMZ · Vecteurs Natural Earth",
  attribShort: "Equal Earth · Natural Earth",
  close: "Fermer",
  politicalMap: "Carte politique",
  physicalMap: "Carte physique",
  aboutTitle: "Un atlas interactif en projection Equal Earth",
  aboutP1: "Ceci est un atlas interactif. Vous pouvez vous déplacer, zoomer et chercher. La carte utilise la projection Equal Earth, pas Mercator.",
  aboutP2: "Mercator est la méthode habituelle des cartes web, datant de 1569. Elle étire les terres près des pôles pour garder les directions de boussole droites. Sur ces cartes, le Groenland paraît de taille similaire à l’Afrique. L’Afrique est environ 14 fois plus grande.",
  aboutP3: "Une projection équivalente est une carte plane qui conserve la taille relative réelle. Aucune carte plane ne montre la Terre sans un compromis. Mercator garde la direction de la boussole et perd la taille. Gall–Peters garde la taille et étire les formes des continents. Equal Earth garde la taille réelle avec des formes plus familières.",
  aboutP4: "En septembre 2026, l’Assemblée générale des Nations Unies a adopté Correct the Map. La résolution est une demande, pas une loi. Le Togo et l’Union africaine ont mené la campagne. Elle invite écoles, gouvernements et entreprises technologiques à utiliser des cartes équivalentes telles qu’Equal Earth.",
  aboutVote: "Vote de l’Assemblée générale",
  voteInFavor: "Pour",
  voteAgainst: "Contre",
  voteAbstained: "Abstentions",
  voteAgainstWho: "États-Unis",
  voteAbstainedWho: "Estonie, Géorgie, Lituanie, Moldavie, Serbie et Ukraine",
  aboutP5: "L’Ukraine et la Serbie ont dit soutenir la taille réelle des continents. Elles ont objecté à la façon dont certaines cartes politiques Equal Earth dessinent des terres disputées. La résolution ne fixe pas les frontières.",
  aboutVoteRecord: "Vote enregistré le 4 septembre 2026.",
  aboutVoteLink: "Article UN News sur le vote",
  aboutP6: "Les contours atténués montrent la taille apparente de ces pays sur Mercator. Ils deviennent corail lorsque vous en pointez un. Cliquez un pays pour les chiffres.",
  aboutP7: "Le globe est constitué de vecteurs Natural Earth au 1:50 millions dessinés en Equal Earth. Les cartes murales originales sont disponibles en téléchargement :",
  aboutCredit: "Carte politique : Tom Patterson, domaine public. Carte physique : édition allemande BMZ d’après Equal Earth / Natural Earth. Ce site n’utilise pas de cookies pour compter les visites.",
  versionLocal: "Version locale",
  versionLabel: "Version",
  outlineMuted: "Le contour est la taille apparente sur Mercator — atténué au repos, corail lorsque vous le pointez.",
  outlineScaled: "Le contour est ce pays mis à l’échelle de sa taille apparente sur Mercator.",
  equatorBarely: "Mercator change à peine la taille de ce pays.",
  compactOutline: "Le contour est la taille apparente sur Mercator.",
  equatorNoOutline: "Près de l’équateur, les deux projections s’accordent sur la taille, donc il n’y a pas de contour supplémentaire.",
  equalEarthTrue: "Equal Earth conserve l’aire relative réelle.",
  wouldAppear: "Cette terre paraîtrait {note} que sa taille réelle.",
  equatorAgree: "Près de l’équateur, Mercator et Equal Earth s’accordent sur la taille.",
  trueArea: "Superficie réelle",
  looksMercator: "Taille apparente sur Mercator",
  difference: "Écart",
  largerMercator: "{n}× plus grand en Mercator",
  smallerMercator: "{n}× plus petit en Mercator",
  largerMercatorLabel: "Plus grand en Mercator",
  smallerMercatorLabel: "Plus petit en Mercator",
  capital: "Capitale",
  city: "Ville",
  country: "Pays",
  cityMetaCapital: "capitale",
  popMillion: "{n} millions",
  popThousand: "{n} mille",
  stageAriaAlways: "Carte Equal Earth avec contours de taille Mercator. Les flèches déplacent, Entrée sélectionne le pays au centre, plus et moins zooment, Échap efface la sélection.",
  stageAriaTap: "Carte Equal Earth. Touchez un pays pour la taille Mercator. Les flèches déplacent, Entrée sélectionne le pays au centre, plus et moins zooment, Échap efface la sélection.",
  stageAriaHover: "Carte Equal Earth. Survolez un pays pour la taille Mercator. Les flèches déplacent, Entrée sélectionne le pays au centre, plus et moins zooment, Échap efface la sélection.",
  stageAriaPlain: "Carte mondiale Equal Earth. Les flèches déplacent, Entrée sélectionne le pays au centre, plus et moins zooment, Échap efface la sélection.",
  searchKindCountry: "Pays",
  faq: [
    {
      name: "Qu’est-ce que la projection Equal Earth ?",
      text: "Equal Earth est une projection cartographique pseudo-cylindrique équivalente. Continents et pays conservent leurs tailles relatives réelles, avec des formes plus familières que Gall–Peters."
    },
    {
      name: "Pourquoi l’Afrique paraît-elle plus grande que sur Google Maps ?",
      text: "Google Maps utilise la projection de Mercator, qui gonfle les terres près des pôles. L’Afrique est environ 14 fois plus grande que le Groenland. La projection Equal Earth montre cette relation de taille réelle."
    },
    {
      name: "Les Nations Unies ont-elles remplacé la carte du monde ?",
      text: "Non. En septembre 2026, l’Assemblée générale a adopté Correct the Map, une demande d’utiliser des projections équivalentes telles qu’Equal Earth pour comparer la taille des pays. Le vote était 164 pour, 1 contre (États-Unis) et 6 abstentions (Estonie, Géorgie, Lituanie, Moldavie, Serbie et Ukraine). La résolution n’interdit pas Mercator et ne fixe pas les frontières."
    },
    {
      name: "Qu’est-ce qu’une projection équivalente ?",
      text: "Une projection équivalente est une carte plane qui conserve la taille relative réelle. Une terre deux fois plus grande sur Terre occupe environ deux fois plus d’espace sur la carte. Mercator n’est pas équivalente. Equal Earth l’est."
    },
    {
      name: "En quoi Equal Earth diffère-t-elle de Mercator ?",
      text: "Mercator conserve la direction de la boussole et étire les terres près des pôles. Equal Earth est équivalente : les pays gardent leur taille relative réelle, avec des formes continentales plus familières que Gall–Peters. Cet atlas utilise Equal Earth et montre la taille Mercator en superposition de comparaison."
    },
    {
      name: "Quelle est la taille de l’Afrique par rapport au Groenland ?",
      text: "L’Afrique est environ 14 fois plus grande que le Groenland. Sur une carte web Mercator, ils peuvent paraître similaires parce que Mercator gonfle les terres près des pôles. Equal Earth conserve ce rapport de 14 pour 1."
    },
    {
      name: "Quelles données cet atlas utilise-t-il ?",
      text: "L’atlas interactif utilise les vecteurs Natural Earth au 1:50 millions. Les cartes murales politiques de Patterson et physiques du BMZ en Equal Earth sont disponibles en téléchargement."
    }
  ]
};

const PT: AtlasMessages = {
  metaTitle: "Projeção Equal Earth — Atlas mundial interativo em tamanho real",
  metaDescription: "Atlas interativo na projeção Equal Earth. Um mapa de áreas equivalentes com o tamanho real dos países, ao contrário de Mercator. Pesquise o mapa e baixe mapas de parede.",
  ogImageAlt: "Mapa político mundial na projeção Equal Earth centrado no Pacífico",
  selectedTitle: "{name} — Equal Earth Map",
  jsonLdAppDescription: "Atlas mundial interativo com a projeção Equal Earth. Mapa de áreas equivalentes com tamanhos relativos reais, ao contrário de Mercator, além de vetores Natural Earth e mapas de parede para download.",
  jsonLdKeywords: "projeção Equal Earth, projeção equivalente, projeção de Mercator, mapa mundial em tamanho real, atlas mundial interativo, África tamanho real",
  skipToSearch: "Ir para o mapa",
  brandHome: "Início Equal Earth",
  tagline: "Projeção Equal Earth, não Mercator",
  language: "Idioma",
  languageMenu: "Idioma",
  mercatorSize: "Como o Mercator distorce",
  mercatorShort: "Distorção Mercator",
  mercatorMenu: "Quando mostrar a distorção Mercator",
  mercatorAria: "Como o Mercator distorce os países",
  mercatorAriaHidden: "Como o Mercator distorce os países (contornos ocultos)",
  compareAlways: "Todos os países",
  compareHover: "Quando eu aponto",
  compareTap: "Quando eu toco",
  compareHide: "Ocultar comparação",
  hintAlways: "Os contornos mostram o tamanho aparente dos países no Mercator.",
  hintHover: "Aponte para um país para ver o tamanho aparente no Mercator.",
  hintTap: "Toque em um país para ver o tamanho aparente no Mercator.",
  hintOff: "Só Equal Earth. Os contornos Mercator estão ocultos.",
  search: "Buscar",
  searchCountryOrCity: "Busque um país ou uma cidade",
  searchPlaceholder: "Groenlândia, África…",
  searchResults: "Resultados da busca",
  searchEmpty: "Nenhum lugar corresponde a “{query}”. Tente outra grafia, ou percorra o mapa.",
  layers: "Camadas",
  closeLayers: "Fechar camadas",
  mapLayers: "Camadas do mapa",
  layerCountries: "Países",
  layerLakes: "Lagos",
  layerRivers: "Rios",
  layerCities: "Cidades",
  layerLabels: "Rótulos",
  layerGraticule: "Grade lat/long",
  layerMore: "Mais camadas",
  moreMapLayers: "Mais camadas do mapa",
  centerMap: "Centralizar mapa",
  countriesAlwaysOn: "Os países ficam sempre ligados para o globo ter terras",
  about: "Sobre",
  atlasView: "Atlas interativo Equal Earth",
  loading: "Carregando dados Natural Earth…",
  loadError: "Não foi possível carregar o mapa. Tente de novo.",
  canvasFail: "Este navegador não consegue desenhar o mapa. Tente de novo.",
  tryAgain: "Tentar de novo",
  clearSelection: "Limpar seleção",
  zoomIn: "Aproximar",
  zoomOut: "Afastar",
  resetView: "Redefinir vista",
  mapCenter: "Centro do mapa",
  centerAfrica: "África",
  centerAmericas: "Américas",
  centerPacific: "Pacífico",
  centerAfricaTitle: "Centralizar na África",
  centerAmericasTitle: "Centralizar nas Américas",
  centerPacificTitle: "Centralizar no Pacífico",
  legendEqualEarth: "Este mapa: Equal Earth",
  legendEqualEarthShort: "Equal Earth",
  legendMercator: "Tamanho aparente no Mercator",
  legendMercatorShort: "Mercator",
  legendLead: "Países preenchidos estão em tamanho real. Os contornos são como aparecem no Mercator.",
  legendLeadCompact: "A terra preenchida é tamanho real. Os contornos são Mercator.",
  legendRestoreStatus: "Somente tamanho real.",
  legendRestoreAction: "Mostrar contornos Mercator",
  attribFull: "Projeção Equal Earth de Šavrič, Patterson e Jenny · Mapas de parede de Tom Patterson / BMZ · Vetores de Natural Earth",
  attribShort: "Equal Earth · Natural Earth",
  close: "Fechar",
  politicalMap: "Mapa político",
  physicalMap: "Mapa físico",
  aboutTitle: "Um atlas interativo na projeção Equal Earth",
  aboutP1: "Este é um atlas interativo. Você pode mover, aproximar e buscar. O mapa usa a projeção Equal Earth, não Mercator.",
  aboutP2: "Mercator é o método usual dos mapas da web, de 1569. Estica a terra perto dos polos para manter as direções da bússola retas. Nesses mapas, a Groenlândia parece semelhante em tamanho à África. A África é cerca de 14 vezes maior.",
  aboutP3: "Uma projeção de áreas equivalentes é um mapa plano que conserva o tamanho relativo real. Nenhum mapa plano mostra a Terra sem uma troca. Mercator conserva a direção da bússola e perde o tamanho. Gall–Peters conserva o tamanho e estica as formas dos continentes. Equal Earth conserva o tamanho real com formas mais familiares.",
  aboutP4: "Em setembro de 2026, a Assembleia Geral da ONU adotou Correct the Map. A resolução é um pedido, não uma lei. Togo e a União Africana lideraram a campanha. Ela pede a escolas, governos e empresas de tecnologia que usem mapas de áreas equivalentes como Equal Earth.",
  aboutVote: "Votação da Assembleia Geral",
  voteInFavor: "A favor",
  voteAgainst: "Contra",
  voteAbstained: "Abstenções",
  voteAgainstWho: "Estados Unidos",
  voteAbstainedWho: "Estônia, Geórgia, Lituânia, Moldávia, Sérvia e Ucrânia",
  aboutP5: "Ucrânia e Sérvia disseram apoiar o tamanho real dos continentes. Objetaram a como alguns mapas políticos Equal Earth desenham terras em disputa. A resolução não define fronteiras.",
  aboutVoteRecord: "Votação registrada em 4 de setembro de 2026.",
  aboutVoteLink: "Reportagem da UN News sobre a votação",
  aboutP6: "Os contornos suaves mostram o tamanho aparente desses países no Mercator. Ficam coral quando você aponta para um. Clique em um país para ver os números.",
  aboutP7: "O globo são vetores Natural Earth 1:50 milhões desenhados em Equal Earth. Os mapas de parede originais estão disponíveis para download:",
  aboutCredit: "Mapa político: Tom Patterson, domínio público. Mapa físico: edição alemã do BMZ com base em Equal Earth / Natural Earth. Este site não usa cookies para contar visitas.",
  versionLocal: "Versão local",
  versionLabel: "Versão",
  outlineMuted: "O contorno é o tamanho aparente no Mercator — suave em repouso, coral quando você aponta.",
  outlineScaled: "O contorno é este país na escala de quão grande ele parece no Mercator.",
  equatorBarely: "O Mercator quase não muda o tamanho deste país.",
  compactOutline: "O contorno é o tamanho aparente no Mercator.",
  equatorNoOutline: "Perto do equador as duas projeções concordam no tamanho, então não há contorno extra.",
  equalEarthTrue: "Equal Earth conserva a área relativa real.",
  wouldAppear: "Esta terra apareceria {note} do que seu tamanho real.",
  equatorAgree: "Perto do equador, Mercator e Equal Earth concordam no tamanho.",
  trueArea: "Área real",
  looksMercator: "Tamanho aparente no Mercator",
  difference: "Diferença",
  largerMercator: "{n}× maior no Mercator",
  smallerMercator: "{n}× menor no Mercator",
  largerMercatorLabel: "Maior no Mercator",
  smallerMercatorLabel: "Menor no Mercator",
  capital: "Capital",
  city: "Cidade",
  country: "País",
  cityMetaCapital: "capital",
  popMillion: "{n} milhões",
  popThousand: "{n} mil",
  stageAriaAlways: "Mapa Equal Earth com contornos de tamanho Mercator. As setas deslocam, Enter seleciona o país no centro, mais e menos aproximam, Escape limpa a seleção.",
  stageAriaTap: "Mapa Equal Earth. Toque em um país para o tamanho Mercator. As setas deslocam, Enter seleciona o país no centro, mais e menos aproximam, Escape limpa a seleção.",
  stageAriaHover: "Mapa Equal Earth. Aponte para um país para o tamanho Mercator. As setas deslocam, Enter seleciona o país no centro, mais e menos aproximam, Escape limpa a seleção.",
  stageAriaPlain: "Mapa mundial Equal Earth. As setas deslocam, Enter seleciona o país no centro, mais e menos aproximam, Escape limpa a seleção.",
  searchKindCountry: "País",
  faq: [
    {
      name: "O que é a projeção Equal Earth?",
      text: "Equal Earth é uma projeção cartográfica pseudocilíndrica equivalente. Continentes e países conservam seus tamanhos relativos reais, com formas mais familiares do que Gall–Peters."
    },
    {
      name: "Por que a África parece maior do que no Google Maps?",
      text: "O Google Maps usa a projeção de Mercator, que infla a terra perto dos polos. A África é cerca de 14 vezes maior que a Groenlândia. A projeção Equal Earth mostra essa relação de tamanho real."
    },
    {
      name: "As Nações Unidas substituíram o mapa-múndi?",
      text: "Não. Em setembro de 2026 a Assembleia Geral da ONU adotou Correct the Map, um pedido para usar projeções de áreas equivalentes como Equal Earth ao comparar o tamanho dos países. A votação foi 164 a favor, 1 contra (Estados Unidos) e 6 abstenções (Estônia, Geórgia, Lituânia, Moldávia, Sérvia e Ucrânia). A resolução não proíbe Mercator nem define fronteiras."
    },
    {
      name: "O que é uma projeção de áreas equivalentes?",
      text: "Uma projeção de áreas equivalentes é um mapa plano que conserva o tamanho relativo real. Terra duas vezes maior na Terra ocupa cerca de duas vezes o espaço no mapa. Mercator não é equivalente. Equal Earth é."
    },
    {
      name: "Como a Equal Earth difere de Mercator?",
      text: "Mercator conserva a direção da bússola e estica a terra perto dos polos. Equal Earth é equivalente: os países conservam o tamanho relativo real, com formas continentais mais familiares do que Gall–Peters. Este atlas usa Equal Earth e mostra o tamanho Mercator como uma sobreposição de comparação."
    },
    {
      name: "Qual o tamanho da África em relação à Groenlândia?",
      text: "A África é cerca de 14 vezes maior que a Groenlândia. Num mapa web Mercator elas podem parecer semelhantes porque Mercator infla a terra perto dos polos. Equal Earth mantém essa relação de 14 para 1."
    },
    {
      name: "Que dados este atlas usa?",
      text: "O atlas interativo usa vetores Natural Earth 1:50 milhões. Os mapas de parede políticos de Patterson e físicos do BMZ em Equal Earth estão disponíveis para download."
    }
  ]
};

const AR: AtlasMessages = {
  metaTitle: "مسقط Equal Earth — أطلس عالمي تفاعلي بالحجم الحقيقي",
  metaDescription: "أطلس تفاعلي بمسقط Equal Earth. خريطة متساوية المساحات تُظهر الحجم الحقيقي للدول، بخلاف مركاتور. ابحث في الخريطة وحمّل خرائط جدارية.",
  ogImageAlt: "خريطة سياسية عالمية بمسقط Equal Earth متمركزة على المحيط الهادئ",
  selectedTitle: "{name} — Equal Earth Map",
  jsonLdAppDescription: "أطلس عالمي تفاعلي بمسقط Equal Earth. خريطة متساوية المساحات بأحجام نسبية حقيقية بخلاف مركاتور، مع متجهات Natural Earth وخرائط جدارية قابلة للتنزيل.",
  jsonLdKeywords: "مسقط Equal Earth، مسقط متساوي المساحات، مسقط مركاتور، خريطة العالم بالحجم الحقيقي، أطلس عالمي تفاعلي، أفريقيا الحجم الحقيقي",
  skipToSearch: "تخطي إلى الخريطة",
  brandHome: "الصفحة الرئيسية لـ Equal Earth",
  tagline: "مسقط Equal Earth، وليس مركاتور",
  language: "اللغة",
  languageMenu: "اللغة",
  mercatorSize: "كيف يمدّد مركاتور",
  mercatorShort: "تمديد مركاتور",
  mercatorMenu: "متى يُعرض تمديد مركاتور",
  mercatorAria: "كيف يمدّد مركاتور البلدان",
  mercatorAriaHidden: "كيف يمدّد مركاتور البلدان (الخطوط الخارجية مخفية)",
  compareAlways: "كل البلدان",
  compareHover: "عندما أشير",
  compareTap: "عندما أنقر",
  compareHide: "إخفاء المقارنة",
  hintAlways: "الخطوط تُظهر حجم الدول الظاهر على مركاتور.",
  hintHover: "أشر إلى دولة لترى حجمها الظاهر على مركاتور.",
  hintTap: "انقر دولة لترى حجمها الظاهر على مركاتور.",
  hintOff: "Equal Earth فقط. خطوط مركاتور الخارجية مخفية.",
  search: "بحث",
  searchCountryOrCity: "ابحث عن دولة أو مدينة",
  searchPlaceholder: "غرينلاند، أفريقيا…",
  searchResults: "نتائج البحث",
  searchEmpty: "لا أماكن تطابق «{query}». جرّب كتابة أخرى، أو حرّك الخريطة.",
  layers: "الطبقات",
  closeLayers: "إغلاق الطبقات",
  mapLayers: "طبقات الخريطة",
  layerCountries: "الدول",
  layerLakes: "البحيرات",
  layerRivers: "الأنهار",
  layerCities: "المدن",
  layerLabels: "التسميات",
  layerGraticule: "شبكة العرض/الطول",
  layerMore: "المزيد من الطبقات",
  moreMapLayers: "طبقات خريطة إضافية",
  centerMap: "توسيط الخريطة",
  countriesAlwaysOn: "تبقى البلدان ظاهرة حتى يكون للكرة أراضٍ",
  about: "حول",
  atlasView: "أطلس Equal Earth التفاعلي",
  loading: "جارٍ تحميل بيانات Natural Earth…",
  loadError: "تعذّر تحميل بيانات الخريطة. حاول مرة أخرى.",
  canvasFail: "لا يستطيع هذا المتصفح رسم الخريطة. حاول مرة أخرى.",
  tryAgain: "إعادة المحاولة",
  clearSelection: "إلغاء التحديد",
  zoomIn: "تكبير",
  zoomOut: "تصغير",
  resetView: "إعادة ضبط العرض",
  mapCenter: "مركز الخريطة",
  centerAfrica: "أفريقيا",
  centerAmericas: "الأمريكتان",
  centerPacific: "الهادئ",
  centerAfricaTitle: "توسيط على أفريقيا",
  centerAmericasTitle: "توسيط على الأمريكتين",
  centerPacificTitle: "توسيط على المحيط الهادئ",
  legendEqualEarth: "هذه الخريطة: Equal Earth",
  legendEqualEarthShort: "Equal Earth",
  legendMercator: "هكذا تبدو على مركاتور",
  legendMercatorShort: "مركاتور",
  legendLead: "البلدان المملوءة بحجمها الحقيقي. الخطوط الخارجية هي شكلها على مركاتور.",
  legendLeadCompact: "الأرض المملوءة بالحجم الحقيقي. الخطوط الخارجية مركاتور.",
  legendRestoreStatus: "الحجم الحقيقي فقط.",
  legendRestoreAction: "إظهار خطوط مركاتور",
  attribFull: "مسقط Equal Earth لـ Šavrič وPatterson وJenny · خرائط جدارية لـ Tom Patterson / BMZ · متجهات من Natural Earth",
  attribShort: "Equal Earth · Natural Earth",
  close: "إغلاق",
  politicalMap: "الخريطة السياسية",
  physicalMap: "الخريطة الطبيعية",
  aboutTitle: "أطلس تفاعلي بمسقط Equal Earth",
  aboutP1: "هذا أطلس تفاعلي. يمكنك التحريك والتكبير والبحث. الخريطة تستخدم مسقط Equal Earth، وليس مركاتور.",
  aboutP2: "مركاتور هو أسلوب خرائط الويب المعتاد منذ 1569. يمدّ الأرض قرب القطبين كي تبقى اتجاهات البوصلة مستقيمة. تبدو غرينلاند بحجم مشابه لأفريقيا على تلك الخرائط. أفريقيا أكبر بنحو 14 مرة.",
  aboutP3: "المسقط متساوي المساحات خريطة مسطحة تحفظ الحجم النسبي الحقيقي. لا خريطة مسطحة تعرض الأرض دون مقايضة. مركاتور يحفظ اتجاه البوصلة ويخسر الحجم. غال–بيترز يحفظ الحجم ويمدّ أشكال القارات. Equal Earth يحفظ الحجم الحقيقي بأشكال أكثر ألفة.",
  aboutP4: "في سبتمبر 2026 اعتمدت الجمعية العامة للأمم المتحدة Correct the Map. القرار طلب وليس قانوناً. قادت توغو والاتحاد الأفريقي الحملة. يطلب من المدارس والحكومات وشركات التقنية استخدام خرائط متساوية المساحات مثل Equal Earth.",
  aboutVote: "تصويت الجمعية العامة",
  voteInFavor: "مؤيد",
  voteAgainst: "معارض",
  voteAbstained: "ممتنع",
  voteAgainstWho: "الولايات المتحدة",
  voteAbstainedWho: "إستونيا وجورجيا وليتوانيا ومولدوفا وصربيا وأوكرانيا",
  aboutP5: "قالت أوكرانيا وصربيا إنهما تدعم حجم القارات الحقيقي. اعترضتا على كيفية رسم بعض الخرائط السياسية Equal Earth للأراضي المتنازع عليها. القرار لا يحدّد الحدود.",
  aboutVoteRecord: "تصويت مسجّل في 4 سبتمبر 2026.",
  aboutVoteLink: "تقرير UN News عن التصويت",
  aboutP6: "الخطوط الخافتة تُظهر حجم تلك الدول الظاهر على مركاتور. تتحول إلى مرجاني عند الإشارة. انقر دولة لرؤية الأرقام.",
  aboutP7: "الكرة متجهات Natural Earth بمقياس 1:50 مليوناً مرسومة بـ Equal Earth. الخرائط الجدارية الأصلية متاحة للتنزيل:",
  aboutCredit: "الخريطة السياسية: Tom Patterson، ملك عام. الخريطة الطبيعية: طبعة BMZ الألمانية استناداً إلى Equal Earth / Natural Earth. هذا الموقع لا يستخدم ملفات تعريف الارتباط لعدّ الزيارات.",
  versionLocal: "إصدار محلي",
  versionLabel: "الإصدار",
  outlineMuted: "الخط هو الحجم الظاهر على مركاتور — خافت في السكون، مرجاني عند الإشارة.",
  outlineScaled: "الخط هو هذه الدولة بمقياس حجمها الظاهر على مركاتور.",
  equatorBarely: "مركاتور لا يكاد يغيّر حجم هذه الدولة.",
  compactOutline: "الخط الخارجي هو حجمها الظاهري على مركاتور.",
  equatorNoOutline: "قرب خط الاستواء يتفق المسقطان على الحجم، لذلك لا يوجد خط إضافي.",
  equalEarthTrue: "Equal Earth يحفظ المساحة النسبية الحقيقية.",
  wouldAppear: "ستظهر هذه الأرض {note} من حجمها الحقيقي.",
  equatorAgree: "قرب خط الاستواء يتفق مركاتور وEqual Earth على الحجم.",
  trueArea: "المساحة الحقيقية",
  looksMercator: "هكذا تبدو على مركاتور",
  difference: "الفرق",
  largerMercator: "أكبر بـ {n}× في مركاتور",
  smallerMercator: "أصغر بـ {n}× في مركاتور",
  largerMercatorLabel: "أكبر في مركاتور",
  smallerMercatorLabel: "أصغر في مركاتور",
  capital: "عاصمة",
  city: "مدينة",
  country: "دولة",
  cityMetaCapital: "عاصمة",
  popMillion: "{n} مليون",
  popThousand: "{n} ألف",
  stageAriaAlways: "خريطة Equal Earth مع خطوط حجم مركاتور. الأسهم تحرّك، Enter يختار الدولة في الوسط، زائد وناقص للتكبير، Escape يلغي التحديد.",
  stageAriaTap: "خريطة Equal Earth. انقر دولة لحجم مركاتور. الأسهم تحرّك، Enter يختار الدولة في الوسط، زائد وناقص للتكبير، Escape يلغي التحديد.",
  stageAriaHover: "خريطة Equal Earth. مرّر على دولة لحجم مركاتور. الأسهم تحرّك، Enter يختار الدولة في الوسط، زائد وناقص للتكبير، Escape يلغي التحديد.",
  stageAriaPlain: "خريطة العالم Equal Earth. الأسهم تحرّك، Enter يختار الدولة في الوسط، زائد وناقص للتكبير، Escape يلغي التحديد.",
  searchKindCountry: "دولة",
  faq: [
    {
      name: "ما مسقط Equal Earth؟",
      text: "Equal Earth مسقط خرائط أسطواني زائف متساوي المساحات. تحتفظ القارات والدول بأحجامها النسبية الحقيقية، بأشكال أكثر ألفة من غال–بيترز."
    },
    {
      name: "لماذا تبدو أفريقيا أكبر مما في خرائط Google؟",
      text: "خرائط Google تستخدم مسقط مركاتور الذي يضخّم الأرض قرب القطبين. أفريقيا أكبر من غرينلاند بنحو 14 مرة. مسقط Equal Earth يُظهر علاقة الحجم الحقيقية تلك."
    },
    {
      name: "هل استبدلت الأمم المتحدة خريطة العالم؟",
      text: "لا. في سبتمبر 2026 اعتمدت الجمعية العامة Correct the Map، طلباً باستخدام مساقط متساوية المساحات مثل Equal Earth عند مقارنة حجم الدول. كان التصويت 164 مؤيداً، و1 معارضاً (الولايات المتحدة)، و6 ممتنعين (إستونيا وجورجيا وليتوانيا ومولدوفا وصربيا وأوكرانيا). القرار لا يحظر مركاتور ولا يحدّد الحدود."
    },
    {
      name: "ما المسقط متساوي المساحات؟",
      text: "المسقط متساوي المساحات خريطة مسطحة تحفظ الحجم النسبي الحقيقي. الأرض الأكبر مرتين على الكرة تأخذ نحو ضعف المساحة على الخريطة. مركاتور ليس متساوي المساحات. Equal Earth كذلك."
    },
    {
      name: "كيف يختلف Equal Earth عن مركاتور؟",
      text: "مركاتور يحفظ اتجاه البوصلة ويمدّ الأرض قرب القطبين. Equal Earth متساوي المساحات: تحتفظ الدول بالحجم النسبي الحقيقي، بأشكال قارية أكثر ألفة من غال–بيترز. يستخدم هذا الأطلس Equal Earth ويعرض حجم مركاتور كطبقة مقارنة."
    },
    {
      name: "كم تبلغ أفريقيا مقارنة بغرينلاند؟",
      text: "أفريقيا أكبر من غرينلاند بنحو 14 مرة. على خريطة ويب مركاتور قد تبدوان متشابهتين لأن مركاتور يضخّم الأرض قرب القطبين. Equal Earth يحفظ علاقة 14 إلى 1."
    },
    {
      name: "ما البيانات التي يستخدمها هذا الأطلس؟",
      text: "يستخدم الأطلس التفاعلي متجهات Natural Earth بمقياس 1:50 مليوناً. خرائط Patterson السياسية وBMZ الطبيعية بمسقط Equal Earth متاحة للتنزيل."
    }
  ]
};

const ZH: AtlasMessages = {
  metaTitle: "Equal Earth 投影 — 真实面积互动世界地图集",
  metaDescription: "Equal Earth 投影互动地图集。等积世界地图，国家面积真实，不同于墨卡托。可搜索地图并下载墙图。",
  ogImageAlt: "以太平洋为中心的 Equal Earth 投影政治世界地图",
  selectedTitle: "{name} — Equal Earth Map",
  jsonLdAppDescription: "使用 Equal Earth 投影的互动世界地图集。等积地图，国家相对面积真实，不同于墨卡托，并含 Natural Earth 矢量与可下载墙图。",
  jsonLdKeywords: "Equal Earth 投影, 等积投影, 墨卡托投影, 真实面积世界地图, 互动世界地图集, 非洲真实面积",
  skipToSearch: "跳到地图",
  brandHome: "Equal Earth 首页",
  tagline: "Equal Earth 投影，而非墨卡托",
  language: "语言",
  languageMenu: "语言",
  mercatorSize: "墨卡托如何拉伸",
  mercatorShort: "墨卡托拉伸",
  mercatorMenu: "何时显示墨卡托拉伸",
  mercatorAria: "墨卡托如何拉伸国家",
  mercatorAriaHidden: "墨卡托如何拉伸国家（轮廓已隐藏）",
  compareAlways: "每个国家",
  compareHover: "当我指向时",
  compareTap: "当我点按时",
  compareHide: "隐藏对照",
  hintAlways: "轮廓显示各国在墨卡托上显得有多大。",
  hintHover: "指向一个国家即可看到其墨卡托表观大小。",
  hintTap: "点按一个国家即可看到其墨卡托表观大小。",
  hintOff: "仅 Equal Earth。墨卡托轮廓已隐藏。",
  search: "搜索",
  searchCountryOrCity: "搜索国家或城市",
  searchPlaceholder: "格陵兰、非洲…",
  searchResults: "搜索结果",
  searchEmpty: "没有地点匹配“{query}”。试试别的拼写，或拖动地图。",
  layers: "图层",
  closeLayers: "关闭图层",
  mapLayers: "地图图层",
  layerCountries: "国家",
  layerLakes: "湖泊",
  layerRivers: "河流",
  layerCities: "城市",
  layerLabels: "标注",
  layerGraticule: "经纬网格",
  layerMore: "更多图层",
  moreMapLayers: "更多地图图层",
  centerMap: "居中地图",
  countriesAlwaysOn: "国家图层保持开启，以便地球上有陆地",
  about: "关于",
  atlasView: "互动 Equal Earth 地图集",
  loading: "正在加载 Natural Earth 数据…",
  loadError: "无法加载地图数据。请重试。",
  canvasFail: "此浏览器无法绘制地图。请重试。",
  tryAgain: "重试",
  clearSelection: "清除选择",
  zoomIn: "放大",
  zoomOut: "缩小",
  resetView: "重置视图",
  mapCenter: "地图中心",
  centerAfrica: "非洲",
  centerAmericas: "美洲",
  centerPacific: "太平洋",
  centerAfricaTitle: "以非洲为中心",
  centerAmericasTitle: "以美洲为中心",
  centerPacificTitle: "以太平洋为中心",
  legendEqualEarth: "本地图：Equal Earth",
  legendEqualEarthShort: "Equal Earth",
  legendMercator: "在墨卡托上显得这么大",
  legendMercatorShort: "墨卡托",
  legendLead: "填色国家是真实面积。轮廓是它们在墨卡托上的样子。",
  legendLeadCompact: "填色陆地是真实面积。轮廓是墨卡托。",
  legendRestoreStatus: "仅真实面积。",
  legendRestoreAction: "显示墨卡托轮廓",
  attribFull: "Equal Earth 投影：Šavrič、Patterson 与 Jenny · 墙图：Tom Patterson / BMZ · 矢量：Natural Earth",
  attribShort: "Equal Earth · Natural Earth",
  close: "关闭",
  politicalMap: "政治地图",
  physicalMap: "自然地图",
  aboutTitle: "互动 Equal Earth 投影地图集",
  aboutP1: "这是一份互动地图集。你可以平移、缩放和搜索。地图使用 Equal Earth 投影，而非墨卡托。",
  aboutP2: "墨卡托是 1569 年以来常见的网络地图方法。它拉伸近极地的陆地，以保持罗盘方向为直线。在那些地图上，格陵兰看起来与非洲差不多大。非洲实际大约大 14 倍。",
  aboutP3: "等积投影是保持真实相对面积的平面地图。任何平面地图展示地球都有取舍。墨卡托保留罗盘方向、失去面积。高尔–彼得斯保留面积、拉伸大陆形状。Equal Earth 保留真实面积，大陆形状更熟悉。",
  aboutP4: "2026 年 9 月，联合国大会通过 Correct the Map。该决议是请求，不是法律。多哥与非洲联盟主导这场运动。它请学校、政府和科技公司在比较国家面积时使用 Equal Earth 等等积地图。",
  aboutVote: "大会投票",
  voteInFavor: "赞成",
  voteAgainst: "反对",
  voteAbstained: "弃权",
  voteAgainstWho: "美国",
  voteAbstainedWho: "爱沙尼亚、格鲁吉亚、立陶宛、摩尔多瓦、塞尔维亚和乌克兰",
  aboutP5: "乌克兰和塞尔维亚表示支持大陆的真实面积。他们反对某些 Equal Earth 政治地图绘制争议土地的方式。该决议不划定边界。",
  aboutVoteRecord: "记录表决于 2026 年 9 月 4 日。",
  aboutVoteLink: "联合国新闻关于此次投票的报道",
  aboutP6: "浅色轮廓显示这些国家在墨卡托上显得有多大。指向时轮廓变为珊瑚色。点击国家可看数字。",
  aboutP7: "地球是以 Equal Earth 绘制的 Natural Earth 1:5000 万矢量。原始墙图可下载：",
  aboutCredit: "政治地图：Tom Patterson，公有领域。自然地图：BMZ 德文版，基于 Equal Earth / Natural Earth。本站不以 cookie 统计访问。",
  versionLocal: "本地版本",
  versionLabel: "版本",
  outlineMuted: "轮廓是墨卡托表观大小——静止时较淡，指向时为珊瑚色。",
  outlineScaled: "轮廓是该国按墨卡托表观大小缩放的结果。",
  equatorBarely: "墨卡托几乎不改变这个国家的大小。",
  compactOutline: "轮廓是它在墨卡托上看起来有多大。",
  equatorNoOutline: "靠近赤道时两种投影的面积接近，因此没有额外轮廓。",
  equalEarthTrue: "Equal Earth 保持相对面积真实。",
  wouldAppear: "这片土地会显得比真实面积{note}。",
  equatorAgree: "靠近赤道时，墨卡托与 Equal Earth 的面积一致。",
  trueArea: "真实面积",
  looksMercator: "在墨卡托上显得这么大",
  difference: "差异",
  largerMercator: "在墨卡托上大 {n}×",
  smallerMercator: "在墨卡托上小 {n}×",
  largerMercatorLabel: "在墨卡托上更大",
  smallerMercatorLabel: "在墨卡托上更小",
  capital: "首都",
  city: "城市",
  country: "国家",
  cityMetaCapital: "首都",
  popMillion: "{n} 百万",
  popThousand: "{n} 千",
  stageAriaAlways: "带墨卡托大小轮廓的 Equal Earth 地图。方向键平移，Enter 选择中心国家，加减号缩放，Escape 清除选择。",
  stageAriaTap: "Equal Earth 地图。点按国家查看墨卡托大小。方向键平移，Enter 选择中心国家，加减号缩放，Escape 清除选择。",
  stageAriaHover: "Equal Earth 地图。悬停国家查看墨卡托大小。方向键平移，Enter 选择中心国家，加减号缩放，Escape 清除选择。",
  stageAriaPlain: "Equal Earth 世界地图。方向键平移，Enter 选择中心国家，加减号缩放，Escape 清除选择。",
  searchKindCountry: "国家",
  faq: [
    {
      name: "什么是 Equal Earth 投影？",
      text: "Equal Earth 是等积伪圆柱地图投影。大陆和国家保持真实相对面积，形状比高尔–彼得斯更熟悉。"
    },
    {
      name: "为什么非洲看起来比谷歌地图上更大？",
      text: "谷歌地图使用墨卡托投影，会放大近极地陆地。非洲大约比格陵兰大 14 倍。Equal Earth 投影显示这一真实面积关系。"
    },
    {
      name: "联合国是否更换了世界地图？",
      text: "没有。2026 年 9 月联合国大会通过 Correct the Map，请求在比较国家面积时使用 Equal Earth 等等积投影。投票为 164 票赞成、1 票反对（美国）、6 票弃权（爱沙尼亚、格鲁吉亚、立陶宛、摩尔多瓦、塞尔维亚和乌克兰）。决议并不禁止墨卡托，也不划定边界。"
    },
    {
      name: "什么是等积投影？",
      text: "等积投影是保持真实相对面积的平面地图。地球上大一倍的陆地在地图上大约占两倍空间。墨卡托不是等积投影。Equal Earth 是。"
    },
    {
      name: "Equal Earth 与墨卡托有何不同？",
      text: "墨卡托保持罗盘方向并拉伸近极地陆地。Equal Earth 是等积投影：国家保持真实相对面积，大陆形状比高尔–彼得斯更熟悉。本图集使用 Equal Earth，并以叠加层显示墨卡托大小作为对照。"
    },
    {
      name: "非洲相对格陵兰有多大？",
      text: "非洲大约比格陵兰大 14 倍。在墨卡托网络地图上它们可能看起来差不多大，因为墨卡托放大近极地陆地。Equal Earth 保持这一 14 比 1 的关系。"
    },
    {
      name: "本图集使用什么数据？",
      text: "互动地图集使用 Natural Earth 1:5000 万矢量。Patterson 政治墙图与 BMZ 自然 Equal Earth 墙图可供下载。"
    }
  ]
};

const RU: AtlasMessages = {
  metaTitle: "Проекция Equal Earth — интерактивный атлас истинного размера",
  metaDescription: "Интерактивный атлас в проекции Equal Earth. Равновеликая карта мира с истинными размерами стран, в отличие от Меркатора. Ищите на карте и скачивайте настенные карты.",
  ogImageAlt: "Политическая карта мира в проекции Equal Earth с центром на Тихом океане",
  selectedTitle: "{name} — Equal Earth Map",
  jsonLdAppDescription: "Интерактивный атлас мира в проекции Equal Earth. Равновеликая карта с истинными относительными размерами стран, в отличие от Меркатора, плюс векторы Natural Earth и настенные карты для скачивания.",
  jsonLdKeywords: "проекция Equal Earth, равновеликая проекция, проекция Меркатора, карта мира истинного размера, интерактивный атлас мира, Африка истинный размер",
  skipToSearch: "Перейти к карте",
  brandHome: "Главная Equal Earth",
  tagline: "Проекция Equal Earth, не Меркатор",
  language: "Язык",
  languageMenu: "Язык",
  mercatorSize: "Как Меркатор растягивает",
  mercatorShort: "Растяжение Меркатора",
  mercatorMenu: "Когда показывать растяжение Меркатора",
  mercatorAria: "Как Меркатор растягивает страны",
  mercatorAriaHidden: "Как Меркатор растягивает страны (контуры скрыты)",
  compareAlways: "Каждая страна",
  compareHover: "Когда навожу",
  compareTap: "Когда нажимаю",
  compareHide: "Скрыть сравнение",
  hintAlways: "Контуры показывают, насколько большими страны выглядят на Меркаторе.",
  hintHover: "Наведите на страну, чтобы увидеть её кажущийся размер на Меркаторе.",
  hintTap: "Нажмите страну, чтобы увидеть её кажущийся размер на Меркаторе.",
  hintOff: "Только Equal Earth. Контуры Меркатора скрыты.",
  search: "Поиск",
  searchCountryOrCity: "Найти страну или город",
  searchPlaceholder: "Гренландия, Африка…",
  searchResults: "Результаты поиска",
  searchEmpty: "Нет мест по запросу «{query}». Попробуйте другое написание или сдвиньте карту.",
  layers: "Слои",
  closeLayers: "Закрыть слои",
  mapLayers: "Слои карты",
  layerCountries: "Страны",
  layerLakes: "Озёра",
  layerRivers: "Реки",
  layerCities: "Города",
  layerLabels: "Подписи",
  layerGraticule: "Сетка широт/долгот",
  layerMore: "Ещё слои",
  moreMapLayers: "Другие слои карты",
  centerMap: "Центрировать карту",
  countriesAlwaysOn: "Страны всегда включены, чтобы на глобусе была суша",
  about: "О проекте",
  atlasView: "Интерактивный атлас Equal Earth",
  loading: "Загрузка данных Natural Earth…",
  loadError: "Не удалось загрузить карту. Попробуйте ещё раз.",
  canvasFail: "Этот браузер не может нарисовать карту. Попробуйте ещё раз.",
  tryAgain: "Повторить",
  clearSelection: "Снять выбор",
  zoomIn: "Приблизить",
  zoomOut: "Отдалить",
  resetView: "Сбросить вид",
  mapCenter: "Центр карты",
  centerAfrica: "Африка",
  centerAmericas: "Америки",
  centerPacific: "Тихий океан",
  centerAfricaTitle: "Центрировать на Африке",
  centerAmericasTitle: "Центрировать на Америках",
  centerPacificTitle: "Центрировать на Тихом океане",
  legendEqualEarth: "Эта карта: Equal Earth",
  legendEqualEarthShort: "Equal Earth",
  legendMercator: "Так выглядит на Меркаторе",
  legendMercatorShort: "Меркатор",
  legendLead: "Заливка стран — истинный размер. Контуры — как на Меркаторе.",
  legendLeadCompact: "Заливка суши — истинный размер. Контуры — Меркатор.",
  legendRestoreStatus: "Только истинный размер.",
  legendRestoreAction: "Показать контуры Меркатора",
  attribFull: "Проекция Equal Earth: Šavrič, Patterson и Jenny · Настенные карты: Tom Patterson / BMZ · Векторы: Natural Earth",
  attribShort: "Equal Earth · Natural Earth",
  close: "Закрыть",
  politicalMap: "Политическая карта",
  physicalMap: "Физическая карта",
  aboutTitle: "Интерактивный атлас в проекции Equal Earth",
  aboutP1: "Это интерактивный атлас. Можно сдвигать, масштабировать и искать. Карта использует проекцию Equal Earth, не Меркатор.",
  aboutP2: "Меркатор — обычный метод веб-карт с 1569 года. Он растягивает сушу у полюсов, чтобы направления компаса оставались прямыми. На таких картах Гренландия кажется сопоставимой с Африкой. Африка примерно в 14 раз больше.",
  aboutP3: "Равновеликая проекция — плоская карта, сохраняющая истинный относительный размер. Никакая плоская карта не показывает Землю без компромисса. Меркатор сохраняет направление компаса и теряет размер. Галл–Петерс сохраняет размер и растягивает очертания материков. Equal Earth сохраняет истинный размер со более знакомыми формами.",
  aboutP4: "В сентябре 2026 года Генеральная Ассамблея ООН приняла Correct the Map. Резолюция — просьба, а не закон. Того и Африканский союз возглавили кампанию. Она просит школы, правительства и технологические компании использовать равновеликие карты, такие как Equal Earth.",
  aboutVote: "Голосование Генеральной Ассамблеи",
  voteInFavor: "За",
  voteAgainst: "Против",
  voteAbstained: "Воздержались",
  voteAgainstWho: "Соединённые Штаты",
  voteAbstainedWho: "Эстония, Грузия, Литва, Молдова, Сербия и Украина",
  aboutP5: "Украина и Сербия заявили, что поддерживают истинный размер материков. Они возразили против того, как некоторые политические карты Equal Earth рисуют спорные земли. Резолюция не устанавливает границ.",
  aboutVoteRecord: "Зарегистрированное голосование 4 сентября 2026 года.",
  aboutVoteLink: "Репортаж UN News о голосовании",
  aboutP6: "Приглушённые контуры показывают кажущийся размер этих стран на Меркаторе. Контуры становятся коралловыми, когда вы указываете на одну. Нажмите страну, чтобы увидеть числа.",
  aboutP7: "Глобус — векторы Natural Earth 1:50 миллионов, нарисованные в Equal Earth. Оригинальные настенные карты доступны для скачивания:",
  aboutCredit: "Политическая карта: Tom Patterson, общественное достояние. Физическая карта: немецкое издание BMZ на основе Equal Earth / Natural Earth. Этот сайт не использует cookie для подсчёта посещений.",
  versionLocal: "Локальная версия",
  versionLabel: "Версия",
  outlineMuted: "Контур — кажущийся размер на Меркаторе: приглушён в покое, коралловый при наведении.",
  outlineScaled: "Контур — эта страна в масштабе того, насколько большой она выглядит на Меркаторе.",
  equatorBarely: "Меркатор почти не меняет размер этой страны.",
  compactOutline: "Контур — насколько большой она выглядит на Меркаторе.",
  equatorNoOutline: "У экватора проекции близко сходятся по размеру, поэтому дополнительного контура нет.",
  equalEarthTrue: "Equal Earth сохраняет истинную относительную площадь.",
  wouldAppear: "Эта земля выглядела бы {note} своего истинного размера.",
  equatorAgree: "У экватора Меркатор и Equal Earth согласны по размеру.",
  trueArea: "Истинная площадь",
  looksMercator: "Так выглядит на Меркаторе",
  difference: "Разница",
  largerMercator: "в {n}× больше на Меркаторе",
  smallerMercator: "в {n}× меньше на Меркаторе",
  largerMercatorLabel: "Больше на Меркаторе",
  smallerMercatorLabel: "Меньше на Меркаторе",
  capital: "Столица",
  city: "Город",
  country: "Страна",
  cityMetaCapital: "столица",
  popMillion: "{n} млн",
  popThousand: "{n} тыс.",
  stageAriaAlways: "Карта Equal Earth с контурами размера Меркатора. Стрелки двигают, Enter выбирает страну в центре, плюс и минус масштабируют, Escape снимает выбор.",
  stageAriaTap: "Карта Equal Earth. Нажмите страну для размера Меркатора. Стрелки двигают, Enter выбирает страну в центре, плюс и минус масштабируют, Escape снимает выбор.",
  stageAriaHover: "Карта Equal Earth. Наведите на страну для размера Меркатора. Стрелки двигают, Enter выбирает страну в центре, плюс и минус масштабируют, Escape снимает выбор.",
  stageAriaPlain: "Карта мира Equal Earth. Стрелки двигают, Enter выбирает страну в центре, плюс и минус масштабируют, Escape снимает выбор.",
  searchKindCountry: "Страна",
  faq: [
    {
      name: "Что такое проекция Equal Earth?",
      text: "Equal Earth — равновеликая псевдоцилиндрическая картографическая проекция. Материки и страны сохраняют истинные относительные размеры, с более знакомыми очертаниями, чем у Галла–Петерса."
    },
    {
      name: "Почему Африка выглядит больше, чем на Google Картах?",
      text: "Google Карты используют проекцию Меркатора, которая увеличивает сушу у полюсов. Африка примерно в 14 раз больше Гренландии. Проекция Equal Earth показывает это истинное соотношение размеров."
    },
    {
      name: "Заменила ли Организация Объединённых Наций карту мира?",
      text: "Нет. В сентябре 2026 года Генеральная Ассамблея ООН приняла Correct the Map — просьбу использовать равновеликие проекции, такие как Equal Earth, при сравнении размера стран. Голосование: 164 за, 1 против (Соединённые Штаты) и 6 воздержавшихся (Эстония, Грузия, Литва, Молдова, Сербия и Украина). Резолюция не запрещает Меркатор и не устанавливает границ."
    },
    {
      name: "Что такое равновеликая проекция?",
      text: "Равновеликая проекция — плоская карта, сохраняющая истинный относительный размер. Земля, вдвое большая на Земле, занимает примерно вдвое больше места на карте. Меркатор не равновеликая. Equal Earth — да."
    },
    {
      name: "Чем Equal Earth отличается от Меркатора?",
      text: "Меркатор сохраняет направление компаса и растягивает сушу у полюсов. Equal Earth равновеликая: страны сохраняют истинный относительный размер, с более знакомыми очертаниями материков, чем у Галла–Петерса. Этот атлас использует Equal Earth и показывает размер Меркатора как слой сравнения."
    },
    {
      name: "Насколько Африка больше Гренландии?",
      text: "Африка примерно в 14 раз больше Гренландии. На веб-карте Меркатора они могут выглядеть похожими, потому что Меркатор увеличивает сушу у полюсов. Equal Earth сохраняет это соотношение 14 к 1."
    },
    {
      name: "Какие данные использует этот атлас?",
      text: "Интерактивный атлас использует векторы Natural Earth 1:50 миллионов. Политическая настенная карта Patterson и физическая карта BMZ в Equal Earth доступны для скачивания."
    }
  ]
};

const ATLAS_MESSAGES: Record<AtlasLocaleId, AtlasMessages> = { en: EN, es: ES, fr: FR, pt: PT, ar: AR, zh: ZH, ru: RU };

let atlasLocale: AtlasLocaleId = "en";
const atlasLocaleListeners: Array<(id: AtlasLocaleId) => void> = [];

function isAtlasLocale(value: string | null | undefined): value is AtlasLocaleId {
  return value === "en" || value === "es" || value === "fr" || value === "pt"
    || value === "ar" || value === "zh" || value === "ru";
}

function atlasLocaleMeta(id: AtlasLocaleId = atlasLocale): AtlasLocaleMeta {
  return ATLAS_LOCALE_META[id];
}

function atlasMessages(id: AtlasLocaleId = atlasLocale): AtlasMessages {
  return ATLAS_MESSAGES[id];
}

function currentAtlasLocale(): AtlasLocaleId {
  return atlasLocale;
}

function fillAtlasText(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) => {
    const value = vars[name];
    return value == null ? `{${name}}` : String(value);
  });
}

function t(key: keyof AtlasMessages, vars?: Record<string, string | number>): string {
  const value = atlasMessages()[key];
  if (typeof value !== "string") return "";
  return fillAtlasText(value, vars);
}

function matchAtlasLocale(tag: string): AtlasLocaleId | null {
  const lower = tag.trim().toLowerCase().replace(/_/g, "-");
  if (!lower) return null;
  if (lower.startsWith("zh")) return "zh";
  const base = lower.split("-")[0];
  return isAtlasLocale(base) ? base : null;
}

function localeFromSearch(search: string): AtlasLocaleId | null {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const raw = params.get("lang");
  return raw && isAtlasLocale(raw) ? raw : null;
}

function storedAtlasLocale(): AtlasLocaleId | null {
  try {
    const raw = localStorage.getItem(ATLAS_LANG_STORAGE);
    return raw && isAtlasLocale(raw) ? raw : null;
  } catch {
    return null;
  }
}

function persistAtlasLocale(id: AtlasLocaleId) {
  try {
    localStorage.setItem(ATLAS_LANG_STORAGE, id);
  } catch {
    // Private mode can block storage; URL still carries the language.
  }
}

function browserAtlasLocale(): AtlasLocaleId | null {
  const tags = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const tag of tags) {
    const match = matchAtlasLocale(tag);
    if (match) return match;
  }
  return null;
}

function resolveAtlasLocale(urlLang: AtlasLocaleId | null): AtlasLocaleId {
  return urlLang || storedAtlasLocale() || browserAtlasLocale() || "en";
}

function formatAtlasNumber(value: number): string {
  const locale = atlasLocaleMeta().bcp47;
  return new Intl.NumberFormat(locale, { numberingSystem: "latn" }).format(value);
}

function setMetaContent(selector: string, content: string, attr = "content") {
  const node = document.head.querySelector(selector);
  if (node) node.setAttribute(attr, content);
}

function applyAtlasSeo() {
  const meta = atlasLocaleMeta();
  const copy = atlasMessages();
  const root = document.documentElement;
  root.lang = meta.bcp47;
  root.dir = meta.dir;
  document.title = copy.metaTitle;
  setMetaContent('meta[name="description"]', copy.metaDescription);
  setMetaContent('meta[property="og:locale"]', meta.ogLocale);
  setMetaContent('meta[property="og:title"]', copy.metaTitle);
  setMetaContent('meta[property="og:description"]', copy.metaDescription);
  setMetaContent('meta[property="og:image:alt"]', copy.ogImageAlt);
  setMetaContent('meta[name="twitter:title"]', copy.metaTitle);
  setMetaContent('meta[name="twitter:description"]', copy.metaDescription);
  setMetaContent('meta[name="twitter:image:alt"]', copy.ogImageAlt);
  document.head.querySelectorAll('meta[property="og:locale:alternate"]').forEach((node) => node.remove());
  for (const id of ATLAS_LOCALE_ORDER) {
    if (id === meta.id) continue;
    const tag = document.createElement("meta");
    tag.setAttribute("property", "og:locale:alternate");
    tag.setAttribute("content", ATLAS_LOCALE_META[id].ogLocale);
    document.head.append(tag);
  }
  const ld = document.querySelector("script[type='application/ld+json']");
  if (!(ld instanceof HTMLScriptElement)) return;
  try {
    const graph = JSON.parse(ld.textContent || "") as {
      "@graph"?: Array<Record<string, unknown>>;
    };
    const nodes = graph["@graph"];
    if (!Array.isArray(nodes)) return;
    for (const node of nodes) {
      if (node["@type"] === "WebApplication") {
        node.description = copy.jsonLdAppDescription;
        node.inLanguage = meta.bcp47;
      }
      if (node["@type"] === "WebPage") {
        node.name = copy.metaTitle;
        node.description = copy.metaDescription;
        node.keywords = copy.jsonLdKeywords;
      }
      if (node["@type"] === "FAQPage" && Array.isArray(node.mainEntity)) {
        node.mainEntity = copy.faq.map((item) => ({
          "@type": "Question",
          name: item.name,
          acceptedAnswer: { "@type": "Answer", text: item.text }
        }));
      }
    }
    ld.textContent = JSON.stringify(graph);
  } catch {
    // Leave committed JSON-LD if parsing fails.
  }
}

function applyAtlasChrome() {
  const copy = atlasMessages();
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (!key || !(key in copy)) return;
    const value = copy[key as keyof AtlasMessages];
    if (typeof value === "string") node.textContent = value;
  });
  document.querySelectorAll<HTMLElement>("[data-i18n-aria]").forEach((node) => {
    const key = node.dataset.i18nAria;
    if (!key || !(key in copy)) return;
    const value = copy[key as keyof AtlasMessages];
    if (typeof value === "string") node.setAttribute("aria-label", value);
  });
  document.querySelectorAll<HTMLElement>("[data-i18n-title]").forEach((node) => {
    const key = node.dataset.i18nTitle;
    if (!key || !(key in copy)) return;
    const value = copy[key as keyof AtlasMessages];
    if (typeof value === "string") node.setAttribute("title", value);
  });
  document.querySelectorAll<HTMLInputElement>("[data-i18n-placeholder]").forEach((node) => {
    const key = node.dataset.i18nPlaceholder;
    if (!key || !(key in copy)) return;
    const value = copy[key as keyof AtlasMessages];
    if (typeof value === "string") node.placeholder = value;
  });
  const langFull = document.getElementById("lang-label-full");
  const langShort = document.getElementById("lang-label-short");
  if (langFull) langFull.textContent = atlasLocaleMeta().nativeName;
  if (langShort) langShort.textContent = atlasLocaleMeta().shortLabel;
  document.querySelectorAll<HTMLElement>("[data-lang]").forEach((node) => {
    const on = node.dataset.lang === atlasLocale;
    node.classList.toggle("is-active", on);
    node.setAttribute("aria-checked", String(on));
  });
}

function applyAtlasLocale(id: AtlasLocaleId, { persist = true } = {}) {
  atlasLocale = id;
  if (persist) persistAtlasLocale(id);
  applyAtlasSeo();
  applyAtlasChrome();
  for (const listener of atlasLocaleListeners) listener(id);
}

function onAtlasLocaleChange(listener: (id: AtlasLocaleId) => void) {
  atlasLocaleListeners.push(listener);
}

applyAtlasLocale(resolveAtlasLocale(localeFromSearch(location.search)), { persist: false });

