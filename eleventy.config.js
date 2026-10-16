export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "CNAME": "CNAME" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy("src/*.txt"); // IndexNow key file
  // Archived screenshots of the original site, shown on /1999/
  eleventyConfig.addPassthroughCopy({ "archive/screenshots": "1999/shots" });

  eleventyConfig.addFilter("year", () => new Date().getFullYear());
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  // Compact search index for /directory/: [title, url, note, category slug, category name]
  eleventyConfig.addFilter("searchIndex", (cats) =>
    cats.flatMap((c) => c.links.map((l) => [l.title, l.url, l.note, c.slug, c.name])));
  eleventyConfig.addFilter("totalLinks", (cats) => cats.reduce((n, c) => n + c.links.length, 0));

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
