import { makeSerialKey } from "../../../common/utils.js";
import { ID_INVENTORY, ID_PLAYGROUND } from "../../../common/config.js";

/**
 * 인벤토리 썸네일에 드래그 부여 (마우스+터치)
 */
export function enableInvToPlayDrag() {
  const root = document.getElementById(ID_INVENTORY);
  if (!root) return;

  // === 1. 마우스 Drag & Drop (HTML5) ===
  root.addEventListener("mousedown", e => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.classList.contains("draggable")) return;

    const figureId = target.getAttribute("data-figure-id");
    const mode = target.getAttribute("data-mode");
    if (!figureId || !mode) return;

    // offset 계산
    const rect = target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    target.setAttribute("draggable", "true");
    target.addEventListener("dragstart", (ev) => {
      if (ev.dataTransfer) {
        const serial = makeSerialKey();
        const dragData = JSON.stringify({
          figureId, mode, serial, offsetX, offsetY,
          source: "inventory"
        });
        ev.dataTransfer.setData("text/plain", dragData);
      }
    }, { once: true });
  });

  root.addEventListener("dragend", e => {
    const target = e.target;
    if (target instanceof HTMLElement && target.classList.contains("draggable")) {
      target.removeAttribute("draggable");
    }
  });

  // === 2. 터치 Drag(커스텀) ===
root.addEventListener("touchstart", e => {
  const target = e.target;
  if (!(target instanceof HTMLImageElement)) return; // ★ img 태그만 허용

  const figureId = target.getAttribute("data-figure-id");
  const mode = target.getAttribute("data-mode");
  if (!figureId || !mode) return;

  const rect = target.getBoundingClientRect();
  const touch = e.touches[0];
  const offsetX = touch.clientX - rect.left;
  const offsetY = touch.clientY - rect.top;

  // img 태그만 복제
  const ghost = target.cloneNode(true) as HTMLImageElement;
  ghost.style.width = rect.width + "px";
  ghost.style.height = rect.height + "px";
  ghost.style.position = "fixed";
  ghost.style.left = `${touch.clientX - offsetX}px`;
  ghost.style.top = `${touch.clientY - offsetY}px`;
  ghost.style.pointerEvents = "none";
  ghost.style.opacity = "0.7";
  ghost.style.zIndex = "9999";
  ghost.style.background = "transparent"; // 배경 투명화
  ghost.style.boxShadow = "none"; // 그림자 제거
  ghost.style.border = "none"; // 테두리 제거(필요시)
  ghost.style.borderRadius = getComputedStyle(target).borderRadius; // 둥근 모서리 유지

  document.body.appendChild(ghost);

  function onTouchMove(ev: TouchEvent) {
    const t = ev.touches[0];
    ghost.style.left = `${t.clientX - offsetX}px`;
    ghost.style.top = `${t.clientY - offsetY}px`;
    ev.preventDefault();
  }
 function onTouchEnd(ev: TouchEvent) {
  document.body.removeChild(ghost);
  document.removeEventListener("touchmove", onTouchMove);
  document.removeEventListener("touchend", onTouchEnd);

  // === [핵심!] ===
  const t = ev.changedTouches[0];
  const playground = document.getElementById(ID_PLAYGROUND);
  if (playground) {
    const rect = playground.getBoundingClientRect();
    // 손가락 위치가 playground 내부라면 drop 처리
    if (
      t.clientX >= rect.left && t.clientX <= rect.right &&
      t.clientY >= rect.top && t.clientY <= rect.bottom
    ) {
      // enablePlaygroundDrop에 drop 함수가 있다면 직접 호출
      if (typeof window.__playgroundTouchDrop === "function") {
        window.__playgroundTouchDrop(
          {
            figureId, mode, serial: makeSerialKey(), offsetX, offsetY, source: "inventory"
          },
          t.clientX, t.clientY, offsetX, offsetY, ghost
        );
      }
    }
  }
}

  document.addEventListener("touchmove", onTouchMove, { passive: false });
  document.addEventListener("touchend", onTouchEnd);
});

}
