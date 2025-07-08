import { IMAGE_ROOT } from "../../../common/config.js";
import { ALL_FIGURE_MODES } from "../../../services/figureLibraryService.js";
import { isModeUnlocked } from "../../../services/gameStateService.js";
export function renderCatalog() {
    const panel = document.querySelector("#catalog");
    if (!panel)
        return;
    panel.innerHTML = "";
    // 이미 ALL_FIGURE_MODES는 상수이므로 바로 사용!
    ALL_FIGURE_MODES.forEach(entry => {
        const src = `${IMAGE_ROOT}${entry.id}.png`;
        const img = document.createElement("img");
        img.src = src;
        img.alt = `${entry.name} (${entry.mode})`;
        img.draggable = false;
        const unlocked = isModeUnlocked(entry.figureId, entry.mode);
        img.className = "catalog-thumb" + (unlocked ? "" : " locked");
        panel.appendChild(img);
    });
}
