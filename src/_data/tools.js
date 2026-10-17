// Flat list of every tool for /tool/<slug>/ pages. See lib/catalog.js.
import { loadCatalog } from "../../lib/catalog.js";
export default () => loadCatalog().tools;
