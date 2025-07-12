import { ID_PLAYGROUND } from "../../../common/config.js";
import { getMaxZIndex, addPlaygroundFigure } from "../../../core/services/gameStateService.js";
import { renderPlayAddOrUpdateFigure } from "../render/playgroundRenderer.js";
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
    // (플레이그라운드 전체에 touchmove, touchend 이벤트 등록)
    let currentDropData = null;
    let touchGhost = null;
    let touchOffsetX = 0, touchOffsetY = 0;
    // 인벤토리(혹은 외부)에서 터치드래그 할 때, 
    // 글로벌 변수/상태로 데이터 저장 필요 (enableInvToPlayDrag쪽과 연동)
    window.__playgroundTouchDrop = (data, startX, startY, offsetX, offsetY, ghost) => {
        // (ghost는 보통 이 시점에서 이미 삭제됨)
        handleDropData(JSON.stringify(data), startX, startY, container, offsetX, offsetY);
    };
    // 플레이그라운드에 터치 드래그 중일 때, drop 판정
    container.addEventListener("touchmove", (e) => {
        if (!touchGhost)
            return;
        const t = e.touches[0];
        // ghost가 손가락 따라 이동
        touchGhost.style.left = `${t.clientX - touchOffsetX}px`;
        touchGhost.style.top = `${t.clientY - touchOffsetY}px`;
    });
    container.addEventListener("touchend", (e) => {
        if (!touchGhost || !currentDropData)
            return;
        // 드롭 판정: 손 뗀 위치가 playground 내부일 때만 drop 처리
        const t = e.changedTouches[0];
        const rect = container.getBoundingClientRect();
        const x = t.clientX - rect.left - touchOffsetX;
        const y = t.clientY - rect.top - touchOffsetY;
        // playground 내부에 있으면 drop 처리
        if (t.clientX >= rect.left && t.clientX <= rect.right &&
            t.clientY >= rect.top && t.clientY <= rect.bottom) {
            handleDropData(currentDropData, t.clientX, t.clientY, container, touchOffsetX, touchOffsetY);
        }
        // cleanup
        if (touchGhost.parentNode)
            touchGhost.parentNode.removeChild(touchGhost);
        touchGhost = null;
        currentDropData = null;
    });
    // ===== PC/모바일 공용: drop데이터 해석&처리
    function handleDropData(data, clientX, clientY, playgroundEl, offsetX, offsetY) {
        try {
            const parsed = JSON.parse(data);
            const { figureId, mode, serial, offsetX: offsetX0, offsetY: offsetY0 } = parsed;
            const rect = playgroundEl.getBoundingClientRect();
            const offX = offsetX !== undefined ? offsetX : offsetX0 !== null && offsetX0 !== void 0 ? offsetX0 : 0;
            const offY = offsetY !== undefined ? offsetY : offsetY0 !== null && offsetY0 !== void 0 ? offsetY0 : 0;
            const x = clientX - rect.left - offX;
            const y = clientY - rect.top - offY;
            const maxZ = getMaxZIndex();
            const fig = {
                id: figureId,
                mode,
                x,
                y,
                serial,
                zIndex: maxZ + 1
            };
            addPlaygroundFigure(fig); // 상태에는 반드시 반영
            renderPlayAddOrUpdateFigure(fig); // ===★ 여기로 교체 ===
        }
        catch (err) {
            console.warn("[Playground Drop] 드롭 데이터 파싱 실패", err);
        }
    }
}
