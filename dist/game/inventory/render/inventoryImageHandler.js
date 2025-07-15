import { IMAGE_ROOT, OUTLINE_IMAGE_BASE } from "../../../common/config.js";
/**
 * 피규어 썸네일 이미지(모든 뷰 공용) 생성
 * - 항상 .thumb-img 사용 (상태는 .draggable, .locked로 구분)
 */
export function createInventoryFigureThumb({ figure, mode, unlocked, onClick, }) {
    const { id, name } = figure;
    const img = document.createElement("img");
    img.className = "thumb-img";
    if (mode === "base") {
        img.classList.add("base-mode");
    }
    if (!unlocked) {
        img.src = `${OUTLINE_IMAGE_BASE}${id}-${mode}-outline.png`;
        img.classList.add("locked");
    }
    else {
        img.src = `${IMAGE_ROOT}${id}-${mode}.png`;
    }
    img.draggable = true; // 브라우저 드래그 기능 켜기
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
