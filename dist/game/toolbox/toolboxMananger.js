import { ID_PLAYGROUND } from "../../common/config.js";
import { clearPlaygroundFigures, getPlaygroundFigures } from "../../core/services/gameStateService.js";
import { renderPlayground } from "../index/renderIndex.js";
export function enableToolbox() {
    const toolbox = document.getElementById("toolbox");
    if (!toolbox)
        return;
    // 전체 삭제 버튼
    const clearBtn = document.createElement("button");
    clearBtn.id = "clear-playground-btn";
    clearBtn.textContent = "플레이그라운드 전체 삭제";
    clearBtn.onclick = () => {
        clearPlaygroundFigures();
        renderPlayground();
    };
    toolbox.appendChild(clearBtn);
    // 🟩 그리드 정렬 버튼 추가
    const gridBtn = document.createElement("button");
    gridBtn.id = "grid-playground-btn";
    gridBtn.textContent = "플레이그라운드 바둑판 정렬";
    gridBtn.onclick = () => {
        arrangeFiguresGridCenter();
        renderPlayground();
    };
    toolbox.appendChild(gridBtn);
}
// === 실제 그리드 정렬 함수 ===
function arrangeFiguresGridCenter() {
    const figures = getPlaygroundFigures();
    if (figures.length === 0)
        return;
    // 플레이그라운드 크기 (HTML에서 직접 얻거나, 고정값 사용)
    const playground = document.getElementById(ID_PLAYGROUND);
    const playgroundWidth = (playground === null || playground === void 0 ? void 0 : playground.clientWidth) || 900;
    const playgroundHeight = (playground === null || playground === void 0 ? void 0 : playground.clientHeight) || 700;
    // 설정값
    const nCol = 5; // 한 줄에 몇 개
    const margin = 24; // 이미지 간격(px)
    const size = 120; // 피규어 한 변의 크기(px), 필요시 getFigureSize로 개별 적용 가능
    // 행/열 계산
    const nRow = Math.ceil(figures.length / nCol);
    // 그리드 전체의 폭/높이 계산
    const gridWidth = nCol * size + (nCol - 1) * margin;
    const gridHeight = nRow * size + (nRow - 1) * margin;
    // "플레이그라운드 중앙"에서 그리드의 (0,0)이 시작할 좌표
    const startX = Math.max(0, Math.round((playgroundWidth - gridWidth) / 2));
    const startY = Math.max(0, Math.round((playgroundHeight - gridHeight) / 2));
    let col = 0, row = 0;
    for (let i = 0; i < figures.length; i++) {
        const fig = figures[i];
        fig.x = startX + col * (size + margin);
        fig.y = startY + row * (size + margin);
        col++;
        if (col >= nCol) {
            col = 0;
            row++;
        }
    }
}
