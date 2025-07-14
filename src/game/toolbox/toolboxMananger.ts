import { ID_PLAYGROUND } from "../../common/config.js";
import {
  clearPlaygroundFigures,
  getPlaygroundFigures,
  removePlaygroundFigureBySerial,
  resetToInitialState
} from "../../core/services/gameStateService.js";
import { renderPlayground } from "../playground/render/playgroundRenderer.js";
import { getUIState, setUIState } from "../../core/services/uiStateService.js";
import { getResponsiveFigureSize } from "../../core/services/figureLibraryService.js";

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

  // 1. 피규어 크기 계산 (반응형)
  // (여기선 모두 같은 사이즈라고 가정. 실제로 다르면 개별적으로 getResponsiveFigureSize 사용)
  const sampleSize = figures[0];
  // 실제 환경에서는 figure마다 다를 수 있으므로 필요시 반복문에서 각각 계산
  const { width: figW, height: figH } = getResponsiveFigureSize(sampleSize.id, sampleSize.mode);

  // 2. 컬럼 개수 자동 결정 (최대 7, 최소 2)
  // (한 줄에 너무 적거나 많으면 보기 불편하니까)
  let nCol = Math.max(2, Math.min(7, Math.floor(playgroundWidth / (figW + 10))));
  nCol = Math.min(nCol, figures.length); // 피규어 개수보다 많을 수 없음

  const nRow = Math.ceil(figures.length / nCol);

  // 3. 그리드 셀 크기(겹쳐도 됨) 계산: 여유가 없으면 margin 줄이고, 필요시 겹침 허용
  let margin = 20;
  let gridWidth = nCol * figW + (nCol - 1) * margin;
  let gridHeight = nRow * figH + (nRow - 1) * margin;

  // 만약 playground보다 크면 margin 줄이고, 그래도 안되면 figW/H도 강제로 줄임(겹침)
  if (gridWidth > playgroundWidth) {
    margin = Math.max(4, Math.floor((playgroundWidth - nCol * figW) / Math.max(1, nCol - 1)));
    gridWidth = nCol * figW + (nCol - 1) * margin;
    // 그래도 넘치면 figW도 줄임
    if (gridWidth > playgroundWidth) {
      const fitFigW = Math.floor((playgroundWidth - (nCol - 1) * margin) / nCol);
      // 비율 유지
      const ratio = figW / figH;
      const fitFigH = Math.floor(fitFigW / ratio);
      gridWidth = nCol * fitFigW + (nCol - 1) * margin;
      gridHeight = nRow * fitFigH + (nRow - 1) * margin;

      // 아래 루프에서 이 값을 사용
      for (let i = 0; i < figures.length; i++) {
        const col = i % nCol;
        const row = Math.floor(i / nCol);
        figures[i].x = Math.max(0, Math.round((playgroundWidth - gridWidth) / 2)) + col * (fitFigW + margin);
        figures[i].y = Math.max(0, Math.round((playgroundHeight - gridHeight) / 2)) + row * (fitFigH + margin);
      }
      return;
    }
  }
  // 기본 케이스: 겹치지 않고 margin 유지 가능
  for (let i = 0; i < figures.length; i++) {
    const col = i % nCol;
    const row = Math.floor(i / nCol);
    figures[i].x = Math.max(0, Math.round((playgroundWidth - gridWidth) / 2)) + col * (figW + margin);
    figures[i].y = Math.max(0, Math.round((playgroundHeight - gridHeight) / 2)) + row * (figH + margin);
  }
}

//TODO 우클릭삭제 나중에 다른방식으로 수정
const playgroundEl = document.getElementById("playground");
if (playgroundEl) {
  playgroundEl.addEventListener("contextmenu", function(e) {
    const target = e.target;
    if (target instanceof HTMLImageElement && target.hasAttribute("data-serial")) {
      e.preventDefault();
      const serial = target.getAttribute("data-serial");
      if (!serial) return;
      removePlaygroundFigureBySerial(serial);
      target.remove();
    }
  });
}

