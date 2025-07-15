import { getFigureById } from "../../../core/services/figureLibraryService.js";
import { ID_INVENTORY, PANEL_INVENTORY } from "../../../common/config.js";
import { createInventoryFigureThumb } from "./inventoryImageHandler.js";
import { getSortedInventory } from "../views/inventoryViewCommon.js";
// 인벤토리 리스트(세로/가로 스크롤) 렌더링
export function renderInventoryList() {
    // 기존 리스트 삭제
    PANEL_INVENTORY.querySelectorAll('.inventory-list').forEach(el => el.remove());
    // 새 리스트 생성
    const list = document.createElement("ul");
    list.className = "inventory-list";
    // 데이터 얻기
    const inventory = getSortedInventory();
    inventory.forEach(invFig => {
        const fig = getFigureById(invFig.id);
        if (!fig)
            return;
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
    PANEL_INVENTORY.appendChild(list);
}
export function addInventoryListItem(invFig) {
    const list = PANEL_INVENTORY.querySelector(".inventory-list");
    if (!list)
        return;
    // 이미 해당 피규어의 썸네일이 존재하면 추가하지 않음
    if (list.querySelector(`img[data-figure-id="${invFig.id}"]`))
        return;
    const fig = getFigureById(invFig.id);
    if (!fig)
        return;
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
}
export function updateInventoryListItem(invFig) {
    const container = document.getElementById(ID_INVENTORY);
    if (!container)
        return;
    const list = container.querySelector(".inventory-list");
    if (!list)
        return;
    // 이 피규어의 모든 썸네일 img들
    const imgs = list.querySelectorAll(`img[data-figure-id="${invFig.id}"]`);
    if (!imgs.length)
        return;
    const fig = getFigureById(invFig.id);
    if (!fig)
        return;
    imgs.forEach(oldImg => {
        const mode = oldImg.getAttribute("data-mode");
        const isUnlocked = invFig.unlockedModes.includes(mode);
        // 새 썸네일 생성 (기존 클릭/드래그/locked 등 완전 동일하게)
        const newImg = createInventoryFigureThumb({
            figure: fig,
            mode,
            unlocked: isUnlocked,
        });
        // 실제로 img 교체
        oldImg.replaceWith(newImg);
    });
}
