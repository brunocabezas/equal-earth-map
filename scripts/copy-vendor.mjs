import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dest = join(root, "vendor");
const out = join(dest, "d3.min.js");

mkdirSync(dest, { recursive: true });

const bundled = spawnSync(
  "bun",
  [
    "build",
    "scripts/d3-slim.js",
    "--outfile",
    "vendor/d3.min.js",
    "--minify",
    "--format=iife",
    "--global-name=d3"
  ],
  { cwd: root, encoding: "utf8" }
);

if (bundled.status === 0) {
  let source = readFileSync(out, "utf8").trim();
  if (!source.startsWith("var d3=") && !source.startsWith("var d3 =")) {
    source = `var d3=${source}`;
  }
  if (!/return fc\}\)\(\);\s*$/.test(source)) {
    source = source.replace(/\}\)\(\);\s*$/, ";return fc})();");
  }
  writeFileSync(out, `${source}\n`);
} else {
  process.stderr.write(bundled.stderr || "bun build failed\n");
  copyFileSync(join(root, "node_modules/d3/dist/d3.min.js"), out);
}

copyFileSync(
  join(root, "node_modules/topojson-client/dist/topojson-client.min.js"),
  join(dest, "topojson.min.js")
);
