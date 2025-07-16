import { getFigureById } from "../../../../core/services/figureLibraryService.js";
import {  CLICK_FIGURE_AUDIO, PANEL_INVENTORY } from "../../../../common/config.js";
import { showInventoryGridModePopover } from "./inventoryGridModePopover.js";
import { createInventoryFigureThumb, getSortedInventory, handleInventoryThumbClick } from "../inventoryCommon.js";
import { InventoryFigure } from "../../../../common/types/game/inventoryTypes.js";
import { playSound } from "../../../../common/utils.js";
import { getInventoryFigures } from "../../../../core/services/gameStateService.js";

// 현재 열린 팝오버의 figureId 저장 (없으면 null)


const INVENTORY_CONTENT = document.getElementById("inventory_content");

/**
 * 그리드 렌더링 (Grid)
 */
export function renderInventoryGrid(filteredInventory?: InventoryFigure[]) {
  if (!INVENTORY_CONTENT) return;

  INVENTORY_CONTENT.innerHTML = ""; // 기존 내용 제거

  const grid = document.createElement("div");
  grid.className = "inventory-grid";

  // filteredInventory가 있으면 그걸, 없으면 전체를 쓴다
  const inventory = filteredInventory ?? getSortedInventory();
 inventory.forEach(invFig => {
  const fig = getFigureById(invFig.id);
  if (!fig) return;

  const currentMode = invFig.currentMode ?? "base";
  const isUnlocked = invFig.unlockedModes.includes(currentMode);

  const item = document.createElement("div");
  item.className = "inventory-grid-item";

  const img = createInventoryFigureThumb({
    figure: fig,
    mode: currentMode,
    unlocked: isUnlocked,
    onClick: (img) => handleInventoryThumbClick(invFig.id, img),
  });

  item.appendChild(img);
  grid.appendChild(item);
});


  INVENTORY_CONTENT.appendChild(grid);
}


/**
 * 리스트 렌더링 (List)
 */
export function renderInventoryList(filteredInventory?: InventoryFigure[]) {
  if (!INVENTORY_CONTENT) return;

  INVENTORY_CONTENT.innerHTML = ""; // 기존 내용 제거

  const list = document.createElement("ul");
  list.className = "inventory-list";

  // filteredInventory가 있으면 그걸, 없으면 전체를 쓴다
  const inventory = filteredInventory ?? getSortedInventory();
  inventory.forEach(invFig => {
    const fig = getFigureById(invFig.id);
    if (!fig) return;
    const li = document.createElement("li");
    li.className = "inventory-list-item";

    const modeBar = document.createElement("div");
    modeBar.className = "inventory-mode-bar";

    Object.keys(fig.modes).forEach(mode => {
      const isUnlocked = invFig.unlockedModes.includes(mode);
      const img = createInventoryFigureThumb({
        figure: fig,
        mode,
        unlocked: isUnlocked,
      });
      modeBar.appendChild(img);
    });

    li.appendChild(modeBar);
    list.appendChild(li);
  });

  INVENTORY_CONTENT.appendChild(list);
}


export function addInventoryGridItem(figureId: string) {
  const grid = PANEL_INVENTORY.querySelector(".inventory-grid") as HTMLDivElement;
  if (!grid) return;

  if (grid.querySelector(`img[data-figure-id="${figureId}"]`)) return;

  const fig = getFigureById(figureId);
  const invFig = getInventoryFigures().find(f => f.id === figureId);
  if (!fig || !invFig) return;

  const currentMode = invFig.currentMode ?? "base";
  const isUnlocked = invFig.unlockedModes.includes(currentMode);

  const item = document.createElement("div");
  item.className = "inventory-grid-item";

  const newImg = createInventoryFigureThumb({
    figure: fig,
    mode: currentMode,
    unlocked: isUnlocked,
    onClick: (img) => handleInventoryThumbClick(figureId, img),
  });

  item.appendChild(newImg);

  // ✅ 맨 앞에 추가
  grid.prepend(item);

  // ✅ 테두리 강조 애니메이션
  item.classList.add("inventory-highlight");
  setTimeout(() => {
    item.classList.remove("inventory-highlight");
  }, 1000);
}


export function updateInventoryGridItem(
  figureId: string,
  modeOverride?: string,
  highlightEffect: boolean = true
) {
  const grid = PANEL_INVENTORY.querySelector(".inventory-grid") as HTMLDivElement;
  if (!grid) return;

  const fig = getFigureById(figureId);
  const invFig = getInventoryFigures().find(f => f.id === figureId);
  if (!fig || !invFig) return;

  const currentMode = modeOverride ?? invFig.currentMode ?? "base";
  const img = grid.querySelector<HTMLImageElement>(
    `img[data-figure-id="${figureId}"][data-mode]`
  );

  if (!img) return;

  const isUnlocked = invFig.unlockedModes.includes(currentMode);
  const currentImgMode = img.getAttribute("data-mode");
  const isCurrentlyUnlocked = !img.classList.contains("locked");

  // mode 변경 or 잠금 상태 변경이 있는 경우만 교체
  if (currentImgMode === currentMode && isCurrentlyUnlocked === isUnlocked) return;

  const newImg = createInventoryFigureThumb({
    figure: fig,
    mode: currentMode,
    unlocked: isUnlocked,
    onClick: (img) => handleInventoryThumbClick(figureId, img),
  });

  const itemDiv = img.closest(".inventory-grid-item");
  img.replaceWith(newImg);

  if (highlightEffect && itemDiv) {
    itemDiv.classList.add("inventory-highlight");
    setTimeout(() => {
      itemDiv.classList.remove("inventory-highlight");
    }, 600);
  }
}
