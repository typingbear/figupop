import { getFigureById } from "../../../core/services/figureLibraryService.js";
import { ID_INVENTORY } from "../../../common/config.js";
import { createFigureThumb } from "../../../core/images/imageHandler.js";
import { getSortedInventory } from "../views/inventoryViewCommon.js";
import { InventoryFigure } from "../../../common/types.js";



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


export function addInventoryListItem(invFig: InventoryFigure) {
  const container = document.getElementById(ID_INVENTORY) as HTMLElement;
  if (!container) return;
  const list = container.querySelector(".inventory-list") as HTMLUListElement;
  if (!list) return;

  // 이미 해당 피규어의 썸네일이 존재하면 추가하지 않음
  if (list.querySelector(`img[data-figure-id="${invFig.id}"]`)) return;

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
      draggable: true,
    });
    modeBar.appendChild(img);
  });

  li.appendChild(modeBar);
  list.appendChild(li);
}


export function updateInventoryListItem(invFig: InventoryFigure) {
  const container = document.getElementById(ID_INVENTORY) as HTMLElement;
  if (!container) return;
  const list = container.querySelector(".inventory-list") as HTMLUListElement;
  if (!list) return;

  // 이 피규어의 모든 썸네일 img들
  const imgs = list.querySelectorAll<HTMLImageElement>(`img[data-figure-id="${invFig.id}"]`);
  if (!imgs.length) return;

  const fig = getFigureById(invFig.id);
  if (!fig) return;

  imgs.forEach(oldImg => {
    const mode = oldImg.getAttribute("data-mode")!;
    const isUnlocked = invFig.unlockedModes.includes(mode);

    // 새 썸네일 생성 (기존 클릭/드래그/locked 등 완전 동일하게)
    const newImg = createFigureThumb({
      id: fig.id,
      mode,
      unlocked: isUnlocked,
      name: fig.name,
      outline: true,
      draggable: true,
    });

    // 실제로 img 교체
    oldImg.replaceWith(newImg);
  });
}
