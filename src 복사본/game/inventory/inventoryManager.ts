import { renderInventory } from "./render/inventoryRenderer.js";
import { renderInventoryControlBar } from "./controlBar/inventoryControlBar.js";
import { getUIState, setUIState } from "../../core/services/uiStateService.js";
import { InventorySortType } from "../../common/types/storage/uiStateTypes.js";

export class InventoryManager {
  private group = document.querySelector("#inventory-group");
  private toggleBtn = document.querySelector("#inventory-toggle");

  constructor() {
    // 토글 버튼
    this.toggleBtn?.addEventListener("click", () => this.toggle());

    // 최초 상태 동기화 (transition 없이)
    this.group?.classList.add("notransition");
    this.applyUIState();
    setTimeout(() => this.group?.classList.remove("notransition"), 10);

    // 최초 렌더
    this.renderControlBar();
    renderInventory();
  }

  applyUIState() {
    this.group?.classList.toggle("closed", !getUIState("inventoryOpen"));
  }

  /** 컨트롤바 + 소트 옵션 반영 */
  renderControlBar() {
    renderInventoryControlBar(
      (view) => this.setView(view),         // 뷰 변경
      (sort) => this.setSort(sort)          // 소트 변경 추가!
    );
  }

  /** 뷰 변경 */
  setView(view: "grid" | "list") {
    if (getUIState("inventoryView") !== view) {
      setUIState("inventoryView", view);
      this.renderControlBar();
      renderInventory();
    }
  }

setSort(sort: InventorySortType) {
  if (getUIState("inventorySort") !== sort) {
    setUIState("inventorySort", sort);
    this.renderControlBar();
    renderInventory();
  }
}
  open() {
    setUIState("inventoryOpen", true);
    this.applyUIState();
  }
  close() {
    setUIState("inventoryOpen", false);
    this.applyUIState();
  }
  toggle() {
    setUIState("inventoryOpen", !getUIState("inventoryOpen"));
    this.applyUIState();
  }
}
