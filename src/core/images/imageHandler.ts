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
  outline = false,
  draggable = false,   // ← 드래그 가능 여부 인자(기본 false)
}: {
  id: string;
  mode: string;
  unlocked: boolean;
  name: string;
  onClick?: (img: HTMLImageElement) => void;
  outline?: boolean;
  draggable?: boolean;   // ← 인자로 추가
}) {
  const img = document.createElement("img");
  img.className = "thumb-img";

  if (!unlocked) {
    // 미해금: outline 이미지, 잠금 클래스
    img.src = outline
      ? `${OUTLINE_IMAGE_BASE}${id}-${mode}-outline.png`
      : `${OUTLINE_IMAGE_BASE}${id}-base-outline.png`;
    img.classList.add("locked");
    img.draggable = false;
  } else {
    // 해금: 일반 이미지
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
