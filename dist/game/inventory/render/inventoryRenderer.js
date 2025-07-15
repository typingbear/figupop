// src/game/inventory/renderInventory.ts
import { getUIState } from "../../../core/services/uiStateService.js";
import { PANEL_INVENTORY } from "../../../common/config.js";
import { enableInvToPlayDrag } from "../dnd/toPlaygroundDrag.js";
import { addInventoryGridItem, renderInventoryGrid, updateInventoryGridItem } from "./grid/inventoryGridRender.js";
import { addInventoryListItem, renderInventoryList, updateInventoryListItem } from "./list/inventoryListRender.js";
export function renderInventory() {
    // 기존 그리드/리스트 요소만 제거 (컨트롤바는 유지)
    PANEL_INVENTORY.querySelectorAll(".inventory-list,.inventory-grid").forEach(el => el.remove());
    const currentView = getUIState("inventoryView");
    if (currentView === "grid") {
        renderInventoryGrid();
    }
    else {
        renderInventoryList();
    }
    // 드래그 등록(공통)
    enableInvToPlayDrag();
}
export function renderInventoryInsertItem(invFig) {
    const currentView = getUIState("inventoryView");
    if (currentView === "grid") {
        addInventoryGridItem(invFig);
    }
    else {
        addInventoryListItem(invFig);
    }
}
export function renderInventoryUpdateItem(invFig) {
    const currentView = getUIState("inventoryView");
    if (currentView === "grid") {
        updateInventoryGridItem(invFig);
    }
    else {
        updateInventoryListItem(invFig);
    }
}
