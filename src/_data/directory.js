// The AI tools directory (source: data/directory.json), with tool slugs added.
import { loadCatalog } from "../../lib/catalog.js";
export default () => loadCatalog().directory;
