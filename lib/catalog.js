// Loads the directory (data/directory.json) and adds what the site needs:
// a unique slug per tool, its own website description and check result (from
// archive/research/ and data/link-check-reviewed.json), its subcategories (the
// "chips" in src/_data/guides.json) and its closest alternatives in the same category.
import fs from "node:fs";
import path from "node:path";

const RESEARCH = "archive/research";
const REVIEWED = "data/link-check-reviewed.json";
const GUIDES = "src/_data/guides.json";
// Verifier reports saved before records carried their own "checked" date were all
// run on or before this day (commit bd5f2f0).
const FIRST_CHECK = "2026-10-16";
const SUFFIX = " - 123ofnet.com";
const STOP = new Set("a an and the for to of with in on your you by from that is it its as at or be are this ai tool tools app apps using use into via can more all one any make makes".split(" "));

export function slugify(s) {
  return s.toLowerCase().replace(/&/g, " and ").replace(/\(.*?\)/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "tool";
}

function words(s) {
  return new Set(s.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w)));
}

// Some sites double-encode their meta descriptions ("&amp;amp;"), so decode entities.
function decode(s) {
  for (let i = 0; i < 2; i++) {
    s = s.replace(/&#(\d+);?/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);?/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
      .replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
  }
  return s;
}

const key = (u) => u.replace(/\/$/, "");

// url -> { desc, status, date } from the verifier reports
function research() {
  const map = new Map();
  if (!fs.existsSync(RESEARCH)) return map;
  for (const f of fs.readdirSync(RESEARCH).filter((f) => f.endsWith(".json"))) {
    for (const r of JSON.parse(fs.readFileSync(path.join(RESEARCH, f), "utf8"))) {
      let d = decode(r.site_desc || "").trim();
      const ascii = d && [...d].filter((ch) => ch.charCodeAt(0) < 128).length / d.length;
      if (!(d.length > 40 && ascii > 0.9 && !/cookie|javascript|enable js/i.test(d))) d = "";
      const rec = { desc: d, status: r.status, date: r.checked || FIRST_CHECK };
      for (const u of [r.url, r.final]) if (u) map.set(key(u), rec);
    }
  }
  return map;
}

// What a visitor sees in the "Checked" row. Honest about what the checker can and can't tell.
function checkResult(rec, reviewed) {
  if (reviewed) return { kind: "person", date: reviewed.reviewed, text: "A person checked the website works" };
  if (!rec) return { kind: "none", date: "", text: "Not checked yet" };
  if (rec.status === "ok" || rec.status === "moved")
    return { kind: "ok", date: rec.date, text: "Website loaded and named the tool" };
  if (rec.status === "blocked")
    return { kind: "blocked", date: rec.date, text: "Website blocks automatic checkers (common for big sites), so we couldn't confirm it loads" };
  return { kind: "flagged", date: rec.date, text: "Our checker flagged this site; a person will review it" };
}

// Titles must fit in 60 characters including " - 123ofnet.com".
export function fitTitle(...options) {
  const max = 60 - SUFFIX.length;
  for (const t of options) if (t.length <= max) return t;
  const last = options[options.length - 1];
  return last.slice(0, max - 1).replace(/\s+\S*$/, "") + "\u2026";
}

// Descriptions must be 70-160 characters: use the longest option that fits.
export function fitDesc(...options) {
  for (const d of options) if (d.length <= 160) return d;
  const last = options[options.length - 1];
  return last.slice(0, 157).replace(/\s+\S*$/, "") + "...";
}

let cached;
export function loadCatalog() {
  if (cached) return cached;
  const directory = JSON.parse(fs.readFileSync("data/directory.json", "utf8"));
  const facts = research();
  const reviewed = fs.existsSync(REVIEWED) ? JSON.parse(fs.readFileSync(REVIEWED, "utf8")) : {};
  const guides = fs.existsSync(GUIDES) ? JSON.parse(fs.readFileSync(GUIDES, "utf8")) : {};
  const used = new Set();
  const tools = [];

  for (const cat of directory.categories) {
    for (const l of cat.links) {
      let slug = slugify(l.title);
      if (used.has(slug)) slug = `${slug}-${cat.slug}`;
      for (let i = 2; used.has(slug); i++) slug = `${slugify(l.title)}-${i}`;
      used.add(slug);
      l.slug = slug;
      const rec = facts.get(key(l.url));
      const text = `${l.title} ${l.note}`.toLowerCase();
      const subs = ((guides[cat.slug] || {}).chips || []).filter((ch) => text.includes(ch.q.toLowerCase())).map((ch) => ch.q);
      tools.push({ ...l, cat: { slug: cat.slug, name: cat.name, color: cat.color },
        siteDesc: (rec && rec.desc) || "", check: checkResult(rec, reviewed[l.url] || reviewed[key(l.url)]),
        subs, _words: words(`${l.title} ${l.note}`) });
    }
  }
  // Alternatives, scored within the category: same subcategory counts most, then shared
  // words weighted by rarity (sharing "artistic" says more than sharing "images"), then a
  // small boost for tools a person chose as quick picks (well-known, trusted choices).
  const df = new Map(), size = new Map();
  for (const t of tools) {
    size.set(t.cat.slug, (size.get(t.cat.slug) || 0) + 1);
    for (const w of t._words) df.set(`${t.cat.slug}:${w}`, (df.get(`${t.cat.slug}:${w}`) || 0) + 1);
  }
  const picks = new Set(Object.entries(guides).flatMap(([slug, g]) => (g.picks || []).map((p) => `${slug}:${p.tool}`)));
  for (const t of tools) {
    const n = size.get(t.cat.slug), own = words(t.title);
    t.alternatives = tools
      .filter((o) => o !== t && o.cat.slug === t.cat.slug)
      .map((o) => {
        let score = 3 * o.subs.filter((q) => t.subs.includes(q)).length;
        for (const w of o._words) if (t._words.has(w) && !own.has(w)) score += Math.log(n / df.get(`${t.cat.slug}:${w}`));
        if (picks.has(`${o.cat.slug}:${o.title}`)) score += 3;
        return { o, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(({ o }) => ({ title: o.title, slug: o.slug, note: o.note, url: o.url }));
  }
  for (const t of tools) delete t._words;

  // Subcategory pages: /directory/<cat>/<chip>/ for chips with at least 3 tools.
  const subcats = [];
  for (const cat of directory.categories) {
    for (const ch of (guides[cat.slug] || {}).chips || []) {
      const list = tools.filter((t) => t.cat.slug === cat.slug && t.subs.includes(ch.q));
      if (list.length >= 3)
        subcats.push({ slug: slugify(ch.label), label: ch.label, q: ch.q, cat: { slug: cat.slug, name: cat.name, color: cat.color }, tools: list,
          picks: (guides[cat.slug].picks || []).map((p) => ({ need: p.need, t: list.find((t) => t.title === p.tool) })).filter((p) => p.t) });
    }
  }
  for (const cat of directory.categories) cat.subs = subcats.filter((s) => s.cat.slug === cat.slug).map(({ slug, label, tools }) => ({ slug, label, count: tools.length }));
  for (const t of tools) t.subPages = t.subs.map((q) => subcats.find((s) => s.cat.slug === t.cat.slug && s.q === q)).filter(Boolean).map(({ slug, label }) => ({ slug, label }));
  cached = { directory, tools, subcats };
  return cached;
}
