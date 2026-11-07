// Subcategory pages (/directory/<category>/<sub>/), built from the "chips" in guides.json.
import { loadCatalog } from "../../lib/catalog.js";
export default () => loadCatalog().subcats;
