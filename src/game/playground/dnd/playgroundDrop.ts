import { DROP_FIGURE_AUDIO, ID_PLAYGROUND } from "../../../common/config.js";
import { getMaxZIndex, addPlaygroundFigure } from "../../../core/services/gameStateService.js";
import { getResponsiveFigureSize } from "../../../core/services/figureLibraryService.js";
import { AddOrUpdatePlayItemRender } from "../playgroundRenderer.js";
import { Entity } from "../../../common/types/game/playgroundTypes.js";
import { playSound } from "../../../common/utils.js";

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
      const { figureId, mode, serial, offsetX = 0, offsetY = 0 } = parsed;
      const rect = playgroundEl.getBoundingClientRect();
      const { width: imgW, height: imgH } = getResponsiveFigureSize(figureId, mode);

      // offsetX, offsetY가 있으면 해당 위치에 정확히 놓기 (비율 보정)
      let adjOffsetX = offsetX;
      let adjOffsetY = offsetY;
      if (parsed.source === "inventory" && parsed.rectW && parsed.rectH) {
        adjOffsetX = offsetX * (imgW / parsed.rectW);
        adjOffsetY = offsetY * (imgH / parsed.rectH);
      }
      const x = clientX - rect.left - adjOffsetX;
      const y = clientY - rect.top - adjOffsetY;

      const fig: Entity = {
        id: figureId,
        mode,
        x,
        y,
        serial,
        zIndex: getMaxZIndex() + 1
      };
      playSound(DROP_FIGURE_AUDIO);
      addPlaygroundFigure(fig);
      AddOrUpdatePlayItemRender(fig);
    } catch (err) {
      console.warn("[Playground Drop] 드롭 데이터 파싱 실패", err);
    }
  }
}
