import { getInventoryFigures } from "../../../services/gameStateService.js";
import { enableInvToPlayDrag } from "../dnd/toPlaygroundDrag.js";
import { renderInventoryGrid } from "../views/inventoryGridView.js";
import { renderInventoryList } from "../views/inventoryListView.js";
import { getUIState } from "../../../services/uiStateService.js";


export function renderInventory() {
  // 1. 패널 DOM 직접 얻기
  const panel = document.querySelector("#inventory") as HTMLElement | null;
if (!panel) return;


  // 2. 현재 뷰 타입을 UI 상태 서비스에서 직접 가져옴
  const viewType = getUIState("inventoryView"); // "grid" | "list"

  // 3. 데이터 직접 얻기
  const unlockedFigures = getInventoryFigures();

  // 4. 기존 리스트/그리드 DOM 삭제
  panel.querySelectorAll(".inventory-list,.inventory-grid").forEach(el => el.remove());

  // 5. 뷰 타입에 따라 렌더링
  if (viewType === "grid") {
    renderInventoryGrid(panel, unlockedFigures);
  } else {
    renderInventoryList(panel, unlockedFigures);
  }

  // 6. 드래그 핸들러(변동된 DOM에 항상 부착)
  enableInvToPlayDrag(
    panel,
    () => getInventoryFigures()
  );
}
