// Lists the archived screenshots for the /1999/ museum page.
import fs from "node:fs";

const DIR = "archive/screenshots/123ofnet.com";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function () {
  if (!fs.existsSync(DIR)) return [];
  return fs.readdirSync(DIR).filter((f) => f.endsWith(".png")).sort().map((file) => {
    const [, ts, rest] = file.match(/^(\d{8})-(.*)\.png$/) || [];
    const path = (rest || "").replace(/^123ofnet\.com_?/, "").replace(/\.shtml$/, "").replace(/_/g, " ").trim();
    return {
      file, ts,
      url: "http://123ofnet.com/" + (rest || "").replace(/^123ofnet\.com_?/, ""),
      page: path ? path[0].toUpperCase() + path.slice(1) : "Homepage",
      date: ts ? `${MONTHS[+ts.slice(4, 6) - 1]} ${ts.slice(0, 4)}` : "",
    };
  });
}
