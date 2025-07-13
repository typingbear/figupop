// src/game/inbox/render/inboxRenderer.ts
import { BOX_ARRIVED, BOX_EMPTY,BOX_FINISH, ID_INBOX, PARCEL_LIMIT } from "../../../common/config.js";
import { formatTimer } from "../../../common/utils.js";
import { pickRandomUnownedPrimeFigure } from "../../../core/services/gameStateCoordinator.js";
import {
  getParcelCount,
  getParcelCountdown,
  removeParcelAndSpawn,
} from "../parcel/inboxParcelManager.js";

export function renderInbox() {
  const containerEl = document.getElementById(ID_INBOX) as HTMLElement | null;
  if (!containerEl) return;
  containerEl.innerHTML = "";

  // 상태 직접 조회
  const boxCount = getParcelCount();
  const countdown = formatTimer(getParcelCountdown());
   // 👇 여기서 바로 사용!
  const isComplete = pickRandomUnownedPrimeFigure() === null;

  // 컨테이너
  const container = document.createElement("div");
  container.className = "inbox-container";

  // 박스 버튼
  const btn = document.createElement("button");
  btn.className = "inbox-box-btn";
  // 완전히 끝났으면 비활성화
  btn.disabled = isComplete || boxCount === 0;

  // 이미지
  const img = document.createElement("img");
  img.className = "inbox-box-img";
  if (isComplete) {
    img.src = BOX_FINISH;
    img.alt = "모든 캐릭터 획득 완료";
  } else if (boxCount > 0) {
    img.src = BOX_ARRIVED;
    img.alt = "택배 도착";
  } else {
    img.src = BOX_EMPTY;
    img.alt = "비어있음";
  }
  img.draggable = false;
  btn.appendChild(img);

  // 개수 뱃지
  const countBox = document.createElement("div");
  countBox.className = "inbox-box-count";
  if (!isComplete) {
    countBox.innerHTML = `
      <span class="count-x">×</span>
      <span class="count-cur">${boxCount}</span>
      <span class="count-max">/${PARCEL_LIMIT}</span>
    `;
  } else {
    countBox.innerHTML = `<span class="inbox-finish-label">완료!</span>`;
  }

  // 타이머
  const timerWrap = document.createElement("div");
  timerWrap.className = "inbox-timer-wrap";
  if (!isComplete) {
    timerWrap.innerHTML = `<span class="inbox-timer-value">${countdown}</span>`;
  } else {
    timerWrap.innerHTML = ""; // 또는 “획득 완료!” 등 텍스트
  }

  container.appendChild(btn);
  container.appendChild(countBox);
  container.appendChild(timerWrap);

  containerEl.appendChild(container);

  // 클릭 시
  btn.onclick = () => {
    if (!isComplete && boxCount > 0) {
      removeParcelAndSpawn();
      renderInbox();
    }
  };
}
