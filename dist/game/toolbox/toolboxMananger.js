import { ID_PLAYGROUND } from "../../common/config.js";
import { clearPlaygroundFigures, getPlaygroundFigures } from "../../core/services/gameStateService.js";
import { renderPlayground } from "../gameCommon/renderIndex.js";
export function enableToolbox() {
    const clearBtn = document.getElementById("clear-playground-btn");
    const gridBtn = document.getElementById("grid-playground-btn");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            clearPlaygroundFigures();
            renderPlayground();
        });
    }
    if (gridBtn) {
        gridBtn.addEventListener("click", () => {
            arrangeFiguresGridCenter();
            renderPlayground();
        });
    }
}
// === 바둑판 정렬 ===
function arrangeFiguresGridCenter() {
    const figures = getPlaygroundFigures();
    if (figures.length === 0)
        return;
    const playground = document.getElementById(ID_PLAYGROUND);
    const playgroundWidth = (playground === null || playground === void 0 ? void 0 : playground.clientWidth) || 900;
    const playgroundHeight = (playground === null || playground === void 0 ? void 0 : playground.clientHeight) || 700;
    const nCol = 5;
    const margin = 24;
    const size = 120;
    const nRow = Math.ceil(figures.length / nCol);
    const gridWidth = nCol * size + (nCol - 1) * margin;
    const gridHeight = nRow * size + (nRow - 1) * margin;
    const startX = Math.max(0, Math.round((playgroundWidth - gridWidth) / 2));
    const startY = Math.max(0, Math.round((playgroundHeight - gridHeight) / 2));
    let col = 0, row = 0;
    for (const fig of figures) {
        fig.x = startX + col * (size + margin);
        fig.y = startY + row * (size + margin);
        col++;
        if (col >= nCol) {
            col = 0;
            row++;
        }
    }
}
