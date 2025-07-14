import { ID_CATEGORY } from "../../../common/config.js";
import { ALL_FIGURE_MODES } from "../../../core/services/figureLibraryService.js";
import { isModeUnlocked } from "../../../core/services/gameStateService.js";
import { createCategoryFigureThumb } from "../../../core/images/imageHandler.js"; // ← 경로 맞게 조정!

export function renderCatalog() {
  const panel = document.getElementById(ID_CATEGORY) as HTMLElement | null;
  if (!panel) return;
  panel.innerHTML = "";

  ALL_FIGURE_MODES.forEach(entry => {
    const img = createCategoryFigureThumb(entry);
    panel.appendChild(img);
  });
}
