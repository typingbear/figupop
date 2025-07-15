import { PANEL_CATEGORY } from "../../../common/config.js";
import { ALL_FIGURE_MODES } from "../../../core/services/figureLibraryService.js";
import { createCategoryFigureThumb } from "./categoryImageHandler.js";
export function renderCatalog() {
    PANEL_CATEGORY.innerHTML = "";
    ALL_FIGURE_MODES.forEach(entry => {
        const img = createCategoryFigureThumb(entry);
        PANEL_CATEGORY.appendChild(img);
    });
}
