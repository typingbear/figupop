import { getFigureById } from "../../../core/services/figureLibraryService.js";
import { ID_INVENTORY } from "../../../common/config.js";
import { showInventoryGridModePopover } from "./inventoryGridModePopover.js";
import { createFigureThumb } from "../../../core/images/imageHandler.js";
import { getSortedInventory } from "./inventoryViewCommon.js";
export function renderInventoryGrid() {
    const container = document.getElementById(ID_INVENTORY);
    if (!container)
        return;
    // 기존 그리드 삭제
    container.querySelectorAll('.inventory-grid').forEach(el => el.remove());
    // 새 그리드 생성
    const grid = document.createElement("div");
    grid.className = "inventory-grid";
    // 정렬된 인벤토리 데이터
    const inventory = getSortedInventory();
    inventory.forEach(invFig => {
        const fig = getFigureById(invFig.id);
        if (!fig)
            return;
        const isUnlocked = invFig.unlockedModes.includes("base");
        const item = document.createElement("div");
        const img = createFigureThumb({
            id: fig.id,
            mode: "base",
            unlocked: isUnlocked,
            name: fig.name,
            onClick: (img) => showInventoryGridModePopover(invFig.id, img),
            outline: true,
            draggable: true
        });
        item.appendChild(img);
        grid.appendChild(item);
    });
    container.appendChild(grid);
}
