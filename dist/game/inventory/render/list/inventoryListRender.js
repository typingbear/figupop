import { getFigureById } from "../../../../core/services/figureLibraryService.js";
import { createInventoryFigureThumb, getSortedInventory } from "../inventoryCommon.js";
const INVENTORY_CONTENT = document.getElementById("inventory_content");
/**
 * 인벤토리 리스트(세로/가로 스크롤) 렌더링 (컨트롤바는 그대로, 컨텐트만 바꿈)
 */
export function renderInventoryList() {
    if (!INVENTORY_CONTENT)
        return;
    // 기존 내용 지움
    INVENTORY_CONTENT.innerHTML = "";
    // 새 리스트 생성
    const list = document.createElement("ul");
    list.className = "inventory-list";
    // 데이터 얻기
    const inventory = getSortedInventory();
    inventory.forEach(invFig => {
        const fig = getFigureById(invFig.id);
        if (!fig)
            return;
        const li = document.createElement("li");
        li.className = "inventory-list-item";
        const modeBar = document.createElement("div");
        modeBar.className = "inventory-mode-bar";
        Object.keys(fig.modes).forEach(mode => {
            const isUnlocked = invFig.unlockedModes.includes(mode);
            const img = createInventoryFigureThumb({
                figure: fig,
                mode,
                unlocked: isUnlocked,
            });
            modeBar.appendChild(img);
        });
        li.appendChild(modeBar);
        list.appendChild(li);
    });
    INVENTORY_CONTENT.appendChild(list);
}
export function addInventoryListItem(figureId) {
}
export function updateInventoryListItem(figureId) {
}
