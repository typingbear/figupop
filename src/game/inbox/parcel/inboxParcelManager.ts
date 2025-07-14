// src/game/inbox/parcel/inboxParcelManager.ts
import { PARCEL_TIME, PARCEL_LIMIT, FIGURE_KIND_FOR_PARCEL, NEW_FIGURE_AUDIO, NEW_FIGURE_EFFECT, ID_PLAYGROUND } from "../../../common/config.js";
import { getFiguresByKind, getResponsiveFigureSize } from "../../../core/services/figureLibraryService.js";
import {
  addOrUnlockInventoryFigure, addPlaygroundFigure, getMaxZIndex,
  getInventoryFigures, getInboxParcels, setInboxParcels
} from "../../../core/services/gameStateService.js";
import { makeSerialKey, playSound } from "../../../common/utils.js";
import { playSpriteEffect } from "../../../core/effects/spriteEffectManager.js";
import { renderPlayAddOrUpdateFigure } from "../../playground/render/playgroundRenderer.js";
import { renderInventoryInsertItem, renderInventoryUpdateItem } from "../../inventory/render/inventoryRenderer.js";
import { pickRandomUnownedPrimeFigure } from "../../../core/services/gameStateCoordinator.js";


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

    state.onChange?.();
  }
}

export function removeParcelAndSpawn() {
  // 1. 박스(택배) 개수 확인 및 차감
  const now = getInboxParcels();
  if (now <= 0) return;
  setInboxParcels(now - 1);

  // 2. 미소유 프라임 피규어 1개 랜덤 선택
  const randomFig = pickRandomUnownedPrimeFigure();
  if (!randomFig) return;

  // 3. 피규어 이미지(예정 크기) 계산
  const { width: imgW, height: imgH } = getResponsiveFigureSize(randomFig.id, "base");

  // 4. 플레이그라운드 중앙 좌표(또는 창 중앙) + 랜덤 오프셋 계산
  const playground = document.getElementById(ID_PLAYGROUND);
  let centerX: number, centerY: number;
  if (playground) {
    const rect = playground.getBoundingClientRect();
    centerX = rect.left + rect.width / 2 + window.scrollX;
    centerY = rect.top + rect.height / 2 + window.scrollY;
  } else {
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
  renderPlayAddOrUpdateFigure(fig);

  const effectSize = Math.max(imgW, imgH);
  playSpriteEffect(
    (randomFig.effect && randomFig.effect.trim() !== "") ? randomFig.effect : NEW_FIGURE_EFFECT,
    {
      size: effectSize,
      centerX: spawnX,
      centerY: spawnY,
    }
  );

  if (randomFig.sound && randomFig.sound.trim() !== "") {
    playSound(randomFig.sound);
  } else if (addResult === "new-figure" && invFig) {
    playSound(NEW_FIGURE_AUDIO);
    renderInventoryInsertItem(invFig);
  }

  // 8. 택배 리필 카운트다운 관리
  if (getInboxParcels() < PARCEL_LIMIT && state.intervalId === null) {
    state.deliveryCountdown = PARCEL_TIME;
    startInboxParcel();
  }
  state.onChange?.();
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


