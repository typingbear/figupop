import { ID_PLAYGROUND, NEW_FIGURE_AUDIO } from "../../../common/config.js";
import { getMaxZIndex, addPlaygroundFigure } from "../../../core/services/gameStateService.js";
import type { PlaygroundFigure } from "../../../common/types.js";
import { renderPlayground } from "../render/playgroundRenderer.js";

/**
 * PC: 드래그앤드랍
 * 모바일/태블릿: 터치 드롭(썸네일 이동 후 손을 떼면 drop)
 */


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

  // === 1. PC: HTML5 DnD ===
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
  // (플레이그라운드 전체에 touchmove, touchend 이벤트 등록)
  let currentDropData: string | null = null;
  let touchGhost: HTMLElement | null = null;
  let touchOffsetX = 0, touchOffsetY = 0;

  // 인벤토리(혹은 외부)에서 터치드래그 할 때, 
  // 글로벌 변수/상태로 데이터 저장 필요 (enableInvToPlayDrag쪽과 연동)
  window.__playgroundTouchDrop = (data: any, startX: number, startY: number, offsetX: number, offsetY: number, ghost: HTMLElement) => {
    // 터치 드래그 시작: 드롭 대기상태
    currentDropData = JSON.stringify(data);
    touchGhost = ghost;
    touchOffsetX = offsetX;
    touchOffsetY = offsetY;
    // ghost 썸네일 이미 body에 append되어 있다고 가정
  };

  // 플레이그라운드에 터치 드래그 중일 때, drop 판정
  container.addEventListener("touchmove", (e: TouchEvent) => {
    if (!touchGhost) return;
    const t = e.touches[0];
    // ghost가 손가락 따라 이동
    touchGhost.style.left = `${t.clientX - touchOffsetX}px`;
    touchGhost.style.top = `${t.clientY - touchOffsetY}px`;
  });

  container.addEventListener("touchend", (e: TouchEvent) => {
    if (!touchGhost || !currentDropData) return;

    // 드롭 판정: 손 뗀 위치가 playground 내부일 때만 drop 처리
    const t = e.changedTouches[0];
    const rect = container.getBoundingClientRect();
    const x = t.clientX - rect.left - touchOffsetX;
    const y = t.clientY - rect.top - touchOffsetY;

    // playground 내부에 있으면 drop 처리
    if (
      t.clientX >= rect.left && t.clientX <= rect.right &&
      t.clientY >= rect.top && t.clientY <= rect.bottom
    ) {
      handleDropData(currentDropData, t.clientX, t.clientY, container, touchOffsetX, touchOffsetY);
    }
    // cleanup
    if (touchGhost.parentNode) touchGhost.parentNode.removeChild(touchGhost);
    touchGhost = null;
    currentDropData = null;
  });

  // ===== PC/모바일 공용: drop데이터 해석&처리
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
      const { figureId, mode, serial, offsetX: offsetX0, offsetY: offsetY0 } = parsed;

      const rect = playgroundEl.getBoundingClientRect();
      const offX = offsetX !== undefined ? offsetX : offsetX0 ?? 0;
      const offY = offsetY !== undefined ? offsetY : offsetY0 ?? 0;
      const x = clientX - rect.left - offX;
      const y = clientY - rect.top - offY;
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
  }
}
