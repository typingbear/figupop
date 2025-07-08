import { getFigureById } from "../../../services/figureLibraryService.js";
import { IMAGE_ROOT } from "../../../common/config.js";
import { getUnlockedModes } from "../../../services/gameStateService.js";
import { makeSerialKey } from "../../../common/utils.js";
/**
 * 인벤토리 그리드에서 피규어의 모드 선택 팝오버를 띄움
 * @param figureId - 피규어 id
 * @param anchorElement - 기준이 되는 이미지 엘리먼트
 */
export function showInventoryGridModePopover(figureId, anchorElement) {
    // 기존 팝오버 모두 닫기
    document.querySelectorAll(".inventory-mode-dialog").forEach(e => e.remove());
    const figure = getFigureById(figureId);
    if (!figure)
        return;
    // 현재 해금된 모드
    const unlockedModes = getUnlockedModes(figureId);
    // 팝오버 생성
    const dialog = document.createElement("div");
    dialog.className = "inventory-mode-dialog";
    Object.keys(figure.modes).forEach(modeName => {
        const modeImg = document.createElement("img");
        modeImg.src = `${IMAGE_ROOT}${figure.id}-${modeName}.png`;
        modeImg.alt = `${figure.name} (${modeName})`;
        modeImg.setAttribute("data-figure-id", figure.id);
        modeImg.setAttribute("data-mode", modeName);
        if (unlockedModes.includes(modeName)) {
            modeImg.classList.add("draggable-inventory-thumb");
            modeImg.draggable = true;
            modeImg.style.cursor = "grab";
            modeImg.addEventListener("dragstart", ev => {
                if (ev.dataTransfer) {
                    const dragData = JSON.stringify({
                        figureId: figure.id,
                        mode: modeName,
                        serial: makeSerialKey()
                    });
                    ev.dataTransfer.setData("text/plain", dragData);
                }
            });
        }
        else {
            modeImg.classList.add("locked");
            modeImg.draggable = false;
            modeImg.style.cursor = "not-allowed";
        }
        dialog.appendChild(modeImg);
    });
    // 화면에 붙여서 실제 크기 계산
    dialog.style.position = "absolute";
    dialog.style.visibility = "hidden";
    document.body.appendChild(dialog);
    // 위치 계산
    const rect = anchorElement.getBoundingClientRect();
    const dialogWidth = dialog.offsetWidth;
    const dialogHeight = dialog.offsetHeight;
    const margin = 12;
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    let left = rect.left + window.scrollX;
    let top = rect.bottom + window.scrollY + 6;
    if (left + dialogWidth + margin > vw) {
        left = vw - dialogWidth - margin;
        if (left < margin)
            left = margin;
    }
    if (top + dialogHeight + margin > vh) {
        top = rect.top + window.scrollY - dialogHeight - margin;
        if (top < margin)
            top = margin;
    }
    dialog.style.left = `${left}px`;
    dialog.style.top = `${top}px`;
    dialog.style.visibility = "visible";
    // 외부 클릭 시 팝오버 닫기
    setTimeout(() => {
        document.addEventListener("mousedown", function handler(e) {
            if (!dialog.contains(e.target)) {
                dialog.remove();
                document.removeEventListener("mousedown", handler);
            }
        });
    }, 10);
}
