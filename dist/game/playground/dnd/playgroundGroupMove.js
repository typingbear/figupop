import { ID_PLAYGROUND } from "../../../common/config.js";
import { playSound } from "../../../common/utils.js";
import { DRAG_GROUP_SELECT_AUDIO, DROP_GROUP_SELECT_AUDIO, CANCEL_GROUP_SELECT_AUDIO } from "../../../common/config.js";
let selectionBox;
let isSelecting = false;
let selStartX = 0, selStartY = 0;
let selectedImgs = [];
let isDraggingGroup = false;
let dragStartX = 0, dragStartY = 0;
let hasMoved = false; // ✅ 이동 여부 확인용
let originalPositions = [];
export function enablePlaygroundGroupMove() {
    selectionBox = document.getElementById('selection-box');
    if (!selectionBox) {
        selectionBox = document.createElement('div');
        selectionBox.id = 'selection-box';
        document.body.appendChild(selectionBox);
    }
    const playgroundEl = document.getElementById(ID_PLAYGROUND);
    playgroundEl.addEventListener("mousedown", e => {
        const target = e.target;
        // ✅ 선택 해제 처리
        const isNotImage = !(target instanceof HTMLImageElement);
        const isNotSelectionBox = target.id !== 'selection-box';
        const isNotSelectedImage = !(target instanceof HTMLImageElement && target.classList.contains("group-selected"));
        if ((isNotImage || isNotSelectedImage) && isNotSelectionBox) {
            if (selectedImgs.length > 0) {
                selectedImgs.forEach(img => img.classList.remove("group-selected"));
                selectedImgs = [];
                playSound(CANCEL_GROUP_SELECT_AUDIO);
            }
        }
        // ✅ 그룹 드래그 시작
        if (target instanceof HTMLImageElement && target.classList.contains("group-selected")) {
            isDraggingGroup = true;
            hasMoved = false; // 초기화
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            originalPositions = getSelectedImages().map(img => ({
                img,
                x: parseInt(img.style.left) || 0,
                y: parseInt(img.style.top) || 0
            }));
            window.addEventListener("mousemove", onGroupMove);
            window.addEventListener("mouseup", onGroupUp);
            e.preventDefault();
            return;
        }
        // ✅ 선택 박스 시작
        if (target === playgroundEl) {
            isSelecting = true;
            selStartX = e.clientX;
            selStartY = e.clientY;
            Object.assign(selectionBox.style, {
                left: selStartX + 'px',
                top: selStartY + 'px',
                width: '0px',
                height: '0px',
                display: 'block',
            });
            selectedImgs = [];
            window.addEventListener("mousemove", onSelectMouseMove);
            window.addEventListener("mouseup", onSelectMouseUp);
            e.preventDefault();
            return;
        }
    });
    function onSelectMouseMove(e) {
        const curX = e.clientX;
        const curY = e.clientY;
        const left = Math.min(selStartX, curX);
        const top = Math.min(selStartY, curY);
        const width = Math.abs(curX - selStartX);
        const height = Math.abs(curY - selStartY);
        Object.assign(selectionBox.style, {
            left: left + 'px',
            top: top + 'px',
            width: width + 'px',
            height: height + 'px',
        });
        const boxRect = selectionBox.getBoundingClientRect();
        selectedImgs = Array.from(playgroundEl.querySelectorAll('img[data-serial]')).filter((el) => {
            const rect = el.getBoundingClientRect();
            return (rect.left < boxRect.right &&
                rect.right > boxRect.left &&
                rect.top < boxRect.bottom &&
                rect.bottom > boxRect.top);
        });
        // 시각 효과
        playgroundEl.querySelectorAll("img[data-serial]").forEach(img => {
            img.classList.remove("group-selected");
        });
        selectedImgs.forEach(img => img.classList.add("group-selected"));
    }
    function onSelectMouseUp() {
        isSelecting = false;
        selectionBox.style.display = 'none';
        window.removeEventListener("mousemove", onSelectMouseMove);
        window.removeEventListener("mouseup", onSelectMouseUp);
        if (selectedImgs.length > 0) {
            playSound(DRAG_GROUP_SELECT_AUDIO);
        }
    }
    function onGroupMove(e) {
        if (!isDraggingGroup)
            return;
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
            hasMoved = true;
        }
        const containerRect = playgroundEl.getBoundingClientRect();
        for (const { img, x, y } of originalPositions) {
            const width = img.getBoundingClientRect().width;
            const height = img.getBoundingClientRect().height;
            let newX = x + dx;
            let newY = y + dy;
            newX = Math.max(0, Math.min(containerRect.width - width, newX));
            newY = Math.max(0, Math.min(containerRect.height - height, newY));
            img.style.left = `${newX}px`;
            img.style.top = `${newY}px`;
        }
    }
    function onGroupUp() {
        if (!isDraggingGroup)
            return;
        isDraggingGroup = false;
        if (hasMoved) {
            playSound(DROP_GROUP_SELECT_AUDIO); // ✅ 실제로 이동한 경우만 사운드
        }
        else {
            playSound(CANCEL_GROUP_SELECT_AUDIO); // ✅ 클릭만 했을 경우엔 취소 사운드
        }
        selectedImgs.forEach(img => img.classList.remove("group-selected"));
        selectedImgs = [];
        window.removeEventListener("mousemove", onGroupMove);
        window.removeEventListener("mouseup", onGroupUp);
    }
}
export function getSelectedImages() {
    return selectedImgs;
}
