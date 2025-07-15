import { IMAGE_ROOT, OUTLINE_IMAGE_BASE } from "../../common/config.js";
import { isModeUnlocked } from "../services/gameStateService.js";
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
export function createCategoryFigureThumb(entry) {
    // 명확하게 변수 구분
    const { id, figureId, name, mode, desc } = entry;
    const unlocked = isModeUnlocked(figureId, mode);
    const img = document.createElement("img");
    img.className = "thumb-img";
    if (mode === "base")
        img.classList.add("base-mode");
    if (!unlocked) {
        img.src = `${OUTLINE_IMAGE_BASE}${figureId}-${mode}-outline.png`;
        img.classList.add("locked");
    }
    else {
        img.src = `${IMAGE_ROOT}${figureId}-${mode}.png`;
    }
    img.draggable = false;
    img.alt = `${name} (${mode})`;
    img.setAttribute("data-figure-id", figureId); // FigureModeEntry에 타입 있음
    img.setAttribute("data-mode", mode);
    // desc는 옵셔널이니 타입가드
    let descCard = null;
    if (desc === null || desc === void 0 ? void 0 : desc.trim()) {
        img.addEventListener("mouseenter", () => {
            if (descCard && descCard.isConnected)
                return;
            descCard = document.createElement("div");
            descCard.className = "figure-thumb-desc-card absolute-overlay-card";
            descCard.innerHTML = desc; // 타입 명확하게
            // 위치계산 등은 생략 (동일)
            const rect = img.getBoundingClientRect();
            descCard.style.left = `${rect.left + rect.width / 2}px`;
            descCard.style.top = `${rect.bottom}px`;
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
