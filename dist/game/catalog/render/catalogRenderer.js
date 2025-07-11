import { ALL_FIGURE_MODES } from "../../../core/services/figureLibraryService.js";
import { isModeUnlocked } from "../../../core/services/gameStateService.js";
import { createFigureThumb } from "../../../core/images/imageHandler.js"; // ← 경로 맞게 조정!
export function renderCatalog() {
    const panel = document.getElementById("catalog-content");
    if (!panel)
        return;
    panel.innerHTML = "";
    ALL_FIGURE_MODES.forEach(entry => {
        const unlocked = isModeUnlocked(entry.figureId, entry.mode);
        const img = createFigureThumb({
            id: entry.figureId,
            mode: entry.mode,
            unlocked,
            name: entry.name,
            outline: true, // 항상 outline 지원
            draggable: false, // 카탈로그는 드래그 불필요
        });
        img.classList.add("catalog-thumb"); // 카탈로그 전용 추가 스타일
        panel.appendChild(img);
    });
}
