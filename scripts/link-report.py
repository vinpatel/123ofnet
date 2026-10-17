#!/usr/bin/env python3
"""Weekly health check of every tool in data/directory.json.

Runs scripts/verify-tools.py over all tools and writes a Markdown report of the
ones that need a human look (dead, parked, redirected elsewhere, name mismatch,
or moved to a new domain). Nothing is removed automatically: some failures are
temporary, so a person decides.

Usage: python3 -I scripts/link-report.py report.md
"""
import json, os, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
d = json.load(open(os.path.join(HERE, "..", "data", "directory.json")))
items = [dict(l, category=c["name"]) for c in d["categories"] for l in c["links"]]

with tempfile.TemporaryDirectory() as tmp:
    src, out = os.path.join(tmp, "in.json"), os.path.join(tmp, "out.json")
    json.dump(items, open(src, "w"))
    subprocess.run([sys.executable, "-I", os.path.join(HERE, "verify-tools.py"), src, out], check=True)
    res = json.load(open(out))

LABEL = {"dead": "Not loading", "parked": "Parked / for sale", "redirected": "Redirects to another site",
         "mismatch": "Page doesn't mention the tool", "moved": "Moved to a new address (update the URL)"}
groups = {k: [r for r in res if r["status"] == k] for k in LABEL}
lines = [f"Checked {len(res)} tools. {sum(len(v) for v in groups.values())} need a look.", ""]
for k, rows in groups.items():
    if not rows:
        continue
    lines += [f"## {LABEL[k]} ({len(rows)})", "", "| Tool | Category | Listed URL | Went to / code |", "|---|---|---|---|"]
    for r in sorted(rows, key=lambda r: r["title"].lower()):
        where = r.get("final") if k in ("moved", "redirected") else r.get("code", "")
        lines.append(f"| {r['title']} | {r['category']} | {r['url']} | {where} |")
    lines.append("")
lines.append("Fix entries in `data/directory.json`. A tool that fails two weeks in a row is probably gone.")
open(sys.argv[1], "w").write("\n".join(lines))
print(lines[0])
