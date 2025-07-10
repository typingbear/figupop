import {
  getPlaygroundFigures,
  addOrUnlockInventoryFigure,
  bringFigureToFront
} from "../../../core/services/gameStateService.js";
import {
  getReactionResult,
  getFigureSize,
} from "../../../core/services/figureLibraryService.js";
import type { PlaygroundFigure } from "../../../common/types.js";
import { renderCatalog, renderInventory, renderPlayground } from "../../index/renderIndex.js";
import { ID_PLAYGROUND } from "../../../common/config.js";

/**
 * 플레이그라운드에서 이미지 직접 드래그-이동 (z-index도 관리)
 */
export function enablePlaygroundDnD() {
  const playgroundEl = document.getElementById(ID_PLAYGROUND) as HTMLElement;
  let draggingImg: HTMLImageElement | null = null;
  let draggingSerial: string | null = null;
  let startX = 0, startY = 0, origX = 0, origY = 0;


  playgroundEl.addEventListener("mousedown", e => {
  const target = e.target as HTMLElement;
  if (target instanceof HTMLImageElement && target.hasAttribute("data-serial")) {
    draggingImg = target;
    draggingSerial = target.getAttribute("data-serial");

    // ★ z-index 최상위로!
    const newZ = bringFigureToFront(draggingSerial!);
    if (typeof newZ === "number") {
      draggingImg.style.zIndex = String(newZ);
    }


      startX = e.clientX;
      startY = e.clientY;
      origX = parseInt(target.style.left) || 0;
      origY = parseInt(target.style.top) || 0;

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);

      e.preventDefault();
    }
  });

  function onMove(e: MouseEvent) {
    if (!draggingImg || !draggingSerial) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    draggingImg.style.left = `${origX + dx}px`;
    draggingImg.style.top = `${origY + dy}px`;

    // Figure 객체에도 좌표 반영
    const figures = getPlaygroundFigures();
    const a = figures.find(f => f.serial === draggingSerial);
    if (!a) return;
    a.x = origX + dx;
    a.y = origY + dy;

    // 효과/속성 모두 제거
    playgroundEl.querySelectorAll(".will-transform").forEach(el => el.classList.remove("will-transform"));
    playgroundEl.querySelectorAll("img[data-pending-id]").forEach(el => {
      el.removeAttribute("data-pending-id");
      el.removeAttribute("data-pending-mode");
    });

    // 겹침 체크 + 효과/속성
    const b = getOverlappingFigure(a, figures);
    if (b) {
      handlePendingEffect(a, b);
      handlePendingEffect(b, a);
    }
  }

function onUp() {
  if (draggingImg && draggingSerial) {
    const figures = getPlaygroundFigures();
    const fig = figures.find(f => f.serial === draggingSerial);

    if (fig && draggingImg) {
      // 변신 타깃들 배열 생성 (자기 자신 + 겹친 상대)
      const targets: Array<[PlaygroundFigure, HTMLImageElement]> = [[fig, draggingImg]];

      const other = getOverlappingFigure(fig, figures);
      if (other) {
        const otherImg = playgroundEl.querySelector(`img[data-serial="${other.serial}"]`);
        if (otherImg instanceof HTMLImageElement) {
          targets.push([other, otherImg]);
        }
      }

      // 한 번에 변신 처리
      const restult = applyPendingTransformBatch(targets);

      if (restult) {
        renderInventory();
        renderCatalog();
      }
      renderPlayground();
    }
  }
  draggingImg = null;
  draggingSerial = null;
  window.removeEventListener("mousemove", onMove);
  window.removeEventListener("mouseup", onUp);

  // 효과/속성 모두 제거
  playgroundEl.querySelectorAll(".will-transform").forEach(el => el.classList.remove("will-transform"));
  playgroundEl.querySelectorAll("img[data-pending-id]").forEach(el => {
    el.removeAttribute("data-pending-id");
    el.removeAttribute("data-pending-mode");
  });
}

  function handlePendingEffect(a: PlaygroundFigure, b: PlaygroundFigure) {
    const reaction = getReactionResult(a.id, a.mode, b.id, b.mode);
    if (!reaction) return;
    if (reaction.resultFigureId !== a.id || reaction.resultMode !== a.mode) {
      const img = playgroundEl.querySelector(`img[data-serial="${a.serial}"]`);
      img?.classList.add("will-transform");
      img?.setAttribute("data-pending-id", reaction.resultFigureId);
      img?.setAttribute("data-pending-mode", reaction.resultMode);
    }
  }

function applyPendingTransformBatch(targets: Array<[PlaygroundFigure, HTMLImageElement]>): boolean {
  // 한 번이라도 새로운 언락이 있으면 true
  let anyUnlocked = false;
  for (const [fig, img] of targets) {
    const pendingId = img.getAttribute("data-pending-id");
    const pendingMode = img.getAttribute("data-pending-mode");
    if (pendingId && pendingMode) {
      fig.id = pendingId;
      fig.mode = pendingMode;
      const result = addOrUnlockInventoryFigure(pendingId, pendingMode);
      if (result !== "old") {
        anyUnlocked = true;
      }
    }
  }
  return anyUnlocked;
}


  function getOverlappingFigure(a: PlaygroundFigure, figures: PlaygroundFigure[]): PlaygroundFigure | null {
    const aSize = getFigureSize(a.id, a.mode);
    const aLeft = a.x, aTop = a.y, aRight = a.x + aSize.width, aBottom = a.y + aSize.height;
    for (const f of figures) {
      if (f.serial === a.serial) continue;
      const bSize = getFigureSize(f.id, f.mode);
      const bLeft = f.x, bTop = f.y, bRight = f.x + bSize.width, bBottom = f.y + bSize.height;
      const isOverlapping = aLeft < bRight && aRight > bLeft && aTop < bBottom && aBottom > bTop;
      if (isOverlapping) return f;
    }
    return null;
  }
}

