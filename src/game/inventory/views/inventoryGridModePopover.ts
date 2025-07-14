import { getFigureById } from "../../../core/services/figureLibraryService.js";
import { getUnlockedModes } from "../../../core/services/gameStateService.js";
import { makeSerialKey } from "../../../common/utils.js";
import { createInventoryFigureThumb } from "../../../core/images/imageHandler.js";

/**
 * 인벤토리 그리드에서 피규어의 모드 선택 팝오버를 띄움
 */
export function showInventoryGridModePopover(figureId: string, anchorElement: HTMLElement) {
  document.querySelectorAll(".inventory-mode-dialog").forEach(e => e.remove());

  const figure = getFigureById(figureId);
  if (!figure) return;

  const unlockedModes = getUnlockedModes(figureId);

  const dialog = document.createElement("div");
  dialog.className = "inventory-mode-dialog";

  Object.keys(figure.modes).forEach(modeName => {
    const isUnlocked = unlockedModes.includes(modeName);
    const img = createInventoryFigureThumb({
      figure: figure,
      mode: modeName,
      unlocked: isUnlocked,
    });

    // 팝오버에서는 dragstart만 따로 추가
    if (isUnlocked) {
      img.addEventListener("dragstart", ev => {
        if (ev.dataTransfer) {
          const dragData = JSON.stringify({
            figureId: figure.id,
            mode: modeName,
            serial: makeSerialKey()
          });
          ev.dataTransfer.setData("text/plain", dragData);
        }
      });
    }
    dialog.appendChild(img);
  });

  // 이하 위치/표시, 외부 클릭 닫기 등은 이전과 동일
  dialog.style.position = "absolute";
  dialog.style.visibility = "hidden";
  document.body.appendChild(dialog);

  const rect = anchorElement.getBoundingClientRect();
  const dialogWidth = dialog.offsetWidth;
  const dialogHeight = dialog.offsetHeight;
  const margin = 12;
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;

  let left = rect.left + window.scrollX;
  let top = rect.bottom + window.scrollY + 6;

  if (left + dialogWidth + margin > vw) {
    left = vw - dialogWidth - margin;
    if (left < margin) left = margin;
  }
  if (top + dialogHeight + margin > vh) {
    top = rect.top + window.scrollY - dialogHeight - margin;
    if (top < margin) top = margin;
  }

  dialog.style.left = `${left}px`;
  dialog.style.top = `${top}px`;
  dialog.style.visibility = "visible";

  setTimeout(() => {
    function handler(e: MouseEvent) {
      if (!dialog.contains(e.target as Node)) {
        dialog.remove();
        document.removeEventListener("mousedown", handler);
      }
    }
    document.addEventListener("mousedown", handler);
  }, 10);
}
