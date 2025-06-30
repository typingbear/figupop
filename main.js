"use strict";
// 상수 및 전역 변수
const playground = document.getElementById('playground');
const imageRoot = "assets/images/";
const audioRoot = "assets/audio/";
let soundCache = {};
let topZ = 10;
// JSON 불러오기
fetch('figures.json')
    .then(res => res.json())
    .then((data) => {
    data.figures.forEach((figure, i) => {
        const img = document.createElement('img');
        img.src = `${imageRoot}${figure.id}-base.png`;
        img.dataset.id = figure.id;
        img.dataset.state = 'base';
        img.classList.add('figure');
        img.style.left = `${180 + i * 180}px`;
        img.style.top = `200px`;
        makeDraggable(img, figure, data.figures);
        playground.appendChild(img);
    });
});
// 드래그 기능
function makeDraggable(img, figure, figures) {
    let offsetX, offsetY;
    img.addEventListener('mousedown', (e) => {
        offsetX = e.offsetX;
        offsetY = e.offsetY;
        topZ += 1;
        img.style.zIndex = topZ.toString();
        function onMouseMove(ev) {
            img.style.left = `${ev.pageX - offsetX}px`;
            img.style.top = `${ev.pageY - offsetY}px`;
            // 1. 모든 glow 제거
            document.querySelectorAll('.figure').forEach(other => {
                other.classList.remove('glow');
            });
            // 2. 겹치는 상대 찾아서 glow 처리 (본인/상대 모두)
            document.querySelectorAll('.figure').forEach(other => {
                if (other === img)
                    return;
                if (isOverlap(img, other)) {
                    const otherImg = other;
                    const otherId = otherImg.dataset.id;
                    const otherFigure = figures.find(f => f.id === otherId);
                    // 본인(드래그) 반응
                    const dragCanReact = figure.reactions.some(r => r.with === otherId && img.dataset.state !== r.resultState);
                    // 상대(타겟) 반응
                    const targetCanReact = otherFigure.reactions.some(r => r.with === img.dataset.id && otherImg.dataset.state !== r.resultState);
                    if (dragCanReact)
                        img.classList.add('glow');
                    if (targetCanReact)
                        otherImg.classList.add('glow');
                }
            });
        }
        function onMouseUp(ev) {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.querySelectorAll('.figure').forEach(el => el.classList.remove('glow'));
            checkCollision(img, figure, figures);
            // z-index 유지
        }
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
    img.addEventListener('dragstart', e => e.preventDefault());
}
// 겹침 판정
function isOverlap(el1, el2) {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();
    return !(rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom);
}
// 충돌 후 상태/사운드 반영
function checkCollision(draggedEl, draggedFigure, allFigures) {
    const draggedId = draggedEl.dataset.id;
    document.querySelectorAll('.figure').forEach(targetEl => {
        if (targetEl === draggedEl)
            return;
        if (!isOverlap(draggedEl, targetEl))
            return;
        const targetImg = targetEl;
        const targetId = targetImg.dataset.id;
        const targetFigure = allFigures.find(f => f.id === targetId);
        // dragged가 반응 대상이면
        const dragReaction = draggedFigure.reactions.find(r => r.with === targetId);
        if (dragReaction && draggedEl.dataset.state !== dragReaction.resultState) {
            setFigureState(draggedEl, draggedFigure.id, dragReaction.resultState);
            playSound(dragReaction.sound);
        }
        // target이 반응 대상이면
        const targetReaction = targetFigure.reactions.find(r => r.with === draggedId);
        if (targetReaction && targetImg.dataset.state !== targetReaction.resultState) {
            setFigureState(targetImg, targetFigure.id, targetReaction.resultState);
            playSound(targetReaction.sound);
        }
    });
}
// 상태(이미지) 변경
function setFigureState(el, id, state) {
    el.src = `${imageRoot}${id}-${state}.png`;
    el.dataset.state = state;
}
// 사운드 재생
function playSound(filename) {
    if (!filename)
        return;
    const url = audioRoot + filename;
    if (!soundCache[url]) {
        soundCache[url] = new Audio(url);
    }
    soundCache[url].currentTime = 0;
    soundCache[url].play();
}
