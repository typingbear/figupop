// src/game/inbox/parcel/inboxParcelManager.ts
import { PARCEL_TIME, PARCEL_LIMIT, FIGURE_KIND_FOR_PARCEL, NEW_FIGURE_AUDIO, UNLOCK_FIGURE_AUDIO, NEW_FIGURE_EFFECT, ID_PLAYGROUND } from "../../../common/config.js";
import { getFiguresByKind, getResponsiveFigureSize } from "../../../core/services/figureLibraryService.js";
import {
  addOrUnlockInventoryFigure, addPlaygroundFigure, getMaxZIndex,
  getInventoryFigures, getInboxParcels, setInboxParcels
} from "../../../core/services/gameStateService.js";
import { makeSerialKey, playSound } from "../../../common/utils.js";
import { SpriteEffectManager } from "../../../core/effects/spriteEffectManager.js";
import { renderPlayAddOrUpdateFigure } from "../../playground/render/playgroundRenderer.js";
import { renderInventoryInsertItem, renderInventoryUpdateItem } from "../../inventory/render/inventoryRenderer.js";
import { pickRandomUnownedPrimeFigure } from "../../../core/services/gameStateCoordinator.js";

const PARCEL_FIGURES = getFiguresByKind(FIGURE_KIND_FOR_PARCEL);

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
  const now = getInboxParcels();
  if (now <= 0) return;
  setInboxParcels(now - 1);

  // === [NEW] 미소유 프라임 피규어 1개 랜덤 선택 ===
  const randomFig = pickRandomUnownedPrimeFigure();

  if (randomFig) {
    // ✅ 반응형 이미지 크기 구하기 (예정된 실제 렌더링 크기)
    const { width: imgW, height: imgH } = getResponsiveFigureSize(randomFig.id, "base");

    // === 플레이그라운드 중앙 계산 ===
    const playground = document.getElementById(ID_PLAYGROUND);
    let centerX, centerY;
    if (playground) {
      const rect = playground.getBoundingClientRect();
      centerX = rect.left + rect.width / 2 + window.scrollX;
      centerY = rect.top + rect.height / 2 + window.scrollY;
    } else {
      // fallback: window 중심
      centerX = Math.round(window.innerWidth / 2);
      centerY = Math.round(window.innerHeight / 2);
    }

    // ★ 중앙 기준 랜덤 오프셋 (이미지 중심!)
    const offsetX = Math.floor(Math.random() * 141) - 70;
    const offsetY = Math.floor(Math.random() * 81) - 40;

    // 실제 "중심좌표" (이펙트, 이미지 둘다 이걸 씀)
    const spawnX = centerX + offsetX;
    const spawnY = centerY + offsetY;

    // 인벤토리에 추가/언락
    const addResult = addOrUnlockInventoryFigure(randomFig.id, "base");
    const invFig = getInventoryFigures().find(f => f.id === randomFig.id);

    if (randomFig.sound && randomFig.sound.trim() !== '') {
      playSound(randomFig.sound);
    } else {
      if (addResult === "new-figure" && invFig) {
        playSound(NEW_FIGURE_AUDIO);
        renderInventoryInsertItem(invFig);
      } else if (addResult === "new-mode" && invFig) {
        playSound(UNLOCK_FIGURE_AUDIO);
        renderInventoryUpdateItem(invFig);
      }
    }

    // ★ 이펙트 크기를 이미지 크기에 맞게 조정!
    const effectSize = Math.max(imgW, imgH);

    if (randomFig.effect && randomFig.effect.trim() !== '') {
      SpriteEffectManager.play(randomFig.effect, document.body, {
        size: effectSize,
        x: spawnX,
        y: spawnY,
      });
    } else {
      SpriteEffectManager.play(NEW_FIGURE_EFFECT, document.body, {
        size: effectSize,
        x: spawnX,
        y: spawnY,
      });
    }

    // 플레이그라운드에 추가 (x, y = 이미지 중심 좌표)
    // 💡 플레이그라운드 내부 좌표(px, 중앙 = (0,0) 아님!):
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
  }

  // 택배 리필 카운트다운 관리
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


