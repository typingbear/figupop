import { makeSerialKey } from "../../../common/utils.js";
import { ID_INVENTORY } from "../../../common/config.js";

/**
 * 인벤토리 썸네일에 '드래그'만 부여 (드롭은 외부에서 따로)
 */
export function enableInvToPlayDrag() {
  const root = document.getElementById(ID_INVENTORY);
  if (!root) return;

  root.addEventListener("mousedown", e => {
    const target = e.target as HTMLElement;
    if (target && target.classList.contains("draggable")) {
      const figureId = target.getAttribute("data-figure-id");
      const mode = target.getAttribute("data-mode");
      if (!figureId || !mode) return;

      // 마우스와 이미지간 offset
      const rect = target.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      target.setAttribute("draggable", "true");
      target.addEventListener("dragstart", (ev: DragEvent) => {
        if (ev.dataTransfer) {
          const serial = makeSerialKey();
          const dragData = JSON.stringify({
            figureId, mode, serial, offsetX, offsetY,
            source: "inventory"
          });
          ev.dataTransfer.setData("text/plain", dragData);
        }
      }, { once: true });
    }
  });

  root.addEventListener("dragend", e => {
    const target = e.target as HTMLElement;
    if (target && target.classList.contains("draggable")) {
      target.removeAttribute("draggable");
    }
  });
}
