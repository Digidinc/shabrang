#!/bin/bash
set -euo pipefail

BOOK_DIR="${1:-/opt/shabrang/repo/Book/dist}"
BUCKET="${2:-shabrang-assets}"
PREFIX="${3:-book}"

if [ ! -d "$BOOK_DIR" ]; then
  echo "Book directory not found: $BOOK_DIR" >&2
  exit 1
fi

if ! command -v wrangler >/dev/null 2>&1; then
  echo "wrangler not found. Install and login first." >&2
  exit 1
fi

echo "Uploading book from $BOOK_DIR to r2://$BUCKET/$PREFIX/"

while IFS= read -r -d '' file; do
  rel="${file#$BOOK_DIR/}"
  key="$PREFIX/$rel"
  content_type=""
  if command -v file >/dev/null 2>&1; then
    content_type="$(file --mime-type -b "$file" || true)"
  fi

  if [ -n "$content_type" ]; then
    wrangler r2 object put "$BUCKET/$key" --file "$file" --content-type "$content_type"
  else
    wrangler r2 object put "$BUCKET/$key" --file "$file"
  fi
done < <(find "$BOOK_DIR" -type f -print0)

echo "Upload complete."
