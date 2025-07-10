import { ID_PLAYGROUND } from "../../../common/config.js";
import { getMaxZIndex, addPlaygroundFigure } from "../../../core/services/gameStateService.js";
import { renderPlayground } from "../render/playgroundRenderer.js";
export function enablePlaygroundDrop() {
    const container = document.getElementById(ID_PLAYGROUND);
    if (!container) {
        console.warn("[Playground Drop] 플레이그라운드 엘리먼트 없음!");
        return;
    }
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
        try {
            const parsed = JSON.parse(data);
            const { figureId, mode, serial, offsetX, offsetY } = parsed;
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left - (offsetX !== null && offsetX !== void 0 ? offsetX : 0);
            const y = e.clientY - rect.top - (offsetY !== null && offsetY !== void 0 ? offsetY : 0);
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
            renderPlayground();
        }
        catch (err) {
            console.warn("[Playground Drop] 드롭 데이터 파싱 실패", err);
        }
    });
}
