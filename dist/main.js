import { InventoryManager } from "./game/inventory/inventoryManager.js";
import { CatalogManager } from "./game/catalog/catalogManager.js";
import { InboxManager } from "./game/inbox/inboxManager.js";
import { PlaygroundManager } from "./game/playground/playgroundManager.js"; // ★ 추가!
import { injectPlaygroundDevArea } from './dev/devNav.js';
import { enableToolbox } from "./game/toolbox/toolboxMananger.js";
const catalogManager = new CatalogManager();
const inventoryManager = new InventoryManager();
const inboxManager = new InboxManager();
const playgroundManager = new PlaygroundManager();
enableToolbox();
if (true) { // 개발용 조건. 나중에 false로 바꾸면 안 보임!
    injectPlaygroundDevArea();
}
