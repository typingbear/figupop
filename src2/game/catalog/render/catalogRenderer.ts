import { ID_CATEGORY, IMAGE_ROOT, OUTLINE_IMAGE_BASE, OUTLINE_IMAGE_SUFFIX } from "../../../common/config.js";
import { ALL_FIGURE_MODES } from "../../../core/services/figureLibraryService.js";
import { isModeUnlocked } from "../../../core/services/gameStateService.js";
export function renderCatalog() {
  const panel = document.getElementById(ID_CATEGORY) as HTMLElement | null;
  if (!panel) return;
  panel.innerHTML = "";

  ALL_FIGURE_MODES.forEach(entry => {
    let src: string;
    const unlocked = isModeUnlocked(entry.figureId, entry.mode);

    if (unlocked) {
      // 해금된 경우: 기존 이미지
      src = `${IMAGE_ROOT}${entry.id}.png`;
    } else {
      // 미해금: outline 폴더의 outline 이미지 사용!
      src = `${OUTLINE_IMAGE_BASE}${entry.id}-${OUTLINE_IMAGE_SUFFIX}.png`;
     
    }

    const img = document.createElement("img");
    img.src = src;
    img.alt = `${entry.name} (${entry.mode})`;
    img.draggable = false;
    img.className = "catalog-thumb" + (unlocked ? "" : " locked");
    panel.appendChild(img);
  });
}
