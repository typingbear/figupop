import { IMAGE_ROOT, OUTLINE_IMAGE_BASE } from "../../common/config.js";
import { Figure, FigureModeEntry } from "../../common/types.js";
import { isModeUnlocked } from "../services/gameStateService.js";

/**
 * 피규어 썸네일 이미지(모든 뷰 공용) 생성
 * - 항상 .thumb-img 사용 (상태는 .draggable, .locked로 구분)
 */

export function createInventoryFigureThumb({
  figure,
  mode,
  unlocked,
  onClick,
}: {
  figure: Figure;
  mode: string;
  unlocked: boolean;
  onClick?: (img: HTMLImageElement) => void;
}) {
  const { id, name } = figure;

  const img = document.createElement("img");
  img.className = "thumb-img";

  if (mode === "base") {
    img.classList.add("base-mode");
  }

  if (!unlocked) {
    img.src = `${OUTLINE_IMAGE_BASE}${id}-${mode}-outline.png`;
    img.classList.add("locked");
  } else {
    img.src = `${IMAGE_ROOT}${id}-${mode}.png`;
  }

  img.draggable = true;           // 브라우저 드래그 기능 켜기
  img.classList.add("draggable"); // 커서 등 체감 효과도 위해 클래스도 추가

  img.alt = `${name} (${mode})`;
  img.setAttribute("data-figure-id", id);
  img.setAttribute("data-mode", mode);

  if (onClick) {
    img.addEventListener("click", e => {
      onClick(img);
      e.stopPropagation();
    });
  }

  return img;
}

export function createCategoryFigureThumb(entry: FigureModeEntry) {
  const { figureId: id, name, mode, desc } = entry;
  const unlocked = isModeUnlocked(entry.figureId, entry.mode);

  const img = document.createElement("img");
  img.className = "thumb-img";

  if (mode === "base") img.classList.add("base-mode");
  if (!unlocked) {
    img.src = `${OUTLINE_IMAGE_BASE}${id}-${mode}-outline.png`;
    img.classList.add("locked");
  } else {
    img.src = `${IMAGE_ROOT}${id}-${mode}.png`;
  }

  img.draggable = false;
  img.alt = `${name} (${mode})`;
  img.setAttribute("data-figure-id", id);
  img.setAttribute("data-mode", mode);

  // desc 카드 절대 위치
  let descCard: HTMLElement | null = null;

  // 💡 unlocked 여부와 무관하게 desc 이벤트 등록!
  if (desc && desc.trim() !== "") {
    img.addEventListener("mouseenter", e => {
      if (descCard && descCard.isConnected) return;

      descCard = document.createElement("div");
      descCard.className = "figure-thumb-desc-card absolute-overlay-card";
      // 🔒 락일 때 설명에 표시 추가
      descCard.innerHTML = desc;

      // 위치 계산 (img 바로 아래, 가운데 정렬)
      const rect = img.getBoundingClientRect();
      descCard.style.position = "absolute";
      descCard.style.left = `${rect.left + rect.width / 2}px`;
      descCard.style.top = `${rect.bottom + 8}px`;
      descCard.style.transform = "translateX(-50%)";

      document.body.appendChild(descCard);

      // 카드가 화면 밖이면 위치 보정
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
