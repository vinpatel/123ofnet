#!/usr/bin/env bash
# Tell IndexNow search engines (Bing, Yandex, Seznam, Naver; Bing feeds ChatGPT search
# and Copilot) that every URL in the live sitemap changed. Runs after each deploy.
set -euo pipefail
SITE="${SITE:-https://123ofnet.com}"
KEY=$(python3 -c "import json;print(json.load(open('src/_data/site.json'))['indexNowKey'])")
URLS=$(curl -sf "$SITE/sitemap.xml" | grep -o '<loc>[^<]*' | sed 's/<loc>//' | python3 -c "import sys,json;print(json.dumps([l.strip() for l in sys.stdin if l.strip()]))")
curl -s -o /dev/null -w "IndexNow: HTTP %{http_code}\n" -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "{\"host\":\"${SITE#https://}\",\"key\":\"$KEY\",\"keyLocation\":\"$SITE/$KEY.txt\",\"urlList\":$URLS}"
