import { getFigureById } from "../../../core/services/figureLibraryService.js";
import { ID_INVENTORY } from "../../../common/config.js";
import { createFigureThumb } from "../../../core/images/imageHandler.js";
import { getSortedInventory } from "./inventoryViewCommon.js";



// 인벤토리 리스트(세로/가로 스크롤) 렌더링
export function renderInventoryList() {
  const container = document.getElementById(ID_INVENTORY) as HTMLElement;
  if (!container) return;

  // 기존 리스트 삭제
  container.querySelectorAll('.inventory-list').forEach(el => el.remove());

  // 새 리스트 생성
  const list = document.createElement("ul");
  list.className = "inventory-list";

  // 데이터 얻기
  const inventory = getSortedInventory();
  inventory.forEach(invFig => {
    const fig = getFigureById(invFig.id);
    if (!fig) return;
    const li = document.createElement("li");
    li.className = "inventory-list-item";

    const modeBar = document.createElement("div");
    modeBar.className = "inventory-mode-bar";

    Object.keys(fig.modes).forEach(mode => {
      const isUnlocked = invFig.unlockedModes.includes(mode);
      const img = createFigureThumb({
        id: fig.id,
        mode,
        unlocked: isUnlocked,
        name: fig.name,
        outline: true,
            draggable:true
      });
      modeBar.appendChild(img);
    });

    li.appendChild(modeBar);
    list.appendChild(li);
  });

  container.appendChild(list);
}
