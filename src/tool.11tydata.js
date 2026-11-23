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
    // Last real change to what the page says: the check, its own content, or the shared template.
    lastmod: ({ tool, site }) => [tool.check.date, tool.content && tool.content.reviewed, site.toolPageUpdated].filter(Boolean).sort().pop(),
    // Keep pages with nothing of their own (no website description, no written content) out of
    // search indexes until they have some; they stay on the site and in the directory.
    noindex: ({ tool }) => !tool.siteDesc && !tool.content,
    crumbs: ({ tool }) => [
      { name: "Home", url: "/" },
      { name: "AI Directory", url: "/directory/" },
      { name: tool.cat.name, url: `/directory/${tool.cat.slug}/` },
      { name: tool.title, url: `/tool/${tool.slug}/` },
    ],
  },
};
