import { getPlaygroundFigures, addOrUnlockInventoryFigure, bringFigureToFront } from "../../../core/services/gameStateService.js";
import { getReactionResult, } from "../../../core/services/figureLibraryService.js";
import { renderCatalog, renderInventory, renderPlayground } from "../../gameCommon/renderIndex.js";
import { ID_PLAYGROUND } from "../../../common/config.js";
function getRenderedSize(imgEl) {
    const rect = imgEl.getBoundingClientRect();
    return {
        width: rect.width,
        height: rect.height,
    };
}
/**
 * 플레이그라운드에서 이미지 직접 드래그-이동 (z-index도 관리)
 */
export function enablePlaygroundDnD() {
    const playgroundEl = document.getElementById(ID_PLAYGROUND);
    let draggingImg = null;
    let draggingSerial = null;
    let startX = 0, startY = 0, origX = 0, origY = 0;
    playgroundEl.addEventListener("mousedown", e => {
        const target = e.target;
        if (target instanceof HTMLImageElement && target.hasAttribute("data-serial")) {
            draggingImg = target;
            draggingSerial = target.getAttribute("data-serial");
            // ★ z-index 최상위로!
            const newZ = bringFigureToFront(draggingSerial);
            if (typeof newZ === "number") {
                draggingImg.style.zIndex = String(newZ);
            }
            startX = e.clientX;
            startY = e.clientY;
            origX = parseInt(target.style.left) || 0;
            origY = parseInt(target.style.top) || 0;
            window.addEventListener("mousemove", onMove);
            window.addEventListener("mouseup", onUp);
            e.preventDefault();
        }
    });
    function onMove(e) {
        if (!draggingImg || !draggingSerial)
            return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const playgroundEl = document.getElementById("playground");
        const fig = getPlaygroundFigures().find(f => f.serial === draggingSerial);
        if (!fig)
            return;
        // ⭐ 실제 렌더된 이미지 크기로 계산
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
    function onUp() {
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
                const restult = applyPendingTransformBatch(targets);
                if (restult) {
                    renderInventory();
                    renderCatalog();
                }
                renderPlayground();
            }
        }
        draggingImg = null;
        draggingSerial = null;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        // 효과/속성 모두 제거
        playgroundEl.querySelectorAll(".will-transform").forEach(el => el.classList.remove("will-transform"));
        playgroundEl.querySelectorAll("img[data-pending-id]").forEach(el => {
            el.removeAttribute("data-pending-id");
            el.removeAttribute("data-pending-mode");
        });
    }
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
        // 한 번이라도 새로운 언락이 있으면 true
        let anyUnlocked = false;
        for (const [fig, img] of targets) {
            const pendingId = img.getAttribute("data-pending-id");
            const pendingMode = img.getAttribute("data-pending-mode");
            if (pendingId && pendingMode) {
                fig.id = pendingId;
                fig.mode = pendingMode;
                const result = addOrUnlockInventoryFigure(pendingId, pendingMode);
                if (result !== "old") {
                    anyUnlocked = true;
                }
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
