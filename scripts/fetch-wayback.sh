#!/usr/bin/env bash
# Download every archived capture of a domain from the Wayback Machine.
# Usage: ./scripts/fetch-wayback.sh 123ofnet.com [from_year] [to_year]
# Output: archive/raw/<timestamp>/<path>  (raw, unmodified "id_" captures)
set -euo pipefail

DOMAIN="${1:?usage: $0 domain [from] [to]}"
FROM="${2:-1996}"
TO="${3:-2010}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/archive/raw"
mkdir -p "$OUT"

echo "Listing captures for $DOMAIN ($FROM-$TO)..."
LIST=$(curl -sf --retry 5 --retry-delay 10 \
  "https://web.archive.org/cdx/search/cdx?url=${DOMAIN}&matchType=domain&from=${FROM}&to=${TO}&filter=statuscode:200&collapse=digest&fl=timestamp,original") \
  || { echo "Wayback Machine unreachable (it may be offline). Try again later."; exit 1; }

if [ -z "$LIST" ]; then
  echo "No captures found for $DOMAIN. Try www.$DOMAIN or the old hosting URL."
  exit 0
fi

echo "$LIST" > "$OUT/index-$DOMAIN.txt"
echo "$(echo "$LIST" | wc -l | tr -d ' ') captures. Downloading..."

while read -r ts url; do
  path="${url#*://}"; path="${path#*/}"
  [ -z "$path" ] || [ "$path" = "${url#*://}" ] && path="index.html"
  case "$path" in */) path="${path}index.html";; esac
  dest="$OUT/$ts/${path%%\?*}"
  [ -f "$dest" ] && continue
  mkdir -p "$(dirname "$dest")"
  # "id_" returns the original bytes without the Wayback toolbar/rewrites
  curl -sf --retry 3 -o "$dest" "https://web.archive.org/web/${ts}id_/${url}" \
    && echo "ok   $ts $url" || echo "FAIL $ts $url"
  sleep 1  # be polite to archive.org
done <<< "$LIST"

echo "Done → $OUT"
