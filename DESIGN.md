---
name: Equal Earth Map
description: Teal-case chrome and ice legend cards over a light-blue ocean.
colors:
  accent: "#c26148"
  accent-bright: "#e29578"
  accent-text: "#a84c38"
  ink: "#054a52"
  ink-soft: "#4d7378"
  night: "#006d77"
  night-deep: "#032f34"
  cream: "#edf6f9"
  cream-soft: "#d4e8ea"
  paper: "#edf6f9"
  panel: "#f4fafb"
  field: "#ffffff"
  field-hover: "#ffddd2"
  ocean: "#b9d2df"
  ocean-deep: "#6a9bb0"
  stage: "#b9d2df"
  line: "rgba(5, 74, 82, 0.14)"
typography:
  display:
    fontFamily: "Source Serif 4, Iowan Old Style, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Source Serif 4, Iowan Old Style, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Source Serif 4, Iowan Old Style, Georgia, serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Source Sans 3, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 450
    lineHeight: 1.45
    letterSpacing: "normal"
  label:
    fontFamily: "Source Sans 3, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 550
    lineHeight: 1.3
    letterSpacing: "normal"
  meta:
    fontFamily: "Source Sans 3, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 450
    lineHeight: 1.35
    letterSpacing: "0.01em"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.92em"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "normal"
rounded:
  md: "8px"
  lg: "12px"
  dialog: "16px"
  pill: "999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "24px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "{colors.night-deep}"
    textColor: "{colors.cream}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.cream}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 14px"
    height: "36px"
  button-seg:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 8px"
    height: "36px"
  button-seg-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    height: "36px"
  mode-btn-active:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 14px"
    height: "36px"
  input-search:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 10px 0 12px"
    height: "36px"
  panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "12px 14px"
  zoom-btn:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    size: "42px"
    width: "42px"
    height: "42px"
---

# Design System: Equal Earth Map

## Overview

**Creative North Star: "The Night Chart Table"**

The atlas sits in a dark teal instrument case. Night bars frame the globe; ice legend cards float on the map like paper laid on a chart table. The map is the artifact. Chrome recedes.

Density is Operate-mode: compact, scannable, one task at a time. Personality lives in the serif name, the coral mark, and the peach-and-sage countries — not in decoration on every control.

**Key Characteristics:**
- Skobeloff chrome, ice legends, light-blue ocean
- Source Serif 4 for the product name and place titles only
- Source Sans 3 for all UI
- Coral used as a rare mark (focus, capitals, checks, caret)
- Offset shadow under floating chrome, never a halo
- Pills for choices, 8–12px rounds for fields and cards

## Colors

Night and ice do the structure. Coral is the only warm UI accent. Ocean and peach belong to the globe, not to buttons. Chrome and ice come from [Coolors 006d77 · 83c5be · edf6f9 · ffddd2 · e29578](https://coolors.co/006d77-83c5be-edf6f9-ffddd2-e29578). The globe water stays the previous light blue (`#b9d2df`), not the Coolors tiffany. Coral is darkened to `#c26148` so focus rings meet 3:1 on ice.

### Primary
- **Chart coral** (`colors.accent`): Focus rings, search caret, checkbox accent, text selection wash. Bright coral (`colors.accent-bright`) for capital dots on the globe. Text coral (`colors.accent-text`) for links on ice so they meet 4.5:1. Not a fill for large surfaces.

### Secondary
- **Globe ocean** (`colors.ocean`): Equal Earth water fill, the previous light blue. Stage (`colors.stage`) matches it so the empty canvas is the same water.

### Neutral
- **Skobeloff** (`colors.night`) and **well teal** (`colors.night-deep`): Top bar and footer.
- **Ice** (`colors.cream`) and **ice-soft** (`colors.cream-soft`): Type and active pills on night.
- **Ink** (`colors.ink`) and **teal mute** (`colors.ink-soft`): Type on paper. Mute is teal, not gray.
- **Legend panel** (`colors.panel`), **paper** (`colors.paper`), **field** (`colors.field`): Cards and inputs. Field hover uses unbleached silk (`colors.field-hover`).
- **Hairline** (`colors.line`): Borders on paper.

**The One Warm Mark Rule.** Coral appears as a mark, never as a page background or a row of filled buttons.

**The No-Cool-Gray Rule.** Secondary text on night is ice-tinted. Secondary text on paper is ink-tinted teal. Do not use neutral gray.

## Typography

**Display Font:** Source Serif 4 (Iowan Old Style, Georgia)
**Body Font:** Source Sans 3 (Segoe UI, sans-serif)

**Character:** The serif is the atlas title plate. The sans is the instrument lettering — humanist, slightly condensed, never Inter.

### Hierarchy
- **Display** (600, 1.25rem, 1.15): Product name in the night bar.
- **Headline** (600, 1.5rem, 1.2): About and 404 titles.
- **Title** (600, 1.375rem, 1.2): Selected place name on a legend card. 1.25rem on narrow viewports.
- **Body** (450, 1rem, 1.45): About prose, max ~62ch.
- **Label** (550, 0.875rem): Buttons, legends, checks.
- **Meta** (450–650, 0.75rem): Footer, fieldset legends, search result kinds.

**The Serif-for-Places Rule.** Source Serif 4 is for the product name and geographic titles. Controls, legends, and data stay sans.

## Layout

Full-viewport app shell: night top bar (min-height 64px, 48px on small screens) with a thin-line globe mark beside the serif name, flex-grown map, night footer. Search, Mercator size, and Layers sit in one chrome row at the top-left. Map options (center, hover/always overlay, layers) live in a sheet at every size — a floating ice card on desktop, a bottom sheet on viewports ≤720px. The place card scrolls inside the remaining map height so size numbers stay above the footer. Zoom stack top-right on desktop, bottom-right on viewports ≤720px. Spacing scale is 4 / 8 / 12 / 16 / 24.

## Elevation & Depth

Floating chrome uses one offset shadow. Surfaces themselves are opaque paper, not glass.

### Shadow Vocabulary
- **Legend lift** (`0 8px 22px rgba(3, 47, 52, 0.18)`): Panels, zoom stack, status.

**The Offset-Not-Halo Rule.** Shadows have y-offset and blur. Do not use a zero-offset colored glow.

## Shapes

Pills (`999px`) for mode, about, and segmented choices. Fields `8px`. Legend cards and zoom cluster `12px`. About dialog `16px`. Hairline borders in `colors.line`. Icons are 16px stroke-1.6 SVG, not emoji or unmatched Unicode. The brand mark is a thin-line globe (circle, equator, one meridian), 36×36 in the night bar (28×28 on compact), cream stroke, no fill.

## Components

### Buttons
- **Shape:** Full pill, min-height 36px, label type.
- **Primary (dialog Close):** Ink fill, ice type, hover well teal.
- **Ghost (About, on night):** Transparent, cream type, 1px cream border at 22% then 40% on hover.
- **Mode pill:** Transparent until active, then cream fill and ink type.
- **Segmented:** Field fill; active is ink fill and cream type; hover field-hover.
- **Hover / Focus:** 160ms ease color/background. Focus-visible is a 2px coral ring, 2px offset.

### Cards / Containers
- **Corner Style:** 12px legend cards; 16px dialog.
- **Background:** Panel cream, opaque.
- **Shadow Strategy:** Legend lift.
- **Border:** 1px hairline.
- **Internal Padding:** 12px 14px (search well 6px).

### Inputs / Fields
- **Style:** Field cream well, 8px radius, 16px text, no inner border.
- **Focus:** 2px coral ring on the well (`box-shadow: 0 0 0 2px`).
- **Placeholder:** Teal mute at full opacity.

### Navigation
Night bar, cream brand serif, pill mode switch at the end, About as ghost. On ≤720px the tagline hides and mode labels shorten to Atlas / Wall.

### Zoom stack
42×42 (40×40 on small screens) paper buttons in a 12px cluster with hairline dividers.

### Checks
16px native checkbox, coral accent, 32px row.

## Do's and Don'ts

### Do:
- **Do** keep Equal Earth as the visual home of the globe; Mercator is a comparison state, not a restyle of the chrome.
- **Do** put place names in Source Serif 4 and everything else in Source Sans 3.
- **Do** tint muted text from ice or ink, never from gray.
- **Do** use coral for focus, caret, capitals, and checks only.

### Don't:
- **Don't** introduce Inter, system-display faces, or a second sans.
- **Don't** nest cards in cards or wrap the map in a card.
- **Don't** add uppercase micro-kickers above headings.
- **Don't** fill large chrome with coral or ocean.
- **Don't** treat country peaches (`#ffddd2` and kin) as UI theme colors; they are globe fills only.
