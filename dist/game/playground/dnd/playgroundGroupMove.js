import { ID_PLAYGROUND } from "../../../common/config.js";
let selectionBox;
let isSelecting = false;
let selStartX = 0, selStartY = 0;
let selectedImgs = [];
let isDraggingGroup = false;
let dragStartX = 0, dragStartY = 0;
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
        // ✅ 그룹 드래그 시작
        if (target instanceof HTMLImageElement && target.classList.contains("group-selected")) {
            isDraggingGroup = true;
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
        // ✅ 선택 해제
        if (selectedImgs.length > 0) {
            selectedImgs.forEach(img => img.classList.remove("group-selected"));
            selectedImgs = [];
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
    }
    function onGroupMove(e) {
        if (!isDraggingGroup)
            return;
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
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
        // ✅ 드래그 끝나면 선택 해제
        selectedImgs.forEach(img => img.classList.remove("group-selected"));
        selectedImgs = [];
        window.removeEventListener("mousemove", onGroupMove);
        window.removeEventListener("mouseup", onGroupUp);
    }
}
export function getSelectedImages() {
    return selectedImgs;
}
