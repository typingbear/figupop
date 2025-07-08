// src/game/inbox/parcel/inboxParcelManager.ts
import { PARCEL_TIME, PARCEL_LIMIT } from "../../../common/config.js";
import { getFiguresByKind } from "../../../services/figureLibraryService.js";
import {
  addInventoryFigure, addPlaygroundFigure, getMaxZIndex,
  getInventoryFigures, getInboxParcels, setInboxParcels, saveToStorage
} from "../../../services/gameStateService.js";
import { makeSerialKey } from "../../../common/utils.js";
import { renderInventory } from "../../inventory/render/inventoryRenderer.js";
import { renderCatalog } from "../../catalog/render/catalogRenderer.js";
import { renderPlayground } from "../../playground/render/playgroundRenderer.js";

const PARCEL_FIGURES = getFiguresByKind("prime");

type OnChangeCallback = (() => void) | null;
const state = {
  deliveryCountdown: PARCEL_TIME,
  intervalId: null as number | null,
  onChange: null as OnChangeCallback,
};

// 콜백 등록
export function subscribeInboxParcel(cb: () => void) {
  state.onChange = cb;
}

// 타이머 시작
export function startInboxParcel() {
  if (state.intervalId !== null) return;
  if (state.deliveryCountdown <= 0) state.deliveryCountdown = PARCEL_TIME;
  state.intervalId = window.setInterval(tick, 1000);
}
export function stopInboxParcel() {
  if (state.intervalId !== null) {
    clearInterval(state.intervalId);
    state.intervalId = null;
  }
}
function tick() {
  const count = getInboxParcels();
  if (count >= PARCEL_LIMIT) {
    stopInboxParcel();
    state.deliveryCountdown = 0;
    state.onChange?.();
    return;
  }
  state.deliveryCountdown--;
  state.onChange?.();
  if (state.deliveryCountdown <= 0) {
    addParcel();
    state.deliveryCountdown = PARCEL_TIME;
    if (getInboxParcels() >= PARCEL_LIMIT) stopInboxParcel();
    state.onChange?.();
  }
}

// 상태 getter
export function getParcelCount() {
  return getInboxParcels();
}
export function getParcelCountdown() {
  if (getInboxParcels() >= PARCEL_LIMIT) return 0;
  return state.deliveryCountdown;
}

export function addParcel() {
  const now = getInboxParcels();
  if (now < PARCEL_LIMIT) {
    setInboxParcels(now + 1);
    saveToStorage();
    state.onChange?.();
  }
}

export function removeParcelAndSpawn() {
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
      const offsetX = Math.floor(Math.random() * 141) - 70;  // -70 ~ +70 px
      const offsetY = Math.floor(Math.random() * 81) - 40;   // -40 ~ +40 px

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
    state.onChange?.();
  }
}


export function isParcelFull() {
  return getInboxParcels() >= PARCEL_LIMIT;
}
export function isParcelEmpty() {
  return getInboxParcels() <= 0;
}
export function resetInboxParcel() {
  setInboxParcels(0);
  state.deliveryCountdown = PARCEL_TIME;
  startInboxParcel();
  state.onChange?.();
}
