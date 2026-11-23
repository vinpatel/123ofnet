// Builds an "awesome list" style GitHub repo from the directory, so people browsing
// GitHub find the list and click through to 123ofnet.com for details and alternatives.
//
//   node scripts/build-awesome.mjs <output-dir>
//
// Writes README.md (quick picks + top tools per category), categories/<slug>.md (every
// tool), CONTRIBUTING.md and LICENSE into <output-dir>. Only tools whose website check
// passed are included. Safe to re-run: it overwrites those files and nothing else.
import fs from "node:fs";
import path from "node:path";
import { loadCatalog } from "../lib/catalog.js";

const out = process.argv[2];
if (!out) { console.error("usage: node scripts/build-awesome.mjs <output-dir>"); process.exit(1); }

const site = JSON.parse(fs.readFileSync("src/_data/site.json", "utf8"));
const guides = JSON.parse(fs.readFileSync("src/_data/guides.json", "utf8"));
const { directory, tools, subcats } = loadCatalog();
const URL = site.url;
const PER_CAT = 15; // tools shown per category in the README (after quick picks)

const ok = (t) => t.check.kind !== "flagged";
const md = (s) => String(s).replace(/([\[\]|*_`<>])/g, "\\$1");
// GitHub heading anchors: lowercase, drop punctuation, each space becomes "-" (so "A & B" -> "a--b").
const anchor = (s) => s.toLowerCase().replace(/[^a-z0-9 -]/g, "").trim().replace(/ /g, "-");
const line = (t, lead = "") =>
  `- ${lead}[${md(t.title)}](${t.url}) - ${md(t.note)}. [Details & alternatives](${URL}/tool/${t.slug}/)`;

// How often a tool is suggested as an alternative elsewhere: a rough "well-known" signal.
const seen = new Map();
for (const t of tools) for (const a of t.alternatives) seen.set(a.slug, (seen.get(a.slug) || 0) + 1);
const rank = (a, b) => (b.content ? 1 : 0) - (a.content ? 1 : 0) || (seen.get(b.slug) || 0) - (seen.get(a.slug) || 0) || a.title.localeCompare(b.title);

const cats = directory.categories.map((cat) => {
  const list = tools.filter((t) => t.cat.slug === cat.slug && ok(t));
  const picks = ((guides[cat.slug] || {}).picks || []).map((p) => ({ need: p.need, t: list.find((t) => t.title === p.tool) })).filter((p) => p.t);
  const pickSet = new Set(picks.map((p) => p.t.slug));
  return { cat, list, picks, more: list.filter((t) => !pickSet.has(t.slug)).sort(rank) };
});
const total = cats.reduce((n, c) => n + c.list.length, 0);

const footer = `---

Maintained by [123ofnet.com](${URL}), an independent directory of AI tools for normal people and small businesses, online since ${site.established}.
Every tool's website is checked before it's listed and re-checked weekly ([how we check](${URL}/how-we-check/)).
Tool descriptions are short summaries; prices and features change, so check each tool's website.
Listing a tool doesn't mean we're connected to it or endorse it. Own a listed tool and want it removed? [Opt out here](${URL}/opt-out/).
`;

// README
const N = total.toLocaleString("en-US");
const REPO = "vinpatel/awesome-ai-tools";
const removed = fs.existsSync("data/removed.json") ? JSON.parse(fs.readFileSync("data/removed.json", "utf8")).tools : [];
const badge = (label, msg, color) => `https://img.shields.io/badge/${encodeURIComponent(label).replace(/-/g, "--")}-${encodeURIComponent(msg).replace(/-/g, "--")}-${color}?style=flat-square`;
const fav = cats.find((c) => c.cat.slug === "assistants") || cats[0];

let r = `<div align="center">

<a href="${URL}"><img src="assets/banner.svg" alt="Awesome AI Tools by 123ofnet.com: ${N} AI tools, checked every week" width="100%"></a>

# Awesome AI Tools

**${N} AI tools for normal people and small businesses, sorted by what you want to get done.<br>Every website re-checked every week. Dead tools get removed, not left to rot.**

[![Tools](${badge("tools", N, "008080")})](data/tools.json)
[![Checked](${badge("links", "checked weekly", "2ea44f")})](CHANGELOG.md)
[![Updated](${badge("updated", site.dataUpdated, "000080")})](CHANGELOG.md)
[![License: CC BY 4.0](${badge("license", "CC BY 4.0", "lightgrey")})](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/${REPO}?style=flat-square&color=yellow)](https://github.com/${REPO}/stargazers)

**[🔎 Search all ${N} on 123ofnet.com](${URL}/directory/)** · **[📦 Get the data (JSON/CSV)](#-use-the-data)** · **[🪦 AI Tool Graveyard](#-the-ai-tool-graveyard)** · **[➕ Suggest a tool](${URL}/submit/)**

<sub>⭐ <b>Star this repo</b> to keep it handy. New tools are added and dead ones removed every Monday.</sub>

</div>

---

## Why this list is different

Most "awesome AI" lists are huge, unsorted and full of dead links. This one is built to stay useful:

- ✅ **Checked every week.** A checker loads every tool's website weekly, and a person reviews anything it flags. Shut-down tools go to the [graveyard](#-the-ai-tool-graveyard).
- 🎯 **Sorted by the job, not the tech.** "Write my resume", "remove a background", "take meeting notes". Start from what you need.
- 🙋 **Quick picks chosen by a person** at the top of every category, for when you just want a good answer.
- 📦 **Free, open data.** The whole list is in [JSON](data/tools.json) and [CSV](data/tools.csv), CC BY 4.0. Build on it.
- 🤝 **Independent.** We aren't connected to the tools listed, and paying never skips the check.${tools.some((t) => t.aff) ? "" : " No affiliate links."}
- 📟 **Running since ${site.established}.** [123ofnet.com](${URL}) started as a student web portal in ${site.established} ("An easy solution to the Net !!!") and came back for AI.

## 🎯 I want to...

| | |
|---|---|
${cats.map((c) => {
  const subs = subcats.filter((s) => s.cat.slug === c.cat.slug);
  const links = subs.map((s) => `[${md(s.label)}](${URL}/directory/${c.cat.slug}/${s.slug}/)`).join(" · ");
  return `| **[${c.cat.name}](#${anchor(c.cat.name)})** | ${links || `[Browse all ${c.list.length}](${URL}/directory/${c.cat.slug}/)`} |`;
}).join("\n")}

<sub>Each link opens a short buyer's guide plus every matching tool on 123ofnet.com.</sub>

## Contents

${cats.map((c) => `- [${c.cat.name}](#${anchor(c.cat.name)}) (${c.list.length})`).join("\n")}
- [📦 Use the data](#-use-the-data)
- [🪦 The AI Tool Graveyard](#-the-ai-tool-graveyard)
- [For tool makers](#for-tool-makers)

`;
for (const c of cats) {
  r += `## ${c.cat.name}\n\n`;
  const intro = (guides[c.cat.slug] || {}).intro || c.cat.blurb;
  if (intro) r += `${intro}\n\n`;
  if (c.picks.length) {
    r += `**Quick picks**\n\n${c.picks.map((p) => line(p.t, `**${md(p.need)}:** `)).join("\n")}\n\n`;
    r += `**More ${c.cat.name.toLowerCase()} tools**\n\n`;
  }
  r += `${c.more.slice(0, PER_CAT).map((t) => line(t)).join("\n")}\n\n`;
  r += `[All ${c.list.length} ${c.cat.name} tools](categories/${c.cat.slug}.md) · [How to choose ${c.cat.name.toLowerCase()} tools on 123ofnet.com](${URL}/directory/${c.cat.slug}/)\n\n`;
}
r += `## 📦 Use the data

The whole list is free to use under [CC BY 4.0](LICENSE): just credit and link [123ofnet.com](${URL}).
It's rebuilt every Monday.

\`\`\`bash
# Every tool as JSON
curl -sL https://raw.githubusercontent.com/${REPO}/main/data/tools.json | jq '.tools[] | select(.category == "${fav.cat.name}") | .name'
\`\`\`

\`\`\`python
import pandas as pd
tools = pd.read_csv("https://raw.githubusercontent.com/${REPO}/main/data/tools.csv")
print(tools.groupby("category").size())
\`\`\`

Fields: \`name\`, \`url\`, \`category\`, \`description\`, \`page\` (details and alternatives on 123ofnet.com), \`lastChecked\`.

## 🪦 The AI Tool Graveyard

AI tools come and go fast. These were in the list and have shut down or stopped working. RIP.

| Tool | Category | Removed | What happened |
|---|---|---|---|
${removed.map((t) => `| ${md(t.name)} | ${md(t.category)} | ${t.removed} | ${md(t.reason)} |`).join("\n")}

<sub>Know a tool here that's still alive, or one in the list that's dead? [Open an issue](https://github.com/${REPO}/issues/new/choose).</sub>

## For tool makers

**Listed here?** Add the retro badge to your site or README:

[![Listed on 123ofnet.com](${URL}/assets/badge-88x31.svg)](${URL})

\`\`\`html
<a href="${URL}"><img src="${URL}/assets/badge-88x31.svg" width="88" height="31" alt="Listed on 123ofnet.com"></a>
\`\`\`

**Not listed yet?** [Submit your tool](${URL}/submit/). It's free, and every tool is checked before it goes live.
**Want your tool removed?** [Opt out](${URL}/opt-out/). It's free and you don't need to give a reason.

## Contributing

Suggest a tool at [123ofnet.com/submit](${URL}/submit/) or [open an issue](https://github.com/${REPO}/issues/new/choose). See [CONTRIBUTING.md](CONTRIBUTING.md).

<div align="center">

### ⭐ If this list saved you some searching, star it so others can find it too.

<a href="https://star-history.com/#${REPO}&Date"><img src="https://api.star-history.com/svg?repos=${REPO}&type=Date" alt="Star history" width="600"></a>

</div>

${footer}`;

fs.mkdirSync(path.join(out, "categories"), { recursive: true });
fs.mkdirSync(path.join(out, "data"), { recursive: true });

// Machine-readable copies of the list, for apps, spreadsheets and AI agents.
const rows = cats.flatMap((c) => [...c.list].sort((a, b) => a.title.localeCompare(b.title)).map((t) => ({
  name: t.title, url: t.url, category: c.cat.name, description: t.note,
  page: `${URL}/tool/${t.slug}/`, lastChecked: t.check.date || "",
})));
const jsonPath = path.join(out, "data", "tools.json");
const before = fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath, "utf8")).tools : null;
fs.writeFileSync(jsonPath, JSON.stringify({ source: URL, license: "CC BY 4.0 (credit and link to 123ofnet.com)", updated: site.dataUpdated, count: rows.length, tools: rows }, null, 1) + "\n");
const csv = (v) => /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
const cols = ["name", "url", "category", "description", "page", "lastChecked"];
fs.writeFileSync(path.join(out, "data", "tools.csv"), [cols.join(","), ...rows.map((r) => cols.map((k) => csv(String(r[k]))).join(","))].join("\n") + "\n");

// Changelog: what was added or removed since the last build in this folder.
const logPath = path.join(out, "CHANGELOG.md");
const log = fs.existsSync(logPath) ? fs.readFileSync(logPath, "utf8").replace(/^# Changelog\n+/, "") : "";
let entry = "";
if (!before) entry = `## ${site.dataUpdated}\n\nFirst version of the list: ${rows.length} tools in ${cats.length} categories.\n\n`;
else {
  const was = new Map(before.map((t) => [t.url, t])), now = new Map(rows.map((t) => [t.url, t]));
  const added = rows.filter((t) => !was.has(t.url)), removed = before.filter((t) => !now.has(t.url));
  if (added.length || removed.length) {
    entry = `## ${new Date().toISOString().slice(0, 10)}\n\n**+${added.length} added, -${removed.length} removed** (now ${rows.length} tools)\n\n`;
    if (added.length) entry += `Added:\n${added.map((t) => `- [${md(t.name)}](${t.page}) (${t.category})`).join("\n")}\n\n`;
    if (removed.length) entry += `Removed (shut down, broken or at the owner's request):\n${removed.map((t) => `- ${md(t.name)} (${t.category})`).join("\n")}\n\n`;
  }
}
if (entry || !log) fs.writeFileSync(logPath, `# Changelog\n\n${entry}${log}`);
fs.writeFileSync(path.join(out, "README.md"), r);

// One full file per category, alphabetical.
for (const c of cats) {
  const all = [...c.list].sort((a, b) => a.title.localeCompare(b.title));
  fs.writeFileSync(path.join(out, "categories", `${c.cat.slug}.md`),
    `# ${c.cat.name} AI tools (${all.length})\n\n[Back to the list](../README.md) · [Compare ${c.cat.name.toLowerCase()} tools on 123ofnet.com](${URL}/directory/${c.cat.slug}/)\n\n${all.map((t) => line(t)).join("\n")}\n\n${footer}`);
}

fs.writeFileSync(path.join(out, "CONTRIBUTING.md"), `# Contributing

This list is generated from the directory at [123ofnet.com](${URL}), so edits to the Markdown files here get overwritten.

- **Suggest a tool:** submit it at [123ofnet.com/submit](${URL}/submit/) or open an issue with the name, website and one line on what it does. Every tool is checked before it's listed.
- **Something wrong or out of date?** Open an issue or email ${site.contactEmail}.
- **Own a listed tool and want it removed?** See [123ofnet.com/opt-out](${URL}/opt-out/). Removal is free and needs no reason.

We don't accept pull requests that add affiliate or tracking links.
`);

fs.writeFileSync(path.join(out, "LICENSE"), `Creative Commons Attribution 4.0 International (CC BY 4.0)

Copyright (c) ${site.established}-${new Date().getFullYear()} 123ofnet.com

You may share and adapt this list for any purpose, including commercially, as long as you
give appropriate credit with a link to ${URL}, link to the license, and indicate if changes
were made.

Full license: https://creativecommons.org/licenses/by/4.0/legalcode
Product names and trademarks belong to their owners.
`);

// Banner (retro 2001 window, like the site). Plain SVG so GitHub renders it with no build step.
fs.mkdirSync(path.join(out, "assets"), { recursive: true });
fs.writeFileSync(path.join(out, "assets", "banner.svg"), banner(1280, 400));
fs.writeFileSync(path.join(out, "assets", "social-preview.svg"), banner(1280, 640));

// Issue forms: make suggesting, reporting and opting out one click.
const tpl = path.join(out, ".github", "ISSUE_TEMPLATE");
fs.mkdirSync(tpl, { recursive: true });
fs.writeFileSync(path.join(tpl, "config.yml"), `blank_issues_enabled: false
contact_links:
  - name: Remove my tool (owners)
    url: ${URL}/opt-out/
    about: Free, no reason needed. Please use the opt-out page so we can verify you own the tool.
  - name: Search all ${N} tools
    url: ${URL}/directory/
    about: Find a tool by what you want to do.
`);
fs.writeFileSync(path.join(tpl, "suggest-tool.yml"), `name: Suggest a tool
description: Tell us about an AI tool that should be on the list
title: "Suggest: "
labels: [suggestion]
body:
  - type: input
    id: name
    attributes: { label: Tool name }
    validations: { required: true }
  - type: input
    id: url
    attributes: { label: Website, placeholder: "https://" }
    validations: { required: true }
  - type: input
    id: what
    attributes: { label: What does it do? (one line) }
    validations: { required: true }
  - type: dropdown
    id: category
    attributes:
      label: Category
      options:
${cats.map((c) => `        - "${c.cat.name}"`).join("\n")}
  - type: markdown
    attributes:
      value: "Every tool is checked before it's listed. Makers can also [submit on 123ofnet.com](${URL}/submit/)."
`);
fs.writeFileSync(path.join(tpl, "report-problem.yml"), `name: Report a dead link or mistake
description: A tool shut down, moved, or its description is wrong
title: "Problem: "
labels: [problem]
body:
  - type: input
    id: name
    attributes: { label: Tool name }
    validations: { required: true }
  - type: dropdown
    id: kind
    attributes:
      label: What's wrong?
      options: [Website is dead or shut down, Website moved to a new address, Description is wrong or outdated, Wrong category, Something else]
    validations: { required: true }
  - type: textarea
    id: details
    attributes: { label: Details (new address, what changed, links) }
`);

// Weekly refresh: the list repo rebuilds itself from the public 123ofnet repo (no secrets needed).
fs.mkdirSync(path.join(out, ".github", "workflows"), { recursive: true });
fs.writeFileSync(path.join(out, ".github", "workflows", "update.yml"), `name: Update list from 123ofnet.com
on:
  schedule: [{ cron: "0 6 * * 1" }]
  workflow_dispatch:
permissions:
  contents: write
jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/checkout@v4
        with: { repository: vinpatel/123ofnet, path: src123 }
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: cd src123 && node scripts/build-awesome.mjs ..
      - run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add -A README.md CONTRIBUTING.md LICENSE CHANGELOG.md categories data assets .github
          git diff --cached --quiet || (git commit -m "Update list from 123ofnet.com" && git push)
`);

console.log(`Wrote ${out}: ${total} tools in ${cats.length} categories`);

function banner(w, h) {
  const big = h > 500, pad = 40, tb = 44;
  const esc = (x) => String(x).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const cy = tb + pad + (big ? 120 : 70);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Awesome AI Tools by 123ofnet.com">
  <rect width="${w}" height="${h}" fill="#008080"/>
  <rect x="${pad}" y="${pad / 2}" width="${w - pad * 2}" height="${h - pad}" fill="#C0C0C0" stroke="#000" stroke-width="2"/>
  <path d="M${pad + 2} ${h - pad / 2 - 2}V${pad / 2 + 2}H${w - pad - 2}" fill="none" stroke="#fff" stroke-width="3"/>
  <rect x="${pad + 6}" y="${pad / 2 + 6}" width="${w - pad * 2 - 12}" height="${tb}" fill="#000080"/>
  <text x="${pad + 22}" y="${pad / 2 + 36}" font-family="Verdana, Tahoma, sans-serif" font-size="22" font-weight="bold" fill="#fff">123ofnet.com - Awesome AI Tools</text>
  ${["_", "□", "×"].map((c, i) => `<rect x="${w - pad - 128 + i * 38}" y="${pad / 2 + 13}" width="32" height="30" fill="#C0C0C0" stroke="#000"/><text x="${w - pad - 112 + i * 38}" y="${pad / 2 + 35}" font-family="Verdana, sans-serif" font-size="18" font-weight="bold" text-anchor="middle">${c}</text>`).join("")}
  <text x="${w / 2}" y="${cy}" font-family="Verdana, Tahoma, sans-serif" font-size="${big ? 56 : 54}" font-weight="bold" fill="#000" text-anchor="middle">Find the right <tspan fill="#CC0000">AI tool</tspan> for anything</text>
  <text x="${w / 2}" y="${cy + (big ? 70 : 56)}" font-family="Verdana, Tahoma, sans-serif" font-size="${big ? 30 : 26}" fill="#000" text-anchor="middle">${esc(N)} tools · sorted by the job · every link checked weekly</text>
  ${big ? `<text x="${w / 2}" y="${cy + 160}" font-family="Verdana, Tahoma, sans-serif" font-size="26" fill="#000080" text-anchor="middle">Quick picks by a person · free JSON/CSV data · AI Tool Graveyard</text>` : ""}
  <rect x="${w / 2 - 260}" y="${h - pad / 2 - (big ? 110 : 84)}" width="520" height="${big ? 64 : 54}" fill="#FFFF99" stroke="#000" stroke-width="2"/>
  <text x="${w / 2}" y="${h - pad / 2 - (big ? 68 : 48)}" font-family="'Courier New', monospace" font-size="${big ? 30 : 26}" font-weight="bold" fill="#000" text-anchor="middle">123ofnet.com · est. ${site.established}</text>
</svg>
`;
}
