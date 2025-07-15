import { getFigureById } from "../../../../core/services/figureLibraryService.js";
import {  CLICK_FIGURE_AUDIO, PANEL_INVENTORY } from "../../../../common/config.js";
import { showInventoryGridModePopover } from "./inventoryGridModePopover.js";
import { createInventoryFigureThumb, getSortedInventory } from "../inventoryCommon.js";
import { InventoryFigure } from "../../../../common/types/game/inventoryTypes.js";
import { playSound } from "../../../../common/utils.js";

// 현재 열린 팝오버의 figureId 저장 (없으면 null)

let currentPopoverFigureId: string | null = null;

function handleThumbClick(figureId: string, img: HTMLImageElement) {
  // 기존 팝오버를 모두 닫음
  document.querySelectorAll('.inventory-mode-dialog').forEach(e => e.remove());
    

  // 이미 같은 피규어의 팝오버가 열려 있었으면 닫고 return
  if (currentPopoverFigureId === figureId) {
    currentPopoverFigureId = null;
    return;
  }

  // 새로 열기
  showInventoryGridModePopover(figureId, img);
  currentPopoverFigureId = figureId;
}

const INVENTORY_CONTENT = document.getElementById("inventory_content");

/**
 * 그리드 렌더링 (Grid)
 */
export function renderInventoryGrid() {
  if (!INVENTORY_CONTENT) return;

  INVENTORY_CONTENT.innerHTML = ""; // 기존 내용 제거

  const grid = document.createElement("div");
  grid.className = "inventory-grid";

  const inventory = getSortedInventory();
  inventory.forEach(invFig => {
    const fig = getFigureById(invFig.id);
    if (!fig) return;

    const isUnlocked = invFig.unlockedModes.includes("base");
    const item = document.createElement("div");
    item.className = "inventory-grid-item";

    const img = createInventoryFigureThumb({
      figure: fig,
      mode: "base",
      unlocked: isUnlocked,
      onClick: (img) => handleThumbClick(invFig.id, img),
    });

    item.appendChild(img);
    grid.appendChild(item);
  });

  INVENTORY_CONTENT.appendChild(grid);
}

/**
 * 리스트 렌더링 (List)
 */
export function renderInventoryList() {
  if (!INVENTORY_CONTENT) return;

  INVENTORY_CONTENT.innerHTML = ""; // 기존 내용 제거

  const list = document.createElement("ul");
  list.className = "inventory-list";

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

export function addInventoryGridItem(invFig: InventoryFigure) {

  const grid = PANEL_INVENTORY.querySelector(".inventory-grid") as HTMLDivElement;
  if (!grid) return;

  // 이미 해당 피규어 썸네일이 존재하면 추가하지 않음
  if (grid.querySelector(`img[data-figure-id="${invFig.id}"]`)) return;

  const fig = getFigureById(invFig.id);
  if (!fig) return;

  const isUnlocked = invFig.unlockedModes.includes("base");

  // 1칸: div (item)
  const item = document.createElement("div");
  item.className = "inventory-grid-item";
  // 굳이 data-id는 안 붙여도 OK (img로 찾을 수 있으니)

  // 썸네일
  const newImg = createInventoryFigureThumb({
    figure: fig,
    mode: "base",
    unlocked: isUnlocked,
    onClick: (img) => handleThumbClick(invFig.id, img),
  });

  item.appendChild(newImg);
  grid.appendChild(item);
}
export function updateInventoryGridItem(invFig: InventoryFigure) {

  const grid = PANEL_INVENTORY.querySelector(".inventory-grid") as HTMLDivElement;
  if (!grid) return;

  const fig = getFigureById(invFig.id);
  if (!fig) return;

  // 해당 피규어의 썸네일 img (grid는 base mode만)
  const img = grid.querySelector<HTMLImageElement>(`img[data-figure-id="${invFig.id}"][data-mode="base"]`);
  if (!img) return;

  const isUnlocked = invFig.unlockedModes.includes("base");
  const isCurrentlyUnlocked = !img.classList.contains("locked");

  // 변화 없으면 skip
  if (isCurrentlyUnlocked === isUnlocked) return;

  // 새 썸네일 생성
  const newImg = createInventoryFigureThumb({
    figure: fig,
    mode: "base",
    unlocked: isUnlocked,
    onClick: (img) => handleThumbClick(invFig.id, img),
  });

  // 실제로 img 교체
  img.replaceWith(newImg);
}
