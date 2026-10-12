export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "CNAME": "CNAME" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  // Faithful 1999 restoration is served as-is, untouched by templates
  eleventyConfig.addPassthroughCopy({ "site/1999": "1999" });
  eleventyConfig.ignores.add("site/**");

  eleventyConfig.addFilter("year", () => new Date().getFullYear());

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
