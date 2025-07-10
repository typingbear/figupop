import { ID_PLAYGROUND, NEW_FIGURE_AUDIO } from "../../../common/config.js";
import { getMaxZIndex, addPlaygroundFigure } from "../../../core/services/gameStateService.js";
import type { PlaygroundFigure } from "../../../common/types.js";
import { renderPlayground } from "../render/playgroundRenderer.js";

export function enablePlaygroundDrop() {
  const container = document.getElementById(ID_PLAYGROUND) as HTMLElement;
  if (!container) {
    console.warn("[Playground Drop] 플레이그라운드 엘리먼트 없음!");
    return;
  }

  container.addEventListener("dragover", e => {
    e.preventDefault();
  });

  container.addEventListener("drop", e => {
    e.preventDefault();
    const data = e.dataTransfer?.getData("text/plain");
    if (!data) {
      console.warn("[Playground Drop] 드롭: 데이터 없음");
      return;
    }

    try {
      const parsed = JSON.parse(data);
      const { figureId, mode, serial, offsetX, offsetY } = parsed;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - (offsetX ?? 0);
      const y = e.clientY - rect.top - (offsetY ?? 0);
      const maxZ = getMaxZIndex();

      const fig: PlaygroundFigure = {
        id: figureId,
        mode,
        x,
        y,
        serial,
        zIndex: maxZ + 1
      };

      addPlaygroundFigure(fig);
      renderPlayground(); 

    } catch (err) {
      console.warn("[Playground Drop] 드롭 데이터 파싱 실패", err);
    }
  });
}
