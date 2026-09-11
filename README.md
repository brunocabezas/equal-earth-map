# Equal Earth Map

Interactive, zoomable Equal Earth world map. Countries and continents keep their true relative sizes, unlike Mercator web maps.

Live site: https://trueearthmap.com/

## What you can do

- **Interactive atlas** — Natural Earth 1:50 million vectors in the Equal Earth projection, with pan/zoom, search, layers, and a Mercator comparison.
- **Wall maps** — original Patterson political map and BMZ physical map, available as downloads.

## Git workflow

Work on a topic branch, not `master`. Name branches `type/short-kebab-description`.

| Prefix | Use |
| --- | --- |
| `feat` | New user-facing behavior |
| `fix` | Bug fix |
| `chore` | Maintenance that is not a feature or fix |
| `deps` | Dependency changes |
| `migrate` | One-off migrations |

Examples: `feat/topbar-filters`, `fix/always-overlay`, `chore/unvendor-cursor-skills`.

Two worktrees exist so two agents can work on the same repo without sharing a directory:

- `code/equal-earth-map`
- `code/equal-earth-map-ts`

Each session stays in the workspace it was opened in, on its own branch. Git will not check out the same branch in both worktrees.

Cursor agents pick this up from `.cursor/rules/git-workflow.mdc` in every session.

## Run locally

```bash
bun install
bun run serve
```

That installs D3 and TopoJSON from npm, copies their minified files into `vendor/` (gitignored), compiles TypeScript from `src/` into `dist/`, then serves the site. Open http://127.0.0.1:8777/

`bun run check` type-checks without emitting files. npm works the same way if you prefer it.

## Version in About

GitHub Pages writes the deployed commit into `version.js` when it publishes the site. About shows that hash, so it matches the commit GitHub actually shipped.

Locally it shows `local`. There is no git hook.

## Data

- Equal Earth projection by Bojan Šavrič, Tom Patterson, and Bernhard Jenny
- Political wall map by Tom Patterson (public domain)
- Physical wall map: BMZ German edition
- Vectors: [Natural Earth](https://www.naturalearthdata.com/)

## Analytics

Visit counts use [GoatCounter](https://www.goatcounter.com/) (no cookies). Create a site named `equal-earth-map`, then open https://equal-earth-map.goatcounter.com/ to see visitors.

Optional PostHog: set `posthogKey` in `src/site-config.ts`.
