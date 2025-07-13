import { ID_PLAYGROUND } from "../../common/config.js";
import {
  clearPlaygroundFigures,
  getPlaygroundFigures,
  resetToInitialState
} from "../../core/services/gameStateService.js";
import { renderPlayground } from "../playground/render/playgroundRenderer.js";
import { getUIState, setUIState } from "../../core/services/uiStateService.js";

// === [설정 모달 관련] ===

function openSoundSettingsModal() {
  const modal = document.getElementById("sound-settings-modal") as HTMLElement | null;
  if (!modal) return;

  // 볼륨 슬라이더와 값
  const sfxInput = document.getElementById("sfxVolume") as HTMLInputElement | null;
  const sfxVal = document.getElementById("sfxVolumeValue") as HTMLElement | null;
  const bgmInput = document.getElementById("bgmVolume") as HTMLInputElement | null;
  const bgmVal = document.getElementById("bgmVolumeValue") as HTMLElement | null;

  if (!sfxInput || !sfxVal || !bgmInput || !bgmVal) return;

  // 볼륨값 UI 최신화
  const sfx = getUIState("sfxVolume");
  const bgm = getUIState("bgmVolume");
  sfxInput.value = sfx.toString();
  sfxVal.textContent = sfx.toString();
  bgmInput.value = bgm.toString();
  bgmVal.textContent = bgm.toString();

  modal.classList.add("active");

  // input 이벤트: 값 표시만 즉시 변경
  sfxInput.oninput = (e) => {
    sfxVal.textContent = (e.target as HTMLInputElement).value;
  };
  bgmInput.oninput = (e) => {
    bgmVal.textContent = (e.target as HTMLInputElement).value;
  };

  // 저장: state에 반영
  const saveBtn = document.getElementById("sound-settings-save-btn") as HTMLButtonElement | null;
  if (saveBtn) {
    saveBtn.onclick = () => {
      setUIState("sfxVolume", parseInt(sfxInput.value, 10));
      setUIState("bgmVolume", parseInt(bgmInput.value, 10));
      closeSoundSettingsModal();
      // (실제 볼륨 반영 함수 호출)
    };
  }

  // 취소: 변경 무시, 닫기
  const cancelBtn = document.getElementById("sound-settings-cancel-btn") as HTMLButtonElement | null;
  if (cancelBtn) {
    cancelBtn.onclick = closeSoundSettingsModal;
  }

  // 바깥쪽 클릭 시 닫기 (선택)
  window.setTimeout(() => {
    function handleOutside(e: MouseEvent) {
      if (!modal!.contains(e.target as Node)) {
        closeSoundSettingsModal();
        document.removeEventListener("mousedown", handleOutside);
      }

    }
    document.addEventListener("mousedown", handleOutside);
  }, 10);
}

function closeSoundSettingsModal() {
  document.getElementById("sound-settings-modal")?.classList.remove("active");
}

// === [툴박스 바인딩/초기화] ===

export function enableToolbox() {
  const clearBtn = document.getElementById("clear-playground-btn") as HTMLButtonElement | null;
  const gridBtn = document.getElementById("grid-playground-btn") as HTMLButtonElement | null;
  const resetBtn = document.getElementById("reset-inventory-btn") as HTMLButtonElement | null;
  const settingsBtn = document.getElementById("open-settings-btn") as HTMLButtonElement | null;

  // 전체 삭제
  clearBtn?.addEventListener("click", () => {
    clearPlaygroundFigures();
    renderPlayground();
  });

  // 바둑판 정렬
  gridBtn?.addEventListener("click", () => {
    arrangeFiguresGridCenter();
    renderPlayground();
  });

  // 초기화(리셋)
  resetBtn?.addEventListener("click", () => {
    resetToInitialState();
    location.reload();
  });

  // 설정(사운드) 모달 오픈
  settingsBtn?.addEventListener("click", openSoundSettingsModal);
}

// === [플레이그라운드 바둑판 정렬] ===

function arrangeFiguresGridCenter() {
  const figures = getPlaygroundFigures();
  if (figures.length === 0) return;

  const playground = document.getElementById(ID_PLAYGROUND) as HTMLElement;
  const playgroundWidth = playground?.clientWidth || 900;
  const playgroundHeight = playground?.clientHeight || 700;

  const nCol = 5;
  const margin = 24;
  const size = 120;

  const nRow = Math.ceil(figures.length / nCol);
  const gridWidth = nCol * size + (nCol - 1) * margin;
  const gridHeight = nRow * size + (nRow - 1) * margin;

  const startX = Math.max(0, Math.round((playgroundWidth - gridWidth) / 2));
  const startY = Math.max(0, Math.round((playgroundHeight - gridHeight) / 2));

  let col = 0, row = 0;
  for (const fig of figures) {
    fig.x = startX + col * (size + margin);
    fig.y = startY + row * (size + margin);
    col++;
    if (col >= nCol) {
      col = 0;
      row++;
    }
  }
}
