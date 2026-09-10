import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dest = join(root, "vendor");

mkdirSync(dest, { recursive: true });

const files = [
  ["d3/dist/d3.min.js", "d3.min.js"],
  ["openseadragon/build/openseadragon/openseadragon.min.js", "openseadragon.min.js"],
  ["topojson-client/dist/topojson-client.min.js", "topojson.min.js"],
];

for (const [from, to] of files) {
  copyFileSync(join(root, "node_modules", from), join(dest, to));
}
