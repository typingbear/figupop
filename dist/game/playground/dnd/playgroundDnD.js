import { getPlaygroundFigures, addOrUnlockInventoryFigure, bringFigureToFront, getInventoryFigures } from "../../../core/services/gameStateService.js";
import { getReactionResult, } from "../../../core/services/figureLibraryService.js";
import { ID_PLAYGROUND } from "../../../common/config.js";
import { renderPlayAddOrUpdateFigure } from "../render/playgroundRenderer.js";
import { renderInventoryInsertItem, renderInventoryUpdateItem } from "../../inventory/render/inventoryRenderer.js";
function getRenderedSize(imgEl) {
    const rect = imgEl.getBoundingClientRect();
    return {
        width: rect.width,
        height: rect.height,
    };
}
/**
 * 플레이그라운드에서 이미지 직접 드래그-이동 (z-index도 관리)
 */ export function enablePlaygroundDnD() {
    const playgroundEl = document.getElementById(ID_PLAYGROUND);
    let draggingImg = null;
    let draggingSerial = null;
    let startX = 0, startY = 0, origX = 0, origY = 0;
    let draggingTouchId = null;
    // ============ [PC: 마우스 DnD] ============
    playgroundEl.addEventListener("mousedown", e => {
        const target = e.target;
        if (target instanceof HTMLImageElement && target.hasAttribute("data-serial")) {
            draggingImg = target;
            draggingSerial = target.getAttribute("data-serial");
            // z-index 최상위로!
            const newZ = bringFigureToFront(draggingSerial);
            if (typeof newZ === "number")
                draggingImg.style.zIndex = String(newZ);
            startX = e.clientX;
            startY = e.clientY;
            origX = parseInt(target.style.left) || 0;
            origY = parseInt(target.style.top) || 0;
            window.addEventListener("mousemove", onMoveMouse);
            window.addEventListener("mouseup", onUpMouse);
            e.preventDefault();
        }
    });
    function onMoveMouse(e) {
        handleMove(e.clientX, e.clientY);
    }
    function onUpMouse() {
        handleUp();
        window.removeEventListener("mousemove", onMoveMouse);
        window.removeEventListener("mouseup", onUpMouse);
    }
    // ============ [모바일/태블릿: 터치 DnD] ============
    playgroundEl.addEventListener("touchstart", e => {
        if (draggingImg)
            return; // 멀티터치 방지
        const touches = e.changedTouches;
        const target = e.target;
        if (target instanceof HTMLImageElement && target.hasAttribute("data-serial")) {
            draggingImg = target;
            draggingSerial = target.getAttribute("data-serial");
            // z-index 최상위로!
            const newZ = bringFigureToFront(draggingSerial);
            if (typeof newZ === "number")
                draggingImg.style.zIndex = String(newZ);
            const t = touches[0];
            draggingTouchId = t.identifier;
            startX = t.clientX;
            startY = t.clientY;
            origX = parseInt(target.style.left) || 0;
            origY = parseInt(target.style.top) || 0;
            window.addEventListener("touchmove", onMoveTouch, { passive: false });
            window.addEventListener("touchend", onUpTouch);
            window.addEventListener("touchcancel", onUpTouch);
            e.preventDefault();
        }
    });
    function onMoveTouch(e) {
        if (draggingImg == null || draggingTouchId == null)
            return;
        for (let i = 0; i < e.changedTouches.length; ++i) {
            const t = e.changedTouches[i];
            if (t.identifier === draggingTouchId) {
                handleMove(t.clientX, t.clientY);
                e.preventDefault();
                break;
            }
        }
    }
    function onUpTouch(e) {
        if (draggingImg == null || draggingTouchId == null)
            return;
        let up = false;
        for (let i = 0; i < e.changedTouches.length; ++i) {
            if (e.changedTouches[i].identifier === draggingTouchId) {
                up = true;
                break;
            }
        }
        if (up) {
            handleUp();
            window.removeEventListener("touchmove", onMoveTouch);
            window.removeEventListener("touchend", onUpTouch);
            window.removeEventListener("touchcancel", onUpTouch);
            draggingTouchId = null;
        }
    }
    // ============ [공통: move/up 처리] ============
    function handleMove(clientX, clientY) {
        if (!draggingImg || !draggingSerial)
            return;
        const dx = clientX - startX;
        const dy = clientY - startY;
        const fig = getPlaygroundFigures().find(f => f.serial === draggingSerial);
        if (!fig)
            return;
        // 실제 렌더 크기로 계산
        const { width, height } = getRenderedSize(draggingImg);
        const rect = playgroundEl.getBoundingClientRect();
        const maxX = rect.width - width;
        const maxY = rect.height - height;
        let nextX = origX + dx;
        let nextY = origY + dy;
        nextX = Math.max(0, Math.min(maxX, nextX));
        nextY = Math.max(0, Math.min(maxY, nextY));
        draggingImg.style.left = `${nextX}px`;
        draggingImg.style.top = `${nextY}px`;
        fig.x = nextX;
        fig.y = nextY;
        // 기존 겹침/이펙트 처리
        playgroundEl.querySelectorAll(".will-transform").forEach(el => el.classList.remove("will-transform"));
        playgroundEl.querySelectorAll("img[data-pending-id]").forEach(el => {
            el.removeAttribute("data-pending-id");
            el.removeAttribute("data-pending-mode");
        });
        const b = getOverlappingFigure(fig, getPlaygroundFigures());
        if (b) {
            handlePendingEffect(fig, b);
            handlePendingEffect(b, fig);
        }
    }
    function handleUp() {
        if (draggingImg && draggingSerial) {
            const figures = getPlaygroundFigures();
            const fig = figures.find(f => f.serial === draggingSerial);
            if (fig && draggingImg) {
                // 변신 타깃들 배열 생성 (자기 자신 + 겹친 상대)
                const targets = [[fig, draggingImg]];
                const other = getOverlappingFigure(fig, figures);
                if (other) {
                    const otherImg = playgroundEl.querySelector(`img[data-serial="${other.serial}"]`);
                    if (otherImg instanceof HTMLImageElement) {
                        targets.push([other, otherImg]);
                    }
                }
                // 한 번에 변신 처리
                const result = applyPendingTransformBatch(targets);
                // === [여기!] 여러 개 업데이트 ===
                for (const [figItem] of targets) {
                    renderPlayAddOrUpdateFigure(figItem);
                }
            }
        }
        draggingImg = null;
        draggingSerial = null;
        // 효과/속성 모두 제거
        playgroundEl.querySelectorAll(".will-transform").forEach(el => el.classList.remove("will-transform"));
        playgroundEl.querySelectorAll("img[data-pending-id]").forEach(el => {
            el.removeAttribute("data-pending-id");
            el.removeAttribute("data-pending-mode");
        });
    }
    // ======= [기존 겹침/효과/변신 로직들은 그대로] =======
    function handlePendingEffect(a, b) {
        const reaction = getReactionResult(a.id, a.mode, b.id, b.mode);
        if (!reaction)
            return;
        if (reaction.resultFigureId !== a.id || reaction.resultMode !== a.mode) {
            const img = playgroundEl.querySelector(`img[data-serial="${a.serial}"]`);
            img === null || img === void 0 ? void 0 : img.classList.add("will-transform");
            img === null || img === void 0 ? void 0 : img.setAttribute("data-pending-id", reaction.resultFigureId);
            img === null || img === void 0 ? void 0 : img.setAttribute("data-pending-mode", reaction.resultMode);
        }
    }
    function applyPendingTransformBatch(targets) {
        let anyUnlocked = false;
        for (const [fig, img] of targets) {
            const pendingId = img.getAttribute("data-pending-id");
            const pendingMode = img.getAttribute("data-pending-mode");
            if (pendingId && pendingMode) {
                fig.id = pendingId;
                fig.mode = pendingMode;
                const result = addOrUnlockInventoryFigure(pendingId, pendingMode);
                const invFig = getInventoryFigures().find(f => f.id === pendingId);
                if (!invFig)
                    continue;
                // === add/update 함수만 분기!
                if (result === "new-figure") {
                    renderInventoryInsertItem(invFig);
                    anyUnlocked = true;
                }
                else if (result === "new-mode") {
                    renderInventoryUpdateItem(invFig);
                    anyUnlocked = true;
                }
                // "old"는 아무것도 안 함
            }
        }
        return anyUnlocked;
    }
    function getOverlappingFigure(a, figures) {
        const aEl = document.querySelector(`img[data-serial="${a.serial}"]`);
        if (!aEl)
            return null;
        const aRect = aEl.getBoundingClientRect();
        for (const f of figures) {
            if (f.serial === a.serial)
                continue;
            const fEl = document.querySelector(`img[data-serial="${f.serial}"]`);
            if (!fEl)
                continue;
            const fRect = fEl.getBoundingClientRect();
            const isOverlapping = (aRect.left < fRect.right &&
                aRect.right > fRect.left &&
                aRect.top < fRect.bottom &&
                aRect.bottom > fRect.top);
            if (isOverlapping)
                return f;
        }
        return null;
    }
}
