// Loads the directory (data/directory.json) and adds what the site needs:
// a unique slug per tool, its own website description (from archive/research/),
// and its closest alternatives in the same category.
import fs from "node:fs";
import path from "node:path";

const RESEARCH = "archive/research";
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

function siteDescriptions() {
  const map = new Map();
  if (!fs.existsSync(RESEARCH)) return map;
  for (const f of fs.readdirSync(RESEARCH).filter((f) => f.endsWith(".json"))) {
    for (const r of JSON.parse(fs.readFileSync(path.join(RESEARCH, f), "utf8"))) {
      const d = decode(r.site_desc || "").trim();
      const ascii = d && [...d].filter((ch) => ch.charCodeAt(0) < 128).length / d.length;
      if (d.length > 40 && ascii > 0.9 && !/cookie|javascript|enable js/i.test(d)) {
        for (const u of [r.url, r.final]) if (u) map.set(u.replace(/\/$/, ""), d);
      }
    }
  }
  return map;
}

let cached;
export function loadCatalog() {
  if (cached) return cached;
  const directory = JSON.parse(fs.readFileSync("data/directory.json", "utf8"));
  const descs = siteDescriptions();
  const used = new Set();
  const tools = [];

  for (const cat of directory.categories) {
    for (const l of cat.links) {
      let slug = slugify(l.title);
      if (used.has(slug)) slug = `${slug}-${cat.slug}`;
      for (let i = 2; used.has(slug); i++) slug = `${slugify(l.title)}-${i}`;
      used.add(slug);
      l.slug = slug;
      tools.push({ ...l, cat: { slug: cat.slug, name: cat.name, color: cat.color },
        siteDesc: descs.get(l.url.replace(/\/$/, "")) || "", _words: words(`${l.title} ${l.note}`) });
    }
  }
  for (const t of tools) {
    t.alternatives = tools
      .filter((o) => o !== t && o.cat.slug === t.cat.slug)
      .map((o) => ({ o, score: [...o._words].filter((w) => t._words.has(w)).length }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(({ o }) => ({ title: o.title, slug: o.slug, note: o.note, url: o.url }));
  }
  for (const t of tools) delete t._words;
  cached = { directory, tools };
  return cached;
}
