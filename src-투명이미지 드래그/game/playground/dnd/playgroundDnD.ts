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

const maskCanvasCache: { [src: string]: HTMLCanvasElement } = {};

function getOutlineSrc(src: string): string {
  const lastSlash = src.lastIndexOf("/");
  const basePath = src.slice(0, lastSlash);
  const filename = src.slice(lastSlash + 1);
  const dotIdx = filename.lastIndexOf(".");
  const name = filename.slice(0, dotIdx);
  const ext = filename.slice(dotIdx);
  const outlineFilename = `${name}-outline${ext}`;
  return `${basePath}/outline/${outlineFilename}`;
}

function getOutlineMaskCanvas(img: HTMLImageElement): HTMLCanvasElement | null {
  const src = img.getAttribute("src");
  if (!src) return null;
  if (maskCanvasCache[src]) return maskCanvasCache[src];

  const outlineSrc = getOutlineSrc(src);
  const maskImg = new window.Image();
  maskImg.src = outlineSrc;

  const canvas = document.createElement("canvas");
  maskImg.onload = () => {
    canvas.width = maskImg.width;
    canvas.height = maskImg.height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (ctx) ctx.drawImage(maskImg, 0, 0);
  };
  maskCanvasCache[src] = canvas;
  return canvas;
}

function isOutlineHit(
  e: MouseEvent,
  img: HTMLImageElement,
  maskCanvas: HTMLCanvasElement
): boolean {
  const rect = img.getBoundingClientRect();
  const x = ((e.clientX - rect.left) * maskCanvas.width / rect.width) | 0;
  const y = ((e.clientY - rect.top) * maskCanvas.height / rect.height) | 0;
  if (x < 0 || y < 0 || x >= maskCanvas.width || y >= maskCanvas.height) return false;
  const ctx = maskCanvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return false;
  const data = ctx.getImageData(x, y, 1, 1).data;
  return data[3] > 32;
}
export function enablePlaygroundDnD() {
  const playgroundEl = document.getElementById(ID_PLAYGROUND) as HTMLElement;
  let draggingImg: HTMLImageElement | null = null;
  let draggingSerial: string | null = null;
  let startX = 0, startY = 0, origX = 0, origY = 0;

  playgroundEl.addEventListener("mousedown", e => {
  // 모든 figure 이미지를 zIndex 높은 순으로 정렬
  const allImgs = Array.from(playgroundEl.querySelectorAll("img.playzone-figure-img")) as HTMLImageElement[];
  allImgs.sort((a, b) => parseInt(b.style.zIndex) - parseInt(a.style.zIndex));
  let hitImg: HTMLImageElement | null = null;
  let hitSerial: string | null = null;

  for (const img of allImgs) {
    if (!img.hasAttribute("data-serial")) continue;
    const maskCanvas = getOutlineMaskCanvas(img);
    if (maskCanvas && maskCanvas.width > 0 && maskCanvas.height > 0 && isOutlineHit(e, img, maskCanvas)) {
      hitImg = img;
      hitSerial = img.getAttribute("data-serial");
      break;
    }
  }
  if (!hitImg || !hitSerial) return;

  // ⭐️ 바로 zIndex 올리고 곧바로 드래그 시작!
  bringFigureToFront(hitSerial);
  renderPlayground();

  // dom이 다시 그려졌으니, 다시 img 선택!
  const newImg = playgroundEl.querySelector(`img[data-serial="${hitSerial}"]`) as HTMLImageElement;
  if (!newImg) return;

  draggingImg = newImg;
  draggingSerial = hitSerial;
  startX = e.clientX;
  startY = e.clientY;
  origX = parseInt(newImg.style.left) || 0;
  origY = parseInt(newImg.style.top) || 0;

  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
  e.preventDefault();
});

  function onMove(e: MouseEvent) {
    if (!draggingImg || !draggingSerial) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    draggingImg.style.left = `${origX + dx}px`;
    draggingImg.style.top = `${origY + dy}px`;

    const figures = getPlaygroundFigures();
    const a = figures.find(f => f.serial === draggingSerial);
    if (!a) return;
    a.x = origX + dx;
    a.y = origY + dy;

    // (이하 동일)
    playgroundEl.querySelectorAll(".will-transform").forEach(el => el.classList.remove("will-transform"));
    playgroundEl.querySelectorAll("img[data-pending-id]").forEach(el => {
      el.removeAttribute("data-pending-id");
      el.removeAttribute("data-pending-mode");
    });
    const b = getOverlappingFigure(a, figures);
    if (b) {
      handlePendingEffect(a, b);
      handlePendingEffect(b, a);
    }
  }

  function onUp() {
    draggingImg = null;
    draggingSerial = null;
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
    playgroundEl.querySelectorAll(".will-transform").forEach(el => el.classList.remove("will-transform"));
    playgroundEl.querySelectorAll("img[data-pending-id]").forEach(el => {
      el.removeAttribute("data-pending-id");
      el.removeAttribute("data-pending-mode");
    });
  }

  // (아래 getOutlineMaskCanvas, isOutlineHit 등은 기존 그대로!)
}


  // 두 피규어가 겹치는지 확인
function getOverlappingFigure(
  a: PlaygroundFigure,
  figures: PlaygroundFigure[]
): PlaygroundFigure | null {
  const aSize = getFigureSize(a.id, a.mode);
  const aLeft = a.x, aTop = a.y, aRight = a.x + aSize.width, aBottom = a.y + aSize.height;
  for (const f of figures) {
    if (f.serial === a.serial) continue;
    const bSize = getFigureSize(f.id, f.mode);
    const bLeft = f.x, bTop = f.y, bRight = f.x + bSize.width, bBottom = f.y + bSize.height;
    const isOverlapping = aLeft < bRight && aRight > bLeft && aTop < bBottom && aBottom > bTop;
    if (isOverlapping) return f;
  }
  return null; // 모든 경우 리턴!
}

// 변신/합성 효과 (예시)
function handlePendingEffect(a: PlaygroundFigure, b: PlaygroundFigure) {
  const reaction = getReactionResult(a.id, a.mode, b.id, b.mode);
  if (!reaction) return;
  if (reaction.resultFigureId !== a.id || reaction.resultMode !== a.mode) {
    const img = document.querySelector<HTMLImageElement>(
      `img[data-serial="${a.serial}"]`
    );
    img?.classList.add("will-transform");
    img?.setAttribute("data-pending-id", reaction.resultFigureId);
    img?.setAttribute("data-pending-mode", reaction.resultMode);
  }


// 합성 후 인벤토리/카탈로그 업데이트 (예시)
function applyPendingTransformBatch(
  targets: Array<[PlaygroundFigure, HTMLImageElement]>
): boolean {
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
}
