import { getFigureById } from "../../../services/figureLibraryService.js";   // 서비스 객체 대신 유틸!
import { IMAGE_ROOT } from "../../../common/config.js";
import type { InventoryFigure } from "../../../common/types.js";

// 인벤토리 리스트(세로/가로 스크롤) 렌더
export function renderInventoryList(container: HTMLElement, inventory: InventoryFigure[]) {
  // 기존 리스트만 삭제 (컨트롤바는 냅둠)
  container.querySelectorAll('.inventory-list').forEach(el => el.remove());

  const list = document.createElement("ul");
  list.className = "inventory-list";

  inventory.forEach(invFig => {
    const fig = getFigureById(invFig.id);    // 유틸만 사용!
    if (!fig) return;

    const li = document.createElement("li");
    li.className = "inventory-list-item";

    // 모드별 썸네일 가로 스크롤
    const modeBar = document.createElement("div");
    modeBar.className = "inventory-mode-bar";

    Object.keys(fig.modes).forEach(mode => {
      const modeImg = document.createElement("img");
      modeImg.src = `${IMAGE_ROOT}${fig.id}-${mode}.png`;
      modeImg.alt = `${fig.name} (${mode})`;
      modeImg.className = "mode-thumb";

      // 속성 부여
      modeImg.setAttribute("data-figure-id", fig.id);
      modeImg.setAttribute("data-mode", mode);

      if (invFig.unlockedModes.includes(mode)) {
        modeImg.classList.add("draggable-inventory-thumb");
        modeImg.draggable = true;
        modeImg.style.cursor = "grab";
      } else {
        modeImg.classList.add("locked");
        modeImg.draggable = false;
        modeImg.style.cursor = "not-allowed";
      }
      modeBar.appendChild(modeImg);
    });

    li.appendChild(modeBar);
    list.appendChild(li);
  });

  container.appendChild(list);
}
