import { makeSerialKey } from "../../../common/utils.js";
import { setInboxParcel } from "../../../services/gameStateService.js";

/**
 * 인박스 썸네일 드래그 가능하게 함.
 * (드래그 시작 → GameStateService에서 칸 비움 → render 콜백 실행)
 * @param root 인박스 박스 목록 부모 DOM
 * @param onAfterDragStart render 등 재호출 콜백
 */
export function enableInboxToPlayDrag(
  root: HTMLElement,
  onAfterDragStart?: () => void
) {
  root.addEventListener("mousedown", e => {
 const target = e.target as HTMLElement;
  
  if (!target.classList.contains("draggable-inbox-thumb")) return;
    // 온 박스(택배)만 드래그 가능!
    if (
      target &&
      target.classList.contains("draggable-inbox-thumb") &&
      target.getAttribute("data-figure-id")
    ) {
      const figureId = target.getAttribute("data-figure-id");
      const indexStr = target.getAttribute("data-index");
      const index = indexStr ? Number(indexStr) : -1;
      if (!figureId || index < 0) return;

      // 마우스 offset 계산
      const offsetX = e.offsetX;
      const offsetY = e.offsetY;

      // 드래그 가능!
      target.setAttribute("draggable", "true");

      // dragstart: 박스를 비우고 render 콜백 호출
      const dragStartHandler = (ev: DragEvent) => {
        if (ev.dataTransfer) {
          const serial = makeSerialKey();
          const dragData = JSON.stringify({
            figureId,
            mode: "base",
            serial,
            offsetX,
            offsetY,
            source: "inbox",
             inboxIndex: index 
          });

          // 가짜(임시) 이미지 생성
          const ghostImg = target.cloneNode(true) as HTMLElement;
          ghostImg.style.position = "absolute";
          ghostImg.style.top = "-9999px"; // 화면 바깥
          document.body.appendChild(ghostImg);

          ev.dataTransfer.setDragImage(ghostImg, offsetX, offsetY);
          ev.dataTransfer.setData("text/plain", dragData);

          // 비움/렌더 콜백은 조금 뒤에!
          setTimeout(() => {
            setInboxParcel(index, null);
            if (onAfterDragStart) onAfterDragStart();
            // cleanup: 가짜 이미지는 드래그 직후 제거 (최대 2초 후라도 강제 제거)
            setTimeout(() => ghostImg.remove(), 2000);
          }, 0);
        }
      };


      // dragstart는 한 번만
      target.addEventListener("dragstart", dragStartHandler, { once: true });

      // dragend: 불필요한 복구/정리
      const dragEndHandler = () => {
        target.removeAttribute("draggable");
        target.removeEventListener("dragend", dragEndHandler);
      };
      target.addEventListener("dragend", dragEndHandler, { once: true });
    }
  });
}
