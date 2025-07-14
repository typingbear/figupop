import { ID_PLAYGROUND } from "../../../common/config.js";
import { getMaxZIndex, addPlaygroundFigure } from "../../../core/services/gameStateService.js";
import { renderPlayAddOrUpdateFigure } from "../render/playgroundRenderer.js";
import { getResponsiveFigureSize } from "../../../core/services/figureLibraryService.js";
export function enablePlaygroundDrop() {
    const container = document.getElementById(ID_PLAYGROUND);
    if (!container) {
        console.warn("[Playground Drop] 플레이그라운드 엘리먼트 없음!");
        return;
    }
    // === 1. PC: HTML5 DnD ===
    container.addEventListener("dragover", e => {
        e.preventDefault();
    });
    container.addEventListener("drop", e => {
        var _a;
        e.preventDefault();
        const data = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData("text/plain");
        if (!data) {
            console.warn("[Playground Drop] 드롭: 데이터 없음");
            return;
        }
        handleDropData(data, e.clientX, e.clientY, container);
    });
    // === 2. 모바일/태블릿: 터치 드롭 ===
    let currentDropData = null;
    let touchGhost = null;
    let touchOffsetX = 0, touchOffsetY = 0;
    window.__playgroundTouchDrop = (data, startX, startY, offsetX, offsetY, ghost) => {
        handleDropData(JSON.stringify(data), startX, startY, container, offsetX, offsetY);
    };
    container.addEventListener("touchmove", (e) => {
        if (!touchGhost)
            return;
        const t = e.touches[0];
        touchGhost.style.left = `${t.clientX - touchOffsetX}px`;
        touchGhost.style.top = `${t.clientY - touchOffsetY}px`;
    });
    container.addEventListener("touchend", (e) => {
        if (!touchGhost || !currentDropData)
            return;
        const t = e.changedTouches[0];
        const rect = container.getBoundingClientRect();
        if (t.clientX >= rect.left && t.clientX <= rect.right &&
            t.clientY >= rect.top && t.clientY <= rect.bottom) {
            handleDropData(currentDropData, t.clientX, t.clientY, container, touchOffsetX, touchOffsetY);
        }
        if (touchGhost.parentNode)
            touchGhost.parentNode.removeChild(touchGhost);
        touchGhost = null;
        currentDropData = null;
    });
    function handleDropData(data, clientX, clientY, playgroundEl, offsetX, offsetY) {
        try {
            const parsed = JSON.parse(data);
            const { figureId, mode, serial } = parsed;
            const rect = playgroundEl.getBoundingClientRect();
            const { width: imgW, height: imgH } = getResponsiveFigureSize(figureId, mode);
            // "중앙 맞춤" 좌표 계산!
            const x = clientX - rect.left - imgW / 2;
            const y = clientY - rect.top - imgH / 2;
            const maxZ = getMaxZIndex();
            const fig = {
                id: figureId,
                mode,
                x,
                y,
                serial,
                zIndex: maxZ + 1
            };
            addPlaygroundFigure(fig);
            renderPlayAddOrUpdateFigure(fig);
        }
        catch (err) {
            console.warn("[Playground Drop] 드롭 데이터 파싱 실패", err);
        }
    }
}
