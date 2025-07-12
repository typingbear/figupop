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
    // 1. PC/모바일: 이미지 우클릭/롱탭 저장메뉴 방지
    document.addEventListener("contextmenu", function (e) {
        if (e.target instanceof HTMLImageElement) {
            e.preventDefault();
            return false;
        }
    });
    // 2. 모바일: 이미지 롱프레스 방지 (일부 브라우저는 touchstart에 반드시 있어야함)
    document.addEventListener("touchstart", function (e) {
        if (e.target instanceof HTMLImageElement) {
            e.preventDefault();
        }
    }, { passive: false });
    // 3. (선택) 더 강력하게, touchend/touchmove에서도 막기
    document.addEventListener("touchend", function (e) {
        if (e.target instanceof HTMLImageElement) {
            e.preventDefault();
        }
    }, { passive: false });
    document.addEventListener("touchmove", function (e) {
        if (e.target instanceof HTMLImageElement) {
            e.preventDefault();
        }
    }, { passive: false });
});
