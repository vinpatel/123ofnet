// Lists archived screenshots for the /1999/ museum page, grouped by site.
import fs from "node:fs";

const ROOT = "archive/screenshots";
const SITES = ["123ofnet.com", "123ofnet.hypermart.net"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function pageName(rest, site) {
  let p = rest.replace(new RegExp("^" + site.replace(/\./g, "\\.") + "_?"), "");
  if (p.startsWith("cgi-bin_odp_index.cgi_")) return "Directory: " + p.slice(22).replace(/_/g, " / ");
  p = p.replace(/\.(shtml|htm)$/, "").replace(/_/g, " ").trim();
  return p ? p[0].toUpperCase() + p.slice(1) : "Homepage";
}

export default function () {
  return SITES.map((site) => {
    const dir = `${ROOT}/${site}`;
    const shots = !fs.existsSync(dir) ? [] : fs.readdirSync(dir).filter((f) => f.endsWith(".png")).sort().map((file) => {
      const [, ts, rest] = file.match(/^(\d{8})-(.*)\.png$/) || [];
      return {
        file: `${site}/${file}`, ts,
        url: `http://${site}/`,
        page: pageName(rest || "", site),
        date: ts ? `${MONTHS[+ts.slice(4, 6) - 1]} ${ts.slice(0, 4)}` : "",
      };
    });
    return { site, shots };
  });
}
