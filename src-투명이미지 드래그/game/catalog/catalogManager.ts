import { renderCatalog } from "./render/catalogRenderer.js"; // ← 경로는 실제 위치에 맞게 조정

export class CatalogManager {
  private group: HTMLElement | null = document.querySelector("#catalog-group");
  private toggleBtn: HTMLElement | null = document.querySelector("#catalog-toggle");

  constructor() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener("click", () => this.toggle());
    }
    renderCatalog();
  }

  open()   { this.group?.classList.remove("closed"); }
  close()  { this.group?.classList.add("closed"); }
  toggle() { this.group?.classList.toggle("closed"); }
}
