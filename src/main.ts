import { InventoryManager } from "./game/inventory/inventoryManager.js";
import { setupCatalogOverlay } from "./game/catalog/catalogManager.js";
import { InboxManager } from "./game/inbox/inboxManager.js";
import { PlaygroundManager } from "./game/playground/playgroundManager.js"; // ★ 추가!
import { enableToolbox } from "./game/toolbox/toolboxMananger.js";
// import { injectPlaygroundDevArea } from './dev/devNav.js';

// const catalogManager = new CatalogManager();
// const inboxManager = new InboxManager();
// enableToolbox();
// if (true) { // 개발용 조건. 나중에 false로 바꾸면 안 보임!
//   injectPlaygroundDevArea();
//}
window.addEventListener("DOMContentLoaded", () => {
    setupCatalogOverlay();
    new InventoryManager();
    new PlaygroundManager();
    new InboxManager();
    enableToolbox();
});
