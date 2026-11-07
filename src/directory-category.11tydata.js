// Per-page values for /directory/<category>/ (see tool.11tydata.js for why this is JS).
import { fitTitle, fitDesc } from "../lib/catalog.js";

export default {
  eleventyComputed: {
    title: ({ cat }) => { const f = cat.forName || cat.name; return fitTitle(`Best AI Tools for ${f} (2026)`, `Best AI Tools for ${f}`, `AI Tools for ${f}`); },
    description: ({ cat }) => {
      const names = cat.links.slice(0, 4).map((l) => l.title).join(", ");
      const what = (cat.forName || cat.name).toLowerCase();
      return fitDesc(
        `The best AI tools for ${what}, checked to make sure they work: ${names} and more. ${cat.blurb}.`,
        `${cat.links.length} AI tools for ${what}, checked to make sure they work: ${names} and more.`,
        `${cat.links.length} checked AI tools for ${what}.`);
    },
    crumbs: ({ cat }) => [
      { name: "Home", url: "/" },
      { name: "AI Directory", url: "/directory/" },
      { name: cat.name, url: `/directory/${cat.slug}/` },
    ],
  },
};
