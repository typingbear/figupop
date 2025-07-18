import { getSortedInventoryFigures } from "../../../core/services/gameStateCoordinator.js";
import { getUIState } from "../../../core/services/uiStateService.js";
import { IMAGE_ROOT, OUTLINE_IMAGE_BASE } from "../../../common/config.js";
import { showInventoryGridModePopover } from "./grid/inventoryGridModePopover.js";
export function getSortedInventory() {
    const sortType = getUIState("inventorySort");
    return getSortedInventoryFigures(sortType);
}
/**
 * 피규어 썸네일 이미지(모든 뷰 공용) 생성
 * - 항상 .thumb-img 사용 (상태는 .draggable, .locked로 구분)
 */
export function createInventoryFigureThumb({ figure, mode, unlocked, onClick, }) {
    const { id, name } = figure;
    const img = document.createElement("img");
    img.className = "thumb-img  inventory-thumb";
    if (mode === "base") {
        img.classList.add("base-mode");
    }
    if (!unlocked) {
        img.src = `${OUTLINE_IMAGE_BASE}${id}-${mode}-outline.png`;
        img.classList.add("locked");
    }
    else {
        img.src = `${IMAGE_ROOT}${id}-${mode}.png`;
    }
    img.draggable = true; // 브라우저 드래그 기능 켜기
    img.classList.add("draggable"); // 커서 등 체감 효과도 위해 클래스도 추가
    img.alt = `${name} (${mode})`;
    img.setAttribute("data-figure-id", id);
    img.setAttribute("data-mode", mode);
    if (onClick) {
        img.addEventListener("click", e => {
            onClick(img);
            e.stopPropagation();
        });
    }
    return img;
}
let currentPopoverFigureId = null;
export function handleInventoryThumbClick(figureId, img) {
    // 기존 팝오버를 모두 닫음
    document.querySelectorAll('.inventory-mode-dialog').forEach(e => e.remove());
    // 이미 같은 피규어의 팝오버가 열려 있었으면 닫고 return
    if (currentPopoverFigureId === figureId) {
        currentPopoverFigureId = null;
        return;
    }
    // 새로 열기
    showInventoryGridModePopover(figureId, img);
    currentPopoverFigureId = figureId;
}
