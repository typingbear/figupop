import { getFigureById } from "../../../core/services/figureLibraryService.js";
import { ID_INVENTORY, IMAGE_ROOT, OUTLINE_IMAGE_BASE } from "../../../common/config.js";
import type { InventoryFigure } from "../../../common/types.js";
import { showInventoryGridModePopover } from "./inventoryGridModePopover.js";
import { getUIState } from "../../../core/services/uiStateService.js";
import { getSortedInventoryFigures } from "../../../core/services/gameStateCoordinator.js";
import { InventorySortType } from "../../../common/types/uiStateTypes.js";

// 인벤토리 그리드 뷰 렌더링
export function renderInventoryGrid() {
  const container = document.getElementById(ID_INVENTORY) as HTMLElement;
  if (!container) return;

  const sortType = getUIState("inventorySort") as InventorySortType;
  const inventory = getSortedInventoryFigures(sortType);

  container.querySelectorAll('.inventory-grid').forEach(el => el.remove());

  const grid = document.createElement("div");
  grid.className = "inventory-grid";

  inventory.forEach(invFig => {
    const fig = getFigureById(invFig.id);
    if (!fig) return;

    // 해금 여부 판단 ("base" 모드가 해금된 대표 이미지)
    const isUnlocked = invFig.unlockedModes.includes("base");

    // --- 해금된 경우: 일반 이미지 / 아닌 경우: outline 이미지로!
    let src: string;
    if (isUnlocked) {
      src = `${IMAGE_ROOT}${fig.id}-base.png`;
    } else {
      src = `${OUTLINE_IMAGE_BASE}${fig.id}-base-outline.png`; // outline 폴더에 outline명!
    }

    const item = document.createElement("div");
    item.className = "inventory-thumb";

    const img = document.createElement("img");
    img.src = src;
    img.alt = fig.name;

    img.setAttribute("data-figure-id", fig.id);
    img.setAttribute("data-mode", "base");

    if (isUnlocked) {
      img.classList.add("draggable-inventory-thumb");
      img.draggable = true;
    } else {
      img.classList.add("locked-inventory-thumb");
      img.draggable = false;
    }

    img.addEventListener("click", event => {
      showInventoryGridModePopover(invFig.id, img);
      event.stopPropagation();
    });

    item.appendChild(img);
    grid.appendChild(item);
  });

  container.appendChild(grid);
}
