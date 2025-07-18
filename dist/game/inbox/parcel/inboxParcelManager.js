// src/game/inbox/parcel/inboxParcelManager.ts
import { PARCEL_TIME, PARCEL_LIMIT, NEW_FIGURE_AUDIO, NEW_FIGURE_EFFECT, ID_PLAYGROUND, AUDIO_ROOT } from "../../../common/config.js";
import { getResponsiveFigureSize } from "../../../core/services/figureLibraryService.js";
import { addOrUnlockInventoryFigure, addPlaygroundFigure, getMaxZIndex, getInventoryFigures, getInboxParcels, setInboxParcels } from "../../../core/services/gameStateService.js";
import { makeSerialKey, playSound } from "../../../common/utils.js";
import { playSpriteEffect } from "../../../core/effects/spriteEffectManager.js";
import { renderInventoryInsertItem } from "../../inventory/render/inventoryRenderer.js";
import { pickRandomUnownedPrimeFigure } from "../../../core/services/gameStateCoordinator.js";
import { AddOrUpdatePlayItemRender } from "../../playground/playgroundRenderer.js";
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
        (_a = state.onChange) === null || _a === void 0 ? void 0 : _a.call(state);
    }
}
export function removeParcelAndSpawn() {
    var _a;
    // 1. 박스(택배) 개수 확인 및 차감
    const now = getInboxParcels();
    if (now <= 0)
        return;
    setInboxParcels(now - 1);
    // 2. 미소유 프라임 피규어 1개 랜덤 선택
    const randomFig = pickRandomUnownedPrimeFigure();
    if (!randomFig)
        return;
    // 3. 피규어 이미지(예정 크기) 계산
    const { width: imgW, height: imgH } = getResponsiveFigureSize(randomFig.id, "base");
    // 4. 플레이그라운드 중앙 좌표(또는 창 중앙) + 랜덤 오프셋 계산
    const playground = document.getElementById(ID_PLAYGROUND);
    let centerX, centerY;
    if (playground) {
        const rect = playground.getBoundingClientRect();
        centerX = rect.left + rect.width / 2 + window.scrollX;
        centerY = rect.top + rect.height / 2 + window.scrollY;
    }
    else {
        centerX = Math.round(window.innerWidth / 2);
        centerY = Math.round(window.innerHeight / 2);
    }
    const offsetX = Math.floor(Math.random() * 141) - 70;
    const offsetY = Math.floor(Math.random() * 81) - 40;
    const spawnX = centerX + offsetX;
    const spawnY = centerY + offsetY;
    // 5. 인벤토리 등록 및 결과 확인
    const addResult = addOrUnlockInventoryFigure(randomFig.id, "base");
    const invFig = getInventoryFigures().find(f => f.id === randomFig.id);
    // === 💡 6. 실제 피규어(데이터)를 플레이그라운드에 추가 ===
    // 내부 좌표계 변환 (중앙 = (0,0) 아님)
    let figureX = spawnX, figureY = spawnY;
    if (playground) {
        const rect = playground.getBoundingClientRect();
        figureX = spawnX - rect.left - window.scrollX;
        figureY = spawnY - rect.top - window.scrollY;
    }
    const fig = {
        id: randomFig.id,
        mode: "base",
        x: figureX,
        y: figureY,
        serial: makeSerialKey(),
        zIndex: getMaxZIndex() + 1,
    };
    addPlaygroundFigure(fig);
    AddOrUpdatePlayItemRender(fig);
    // === 이펙트 위치를 실제 이미지 중앙으로 보정 ===
    let effectCenterX = spawnX;
    let effectCenterY = spawnY;
    if (playground) {
        const imgEl = playground.querySelector(`img[data-serial="${fig.serial}"]`);
        if (imgEl) {
            const imgRect = imgEl.getBoundingClientRect();
            effectCenterX = imgRect.left + imgRect.width / 2 + window.scrollX;
            effectCenterY = imgRect.top + imgRect.height / 2 + window.scrollY;
        }
    }
    const effectSize = Math.max(imgW, imgH);
    playSpriteEffect((randomFig.effect && randomFig.effect.trim() !== "") ? randomFig.effect : NEW_FIGURE_EFFECT, {
        size: effectSize,
        centerX: effectCenterX,
        centerY: effectCenterY,
    });
    if (randomFig.sound && randomFig.sound.trim() !== "") {
        playSound(AUDIO_ROOT + randomFig.sound);
    }
    else if (addResult === "new-figure" && invFig) {
        playSound(NEW_FIGURE_AUDIO);
        renderInventoryInsertItem(invFig.id);
    }
    // 8. 택배 리필 카운트다운 관리
    if (getInboxParcels() < PARCEL_LIMIT && state.intervalId === null) {
        state.deliveryCountdown = PARCEL_TIME;
        startInboxParcel();
    }
    (_a = state.onChange) === null || _a === void 0 ? void 0 : _a.call(state);
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
