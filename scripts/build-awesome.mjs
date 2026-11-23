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
const { directory, tools } = loadCatalog();
const URL = site.url;
const PER_CAT = 15; // tools shown per category in the README (after quick picks)

const ok = (t) => t.check.kind !== "flagged";
const md = (s) => String(s).replace(/([\[\]|*_`<>])/g, "\\$1");
const anchor = (s) => s.toLowerCase().replace(/[^a-z0-9 -]/g, "").trim().replace(/\s+/g, "-");
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
let r = `# Awesome AI Tools by 123ofnet

> A checked list of ${total.toLocaleString("en-US")} AI tools for normal people and small businesses, sorted by what you want to get done.

This list is generated from the directory at **[123ofnet.com](${URL})**, where every tool has its own page with what it does, who it's for and its closest alternatives.
Search all of them at [123ofnet.com/directory](${URL}/directory/).

**Legend:** quick picks are chosen by a person. "Details & alternatives" opens the tool's page on 123ofnet.com.

## Contents

${cats.map((c) => `- [${c.cat.name}](#${anchor(c.cat.name)}) (${c.list.length})`).join("\n")}

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
r += `## Contributing\n\nSuggest a tool at [123ofnet.com/submit](${URL}/submit/) or open an issue. See [CONTRIBUTING.md](CONTRIBUTING.md).\n\n${footer}`;

fs.mkdirSync(path.join(out, "categories"), { recursive: true });
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
          git add -A README.md CONTRIBUTING.md LICENSE categories .github
          git diff --cached --quiet || (git commit -m "Update list from 123ofnet.com" && git push)
`);

console.log(`Wrote ${out}: ${total} tools in ${cats.length} categories`);
