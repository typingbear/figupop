// src/game/inbox/render/inboxRenderer.ts
import { BOX_EMPTY, BOX_ARRIVED } from "../../../common/config.js";

export function renderInbox(
  containerEl: HTMLElement | null,
  boxes: (string | null)[],
  countdown: string,
  onDragSetup?: (wrap: HTMLElement) => void
) {
  if (!containerEl) return;
  containerEl.innerHTML = "";

  const container = document.createElement("div");
  container.className = "inbox-container";

  const boxesWrap = document.createElement("div");
  boxesWrap.className = "inbox-boxes";

  for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i];
    const btn = document.createElement("button");
    btn.className = "inbox-box-btn";
    const img = document.createElement("img");
    img.className = "inbox-box-img";
    img.setAttribute("data-index", String(i));

    if (!box) {
      img.src = BOX_EMPTY;
      img.alt = "비어있음";
      img.draggable = false; // <<<< 여기 추가!
    } else {
      img.src = BOX_ARRIVED;
      img.alt = "택배 도착";
      img.classList.add("draggable-inbox-thumb");
      img.setAttribute("data-figure-id", box);
      img.draggable = true; // <<<< 이건 선택(안줘도 무방)
    }

    btn.appendChild(img);
    boxesWrap.appendChild(btn);
  }

  container.appendChild(boxesWrap);

  const timerWrap = document.createElement("div");
  timerWrap.className = "inbox-timer";
  timerWrap.innerHTML = `
    <div class="inbox-timer-label">Next Parcel</div>
    <div class="inbox-timer-value">${countdown}</div>
  `;
  container.appendChild(timerWrap);

  containerEl.appendChild(container);

  // 드래그 셋업 등 필요한 후처리
  if (onDragSetup) onDragSetup(boxesWrap);
}
