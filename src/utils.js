"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickRandom = pickRandom;
exports.isOverlap = isOverlap;
exports.playSound = playSound;
// 랜덤 3개 추출
function pickRandom(arr, n) {
    return arr.slice().sort(() => Math.random() - 0.5).slice(0, n);
}
// 겹침 체크
function isOverlap(el1, el2) {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();
    return !(rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom);
}
// 사운드
let soundCache = {};
function playSound(url) {
    if (!url)
        return;
    if (!soundCache[url])
        soundCache[url] = new Audio(url);
    soundCache[url].currentTime = 0;
    soundCache[url].play();
}
