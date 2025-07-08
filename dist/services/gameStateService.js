// src/services/gameStateService.js
import { GAME_STATE_STORAGE_KEY, PARCEL_LIMIT } from "../common/config.js";
import { INITIAL_GAME_STATE } from "../data/initialGameState.js";
// --- 내부 상태 변수 (전역적 싱글턴)
let data = loadFromStorage();
// --- 유틸
export function saveToStorage() {
    localStorage.setItem(GAME_STATE_STORAGE_KEY, JSON.stringify(data));
}
function loadFromStorage() {
    const str = localStorage.getItem(GAME_STATE_STORAGE_KEY);
    if (str) {
        try {
            const obj = JSON.parse(str);
            if (typeof obj.inboxParcels !== "number")
                obj.inboxParcels = 0;
            return obj;
        }
        catch (_a) {
            return Object.assign({}, INITIAL_GAME_STATE);
        }
    }
    return Object.assign({}, INITIAL_GAME_STATE);
}
// === [공개 API 함수들] ===
// 전체 반환
export function getGameState() { return data; }
// [플레이그라운드 관련]
export function getPlaygroundFigures() { return data.playgroundFigures; }
export function addPlaygroundFigure(figure) {
    data.playgroundFigures.push(figure);
    saveToStorage();
}
export function removePlaygroundFigure(id) {
    data.playgroundFigures = data.playgroundFigures.filter(f => f.id !== id);
    saveToStorage();
}
export function removePlaygroundFigureBySerial(serial) {
    data.playgroundFigures = data.playgroundFigures.filter(f => f.serial !== serial);
    saveToStorage();
}
export function getMaxZIndex() {
    if (!data.playgroundFigures.length)
        return 0;
    return Math.max(...data.playgroundFigures.map(f => { var _a; return (_a = f.zIndex) !== null && _a !== void 0 ? _a : 0; }));
}
// [인벤토리 관련]
export function getInventoryFigures() { return data.inventoryFigures; }
export function removeInventoryFigure(id) {
    data.inventoryFigures = data.inventoryFigures.filter(f => f.id !== id);
    saveToStorage();
}
export function hasFigure(figureId) {
    return data.inventoryFigures.some(f => f.id === figureId);
}
export function getUnlockedModes(figureId) {
    const entry = data.inventoryFigures.find(f => f.id === figureId);
    return entry ? entry.unlockedModes : [];
}
export function unlockFigureMode(figureId, mode) {
    let entry = data.inventoryFigures.find(f => f.id === figureId);
    if (!entry) {
        entry = { id: figureId, currentMode: mode, unlockedModes: [mode] };
        data.inventoryFigures.push(entry);
    }
    else {
        if (!entry.unlockedModes.includes(mode)) {
            entry.unlockedModes.push(mode);
        }
    }
    saveToStorage();
}
export function isModeUnlocked(figureId, mode) {
    const entry = data.inventoryFigures.find(f => f.id === figureId);
    return !!entry && entry.unlockedModes.includes(mode);
}
export function getCurrentMode(figureId) {
    const entry = data.inventoryFigures.find(f => f.id === figureId);
    return entry === null || entry === void 0 ? void 0 : entry.currentMode;
}
export function setCurrentMode(figureId, mode) {
    const entry = data.inventoryFigures.find(f => f.id === figureId);
    if (entry && entry.unlockedModes.includes(mode)) {
        entry.currentMode = mode;
        saveToStorage();
    }
}
// 인벤토리에 캐릭터+모드 추가, 그리고 상태 리턴
export function addInventoryFigure(figureId, mode) {
    let entry = data.inventoryFigures.find(f => f.id === figureId);
    if (!entry) {
        entry = { id: figureId, currentMode: mode, unlockedModes: [mode] };
        data.inventoryFigures.push(entry);
        saveToStorage();
        return "new-figure";
    }
    if (entry.unlockedModes.includes(mode)) {
        return "already-unlocked";
    }
    entry.unlockedModes.push(mode);
    entry.currentMode = mode;
    saveToStorage();
    return "new-mode";
}
// [인박스(택배) 관련]
// 현재 남은 택배 개수 반환
export function getInboxParcels() {
    return data.inboxParcels;
}
// 택배 개수 설정 (최소/최대 보정)
export function setInboxParcels(count) {
    data.inboxParcels = Math.max(0, Math.min(count, PARCEL_LIMIT));
    saveToStorage();
}
// 0으로 리셋
export function clearInboxParcels() {
    data.inboxParcels = 0;
    saveToStorage();
}
// 유틸
export function incInboxParcels() { setInboxParcels(getInboxParcels() + 1); }
export function decInboxParcels() { setInboxParcels(getInboxParcels() - 1); }
export function isInboxFull() { return getInboxParcels() >= PARCEL_LIMIT; }
export function isInboxEmpty() { return getInboxParcels() <= 0; }
// [초기화]
export function resetGameState() {
    data = {
        playgroundFigures: [],
        inventoryFigures: [],
        inboxParcels: 0
    };
    saveToStorage();
}
export function resetToInitialState() {
    data = JSON.parse(JSON.stringify(INITIAL_GAME_STATE));
    saveToStorage();
}
