import { getFigureById, getResponsiveFigureSize } from "../../core/services/figureLibraryService.js";
import {  IMAGE_ROOT, PANEL_PLAYGROUND } from "../../common/config.js";
import { getPlaygroundFigures } from "../../core/services/gameStateService.js";
import { Entity } from "../../common/types/game/playgroundTypes.js";

function setupPlayzoneFigureImg(
  img: HTMLImageElement,
  entity: Entity,
) {
  // 여기서 직접!
  const meta = getFigureById(entity.id);
  const size = getResponsiveFigureSize(entity.id, entity.mode);

  if (!meta || !size) return;

  img.className = "playzone-figure-img";
  img.src = `${IMAGE_ROOT}${entity.id}-${entity.mode}.png`;
  img.alt = `${meta.name} (${entity.mode})`;
  img.style.left = `${entity.x}px`;
  img.style.top = `${entity.y}px`;
  img.style.width = `${size.width}px`;
  img.style.height = `${size.height}px`;
  img.style.zIndex = `${entity.zIndex ?? 0}`;
  if (entity.serial) img.setAttribute("data-serial", entity.serial);
}


export function renderPlayground() {

  PANEL_PLAYGROUND.innerHTML = "";

  const entities = getPlaygroundFigures().slice().sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0));
  for (let i = 0; i < entities.length; i++) {
    const img = document.createElement("img");
    setupPlayzoneFigureImg(img,  entities[i]);
    PANEL_PLAYGROUND.appendChild(img);
  }
}

export function AddOrUpdatePlayItemRender(entity: Entity) {

  let img = PANEL_PLAYGROUND.querySelector<HTMLImageElement>(
    `img[data-serial="${entity.serial}"]`
  );
  if (!img) {
    img = document.createElement("img");
    PANEL_PLAYGROUND.appendChild(img);
  }
  setupPlayzoneFigureImg(img, entity);
}


