import { ID_PLAYGROUND } from "../../../common/config.js";
import { getMaxZIndex, addPlaygroundFigure } from "../../../core/services/gameStateService.js";
import type { PlaygroundFigure } from "../../../common/types.js";
import { renderPlayAddOrUpdateFigure } from "../render/playgroundRenderer.js";
import { getResponsiveFigureSize } from "../../../core/services/figureLibraryService.js";

declare global {
  interface Window {
    __playgroundTouchDrop?: (
      data: any,
      startX: number,
      startY: number,
      offsetX: number,
      offsetY: number,
      ghost: HTMLElement
    ) => void;
  }
}

export function enablePlaygroundDrop() {
  const container = document.getElementById(ID_PLAYGROUND) as HTMLElement;
  if (!container) {
    console.warn("[Playground Drop] 플레이그라운드 엘리먼트 없음!");
    return;
  }

  // PC: HTML5 Drag & Drop
  container.addEventListener("dragover", e => e.preventDefault());

  container.addEventListener("drop", e => {
    e.preventDefault();
    const data = e.dataTransfer?.getData("text/plain");
    if (!data) return console.warn("[Playground Drop] 드롭: 데이터 없음");
    handleDropData(data, e.clientX, e.clientY, container);
  });

  // 모바일/태블릿: 터치 드롭
  window.__playgroundTouchDrop = (data, startX, startY) => {
    handleDropData(
      JSON.stringify(data),
      startX,
      startY,
      container
    );
  };

  // === 항상 중앙에 드롭 (offsetX/offsetY 무시) ===
  function handleDropData(
    data: string,
    clientX: number,
    clientY: number,
    playgroundEl: HTMLElement
  ) {
    try {
      const parsed = JSON.parse(data);
      const { figureId, mode, serial } = parsed;
      const rect = playgroundEl.getBoundingClientRect();
      const { width: imgW, height: imgH } = getResponsiveFigureSize(figureId, mode);

      const x = clientX - rect.left - imgW / 2;
      const y = clientY - rect.top - imgH / 2;

      const fig: PlaygroundFigure = {
        id: figureId,
        mode,
        x,
        y,
        serial,
        zIndex: getMaxZIndex() + 1
      };

      addPlaygroundFigure(fig);
      renderPlayAddOrUpdateFigure(fig);
    } catch (err) {
      console.warn("[Playground Drop] 드롭 데이터 파싱 실패", err);
    }
  }
}
