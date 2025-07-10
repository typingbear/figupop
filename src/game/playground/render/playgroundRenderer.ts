// src/game/ui/PlaygroundRenderer.ts
import { getFigureById, getFigureSize } from "../../../core/services/figureLibraryService.js";
import { ID_PLAYGROUND, IMAGE_ROOT } from "../../../common/config.js";
import { getPlaygroundFigures } from "../../../core/services/gameStateService.js";

/**
 * 플레이그라운드에 피규어 배열을 렌더링 (순수 함수)
 * @param container   렌더링 대상 컨테이너 (HTMLElement)
 * @param figures     PlaygroundFigure 배열 (zIndex 오름차순 정렬)
 * @param onRemoveFigure (선택) 우클릭 삭제 콜백 (serial 넘겨줌)
 */


export function renderPlayground() {
  // 1. 컨테이너 직접 얻기 (상수로 관리)
  const container = document.getElementById(ID_PLAYGROUND) as HTMLElement | null;
  if (!container) return;


  // 2. 현재 상태 직접 얻기
  const figures = getPlaygroundFigures();

  container.innerHTML = "";

  // zIndex 오름차순 정렬 (깊이순)
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
    img.style.zIndex = (fig.zIndex ?? 0).toString();
    img.setAttribute("data-index", i.toString());
    // 시리얼 속성 부여
    if (fig.serial) {
      img.dataset.serial = fig.serial;
      img.setAttribute("data-serial", fig.serial);
    }

    container.appendChild(img);
  }
}
