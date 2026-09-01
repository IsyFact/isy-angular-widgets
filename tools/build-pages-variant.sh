#!/usr/bin/env bash
#
# Builds the demo application and the Compodoc documentation of a single
# version line into a target directory.
#
#   tools/build-pages-variant.sh <source-dir> <target-dir> <base-href>
#
# The source directory is a checkout of the version line to build. All npm and
# Angular commands resolve relative to it, so concurrent version lines never
# share build output.
#
set -euo pipefail

if [[ "$#" -ne 3 ]]; then
  echo "Usage: $0 <source-dir> <target-dir> <base-href>" >&2
  exit 1
fi

SOURCE_DIR="$1"
TARGET_DIR="$2"
# Collapses duplicate slashes so that a site published at the domain root
# ("/") does not produce a "//" base href.
BASE_HREF="$(printf '%s/' "$3" | sed 's|//*|/|g')"

mkdir -p "$TARGET_DIR"
TARGET_ABS="$(cd "$TARGET_DIR" && pwd)"

echo "Building '$SOURCE_DIR' into '$TARGET_ABS' with base href '$BASE_HREF'"

cd "$SOURCE_DIR"

# The demo consumes the widgets library as a packed tarball, so the library has
# to be built before the full dependency tree can be installed.
cp package.json package.json.orig
node -e "const fs=require('fs'),p=JSON.parse(fs.readFileSync('package.json'));if(p.dependencies)delete p.dependencies['@isyfact/isy-angular-widgets'];fs.writeFileSync('package.json',JSON.stringify(p,null,2));"
npm ci --ignore-scripts
mv package.json.orig package.json
npm run build:widgets_lib
npm run pack:widgets_lib
npm ci

npm run compodoc:build

# Called through npx instead of the npm script so that the base href is always
# the one passed in, independent of what the checked out branch hardcodes.
npx ng build isy-angular-widgets-demo --configuration production --base-href "$BASE_HREF"

# Angular 21 emits to dist/<app>, Angular 22 to dist/<app>/browser.
DIST_DIR="dist/isy-angular-widgets-demo"
if [[ -d "$DIST_DIR/browser" ]]; then
  DIST_DIR="$DIST_DIR/browser"
fi

cp -R "$DIST_DIR/." "$TARGET_ABS/"

rm -rf "$TARGET_ABS/documentation"
mkdir -p "$TARGET_ABS/documentation"
cp -R docs/. "$TARGET_ABS/documentation/"

echo "Done: $(find "$TARGET_ABS" -mindepth 1 -maxdepth 1 | wc -l | tr -d ' ') entries in $TARGET_ABS"
