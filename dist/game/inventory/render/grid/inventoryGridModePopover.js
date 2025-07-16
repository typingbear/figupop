import { getFigureById } from "../../../../core/services/figureLibraryService.js";
import { getUnlockedModes, setCurrentMode } from "../../../../core/services/gameStateService.js";
import { makeSerialKey, playSound } from "../../../../common/utils.js";
import { createInventoryFigureThumb } from "../inventoryCommon.js";
import { DRAG_FIGURE_AUDIO } from "../../../../common/config.js";
import { renderInventoryUpdateItem } from "../inventoryRenderer.js";
/**
 * 인벤토리 그리드에서 피규어의 모드 선택 팝오버를 띄움
 */
export function showInventoryGridModePopover(figureId, anchorElement) {
    // 기존 팝오버 제거
    document.querySelectorAll(".inventory-mode-dialog").forEach(e => e.remove());
    const figure = getFigureById(figureId);
    if (!figure)
        return;
    const unlockedModes = getUnlockedModes(figureId);
    // 팝오버 DOM 생성
    const dialog = document.createElement("div");
    dialog.className = "inventory-mode-dialog";
    Object.keys(figure.modes).forEach(modeName => {
        const isUnlocked = unlockedModes.includes(modeName);
        const img = createInventoryFigureThumb({
            figure,
            mode: modeName,
            unlocked: isUnlocked,
        });
        if (isUnlocked) {
            img.addEventListener("click", () => {
                setCurrentMode(figureId, modeName);
                playSound(DRAG_FIGURE_AUDIO);
                dialog.remove();
                renderInventoryUpdateItem(figureId, modeName, false);
            });
            // 드래그 처리
            img.addEventListener("dragstart", ev => {
                if (ev.dataTransfer) {
                    const rect = img.getBoundingClientRect();
                    const offsetX = ev.clientX - rect.left;
                    const offsetY = ev.clientY - rect.top;
                    const dragData = JSON.stringify({
                        figureId: figure.id,
                        mode: modeName,
                        serial: makeSerialKey(),
                        offsetX,
                        offsetY,
                        rectW: rect.width,
                        rectH: rect.height,
                        source: "inventory"
                    });
                    ev.dataTransfer.setData("text/plain", dragData);
                }
            });
        }
        dialog.appendChild(img);
    });
    // 팝오버 위치 계산
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
        if (left < margin)
            left = margin;
    }
    if (top + dialogHeight + margin > vh) {
        top = rect.top + window.scrollY - dialogHeight - margin;
        if (top < margin)
            top = margin;
    }
    dialog.style.left = `${left}px`;
    dialog.style.top = `${top}px`;
    dialog.style.visibility = "visible";
    // 외부 클릭 시 팝오버 제거
    setTimeout(() => {
        function handler(e) {
            if (!dialog.contains(e.target)) {
                dialog.remove();
                document.removeEventListener("mousedown", handler);
            }
        }
        document.addEventListener("mousedown", handler);
    }, 10);
}
