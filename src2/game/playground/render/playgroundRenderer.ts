import { getFigureById, getFigureSize } from "../../../core/services/figureLibraryService.js";
import { ID_PLAYGROUND, IMAGE_ROOT } from "../../../common/config.js";
import { getPlaygroundFigures } from "../../../core/services/gameStateService.js";

const STAGE_WIDTH = 3000;
const STAGE_HEIGHT = 2000;
const FLOOR_IMAGE = "assets/images/floor.png"; // 실제 경로로 변경

export function renderPlayground() {
  const playground = document.getElementById(ID_PLAYGROUND) as HTMLElement | null;
  if (!playground) return;

  // 1. stage 준비 (relative)
  let stage = playground.querySelector("#stage") as HTMLDivElement | null;
  if (!stage) {
    stage = document.createElement("div");
    stage.id = "stage";
    playground.appendChild(stage);
  }
  stage.style.position = "relative";
  stage.style.width = STAGE_WIDTH + "px";
  stage.style.height = STAGE_HEIGHT + "px";
  stage.style.minWidth = "100vw";
  stage.style.minHeight = "100vh";

  // 2. background 준비
  let bg = stage.querySelector("#background") as HTMLDivElement | null;
  if (!bg) {
    bg = document.createElement("div");
    bg.id = "background";
    stage.appendChild(bg);
  }
  bg.style.position = "absolute";
  bg.style.left = "0";
  bg.style.top = "0";
  bg.style.width = "100%";
  bg.style.height = "100%";
  bg.style.background = `#eee url('${FLOOR_IMAGE}') center center/cover`;
  bg.style.zIndex = "0";
  bg.style.pointerEvents = "none";

  // 3. 기존 피규어 이미지 삭제(배경은 남김)
  stage.querySelectorAll("img.playzone-figure-img").forEach(img => img.remove());

  // 4. 피규어 렌더링
  const figures = getPlaygroundFigures();
  const sortedFigures = figures.slice().sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0));
  for (let i = 0; i < sortedFigures.length; i++) {
    const fig = sortedFigures[i];
    const meta = getFigureById(fig.id);
    if (!meta) continue;

    const size = getFigureSize(fig.id, fig.mode);

    const img = document.createElement("img");
    img.className = "playzone-figure-img";
    img.src = `${IMAGE_ROOT}${fig.id}-${fig.mode}.png`;
    img.alt = `${meta.name} (${fig.mode})`;

    img.style.position = "absolute";
    img.style.left = `${fig.x}px`;
    img.style.top = `${fig.y}px`;
    img.style.width = size.width + "px";
    img.style.height = size.height + "px";
    img.style.zIndex = (fig.zIndex ?? 1).toString();
    img.setAttribute("data-index", i.toString());
    if (fig.serial) {
      img.dataset.serial = fig.serial;
      img.setAttribute("data-serial", fig.serial);
    }

    stage.appendChild(img);
  }

  // 5. (처음 1회만) 스크롤 중앙으로
  if (!(playground as any)._scrollCentered) {
    playground.scrollLeft = (STAGE_WIDTH - playground.clientWidth) / 2;
    playground.scrollTop = (STAGE_HEIGHT - playground.clientHeight) / 2;
    (playground as any)._scrollCentered = true;
  }

  // 6. (한 번만) 마우스 드래그로 scroll 패닝 가능하게
  if (!(playground as any)._scrollPanningAttached) {
    let isDragging = false;
    let startX = 0, startY = 0, scrollLeft = 0, scrollTop = 0;

    playground.addEventListener("mousedown", (e) => {
      // 마우스 왼쪽 버튼만 (우클릭 방지)
      if (e.button !== 0) return;
      isDragging = true;
      playground.style.cursor = "grabbing";
      startX = e.clientX;
      startY = e.clientY;
      scrollLeft = playground.scrollLeft;
      scrollTop = playground.scrollTop;
      // 드래그 중 텍스트 선택 방지
      e.preventDefault();
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      playground.scrollLeft = scrollLeft - dx;
      playground.scrollTop = scrollTop - dy;
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
      playground.style.cursor = "grab";
    });

    playground.style.cursor = "grab";
    (playground as any)._scrollPanningAttached = true;
  }
}
