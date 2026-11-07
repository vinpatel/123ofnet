// Per-page values for /directory/<category>/<sub>/.
import { fitTitle, fitDesc } from "../lib/catalog.js";

export default {
  eleventyComputed: {
    title: ({ sub }) => fitTitle(`Best AI ${sub.label} (2026): ${sub.tools.length} Tools`, `Best AI ${sub.label} (2026)`, `Best AI ${sub.label}`, `AI ${sub.label}`),
    description: ({ sub }) => {
      const names = sub.tools.slice(0, 3).map((t) => t.title).join(", ");
      const what = sub.label.toLowerCase();
      return fitDesc(
        `${sub.tools.length} AI tools for ${what} in ${sub.cat.name}, checked to make sure they work: ${names} and more. Compare them and find alternatives.`,
        `${sub.tools.length} checked AI tools for ${what}: ${names} and more.`,
        `${sub.tools.length} checked AI tools for ${what} in ${sub.cat.name}, from the 123ofnet.com directory.`);
    },
    crumbs: ({ sub }) => [
      { name: "Home", url: "/" },
      { name: "AI Directory", url: "/directory/" },
      { name: sub.cat.name, url: `/directory/${sub.cat.slug}/` },
      { name: sub.label, url: `/directory/${sub.cat.slug}/${sub.slug}/` },
    ],
  },
};
