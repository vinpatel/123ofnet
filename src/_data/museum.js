// Lists archived screenshots for the /1999/ museum page, grouped by site.
// Thumbnails (400px wide JPEGs) live in src/assets/1999/; regenerate them with
// scripts/museum-thumbs.sh after adding screenshots. The originals are never changed.
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
      // PNG width/height live at bytes 16-23 of the file (IHDR chunk)
      const head = Buffer.alloc(24);
      const fd = fs.openSync(`${dir}/${file}`, "r"); fs.readSync(fd, head, 0, 24, 0); fs.closeSync(fd);
      const w = head.readUInt32BE(16), h = head.readUInt32BE(20);
      return {
        file: `${site}/${file}`, ts,
        thumb: `${site}/${file.replace(/\.png$/, ".jpg")}`, tw: 400, th: Math.round((h * 400) / w),
        url: `http://${site}/`,
        page: pageName(rest || "", site),
        date: ts ? `${MONTHS[+ts.slice(4, 6) - 1]} ${ts.slice(0, 4)}` : "",
      };
    });
    return { site, shots };
  });
}
