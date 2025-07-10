import { getFigureById } from "../../../core/services/figureLibraryService.js";
import { ID_INVENTORY, IMAGE_ROOT, OUTLINE_IMAGE_BASE } from "../../../common/config.js";
import { getUIState } from "../../../core/services/uiStateService.js";
import { getSortedInventoryFigures } from "../../../core/services/gameStateCoordinator.js";
import { InventorySortType } from "../../../common/types/uiStateTypes.js";

// 인벤토리 리스트(세로/가로 스크롤) 렌더
export function renderInventoryList() {
  const container = document.getElementById(ID_INVENTORY) as HTMLElement;
  if (!container) return;

  const sortType = getUIState("inventorySort") as InventorySortType;
  const inventory = getSortedInventoryFigures(sortType);
  container.querySelectorAll('.inventory-list').forEach(el => el.remove());

  const list = document.createElement("ul");
  list.className = "inventory-list";

  inventory.forEach(invFig => {
    const fig = getFigureById(invFig.id);
    if (!fig) return;

    const li = document.createElement("li");
    li.className = "inventory-list-item";

    // 모드별 썸네일 가로 스크롤
    const modeBar = document.createElement("div");
    modeBar.className = "inventory-mode-bar";

    Object.keys(fig.modes).forEach(mode => {
      const isUnlocked = invFig.unlockedModes.includes(mode);

      const modeImg = document.createElement("img");
      // --- 해금 여부에 따라 이미지 경로 분기 ---
      if (isUnlocked) {
        modeImg.src = `${IMAGE_ROOT}${fig.id}-${mode}.png`;
      } else {
        modeImg.src = `${OUTLINE_IMAGE_BASE}${fig.id}-${mode}-outline.png`;
      }

      modeImg.alt = `${fig.name} (${mode})`;
      modeImg.className = "mode-thumb";
      modeImg.setAttribute("data-figure-id", fig.id);
      modeImg.setAttribute("data-mode", mode);

      if (isUnlocked) {
        modeImg.classList.add("draggable-inventory-thumb");
        modeImg.draggable = true;
      } else {
        modeImg.classList.add("locked");
        modeImg.draggable = false;
      }
      modeBar.appendChild(modeImg);
    });

    li.appendChild(modeBar);
    list.appendChild(li);
  });

  container.appendChild(list);
}
