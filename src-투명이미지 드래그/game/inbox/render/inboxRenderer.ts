// src/game/inbox/render/inboxRenderer.ts
import { BOX_ARRIVED, BOX_EMPTY, ID_INBOX, PARCEL_LIMIT } from "../../../common/config.js";
import { formatTimer } from "../../../common/utils.js";
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

  // 컨테이너
  const container = document.createElement("div");
  container.className = "inbox-container";

  // 박스 버튼
  const btn = document.createElement("button");
  btn.className = "inbox-box-btn";
  btn.disabled = boxCount === 0;

  const img = document.createElement("img");
  img.className = "inbox-box-img";
  img.src = boxCount > 0 ? BOX_ARRIVED : BOX_EMPTY;
  img.alt = boxCount > 0 ? "택배 도착" : "비어있음";
  img.draggable = false; 
  btn.appendChild(img);

  // 개수 뱃지
  const countBox = document.createElement("div");
  countBox.className = "inbox-box-count";
  countBox.innerHTML = `
    <span class="count-x">×</span>
    <span class="count-cur">${boxCount}</span>
    <span class="count-max">/${PARCEL_LIMIT}</span>
  `;

  // 타이머
  const timerWrap = document.createElement("div");
  timerWrap.className = "inbox-timer-wrap";
  timerWrap.innerHTML = `
    <span class="inbox-timer-label">Time Left</span>
    <span class="inbox-timer-value">${countdown}</span>
  `;

  container.appendChild(btn);
  container.appendChild(countBox);
  container.appendChild(timerWrap);

  containerEl.appendChild(container);

  // 클릭 시
  btn.onclick = () => {
    removeParcelAndSpawn();
    renderInbox(); // 상태 변경 후 다시 그리기 (subscribe에서도 호출해도 됨)
  };
}
