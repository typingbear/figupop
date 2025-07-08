import { renderInventoryGrid } from "./views/inventoryGridView.js";
import { renderInventoryList } from "./views/inventoryListView.js";
import { getInventoryFigures } from "../../services/gameStateService.js";
import { enableInvToPlayDrag } from "./dnd/toPlaygroundDrag.js";
import { getUIState, setUIState } from "../../services/uiStateService.js";
import type { InventoryFigure } from "../../common/types.js";

export class InventoryManager {
  private group: HTMLElement | null = document.querySelector("#inventory-group");
  private toggleBtn: HTMLElement | null = document.querySelector("#inventory-toggle");
  private panel: HTMLElement | null = document.querySelector("#inventory");

  constructor() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener("click", () => this.toggle());
    }

    // 최초 상태 적용 시 transition 없이!
    this.group?.classList.add("notransition");
    this.applyUIState();
    setTimeout(() => this.group?.classList.remove("notransition"), 10);

    this.renderControlBar();
    this.renderInventory();
  }

  /** 상태값에 따라 패널 오픈/클로즈 동기화 */
  applyUIState() {
    const isOpen = getUIState("inventoryOpen");
    if (isOpen) this.group?.classList.remove("closed");
    else this.group?.classList.add("closed");
  }

  renderControlBar() {
    if (!this.panel) return;
    const exist = this.panel.querySelector(".inventory-control-bar");
    if (exist) exist.remove();

    const bar = document.createElement("div");
    bar.className = "inventory-control-bar";
    bar.style.display = "flex";
    bar.style.gap = "8px";
    bar.style.marginBottom = "12px";

    const currentView = getUIState("inventoryView");

    const gridBtn = document.createElement("button");
    gridBtn.textContent = "그리드뷰";
    gridBtn.onclick = () => { this.setView("grid"); };
    if (currentView === "grid") gridBtn.disabled = true;

    const listBtn = document.createElement("button");
    listBtn.textContent = "리스트뷰";
    listBtn.onclick = () => { this.setView("list"); };
    if (currentView === "list") listBtn.disabled = true;

    bar.appendChild(gridBtn);
    bar.appendChild(listBtn);
    this.panel.prepend(bar);
  }

  setView(view: "grid" | "list") {
    if (getUIState("inventoryView") !== view) {
      setUIState("inventoryView", view);
      this.renderControlBar();
      this.renderInventory();
    }
  }

  renderInventory() {
    if (!this.panel) return;
    this.panel.querySelectorAll(".inventory-list,.inventory-grid").forEach(el => el.remove());
    const unlockedFigures: InventoryFigure[] = getInventoryFigures();
    const currentView = getUIState("inventoryView");

    if (currentView === "grid") {
      renderInventoryGrid(this.panel, unlockedFigures);
    } else {
      renderInventoryList(this.panel, unlockedFigures);
    }

    enableInvToPlayDrag(
      this.panel,
      () => getInventoryFigures()
    );
  }

  open() {
    this.group?.classList.remove("closed");
    setUIState("inventoryOpen", true);
  }
  close() {
    this.group?.classList.add("closed");
    setUIState("inventoryOpen", false);
  }
  toggle() {
    const isOpen = !getUIState("inventoryOpen");
    if (isOpen) this.open();
    else this.close();
  }
}
