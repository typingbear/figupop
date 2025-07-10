import { resetToInitialState } from "../core/services/gameStateService.js";

/** 개발자 전용 영역/버튼을 플레이그라운드 "바로 아래(형제)"에 추가 */
export function injectPlaygroundDevArea() {
  const playground = document.getElementById('playground');
  if (!playground) return;

  // 이미 있으면 중복 생성 X
  if (document.getElementById('playground-dev-area')) return;

  // dev area 컨테이너 생성
  const devArea = document.createElement('div');
  devArea.id = 'playground-dev-area';
  devArea.style.padding = '12px 0';
  devArea.style.borderTop = '1px solid #eee';
  devArea.style.background = '#f8f8f8';
  devArea.style.display = 'flex';
  devArea.style.justifyContent = 'center';
  devArea.style.gap = '12px';

  // ======= 개발 버튼 =======
  const resetBtn = document.createElement("button");
  resetBtn.textContent = "인박스 비우기 (테스트용)";
  resetBtn.style.padding = '8px 24px';
  resetBtn.style.borderRadius = '8px';
  resetBtn.style.border = 'none';
  resetBtn.style.background = '#eee';
  resetBtn.style.fontWeight = 'bold';
  resetBtn.style.cursor = 'pointer';

  resetBtn.onclick = () => {
    resetToInitialState();
    location.reload();
  };

  devArea.appendChild(resetBtn);

  // **플레이그라운드 바로 아래(형제로) 삽입**
  playground.parentElement?.insertBefore(devArea, playground.nextSibling);
}
