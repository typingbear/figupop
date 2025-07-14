import {
  getPlaygroundFigures,
  addOrUnlockInventoryFigure,
  bringFigureToFront,
  getInventoryFigures,
  removePlaygroundFigureBySerial
} from "../../../core/services/gameStateService.js";
import {
  getReactionResult,

} from "../../../core/services/figureLibraryService.js";
import type { FigureReaction, PlaygroundFigure } from "../../../common/types.js";
import { ID_PLAYGROUND, NEW_FIGURE_AUDIO, OLD_FIGURE_AUDIO, UNLOCK_FIGURE_AUDIO } from "../../../common/config.js";
import { renderPlayAddOrUpdateFigure } from "../render/playgroundRenderer.js";
import { renderInventoryInsertItem, renderInventoryUpdateItem } from "../../inventory/render/inventoryRenderer.js";
import { playSound } from "../../../common/utils.js";
import { playSpriteEffect } from "../../../core/effects/spriteEffectManager.js";



function getRenderedSize(imgEl: HTMLImageElement): { width: number; height: number } {
  const rect = imgEl.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
  };
}


/**
 * 플레이그라운드에서 이미지 직접 드래그-이동 (z-index도 관리)
 */export function enablePlaygroundDnD() {
  const playgroundEl = document.getElementById(ID_PLAYGROUND) as HTMLElement;
  let draggingImg: HTMLImageElement | null = null;
  let draggingSerial: string | null = null;
  let startX = 0, startY = 0, origX = 0, origY = 0;
  let draggingTouchId: number | null = null;

  // ============ [PC: 마우스 DnD] ============
  playgroundEl.addEventListener("mousedown", e => {
    const target = e.target as HTMLElement;
    if (target instanceof HTMLImageElement && target.hasAttribute("data-serial")) {
      draggingImg = target;
      draggingSerial = target.getAttribute("data-serial");

      // z-index 최상위로!
      const newZ = bringFigureToFront(draggingSerial!);
      if (typeof newZ === "number") draggingImg.style.zIndex = String(newZ);

      startX = e.clientX;
      startY = e.clientY;
      origX = parseInt(target.style.left) || 0;
      origY = parseInt(target.style.top) || 0;

      window.addEventListener("mousemove", onMoveMouse);
      window.addEventListener("mouseup", onUpMouse);

      e.preventDefault();
    }
  });

  function onMoveMouse(e: MouseEvent) {
    handleMove(e.clientX, e.clientY);
  }

  function onUpMouse() {
    handleUp();
    window.removeEventListener("mousemove", onMoveMouse);
    window.removeEventListener("mouseup", onUpMouse);
  }

  // ============ [모바일/태블릿: 터치 DnD] ============
  playgroundEl.addEventListener("touchstart", e => {
    if (draggingImg) return; // 멀티터치 방지
    const touches = e.changedTouches;
    const target = (e.target as HTMLElement);
    if (target instanceof HTMLImageElement && target.hasAttribute("data-serial")) {
      draggingImg = target;
      draggingSerial = target.getAttribute("data-serial");

      // z-index 최상위로!
      const newZ = bringFigureToFront(draggingSerial!);
      if (typeof newZ === "number") draggingImg.style.zIndex = String(newZ);

      const t = touches[0];
      draggingTouchId = t.identifier;
      startX = t.clientX;
      startY = t.clientY;
      origX = parseInt(target.style.left) || 0;
      origY = parseInt(target.style.top) || 0;

      window.addEventListener("touchmove", onMoveTouch, { passive: false });
      window.addEventListener("touchend", onUpTouch);
      window.addEventListener("touchcancel", onUpTouch);

      e.preventDefault();
    }
  });

  function onMoveTouch(e: TouchEvent) {
    if (draggingImg == null || draggingTouchId == null) return;
    for (let i = 0; i < e.changedTouches.length; ++i) {
      const t = e.changedTouches[i];
      if (t.identifier === draggingTouchId) {
        handleMove(t.clientX, t.clientY);
        e.preventDefault();
        break;
      }
    }
  }

  function onUpTouch(e: TouchEvent) {
    if (draggingImg == null || draggingTouchId == null) return;
    let up = false;
    for (let i = 0; i < e.changedTouches.length; ++i) {
      if (e.changedTouches[i].identifier === draggingTouchId) {
        up = true;
        break;
      }
    }
    if (up) {
      handleUp();
      window.removeEventListener("touchmove", onMoveTouch);
      window.removeEventListener("touchend", onUpTouch);
      window.removeEventListener("touchcancel", onUpTouch);
      draggingTouchId = null;
    }
  }

  function getOverlappingFigure(a: PlaygroundFigure, figures: PlaygroundFigure[]): PlaygroundFigure | null {
    const aEl = document.querySelector(`img[data-serial="${a.serial}"]`) as HTMLImageElement | null;
    if (!aEl) return null;
    const aRect = aEl.getBoundingClientRect();
    for (const f of figures) {
      if (f.serial === a.serial) continue;
      const fEl = document.querySelector(`img[data-serial="${f.serial}"]`) as HTMLImageElement | null;
      if (!fEl) continue;
      const fRect = fEl.getBoundingClientRect();
      const isOverlapping = (
        aRect.left < fRect.right &&
        aRect.right > fRect.left &&
        aRect.top < fRect.bottom &&
        aRect.bottom > fRect.top
      );
      if (isOverlapping) return f;
    }
    return null;
  }
  // ======= [기존 겹침/효과/변신 로직들은 그대로] =======
  function handlePendingEffect(a: PlaygroundFigure, b: PlaygroundFigure) {
    const reaction = getReactionResult(a.id, a.mode, b.id, b.mode);
    if (!reaction) return;
    if (reaction.resultFigureId !== a.id || reaction.resultMode !== a.mode) {
      const img = playgroundEl.querySelector(`img[data-serial="${a.serial}"]`);
      img?.classList.add("will-transform");
      img?.setAttribute("data-pending-id", reaction.resultFigureId);
      img?.setAttribute("data-pending-mode", reaction.resultMode);
      img?.setAttribute("data-pending-sound", reaction.sound ?? '');
      img?.setAttribute("data-pending-effect", reaction.effect ?? '');

      // === 상대방 serial만 저장!
      if (reaction.removeOther) {
        img?.setAttribute("data-remove-other", b.serial);
      } else {
        img?.removeAttribute("data-remove-other");
      }


    }
  }


  // ============ [공통: move/up 처리] ============
  function handleMove(clientX: number, clientY: number) {
    if (!draggingImg || !draggingSerial) return;

    const dx = clientX - startX;
    const dy = clientY - startY;

    const fig = getPlaygroundFigures().find(f => f.serial === draggingSerial);
    if (!fig) return;

    // 실제 렌더 크기로 계산
    const { width, height } = getRenderedSize(draggingImg);
    const rect = playgroundEl.getBoundingClientRect();
    const maxX = rect.width - width;
    const maxY = rect.height - height;

    let nextX = origX + dx;
    let nextY = origY + dy;
    nextX = Math.max(0, Math.min(maxX, nextX));
    nextY = Math.max(0, Math.min(maxY, nextY));

    draggingImg.style.left = `${nextX}px`;
    draggingImg.style.top = `${nextY}px`;
    fig.x = nextX;
    fig.y = nextY;

    // 기존 겹침/이펙트 처리
    playgroundEl.querySelectorAll(".will-transform").forEach(el => el.classList.remove("will-transform"));
    playgroundEl.querySelectorAll("img[data-pending-id]").forEach(el => {
      el.removeAttribute("data-pending-id");
      el.removeAttribute("data-pending-mode");
      el.removeAttribute("data-pending-sound");
      el.removeAttribute("data-pending-effect");
      el.removeAttribute("data-remove-other");
    });

    const b = getOverlappingFigure(fig, getPlaygroundFigures());
    if (b) {
      handlePendingEffect(fig, b);
      handlePendingEffect(b, fig);
    }
  }

  function handleUp() {
    if (!draggingImg || !draggingSerial) return;

    const figures = getPlaygroundFigures();
    const figA = figures.find(f => f.serial === draggingSerial);
    const figB = figA ? getOverlappingFigure(figA, figures) : null;
    const imgB = figB ? playgroundEl.querySelector(`img[data-serial="${figB.serial}"]`) : null;

    // 서로를 지우라고 동시에 명령한 경우 체크
    let bothWantToDeleteEachOther = false;
    if (figA && figB && draggingImg && imgB instanceof HTMLImageElement) {
      const aRemoveOther = draggingImg.getAttribute("data-remove-other");
      const bRemoveOther = imgB.getAttribute("data-remove-other");
      bothWantToDeleteEachOther = (
        aRemoveOther === figB.serial &&
        bRemoveOther === figA.serial
      );
    }

    // A 처리 (드래그 주체)
    if (figA && draggingImg) {
      applyPendingTransformSingle(
        figA,
        draggingImg,
        bothWantToDeleteEachOther,
        "first"
      );
      renderPlayAddOrUpdateFigure(figA);
    }

    // B 처리
    if (figB && imgB instanceof HTMLImageElement) {
      applyPendingTransformSingle(
        figB,
        imgB,
        bothWantToDeleteEachOther,
        "second"
      );
      // 실제로 데이터/DOM에 살아있는 경우에만 render
      const stillExists = getPlaygroundFigures().some(f => f.serial === figB.serial);
      const stillImg = playgroundEl.querySelector(`img[data-serial="${figB.serial}"]`);
      if (stillExists && stillImg) {
        renderPlayAddOrUpdateFigure(figB);
      }
    }

    // 효과/속성 모두 제거
    playgroundEl.querySelectorAll(".will-transform").forEach(el => el.classList.remove("will-transform"));
    playgroundEl.querySelectorAll("img[data-pending-id]").forEach(el => {
      el.removeAttribute("data-pending-id");
      el.removeAttribute("data-pending-mode");
      el.removeAttribute("data-pending-sound");
      el.removeAttribute("data-pending-effect");
      el.removeAttribute("data-remove-other");
      el.removeAttribute("data-remove-self");
    });

    draggingImg = null;
    draggingSerial = null;
  }

  /**
   * @param isDragged 내가 드래그 주체인지
   * @param skipRemoveOther '둘 다 서로를 가리킬 때, 드래그 주체는 상대방을 삭제하지 않는다'는 특수 상황을 위한 플래그
   */
  function applyPendingTransformSingle(
    fig: PlaygroundFigure,
    img: HTMLImageElement,
    bothWantToDeleteEachOther: boolean = false,
    side: String = "first"
  ) {
    if (bothWantToDeleteEachOther && (side == 'second')) return;

    // 상대 삭제
    const removeOtherSerial = img.getAttribute("data-remove-other");
    // skipRemoveOther=true(특수 상황, 드래그 주체면 삭제하지 않음) + 드래그 주체만 해당
    if (removeOtherSerial && (!(bothWantToDeleteEachOther && (side == 'second')))) {
      removePlaygroundFigureBySerial(removeOtherSerial);
      const el = document.querySelector(`img[data-serial="${removeOtherSerial}"]`);
      if (el) el.remove();
    }

    // 변신/효과/사운드
    const pendingId = img.getAttribute("data-pending-id");
    const pendingMode = img.getAttribute("data-pending-mode");
    const pendingSound = img.getAttribute("data-pending-sound");
    const pendingEffect = img.getAttribute("data-pending-effect");

    if (pendingId && pendingMode) {
      fig.id = pendingId;
      fig.mode = pendingMode;
      const result = addOrUnlockInventoryFigure(pendingId, pendingMode);

      // 사운드
      if (pendingSound && pendingSound.trim() !== '') playSound(pendingSound);
      else if (result === "new-figure") playSound(NEW_FIGURE_AUDIO);
      else if (result === "new-mode") playSound(UNLOCK_FIGURE_AUDIO);
      else playSound(OLD_FIGURE_AUDIO);

      // 이펙트
      if (pendingEffect && pendingEffect.trim() !== '') {
        const rect = img.getBoundingClientRect();
        playSpriteEffect(pendingEffect, {
          size: Math.max(rect.width, rect.height),
          centerX: rect.left + rect.width / 2 + window.scrollX,
          centerY: rect.top + rect.height / 2 + window.scrollY,
        });
      }

      // 인벤토리 UI
      const invFig = getInventoryFigures().find(f => f.id === pendingId);
      if (invFig) {
        if (result === "new-figure") renderInventoryInsertItem(invFig);
        else if (result === "new-mode") renderInventoryUpdateItem(invFig);
      }
    }
  }

}
