import { renderInventory } from "./render/inventoryRenderer.js";
import { renderInventoryControlBar } from "./controlBar/inventoryControlBar.js";
import { getUIState, setUIState } from "../../core/services/uiStateService.js";
export class InventoryManager {
    constructor() {
        var _a, _b;
        this.group = document.querySelector("#inventory-group");
        this.toggleBtn = document.querySelector("#inventory-toggle");
        // 토글 버튼
        (_a = this.toggleBtn) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => this.toggle());
        // 최초 상태 동기화 (transition 없이)
        (_b = this.group) === null || _b === void 0 ? void 0 : _b.classList.add("notransition");
        this.applyUIState();
        setTimeout(() => { var _a; return (_a = this.group) === null || _a === void 0 ? void 0 : _a.classList.remove("notransition"); }, 10);
        // 최초 렌더
        this.renderControlBar();
        renderInventory();
    }
    applyUIState() {
        var _a;
        (_a = this.group) === null || _a === void 0 ? void 0 : _a.classList.toggle("closed", !getUIState("inventoryOpen"));
    }
    /** 컨트롤바 + 소트 옵션 반영 */
    renderControlBar() {
        renderInventoryControlBar((view) => this.setView(view), // 뷰 변경
        (sort) => this.setSort(sort) // 소트 변경 추가!
        );
    }
    /** 뷰 변경 */
    setView(view) {
        if (getUIState("inventoryView") !== view) {
            setUIState("inventoryView", view);
            this.renderControlBar();
            renderInventory();
        }
    }
    setSort(sort) {
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
