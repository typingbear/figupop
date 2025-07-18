import { getFigureById } from "../../../core/services/figureLibraryService.js";
import { ID_INVENTORY } from "../../../common/config.js";
import { showInventoryGridModePopover } from "../views/inventoryGridModePopover.js";
import { createInventoryFigureThumb } from "./inventoryImageHandler.js";
import { getSortedInventory } from "../views/inventoryViewCommon.js";
// 현재 열린 팝오버의 figureId 저장 (없으면 null)
let currentPopoverFigureId = null;
function handleThumbClick(figureId, img) {
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
export function renderInventoryGrid() {
    const container = document.getElementById(ID_INVENTORY);
    if (!container)
        return;
    // 기존 그리드 삭제
    container.querySelectorAll('.inventory-grid').forEach(el => el.remove());
    // 새 그리드 생성
    const grid = document.createElement("div");
    grid.className = "inventory-grid";
    // 정렬된 인벤토리 데이터
    const inventory = getSortedInventory();
    inventory.forEach(invFig => {
        const fig = getFigureById(invFig.id);
        if (!fig)
            return;
        const isUnlocked = invFig.unlockedModes.includes("base");
        const item = document.createElement("div");
        const img = createInventoryFigureThumb({
            figure: fig,
            mode: "base",
            unlocked: isUnlocked,
            onClick: (img) => handleThumbClick(invFig.id, img),
        });
        item.appendChild(img);
        grid.appendChild(item);
    });
    container.appendChild(grid);
}
export function addInventoryGridItem(invFig) {
    const container = document.getElementById(ID_INVENTORY);
    if (!container)
        return;
    const grid = container.querySelector(".inventory-grid");
    if (!grid)
        return;
    // 이미 해당 피규어 썸네일이 존재하면 추가하지 않음
    if (grid.querySelector(`img[data-figure-id="${invFig.id}"]`))
        return;
    const fig = getFigureById(invFig.id);
    if (!fig)
        return;
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
export function updateInventoryGridItem(invFig) {
    const container = document.getElementById(ID_INVENTORY);
    if (!container)
        return;
    const grid = container.querySelector(".inventory-grid");
    if (!grid)
        return;
    const fig = getFigureById(invFig.id);
    if (!fig)
        return;
    // 해당 피규어의 썸네일 img (grid는 base mode만)
    const img = grid.querySelector(`img[data-figure-id="${invFig.id}"][data-mode="base"]`);
    if (!img)
        return;
    const isUnlocked = invFig.unlockedModes.includes("base");
    const isCurrentlyUnlocked = !img.classList.contains("locked");
    // 변화 없으면 skip
    if (isCurrentlyUnlocked === isUnlocked)
        return;
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
