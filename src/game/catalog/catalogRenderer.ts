
import { PANEL_CATEGORY } from "../../common/config.js";
import { ALL_FIGURE_MODES } from "../../core/services/figureLibraryService.js";
import {  IMAGE_ROOT, OUTLINE_IMAGE_BASE } from "../../common/config.js";
import { isModeUnlocked } from "../../core/services/gameStateService.js";
import { FigureModeEntry } from "../../common/types/storage/figureTypes.js";

export function renderCatalog() {

  PANEL_CATEGORY.innerHTML = "";

  ALL_FIGURE_MODES.forEach(entry => {
    const img = createCategoryFigureThumb(entry);
    PANEL_CATEGORY.appendChild(img);
  });
}

export function createCategoryFigureThumb(entry: FigureModeEntry): HTMLImageElement {
  // 명확하게 변수 구분
  const { id, figureId, name, mode, desc } = entry;
  const unlocked: boolean = isModeUnlocked(figureId, mode);

  const img: HTMLImageElement = document.createElement("img");
  img.className = "thumb-img category-thumb";

  if (mode === "base") img.classList.add("base-mode");
  if (!unlocked) {
    img.src = `${OUTLINE_IMAGE_BASE}${figureId}-${mode}-outline.png`;
    img.classList.add("locked");
  } else {
    img.src = `${IMAGE_ROOT}${figureId}-${mode}.png`;
  }

  img.draggable = false;
  img.alt = `${name} (${mode})`;
  img.setAttribute("data-figure-id", figureId); // FigureModeEntry에 타입 있음
  img.setAttribute("data-mode", mode);

  // desc는 옵셔널이니 타입가드
  let descCard: HTMLElement | null = null;
  if (desc?.trim()) {
    img.addEventListener("mouseenter", () => {
      if (descCard && descCard.isConnected) return;

      descCard = document.createElement("div");
      descCard.className = "figure-thumb-desc-card absolute-overlay-card";
      descCard.innerHTML = desc as string; // 타입 명확하게

      // 위치계산 등은 생략 (동일)
      const rect = img.getBoundingClientRect();
      descCard.style.left = `${rect.left + rect.width / 2}px`;
      descCard.style.top = `${rect.bottom }px`;
      document.body.appendChild(descCard);

      // 화면 밖 보정 등 생략 (동일)
      const cardRect = descCard.getBoundingClientRect();
      if (cardRect.right > window.innerWidth) {
        descCard.style.left = `${window.innerWidth - cardRect.width / 2 - 8}px`;
      }
      if (cardRect.left < 0) {
        descCard.style.left = `${cardRect.width / 2 + 8}px`;
      }
      if (cardRect.bottom > window.innerHeight) {
        descCard.style.top = `${window.innerHeight - cardRect.height - 8}px`;
      }
    });

    img.addEventListener("mouseleave", () => {
      if (descCard && descCard.isConnected) {
        descCard.remove();
        descCard = null;
      }
    });
  }

  return img;
}
