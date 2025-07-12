// src/game/inventory/renderInventory.ts
import { getUIState } from "../../../core/services/uiStateService.js";
import { ID_INVENTORY } from "../../../common/config.js";
import { enableInvToPlayDrag } from "../dnd/toPlaygroundDrag.js";
import { addInventoryGridItem,  renderInventoryGrid, updateInventoryGridItem } from "./inventoryGridView.js";
import { addInventoryListItem,  renderInventoryList, updateInventoryListItem } from "./inventoryListView.js";
import { InventoryFigure } from "../../../common/types.js";

export function renderInventory() {
  const panel = document.getElementById(ID_INVENTORY);
  if (!panel) return;
  // 기존 그리드/리스트 요소만 제거 (컨트롤바는 유지)
  panel.querySelectorAll(".inventory-list,.inventory-grid").forEach(el => el.remove());

  const currentView = getUIState("inventoryView");
  if (currentView === "grid") {
    renderInventoryGrid();
  } else {
    renderInventoryList();
  }

  // 드래그 등록(공통)
  enableInvToPlayDrag();
}

export function renderInventoryInsertItem(invFig: InventoryFigure) {
  const currentView = getUIState("inventoryView");
  if (currentView === "grid") {
    addInventoryGridItem(invFig);
  } else {
    addInventoryListItem(invFig);
  }
}

export function renderInventoryUpdateItem(invFig: InventoryFigure) {
  const currentView = getUIState("inventoryView");
  if (currentView === "grid") {
    updateInventoryGridItem( invFig);
  } else {
    updateInventoryListItem(invFig);
  }
}
