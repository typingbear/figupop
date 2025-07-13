// src/game/inventory/views/inventoryControlBarView.ts
import { getUIState } from "../../../core/services/uiStateService.js";
import type { InventorySortType } from "../../../common/types/uiStateTypes.js";

/**
 * 인벤토리 컨트롤바(뷰+소트)
 * @param onChangeView - "grid" | "list"
 * @param onChangeSort - "recent" | "registered" | "name"
 */export function renderInventoryControlBar(
  onChangeView: (view: "grid" | "list") => void,
  onChangeSort: (sort: InventorySortType) => void
) {
  const panel = document.getElementById("inventory");
  if (!panel) return;

  const currentView = (getUIState("inventoryView") ?? "grid") as "grid" | "list";
  const currentSort = (getUIState("inventorySort") ?? "recent") as InventorySortType;

  panel.querySelector(".inventory-control-bar")?.remove();

  const bar = document.createElement("div");
  bar.className = "inventory-control-bar";

  // Grid/List 버튼
  ["grid", "list"].forEach(view => {
    const btn = document.createElement("button");
    btn.className = "inventory-toggle-btn";
    btn.textContent = view[0].toUpperCase() + view.slice(1);
    btn.onclick = () => onChangeView(view as "grid" | "list");
    btn.disabled = currentView === view;
    bar.appendChild(btn);
  });

  // 구분선(선택)
  const divider = document.createElement("span");
  divider.style.display = "inline-block";
  divider.style.width = "2px";
  bar.appendChild(divider);

  // Sort 드롭다운
  const select = document.createElement("select");
  select.className = "inventory-sort-select";
  [
    { label: "Recent", value: "recent" },
    { label: "Registered", value: "registered" },
    { label: "Name", value: "name" }
  ].forEach(opt => {
    const option = document.createElement("option");
    option.value = opt.value;
    option.textContent = opt.label;
    if (currentSort === opt.value) option.selected = true;
    select.appendChild(option);
  });
  select.onchange = () => onChangeSort(select.value as InventorySortType);
  bar.appendChild(select);

  panel.prepend(bar);
}
