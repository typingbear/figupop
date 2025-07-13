import { IMAGE_ROOT, OUTLINE_IMAGE_BASE } from "../../common/config.js";

/**
 * 피규어 썸네일 이미지(모든 뷰 공용) 생성
 * - 항상 .thumb-img 사용 (상태는 .draggable, .locked로 구분)
 */
export function createFigureThumb({
  id,
  mode,
  unlocked,
  name,
  onClick,
  draggable = false,
}: {
  id: string;
  mode: string;
  unlocked: boolean;
  name: string;
  onClick?: (img: HTMLImageElement) => void;
  draggable?: boolean;
}) {
  const img = document.createElement("img");
  img.className = "thumb-img";

  // === 여기서 mode가 "base"면 클래스 추가 ===
  if (mode === "base") {
    img.classList.add("base-mode");
  }

  if (!unlocked) {
    img.src = `${OUTLINE_IMAGE_BASE}${id}-${mode}-outline.png`;
    img.classList.add("locked");
    img.draggable = false;
  } else {
    img.src = `${IMAGE_ROOT}${id}-${mode}.png`;
    if (draggable) {
      img.classList.add("draggable");
      img.draggable = true;
    } else {
      img.draggable = false;
    }
  }

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
