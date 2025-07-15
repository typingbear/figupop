import { getUIState } from "../../../core/services/uiStateService.js";
import { PANEL_INVENTORY } from "../../../common/config.js";
import { renderInventoryGrid, renderInventoryList } from "../render/grid/inventoryGridRender.js";
import { searchInventoryFiguresByName } from "../../../core/services/gameStateCoordinator.js";
/**
 * 인벤토리 컨트롤바 렌더러
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
    // 4. 검색 input 바인딩 추가
    searchInput.oninput = () => {
        console.log("[Inventory] Search input changed:", searchInput.value);
        const keyword = searchInput.value.trim();
        if (!keyword) {
            // 입력 없으면 전체 인벤토리 다시 보여주기
            if (currentView === "grid")
                renderInventoryGrid();
            else
                renderInventoryList();
            return;
        }
        // 검색해서 필터링된 결과만 보여주기
        const filteredMeta = searchInventoryFiguresByName(keyword);
        // InventoryFigure만 추려서 전달 (메타필드와 혼합된 경우 아래처럼 추출)
        const filtered = filteredMeta.map(meta => ({
            id: meta.id,
            currentMode: meta.currentMode,
            unlockedModes: meta.unlockedModes,
            openedAt: meta.openedAt
        }));
        if (currentView === "grid")
            renderInventoryGrid(filtered);
        else
            renderInventoryList(filtered);
    };
}
