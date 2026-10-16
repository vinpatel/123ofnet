#!/usr/bin/env python3
"""Check candidate AI tool URLs before they go into the directory.

Usage: python3 -I scripts/verify-tools.py candidates.json out.json

For each {"title","url","note"} it fetches the page and records:
  status   ok | moved | blocked | dead | parked | redirected | mismatch
           moved   = redirected to the tool's own new domain (use "final" as the new URL)
           blocked = bot protection; the site is up but can't be inspected
  final    final URL after redirects
  site_title / site_desc   what the site says about itself (for human review)
Only "ok", "moved" and "blocked" entries are safe to add; "mismatch" needs a human look.
"""
import json, re, sys, html, subprocess, tempfile, os, concurrent.futures as cf
from urllib.parse import urlparse

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36"
PARKED = re.compile(r"domain (is )?for sale|buy this domain|this domain (name )?(is|may be) (for sale|available)|parked (free|domain)|"
                    r"sedoparking|hugedomains|dan\.com|afternic|godaddy\.com/domainsearch|domain has expired|"
                    r"account (has been )?suspended|coming soon - this domain", re.I)


def root(host):
    parts = (host or "").lower().split(".")
    return ".".join(parts[-2:]) if len(parts) >= 2 else host


def norm(s):
    return re.sub(r"[^a-z0-9]", "", s.lower())


def check(item):
    url = item["url"]
    out = dict(item)
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        path = tmp.name
    try:
        r = subprocess.run(["curl", "-sL", "--compressed", "-m", "25", "--max-filesize", "3000000", "-A", UA,
                            "-H", "Accept-Language: en", "-o", path, "-w", "%{http_code} %{url_effective}", url],
                           capture_output=True, text=True, timeout=40)
        code, _, final = r.stdout.strip().partition(" ")
        body = open(path, "rb").read(400_000).decode("utf-8", "ignore")
    except subprocess.TimeoutExpired:
        code, final, body = "000", url, ""
    finally:
        os.unlink(path)
    if code in ("401", "403", "429", "503", "202"):
        out.update(status="blocked", code=code, final=final or url)
        return out
    if code != "200":
        out.update(status="dead", code=code, final=final or url)
        return out

    title = html.unescape(re.sub(r"\s+", " ", (re.search(r"<title[^>]*>(.*?)</title>", body, re.S | re.I) or [None, ""])[1])).strip()
    desc = re.search(r'<meta[^>]+(?:name|property)=["\'](?:og:)?description["\'][^>]+content=["\']([^"\']*)', body, re.I)
    desc = html.unescape(desc.group(1)).strip() if desc else ""
    out.update(final=final, site_title=title[:160], site_desc=desc[:220], code=code)

    if PARKED.search(title + " " + desc + " " + body[:20000]):
        out["status"] = "parked"
    elif root(urlparse(final).hostname) != root(urlparse(url).hostname):
        brand = norm(item["title"].split()[0]) if item["title"].split() else ""
        moved = len(brand) >= 3 and brand[:6] in norm(urlparse(final).hostname or "")
        out["status"] = "moved" if moved else "redirected"
    else:
        name = norm(item["title"].split("(")[0])
        first = norm(item["title"].split()[0]) if item["title"].split() else name
        hay = norm(title + " " + desc + " " + final + " " + body[:60000])
        out["status"] = "ok" if (name[:12] in hay or (len(first) >= 4 and first in hay)) else "mismatch"
    return out


def main():
    items = json.load(open(sys.argv[1]))
    with cf.ThreadPoolExecutor(24) as ex:
        res = list(ex.map(check, items))
    json.dump(res, open(sys.argv[2], "w"), indent=1, ensure_ascii=False)
    counts = {}
    for r in res:
        counts[r["status"]] = counts.get(r["status"], 0) + 1
    print(json.dumps(counts))


if __name__ == "__main__":
    main()
