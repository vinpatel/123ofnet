#!/usr/bin/env bash
# Make 400px-wide JPEG thumbnails of archive/screenshots/ for the /1999/ page (macOS sips).
# The originals in archive/screenshots/ are never modified.
set -euo pipefail
cd "$(dirname "$0")/.."
for f in archive/screenshots/*/*.png; do
  rel=${f#archive/screenshots/}; out=src/assets/1999/${rel%.png}.jpg
  [ -f "$out" ] && continue
  mkdir -p "$(dirname "$out")"
  sips -s format jpeg -s formatOptions 60 --resampleWidth 400 "$f" --out "$out" >/dev/null
done
