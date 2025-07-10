import { clearPlaygroundFigures } from "../../core/services/gameStateService.js";
import { renderPlayground } from "../index/renderIndex.js";

export function enableToolbox() {
  const toolbox = document.getElementById("toolbox");
  if (!toolbox) return;

  // 동적으로 버튼 생성
  const clearBtn = document.createElement("button");
  clearBtn.id = "clear-playground-btn";
  clearBtn.textContent = "플레이그라운드 전체 삭제";
  clearBtn.onclick = () => {
    clearPlaygroundFigures();
    renderPlayground();
  };

  // 툴박스에 버튼 추가
  toolbox.appendChild(clearBtn);
}
