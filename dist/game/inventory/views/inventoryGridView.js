// src/game/inventory/renderInventoryGrid.ts
import { getFigureById } from "../../../services/figureLibraryService.js";
import { IMAGE_ROOT } from "../../../common/config.js";
import { showInventoryGridModePopover } from "./inventoryGridModePopover.js";
// 인벤토리 그리드 뷰 렌더링
export function renderInventoryGrid(container, inventory) {
    // 기존 inventory-grid만 지우기 (컨트롤바는 냅둠)
    container.querySelectorAll('.inventory-grid').forEach(el => el.remove());
    const grid = document.createElement("div");
    grid.className = "inventory-grid";
    inventory.forEach(invFig => {
        const fig = getFigureById(invFig.id);
        if (!fig)
            return;
        const src = `${IMAGE_ROOT}${fig.id}-base.png`;
        const item = document.createElement("div");
        item.className = "inventory-thumb";
        const img = document.createElement("img");
        img.src = src;
        img.alt = fig.name;
        img.style.width = "64px";
        img.style.height = "64px";
        // 해금 여부 판단 ("base" 모드가 해금된 대표 이미지)
        const isUnlocked = invFig.unlockedModes.includes("base");
        img.setAttribute("data-figure-id", fig.id);
        img.setAttribute("data-mode", "base");
        if (isUnlocked) {
            img.classList.add("draggable-inventory-thumb");
            img.draggable = true;
            img.style.cursor = "grab";
        }
        else {
            img.classList.add("locked-inventory-thumb");
            img.draggable = false;
            img.style.cursor = "not-allowed";
        }
        img.addEventListener("click", event => {
            showInventoryGridModePopover(invFig.id, img);
            event.stopPropagation();
        });
        item.appendChild(img);
        grid.appendChild(item);
    });
    container.appendChild(grid);
}
