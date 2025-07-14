import { ID_PLAYGROUND, NEW_FIGURE_AUDIO } from "../../../common/config.js";
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

  // === 1. PC: HTML5 Drag & Drop ===
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
    handleDropData(data, e.clientX, e.clientY, container);
  });

  // === 2. 모바일/태블릿: 터치 드롭 ===
  let currentDropData: string | null = null;
  let touchGhost: HTMLElement | null = null;
  let touchOffsetX = 0, touchOffsetY = 0;

  window.__playgroundTouchDrop = (data, startX, startY, offsetX, offsetY, ghost) => {
    handleDropData(
      JSON.stringify(data),
      startX,
      startY,
      container,
      offsetX,
      offsetY
    );
  };

  container.addEventListener("touchmove", (e: TouchEvent) => {
    if (!touchGhost) return;
    const t = e.touches[0];
    touchGhost.style.left = `${t.clientX - touchOffsetX}px`;
    touchGhost.style.top = `${t.clientY - touchOffsetY}px`;
  });

  container.addEventListener("touchend", (e: TouchEvent) => {
    if (!touchGhost || !currentDropData) return;
    const t = e.changedTouches[0];
    const rect = container.getBoundingClientRect();
    if (
      t.clientX >= rect.left && t.clientX <= rect.right &&
      t.clientY >= rect.top && t.clientY <= rect.bottom
    ) {
      handleDropData(currentDropData, t.clientX, t.clientY, container, touchOffsetX, touchOffsetY);
    }
    if (touchGhost.parentNode) touchGhost.parentNode.removeChild(touchGhost);
    touchGhost = null;
    currentDropData = null;
  });

  // === 3. 이미지 드롭 데이터 처리 (커서 중앙 배치 지원) ===
  function handleDropData(
    data: string,
    clientX: number,
    clientY: number,
    playgroundEl: HTMLElement,
    offsetX?: number,
    offsetY?: number
  ) {
    try {
  

      const parsed = JSON.parse(data);
      const { figureId, mode, serial } = parsed;

      const rect = playgroundEl.getBoundingClientRect();
      const { width: imgW, height: imgH } = getResponsiveFigureSize(figureId, mode);

      // === 중앙정렬 또는 오프셋 적용 ===
      let x: number, y: number;
      if (typeof offsetX === "number" && typeof offsetY === "number") {
        // 드래그할 때 커서-이미지간 상대좌표(드래그-앤-드롭)에서
        // 드래그한 이미지 내부 좌표가 전달될 때
        x = clientX - rect.left - offsetX;
        y = clientY - rect.top - offsetY;
      } else {
        // 커서 기준 이미지 중앙 정렬 (offsetX/offsetY가 없으면 이게 항상 맞음)
        x = clientX - rect.left - imgW / 2;
        y = clientY - rect.top - imgH / 2;
      }
      // === 디버깅용 콘솔 출력 ===
      console.log({
        clientX, clientY,
        rectLeft: rect.left, rectTop: rect.top,
        imgW, imgH, offsetX, offsetY,
        resultX: x, resultY: y
      });

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
      renderPlayAddOrUpdateFigure(fig);

    } catch (err) {
      console.warn("[Playground Drop] 드롭 데이터 파싱 실패", err);
    }
  }
}
