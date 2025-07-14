import { getFigureById, getResponsiveFigureSize } from "../../../core/services/figureLibraryService.js";
import { ID_PLAYGROUND, IMAGE_ROOT } from "../../../common/config.js";
import { getPlaygroundFigures } from "../../../core/services/gameStateService.js";
import { PlaygroundFigure } from "../../../common/types.js";

export function renderPlayground() {
  const container = document.getElementById(ID_PLAYGROUND) as HTMLElement | null;
  if (!container) return;

  const figures = getPlaygroundFigures();
  container.innerHTML = "";

  const sortedFigures = figures.slice().sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0));

  for (let i = 0; i < sortedFigures.length; i++) {
    const fig = sortedFigures[i];
    const meta = getFigureById(fig.id);
    if (!meta) continue;

    // 🟠 바뀐 부분: 반응형 크기 적용!
    const size = getResponsiveFigureSize(fig.id, fig.mode);

    const img = document.createElement("img");
    img.className = "playzone-figure-img";
    img.src = `${IMAGE_ROOT}${fig.id}-${fig.mode}.png`;
    img.alt = `${meta.name} (${fig.mode})`;

    img.style.position = "absolute";
    // 중앙 좌표라면 아래처럼 위치를 보정!
    img.style.left = `${fig.x}px`;
    img.style.top = `${fig.y}px`;
    img.style.width = size.width + "px";
    img.style.height = size.height + "px";
    img.style.zIndex = (fig.zIndex ?? 0).toString();
    img.style.transform = "translate(-50%, -50%)"; // 중앙기준!
    img.setAttribute("data-index", i.toString());
    if (fig.serial) {
      img.dataset.serial = fig.serial;
      img.setAttribute("data-serial", fig.serial);
    }

    container.appendChild(img);
  }
}

export function renderPlayAddOrUpdateFigure(figData: PlaygroundFigure) {
  const container = document.getElementById(ID_PLAYGROUND);
  if (!container) return;

  const meta = getFigureById(figData.id);
  // 🟠 반응형 사이즈 적용!
  const size = getResponsiveFigureSize(figData.id, figData.mode);
  if (!meta || !size) return;

  let img = container.querySelector<HTMLImageElement>(`img[data-serial="${figData.serial}"]`);
  if (!img) {
    img = document.createElement("img");
    img.className = "playzone-figure-img";
    img.setAttribute("data-serial", figData.serial);
    container.appendChild(img);
  }
  img.style.position = "absolute";
  img.style.left = `${figData.x}px`;
  img.style.top = `${figData.y}px`;
  img.style.width = `${size.width}px`;
  img.style.height = `${size.height}px`;
  img.style.zIndex = `${figData.zIndex ?? 0}`;
  img.style.transform = "translate(-50%, -50%)"; // 중앙
  img.src = `${IMAGE_ROOT}${figData.id}-${figData.mode}.png`;
  img.alt = `${meta.name} (${figData.mode})`;
}
