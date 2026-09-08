#!/usr/bin/env bash
set -euo pipefail

ROOT=$(git rev-parse --show-toplevel)
SHA=$(git rev-parse HEAD)
SHORT=$(git rev-parse --short=7 HEAD)
DATE=$(git -c log.showSignature=false show -s --format=%cI HEAD)

cat > "$ROOT/version.js" <<EOF
window.EQUAL_EARTH_VERSION = {
  commit: "${SHA}",
  short: "${SHORT}",
  builtAt: "${DATE}"
};
EOF
