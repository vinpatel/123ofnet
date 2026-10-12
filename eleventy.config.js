export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "CNAME": "CNAME" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  // Archived screenshots of the original site, shown on /1999/
  eleventyConfig.addPassthroughCopy({ "archive/screenshots/123ofnet.com": "1999/shots" });

  eleventyConfig.addFilter("year", () => new Date().getFullYear());
  eleventyConfig.addFilter("totalLinks", (cats) => cats.reduce((n, c) => n + c.links.length, 0));

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
