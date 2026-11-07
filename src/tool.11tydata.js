// Per-page values for /tool/<slug>/. Computed in JS (not front matter) because
// front-matter arrays like `crumbs` were evaluated once and shared by every page.
import { fitTitle, fitDesc } from "../lib/catalog.js";

export default {
  eleventyComputed: {
    title: ({ tool }) => fitTitle(`${tool.title}: What It Does & Alternatives`, `${tool.title} & Alternatives`, `${tool.title} Alternatives`, tool.title),
    description: ({ tool }) => {
      const n = tool.alternatives.length, cat = tool.cat.name;
      return fitDesc(
        `${tool.title}: ${tool.note}. See what it does and ${n} alternatives in ${cat}, checked by 123ofnet.com.`,
        `${tool.title}: ${tool.note}. See what it does and ${n} alternatives in ${cat}.`,
        `${tool.title}: ${tool.note}. Plus ${n} alternatives.`,
        `${tool.title}: ${tool.note}.`);
    },
    lastmod: ({ tool }) => tool.check.date || undefined,
    crumbs: ({ tool }) => [
      { name: "Home", url: "/" },
      { name: "AI Directory", url: "/directory/" },
      { name: tool.cat.name, url: `/directory/${tool.cat.slug}/` },
      { name: tool.title, url: `/tool/${tool.slug}/` },
    ],
  },
};
