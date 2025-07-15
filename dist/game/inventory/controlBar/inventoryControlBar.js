import { getUIState } from "../../../core/services/uiStateService.js";
import { PANEL_INVENTORY } from "../../../common/config.js";
/**
 * 하드코딩된 인벤토리 컨트롤바에 상태/이벤트 바인딩만 한다
 * @param onChangeView - "grid" | "list"
 * @param onChangeSort - "recent" | "registered" | "name"
 */
export function renderInventoryControlBar(onChangeView, onChangeSort) {
    var _a, _b;
    const currentView = ((_a = getUIState("inventoryView")) !== null && _a !== void 0 ? _a : "grid");
    const currentSort = ((_b = getUIState("inventorySort")) !== null && _b !== void 0 ? _b : "recent");
    // 1. 버튼, 셀렉트, 인풋 등 기존 DOM 요소 가져오기
    const gridBtn = PANEL_INVENTORY.querySelector("#inventory-grid-btn");
    const listBtn = PANEL_INVENTORY.querySelector("#inventory-list-btn");
    const sortSelect = PANEL_INVENTORY.querySelector("#inventory-sort-select");
    const searchInput = PANEL_INVENTORY.querySelector("#inventory-search-input");
    if (!gridBtn || !listBtn || !sortSelect || !searchInput) {
        console.warn("[Inventory] Control bar DOM not found.");
        return;
    }
    // 2. 버튼 상태 및 이벤트
    gridBtn.disabled = currentView === "grid";
    listBtn.disabled = currentView === "list";
    gridBtn.onclick = () => onChangeView("grid");
    listBtn.onclick = () => onChangeView("list");
    // 3. 셀렉트 상태 및 이벤트
    Array.from(sortSelect.options).forEach(option => {
        option.selected = option.value === currentSort;
    });
    sortSelect.onchange = () => onChangeSort(sortSelect.value);
    // 4. 검색 input 바인딩 등 필요시 추가
    // searchInput.oninput = ...
}
