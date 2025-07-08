// src/game/inbox/parcel/inboxParcelManager.ts
import { PARCEL_TIME, PARCEL_LIMIT } from "../../../common/config.js";
import { getFiguresByKind } from "../../../services/figureLibraryService.js";
import { addInventoryFigure, addPlaygroundFigure, getMaxZIndex, getInventoryFigures, getInboxParcels, setInboxParcels, saveToStorage } from "../../../services/gameStateService.js";
import { makeSerialKey } from "../../../common/utils.js";
import { renderInventory } from "../../inventory/render/inventoryRenderer.js";
import { renderCatalog } from "../../catalog/render/catalogRenderer.js";
import { renderPlayground } from "../../playground/render/playgroundRenderer.js";
const PARCEL_FIGURES = getFiguresByKind("prime");
const state = {
    deliveryCountdown: PARCEL_TIME,
    intervalId: null,
    onChange: null,
};
// 콜백 등록
export function subscribeInboxParcel(cb) {
    state.onChange = cb;
}
// 타이머 시작
export function startInboxParcel() {
    if (state.intervalId !== null)
        return;
    if (state.deliveryCountdown <= 0)
        state.deliveryCountdown = PARCEL_TIME;
    state.intervalId = window.setInterval(tick, 1000);
}
export function stopInboxParcel() {
    if (state.intervalId !== null) {
        clearInterval(state.intervalId);
        state.intervalId = null;
    }
}
function tick() {
    var _a, _b, _c;
    const count = getInboxParcels();
    if (count >= PARCEL_LIMIT) {
        stopInboxParcel();
        state.deliveryCountdown = 0;
        (_a = state.onChange) === null || _a === void 0 ? void 0 : _a.call(state);
        return;
    }
    state.deliveryCountdown--;
    (_b = state.onChange) === null || _b === void 0 ? void 0 : _b.call(state);
    if (state.deliveryCountdown <= 0) {
        addParcel();
        state.deliveryCountdown = PARCEL_TIME;
        if (getInboxParcels() >= PARCEL_LIMIT)
            stopInboxParcel();
        (_c = state.onChange) === null || _c === void 0 ? void 0 : _c.call(state);
    }
}
// 상태 getter
export function getParcelCount() {
    return getInboxParcels();
}
export function getParcelCountdown() {
    if (getInboxParcels() >= PARCEL_LIMIT)
        return 0;
    return state.deliveryCountdown;
}
export function addParcel() {
    var _a;
    const now = getInboxParcels();
    if (now < PARCEL_LIMIT) {
        setInboxParcels(now + 1);
        saveToStorage();
        (_a = state.onChange) === null || _a === void 0 ? void 0 : _a.call(state);
    }
}
export function removeParcelAndSpawn() {
    var _a;
    let now = getInboxParcels();
    if (now > 0) {
        setInboxParcels(now - 1);
        saveToStorage();
        const ownedIds = new Set(getInventoryFigures().map(f => f.id));
        const notOwnedList = PARCEL_FIGURES.filter(f => !ownedIds.has(f.id));
        if (notOwnedList.length > 0) {
            const randomFig = notOwnedList[Math.floor(Math.random() * notOwnedList.length)];
            // === 가운데 위치 ===
            const centerX = Math.round(window.innerWidth / 2 - 60);
            const centerY = Math.round(window.innerHeight / 2 - 60);
            // === 랜덤 offset 추가! ===
            const offsetX = Math.floor(Math.random() * 141) - 70; // -70 ~ +70 px
            const offsetY = Math.floor(Math.random() * 81) - 40; // -40 ~ +40 px
            const result = addInventoryFigure(randomFig.id, "base");
            if (result === "new-figure" || result === "new-mode") {
                renderInventory();
                renderCatalog();
            }
            addPlaygroundFigure({
                id: randomFig.id,
                mode: "base",
                x: centerX + offsetX,
                y: centerY + offsetY,
                serial: makeSerialKey(),
                zIndex: getMaxZIndex() + 1
            });
            renderPlayground();
        }
        if (getInboxParcels() < PARCEL_LIMIT && state.intervalId === null) {
            state.deliveryCountdown = PARCEL_TIME;
            startInboxParcel();
        }
        (_a = state.onChange) === null || _a === void 0 ? void 0 : _a.call(state);
    }
}
export function isParcelFull() {
    return getInboxParcels() >= PARCEL_LIMIT;
}
export function isParcelEmpty() {
    return getInboxParcels() <= 0;
}
export function resetInboxParcel() {
    var _a;
    setInboxParcels(0);
    state.deliveryCountdown = PARCEL_TIME;
    startInboxParcel();
    (_a = state.onChange) === null || _a === void 0 ? void 0 : _a.call(state);
}
