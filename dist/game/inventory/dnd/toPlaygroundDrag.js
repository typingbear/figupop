import { makeSerialKey } from "../../../common/utils.js";
import { ID_INVENTORY } from "../../../common/config.js";
/**
 * 인벤토리 썸네일에 드래그 부여 (마우스+터치)
 */
export function enableInvToPlayDrag() {
    const root = document.getElementById(ID_INVENTORY);
    if (!root)
        return;
    // === 1. 마우스 Drag & Drop (HTML5) ===
    root.addEventListener("mousedown", e => {
        const target = e.target;
        if (!(target instanceof HTMLElement))
            return;
        if (!target.classList.contains("draggable"))
            return;
        const figureId = target.getAttribute("data-figure-id");
        const mode = target.getAttribute("data-mode");
        if (!figureId || !mode)
            return;
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
            }
        }, { once: true });
    });
    root.addEventListener("dragend", e => {
        const target = e.target;
        if (target instanceof HTMLElement && target.classList.contains("draggable")) {
            target.removeAttribute("draggable");
        }
    });
    // === 2. 터치 Drag(커스텀) ===
    root.addEventListener("touchstart", e => {
        const target = e.target;
        if (!(target instanceof HTMLElement))
            return;
        if (!target.classList.contains("draggable"))
            return;
        const figureId = target.getAttribute("data-figure-id");
        const mode = target.getAttribute("data-mode");
        if (!figureId || !mode)
            return;
        const rect = target.getBoundingClientRect();
        const touch = e.touches[0];
        const offsetX = touch.clientX - rect.left;
        const offsetY = touch.clientY - rect.top;
        // 1) 썸네일 복제(가짜 드래그용)
        const ghost = target.cloneNode(true);
        if (!(ghost instanceof HTMLElement))
            return;
        ghost.style.position = "fixed";
        ghost.style.left = `${touch.clientX - offsetX}px`;
        ghost.style.top = `${touch.clientY - offsetY}px`;
        ghost.style.pointerEvents = "none";
        ghost.style.opacity = "0.7";
        ghost.style.zIndex = "9999";
        document.body.appendChild(ghost);
        // 2) 드래그 이동
        function onTouchMove(ev) {
            const t = ev.touches[0];
            ghost.style.left = `${t.clientX - offsetX}px`;
            ghost.style.top = `${t.clientY - offsetY}px`;
            ev.preventDefault();
        }
        // 3) 드래그 끝 (드롭 처리 등)
        function onTouchEnd(ev) {
            document.body.removeChild(ghost);
            // 플레이그라운드 영역에 투하 판단/추가는 여기서!
            document.removeEventListener("touchmove", onTouchMove);
            document.removeEventListener("touchend", onTouchEnd);
        }
        document.addEventListener("touchmove", onTouchMove, { passive: false });
        document.addEventListener("touchend", onTouchEnd);
    });
}
