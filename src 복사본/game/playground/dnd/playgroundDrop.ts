import { getMaxZIndex, addPlaygroundFigure, isModeUnlocked, unlockFigureMode } from "../../../services/gameStateService.js";
import { NEW_FIGURE_AUDIO } from "../../../common/config.js";
import { playSound } from "../../../common/utils.js";
import { renderInventory } from "../../inventory/render/inventoryRenderer.js";  // 추가!
import { renderCatalog } from "../../catalog/render/catalogRenderer.js";       // 추가!
import type { PlaygroundFigure } from "../../../common/types.js";

export function enableUniversalPlaygroundDrop(
  container: HTMLElement,
  onAfterDrop?: (source: string) => void
) {
  container.addEventListener("dragover", e => {
    e.preventDefault();
  });

  container.addEventListener("drop", e => {
    e.preventDefault();
    const data = e.dataTransfer?.getData("text/plain");
    if (!data) {
      console.warn("[Playground Drop] 드롭: 데이터 없음");
      return;
    }

    try {
      const parsed = JSON.parse(data);
      const { figureId, mode, serial, offsetX, offsetY, source } = parsed;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - (offsetX ?? 0);
      const y = e.clientY - rect.top - (offsetY ?? 0);
      const maxZ = getMaxZIndex();

      let dropMode = source === "inbox" ? "base" : mode;

      const fig: PlaygroundFigure = {
        id: figureId,
        mode: dropMode,
        x,
        y,
        serial,
        zIndex: maxZ + 1
      };

      addPlaygroundFigure(fig);

      // === 해금 체크 및 사운드 ===
      let newlyUnlocked = false;
      if (!isModeUnlocked(figureId, dropMode)) {
        unlockFigureMode(figureId, dropMode);
        playSound(NEW_FIGURE_AUDIO);
        newlyUnlocked = true;
      }

      // === 인벤토리/도감 리렌더 ===
      if (newlyUnlocked) {
        renderInventory();
        renderCatalog();
      }

      if (onAfterDrop) onAfterDrop(source);
    } catch (err) {
      console.warn("[Playground Drop] 드롭 데이터 파싱 실패", err);
    }
  });
}
