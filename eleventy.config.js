export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "CNAME": "CNAME" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy("src/*.txt"); // IndexNow key file
  // Archived screenshots of the original site, shown on /1999/
  eleventyConfig.addPassthroughCopy({ "archive/screenshots": "1999/shots" });

  eleventyConfig.addWatchTarget("data/");
  eleventyConfig.addWatchTarget("lib/");
  eleventyConfig.addFilter("year", () => new Date().getFullYear());
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  // "2026-10-16" -> "Oct 2026" (check dates are shown to the month; see /how-we-check/)
  eleventyConfig.addFilter("monthYear", (d) => new Date(d + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" }));
  // Google's applicationCategory values for SoftwareApplication, by directory category
  const APP_CATEGORY = { assistants: "UtilitiesApplication", writing: "UtilitiesApplication", career: "BusinessApplication",
    design: "DesignApplication", video: "MultimediaApplication", work: "BusinessApplication", business: "BusinessApplication",
    build: "DeveloperApplication", developer: "DeveloperApplication", learn: "EducationalApplication" };
  eleventyConfig.addFilter("appCategory", (slug) => APP_CATEGORY[slug] || "UtilitiesApplication");
  // Compact search index for /directory/: [title, url, note, category slug, category name]
  eleventyConfig.addFilter("searchIndex", (cats) =>
    cats.flatMap((c) => c.links.map((l) => [l.title, l.url, l.note, c.slug, c.name, l.slug])));
  eleventyConfig.addFilter("totalLinks", (cats) => cats.reduce((n, c) => n + c.links.length, 0));

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
