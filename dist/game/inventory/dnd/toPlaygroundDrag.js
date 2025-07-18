import { makeSerialKey, playSound } from "../../../common/utils.js";
import { DRAG_FIGURE_AUDIO, ID_PLAYGROUND, PANEL_INVENTORY } from "../../../common/config.js";
/**
 * 인벤토리 썸네일에 드래그 부여 (마우스+터치)
 */
export function enableInvToPlayDrag() {
    // === 1. 마우스 Drag & Drop (HTML5) ===
    PANEL_INVENTORY.addEventListener("mousedown", e => {
        const target = e.target;
        if (!(target instanceof HTMLElement))
            return;
        if (!target.classList.contains("draggable"))
            return;
        const figureId = target.getAttribute("data-figure-id");
        const mode = target.getAttribute("data-mode");
        if (!figureId || !mode)
            return;
        playSound(DRAG_FIGURE_AUDIO);
        // offset 계산
        const rect = target.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        target.setAttribute("draggable", "true");
        target.addEventListener("dragstart", (ev) => {
            if (ev.dataTransfer) {
                const serial = makeSerialKey();
                const dragData = JSON.stringify({
                    figureId, mode, serial, offsetX, offsetY,
                    source: "inventory"
                });
                ev.dataTransfer.setData("text/plain", dragData);
                // 썸네일 이미지를 투명 배경으로 복제해서 드래그 프리뷰로 지정
                const dragImg = target.cloneNode(true);
                dragImg.style.width = rect.width + "px";
                dragImg.style.height = rect.height + "px";
                dragImg.style.background = "transparent";
                dragImg.style.boxShadow = "none";
                dragImg.style.border = "none";
                dragImg.style.outline = "none";
                dragImg.style.position = "absolute";
                dragImg.style.left = "-9999px";
                document.body.appendChild(dragImg);
                ev.dataTransfer.setDragImage(dragImg, offsetX, offsetY);
                setTimeout(() => document.body.removeChild(dragImg), 0);
            }
        }, { once: true });
    });
    PANEL_INVENTORY.addEventListener("dragend", e => {
        const target = e.target;
        if (target instanceof HTMLElement && target.classList.contains("draggable")) {
            target.removeAttribute("draggable");
        }
    });
    // === 2. 터치 Drag(커스텀) ===
    PANEL_INVENTORY.addEventListener("touchstart", e => {
        const target = e.target;
        if (!(target instanceof HTMLImageElement))
            return; // ★ img 태그만 허용
        const figureId = target.getAttribute("data-figure-id");
        const mode = target.getAttribute("data-mode");
        if (!figureId || !mode)
            return;
        const rect = target.getBoundingClientRect();
        const touch = e.touches[0];
        const offsetX = touch.clientX - rect.left;
        const offsetY = touch.clientY - rect.top;
        // img 태그만 복제
        const ghost = target.cloneNode(true);
        ghost.classList.add("ghost-drag-img");
        ghost.style.width = rect.width + "px";
        ghost.style.height = rect.height + "px";
        ghost.style.left = `${touch.clientX - offsetX}px`;
        ghost.style.top = `${touch.clientY - offsetY}px`;
        ghost.style.borderRadius = getComputedStyle(target).borderRadius;
        document.body.appendChild(ghost);
        function onTouchMove(ev) {
            const t = ev.touches[0];
            ghost.style.left = `${t.clientX - offsetX}px`;
            ghost.style.top = `${t.clientY - offsetY}px`;
            ev.preventDefault();
        }
        function onTouchEnd(ev) {
            document.body.removeChild(ghost);
            document.removeEventListener("touchmove", onTouchMove);
            document.removeEventListener("touchend", onTouchEnd);
            // 1️⃣ 손가락 위치 구하기
            const t = ev.changedTouches[0];
            const playground = document.getElementById(ID_PLAYGROUND);
            if (playground) {
                const rect = playground.getBoundingClientRect();
                if (t.clientX >= rect.left && t.clientX <= rect.right &&
                    t.clientY >= rect.top && t.clientY <= rect.bottom) {
                    // 2️⃣ "즉시" drop 함수 직접 호출!
                    if (typeof window.__playgroundTouchDrop === "function") {
                        window.__playgroundTouchDrop({
                            figureId, mode, serial: makeSerialKey(), offsetX, offsetY, source: "inventory"
                        }, t.clientX, t.clientY, offsetX, offsetY, ghost);
                    }
                }
            }
        }
        document.addEventListener("touchmove", onTouchMove, { passive: false });
        document.addEventListener("touchend", onTouchEnd);
    });
}
