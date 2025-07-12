import { InventoryManager } from "./game/inventory/inventoryManager.js";
import { setupCatalogOverlay } from "./game/catalog/catalogManager.js";
import { InboxManager } from "./game/inbox/inboxManager.js";
import { PlaygroundManager } from "./game/playground/playgroundManager.js"; // ★ 추가!
import { enableToolbox } from "./game/toolbox/toolboxMananger.js";

window.addEventListener("DOMContentLoaded", () => {
    setupCatalogOverlay();
    new InventoryManager();
    new PlaygroundManager();
    new InboxManager();
    enableToolbox();
      // === 이미지 길게 눌러도 저장 메뉴 안 뜨게 하기 ===
    document.addEventListener("contextmenu", function(e) {
      if (e.target instanceof HTMLImageElement) {
        e.preventDefault();
      }
    });
});
