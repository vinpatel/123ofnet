#!/usr/bin/env python3
"""Merge verified candidate tools into src/_data/directory.json.

Usage: python3 -I scripts/merge-tools.py verified/<slug>.json [more files...]

Each file is the output of verify-tools.py for one category; the category slug is the
file name. Only status ok / moved / blocked are added ("moved" uses the final URL).
Skips anything already in the directory (same site+path or same tool name, in any
category). Existing entries keep their position; new ones are appended.
"""
import json, os, re, sys
from urllib.parse import urlparse, urlunparse

DIR = os.path.join(os.path.dirname(__file__), "..", "src", "_data", "directory.json")
ACCEPT = {"ok", "moved", "blocked"}


def clean_url(u):
    p = urlparse(u.strip())
    path = p.path if p.path not in ("", "/") else ""
    return urlunparse(("https", p.netloc.lower(), path, "", "", ""))


def key_url(u):
    p = urlparse(u)
    return (p.netloc.lower().removeprefix("www."), p.path.rstrip("/").lower())


def key_name(t):
    return re.sub(r"[^a-z0-9]", "", t.lower().split("(")[0])


def main():
    d = json.load(open(DIR))
    cats = {c["slug"]: c for c in d["categories"]}
    seen_url = {key_url(l["url"]) for c in d["categories"] for l in c["links"]}
    seen_name = {key_name(l["title"]) for c in d["categories"] for l in c["links"]}
    for path in sys.argv[1:]:
        slug = os.path.splitext(os.path.basename(path))[0]
        cat, added, skipped = cats[slug], 0, {}
        for r in json.load(open(path)):
            if r.get("status") not in ACCEPT:
                skipped[r.get("status")] = skipped.get(r.get("status"), 0) + 1
                continue
            url = clean_url(r["final"] if r["status"] == "moved" else r["url"])
            ku, kn = key_url(url), key_name(r["title"])
            if ku in seen_url or kn in seen_name:
                skipped["duplicate"] = skipped.get("duplicate", 0) + 1
                continue
            note = re.sub(r"\s+", " ", r["note"]).strip().rstrip(".")
            cat["links"].append({"title": r["title"].strip(), "url": url, "note": note})
            seen_url.add(ku)
            seen_name.add(kn)
            added += 1
        print(f"{slug:12} +{added:<4} now {len(cat['links']):<4} skipped {skipped}")
    json.dump(d, open(DIR, "w"), indent=2, ensure_ascii=False)
    open(DIR, "a").write("\n")


if __name__ == "__main__":
    main()
