//catalogManager.ts
import { renderCatalog } from "./render/catalogRenderer.js";
export class CatalogManager {
    constructor() {
        this.group = document.querySelector("#catalog-group");
        this.toggleBtn = document.querySelector("#catalog-toggle");
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener("click", () => this.toggle());
        }
        renderCatalog();
    }
    open() { var _a; (_a = this.group) === null || _a === void 0 ? void 0 : _a.classList.remove("closed"); }
    close() { var _a; (_a = this.group) === null || _a === void 0 ? void 0 : _a.classList.add("closed"); }
    toggle() { var _a; (_a = this.group) === null || _a === void 0 ? void 0 : _a.classList.toggle("closed"); }
}
