#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_DIR="$ROOT_DIR/apps/site"
BLOG_DIST="$SITE_DIR/dist"
OUTPUT_DIR="$ROOT_DIR/dist"

copy_dir() {
  local src="$1"
  local dest="$2"
  if [ -d "$src" ]; then
    mkdir -p "$dest"
    cp -a "$src/." "$dest/"
    return 0
  fi
  return 1
}

echo "Building blog..."
cd "$SITE_DIR"
npm install --silent
npm run build

rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

echo "Copying landing..."
if ! copy_dir "$ROOT_DIR/static/landing" "$OUTPUT_DIR"; then
  echo "Warning: no landing assets at $ROOT_DIR/static/landing"
fi

echo "Copying blog to /content..."
copy_dir "$BLOG_DIST" "$OUTPUT_DIR/content"

echo "Copying book to /book..."
if ! copy_dir "$ROOT_DIR/static/book" "$OUTPUT_DIR/book"; then
  echo "Warning: no book assets at $ROOT_DIR/static/book (serve via R2 instead)"
fi

echo "Build complete: $OUTPUT_DIR"
