import { getFigureById, getResponsiveFigureSize } from "../../core/services/figureLibraryService.js";
import { IMAGE_ROOT, PANEL_PLAYGROUND } from "../../common/config.js";
import { getPlaygroundFigures } from "../../core/services/gameStateService.js";
export function renderPlayground() {
    PANEL_PLAYGROUND.innerHTML = "";
    const entities = getPlaygroundFigures().slice().sort((a, b) => { var _a, _b; return ((_a = a.zIndex) !== null && _a !== void 0 ? _a : 0) - ((_b = b.zIndex) !== null && _b !== void 0 ? _b : 0); });
    for (let i = 0; i < entities.length; i++) {
        const img = document.createElement("img");
        setupPlayzoneFigureImg(img, entities[i]);
        PANEL_PLAYGROUND.appendChild(img);
    }
}
export function AddOrUpdatePlayItemRender(entity) {
    let img = PANEL_PLAYGROUND.querySelector(`img[data-serial="${entity.serial}"]`);
    if (!img) {
        img = document.createElement("img");
        PANEL_PLAYGROUND.appendChild(img);
    }
    setupPlayzoneFigureImg(img, entity);
}
function setupPlayzoneFigureImg(img, entity) {
    var _a;
    // 여기서 직접!
    const meta = getFigureById(entity.id);
    const size = getResponsiveFigureSize(entity.id, entity.mode);
    if (!meta || !size)
        return;
    img.className = "playzone-figure-img";
    img.src = `${IMAGE_ROOT}${entity.id}-${entity.mode}.png`;
    img.alt = `${meta.name} (${entity.mode})`;
    img.style.left = `${entity.x}px`;
    img.style.top = `${entity.y}px`;
    img.style.width = `${size.width}px`;
    img.style.height = `${size.height}px`;
    img.style.zIndex = `${(_a = entity.zIndex) !== null && _a !== void 0 ? _a : 0}`;
    if (entity.serial)
        img.setAttribute("data-serial", entity.serial);
}
