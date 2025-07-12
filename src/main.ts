import { InventoryManager } from "./game/inventory/inventoryManager.js";
import { setupCatalogOverlay } from "./game/catalog/catalogManager.js";
import { InboxManager } from "./game/inbox/inboxManager.js";
import { PlaygroundManager } from "./game/playground/playgroundManager.js";
import { enableToolbox } from "./game/toolbox/toolboxMananger.js";

window.addEventListener("DOMContentLoaded", () => {
    setupCatalogOverlay();
    new InventoryManager();
    new PlaygroundManager();
    new InboxManager();
    enableToolbox();

    // 1. PC/모바일: 이미지 우클릭/롱탭 저장메뉴 방지 (최대한!)
    document.addEventListener("contextmenu", function(e) {
      if (e.target instanceof HTMLImageElement) {
        e.preventDefault();
        return false;
      }
    });

    // 2. (옵션) iOS 일부 버전에서 callout 막기용 - 터치 클릭/드래그에 영향 없도록 CSS 병행 권장
    // document.addEventListener("touchstart", function(e) {
    //   if (e.target instanceof HTMLImageElement) {
    //     // e.preventDefault(); // ← 이 줄은 주석! (드래그/클릭이 필요하므로)
    //   }
    // }, { passive: false });
});
